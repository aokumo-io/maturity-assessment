#!/usr/bin/env node

/**
 * @file analyze-knowledge-coverage.cjs
 * @description 知識カバレッジ分析スクリプト
 * 静的知識のカバレッジを分析し、AIに依存している質問を特定します。
 */

const fs = require('fs');
const path = require('path');

/**
 * @function getAllQuestions
 * @description 全ての質問を取得
 */
function getAllQuestions() {
  const questionsDir = path.join(__dirname, '../server/questions');
  const questions = [];
  
  const files = fs.readdirSync(questionsDir).filter(file => file.endsWith('.ts') && file !== 'index.ts');
  
  for (const file of files) {
    const category = file.replace('.ts', '');
    const filePath = path.join(questionsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Extract question IDs using regex
    const questionMatches = content.match(/"[^"]*_\d+"/g);
    if (questionMatches) {
      const questionIds = questionMatches.map(match => match.replace(/"/g, ''));
      questions.push(...questionIds.map(id => ({ category, id })));
    }
  }
  
  return questions;
}

/**
 * @function getStaticKnowledge
 * @description 静的知識を取得
 */
function getStaticKnowledge() {
  const knowledgeDir = path.join(__dirname, '../server/knowledge');
  const knowledge = [];
  
  const files = fs.readdirSync(knowledgeDir).filter(file => file.endsWith('.ts') && file !== 'index.ts');
  
  for (const file of files) {
    const category = file.replace('.ts', '');
    const filePath = path.join(knowledgeDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Extract knowledge IDs using regex
    const knowledgeMatches = content.match(/"[^"]*_\d+"/g);
    if (knowledgeMatches) {
      const knowledgeIds = knowledgeMatches.map(match => match.replace(/"/g, ''));
      knowledge.push(...knowledgeIds.map(id => ({ category, id })));
    }
  }
  
  return knowledge;
}

/**
 * @function analyzeKnowledgeCoverage
 * @description 知識カバレッジを分析
 */
function analyzeKnowledgeCoverage() {
  console.log('🔍 Analyzing Knowledge Coverage...\n');
  
  const allQuestions = getAllQuestions();
  const staticKnowledge = getStaticKnowledge();
  
  // Create lookup sets for faster searching
  const knowledgeSet = new Set(staticKnowledge.map(k => `${k.category}:${k.id}`));
  
  // Categorize questions
  const covered = [];
  const missing = [];
  
  for (const question of allQuestions) {
    const key = `${question.category}:${question.id}`;
    if (knowledgeSet.has(key)) {
      covered.push(question);
    } else {
      missing.push(question);
    }
  }
  
  // Group missing by category
  const missingByCategory = {};
  for (const question of missing) {
    if (!missingByCategory[question.category]) {
      missingByCategory[question.category] = [];
    }
    missingByCategory[question.category].push(question.id);
  }
  
  // Print results
  console.log('📊 Coverage Summary:');
  console.log(`Total Questions: ${allQuestions.length}`);
  console.log(`Static Knowledge Available: ${covered.length} (${Math.round((covered.length / allQuestions.length) * 100)}%)`);
  console.log(`Missing Static Knowledge: ${missing.length} (${Math.round((missing.length / allQuestions.length) * 100)}%)`);
  console.log('');
  
  if (missing.length > 0) {
    console.log('❌ Questions Missing Static Knowledge:');
    console.log('');
    
    for (const [category, questionIds] of Object.entries(missingByCategory)) {
      console.log(`📁 ${category}:`);
      questionIds.forEach(id => console.log(`   - ${id}`));
      console.log('');
    }
    
    console.log('💡 Recommendations:');
    console.log('1. Add static knowledge for high-frequency questions first');
    console.log('2. Focus on beginner-level content to reduce AI dependency');
    console.log('3. Consider creating templates for common question patterns');
    console.log('');
  }
  
  // Show categories with best/worst coverage
  const categoryStats = {};
  for (const question of allQuestions) {
    if (!categoryStats[question.category]) {
      categoryStats[question.category] = { total: 0, covered: 0 };
    }
    categoryStats[question.category].total++;
    if (knowledgeSet.has(`${question.category}:${question.id}`)) {
      categoryStats[question.category].covered++;
    }
  }
  
  console.log('📈 Coverage by Category:');
  const sortedCategories = Object.entries(categoryStats)
    .map(([category, stats]) => ({
      category,
      ...stats,
      percentage: Math.round((stats.covered / stats.total) * 100)
    }))
    .sort((a, b) => b.percentage - a.percentage);
  
  for (const { category, covered, total, percentage } of sortedCategories) {
    const status = percentage >= 80 ? '✅' : percentage >= 50 ? '⚠️' : '❌';
    console.log(`${status} ${category}: ${covered}/${total} (${percentage}%)`);
  }
  
  console.log('');
  console.log('🎯 Next Steps:');
  console.log('1. Run the smart knowledge service to start caching AI responses');
  console.log('2. Monitor cache hit rates to identify frequently requested content');
  console.log('3. Convert high-usage AI responses to static knowledge');
  console.log('4. Use the admin interface to monitor cache performance');
}

// Run the analysis
if (require.main === module) {
  analyzeKnowledgeCoverage();
} 