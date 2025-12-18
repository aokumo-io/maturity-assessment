/**
 * @file anthropic-service.ts
 * @description Anthropic APIを使用したAIサービスの実装
 */

import Anthropic from '@anthropic-ai/sdk';
import { logger } from '../utils/logger';
import { 
  AIResponse, 
  PromptRequest,
  EducationalContentRequest,
  ExecutiveSummaryRequest,
  TrailMapMilestonesRequest,
  PrioritizedFocusAreasRequest
} from '../types/ai-types';
import config from '../config';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: config.anthropic.apiKey,
});

/**
 * Anthropic APIを使用したAIサービスクラス
 */
export default class AnthropicService {
  /**
   * APIキーが設定されているかどうかを確認
   */
  hasValidApiKey(): boolean {
    return !!config.anthropic.apiKey;
  }

  /**
   * レスポンスコンテンツを取得
   */
  private getContentText(message: any): string {
    let contentText = '';
    if (message.content && message.content.length > 0) {
      const firstContent = message.content[0];
      contentText = 'text' in firstContent ? firstContent.text : 
                  (typeof firstContent === 'string' ? firstContent : JSON.stringify(firstContent));
    }
    return contentText;
  }

  /**
   * プロンプトに基づいてAIレスポンスを生成
   */
  async generateResponse(options: PromptRequest): Promise<AIResponse> {
    const { prompt, maxTokens = 1000, language = 'en' } = options;
    
    let systemPrompt = "You are an AI assistant helping with a cloud native maturity assessment. Provide helpful insights, explanations and educational content.";
    
    if (language === 'ja') {
      systemPrompt += " Please respond in Japanese with natural, professional phrasing appropriate for business contexts in Japan.";
    } else {
      systemPrompt += " Please respond in English with clear, professional language.";
    }
    
    const message = await anthropic.messages.create({
      model: config.anthropic.model,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [
        { role: "user", content: prompt }
      ]
    });
    
    return {
      content: this.getContentText(message),
      provider: 'anthropic',
      language
    };
  }

  /**
   * 教育コンテンツを生成
   */
  async generateEducationalContent(options: EducationalContentRequest): Promise<AIResponse> {
    const { category, topic, skillLevel, maxTokens = 1000, language = 'en', userRole = 'practitioner' } = options;

    // Construct the system prompt based on language
    let systemPrompt = "You are Claude, an AI assistant helping with a cloud native maturity assessment.\n";
    systemPrompt += "Provide helpful insights, explanations and educational content.\n";
    
    if (language === 'ja') {
      systemPrompt += "Please respond in Japanese with natural, professional phrasing appropriate for business contexts in Japan.";
    } else {
      systemPrompt += "Please respond in English with clear, professional language.";
    }
    
    // Add role-specific context to the system prompt
    if (userRole === 'executive') {
      systemPrompt += "\nThe user is an executive, so focus on strategic importance, business impact, cost implications, and high-level concepts without technical jargon.";
    } else if (userRole === 'manager') {
      systemPrompt += "\nThe user is a manager, so focus on implementation strategy, team coordination, resource requirements, and practical considerations.";
    } else {
      systemPrompt += "\nThe user is a technical practitioner, so include technical details, implementation steps, and specifics on configuration and best practices.";
    }
    
    // Adjust content depth based on skill level
    let contentDepth = "beginner";
    if (skillLevel === 'intermediate') {
      contentDepth = "intermediate with some technical detail";
    } else if (skillLevel === 'advanced') {
      contentDepth = "advanced with in-depth technical information";
    }
    
    const humanMessage = `Generate educational content about "${topic}" within the context of ${category} in cloud native environments.

The content should include:
- A brief explanation of what "${topic}" is and why it's important
- Key concepts related to this topic
- Best practices for implementation in cloud environments
- Common challenges and how to overcome them
- Examples of tools or technologies that can help

Tailor the explanation to a ${contentDepth} knowledge level.
Format the content in a way that is easy to read and understand, using sub-headings and bullet points where appropriate.

For a user in a ${userRole} role, focus on aspects most relevant to their responsibilities.
Respond in ${language === 'ja' ? 'Japanese' : 'English'} with appropriate technical terminology.`;

    try {
      const response = await anthropic.messages.create({
        model: config.anthropic.model,
        system: systemPrompt,
        max_tokens: maxTokens,
        messages: [
          {
            role: 'user',
            content: humanMessage
          }
        ]
      });
      
      // Get the content text safely
      const contentText = response.content[0]?.type === 'text' ? response.content[0].text : '';
      
      return {
        content: contentText,
        provider: 'anthropic',
        language
      };
    } catch (error: any) {
      logger.error('Anthropic educational content error:', error);
      throw error;
    }
  }

  /**
   * エグゼクティブサマリーを生成
   */
  async generateExecutiveSummary(options: ExecutiveSummaryRequest): Promise<AIResponse> {
    const { assessmentData, categoryScores, organizationInfo, userRole, maxTokens = 2000, language = 'en' } = options;
    
    let systemPrompt = `You are a senior cloud-native strategist and AI advisor.
Your role is to provide both independent analysis and validation of existing assessments.

You will receive:
1. Raw assessment responses for independent analysis
2. Rule-based analysis results for validation
3. Cost analysis calculations for validation
4. Organization context for tailoring

Please provide thorough analysis that validates, enhances, or challenges the provided conclusions.`;
    
    if (language === 'ja') {
      systemPrompt += " Please respond in Japanese with natural, professional phrasing appropriate for business contexts in Japan.";
    } else {
      systemPrompt += " Please respond in English with clear, professional language.";
    }
    
    // Check if we have enhanced data with raw responses
    const hasEnhancedData = assessmentData && 
      typeof assessmentData === 'object' && 
      'assessmentResponses' in assessmentData;
    
    let prompt = '';
    
    if (hasEnhancedData) {
      // Enhanced prompt with validation capabilities
      const enhancedData = assessmentData as any;
      
      // Add explicit language instruction for Japanese
      const promptLanguageInstruction = language === 'ja'
        ? `IMPORTANT: All field values in the JSON must be written in Japanese using professional business language. Field names must remain in English as specified.

`
        : `IMPORTANT: All field values in the JSON must be written in English.

`;

      // Localize maturity level labels
      const maturityLabels = language === 'ja'
        ? '初級 (beginner), 中級 (intermediate), 上級 (advanced), エキスパート (expert)'
        : 'beginner, intermediate, advanced, or expert';

      // Localize JSON schema examples based on language
      const schemaExamples = language === 'ja' ? {
        executiveSummaryContent: "PDF レポートに適した簡潔な 2-3 段落の要約（最大 300 語）。主要な発見、ビジネスへの影響、および最重要推奨事項に焦点を当てる。プロフェッショナルで経営陣向けのトーンで記述。",
        keyFindings: ["現在の状況に関する主要な発見", "特定されたリスクまたは機会", "注目すべきギャップまたは強み"],
        topRecommendations: ["最優先のアクション", "必要な重要な改善", "追求すべき戦略的イニシアチブ"],
        detailedAnalysisContent: "ダッシュボード表示用の包括的な分析（800-1200語）。詳細な説明、コンテキスト、実装ガイダンス、および徹底的な推奨事項を含む。これはエグゼクティブサマリーとは異なる内容である必要があります - より技術的で詳細。",
        strengths: ["具体的な強み領域 1", "具体的な強み領域 2", "具体的な強み領域 3"],
        areasForImprovement: ["具体的な改善領域 1", "具体的な改善領域 2", "具体的な改善領域 3"],
        strategicRecommendations: ["戦略的推奨事項 1", "戦略的推奨事項 2", "戦略的推奨事項 3", "戦略的推奨事項 4"],
        businessImpact: "ROI、運用改善、競争優位性に焦点を当てた詳細なビジネス影響分析。これは詳細分析の内容とは異なる必要があります。",
        implementationGuidance: "タイムライン、必要なリソース、成功指標を含む次のステップの段階的ガイダンス。これは他のセクションとは異なる必要があります。",
        costAnalysisValidation: "この組織規模と業界に対してコスト計算が合理的で正確かどうかの評価",
        additionalInsights: "ルールベースシステムでは捉えられなかった独立分析からの新しい洞察"
      } : {
        executiveSummaryContent: "A concise 2-3 paragraph summary suitable for PDF reports (max 300 words). Focus on key findings, business impact, and top recommendations. Write in a professional, executive-friendly tone.",
        keyFindings: ["Primary finding about current state", "Key risk or opportunity identified", "Notable gap or strength discovered"],
        topRecommendations: ["Highest priority action", "Critical improvement needed", "Strategic initiative to pursue"],
        detailedAnalysisContent: "A comprehensive analysis for dashboard display (800-1200 words). Include detailed explanations, context, implementation guidance, and thorough recommendations. This should be DIFFERENT content from the executive summary - more technical and detailed.",
        strengths: ["Specific strength area 1", "Specific strength area 2", "Specific strength area 3"],
        areasForImprovement: ["Specific improvement area 1", "Specific improvement area 2", "Specific improvement area 3"],
        strategicRecommendations: ["Strategic recommendation 1", "Strategic recommendation 2", "Strategic recommendation 3", "Strategic recommendation 4"],
        businessImpact: "Detailed business impact analysis focusing on ROI, operational improvements, and competitive advantages. This should be DIFFERENT from the detailed analysis content.",
        implementationGuidance: "Step-by-step guidance for next steps including timeline, resources needed, and success metrics. This should be DIFFERENT from other sections.",
        costAnalysisValidation: "Assessment of whether the cost calculations seem reasonable and accurate for this organization size and industry",
        additionalInsights: "New insights from your independent analysis that were not captured by the rule-based system"
      };

      prompt = `${promptLanguageInstruction}You are a JSON-only API. You must output only valid JSON. Never include explanations, comments, or markdown. Your responses will be parsed by an automated system.

Return this exact JSON structure with NO additional text:

{
  "executiveSummary": {
    "content": "${schemaExamples.executiveSummaryContent}",
    "overallMaturityLevel": "Current maturity level based on your independent analysis (use: ${maturityLabels})",
    "keyFindings": ${JSON.stringify(schemaExamples.keyFindings)},
    "topRecommendations": ${JSON.stringify(schemaExamples.topRecommendations)}
  },
  "detailedAnalysis": {
    "content": "${schemaExamples.detailedAnalysisContent}",
    "strengths": ${JSON.stringify(schemaExamples.strengths)},
    "areasForImprovement": ${JSON.stringify(schemaExamples.areasForImprovement)},
    "strategicRecommendations": ${JSON.stringify(schemaExamples.strategicRecommendations)},
    "businessImpact": "${schemaExamples.businessImpact}",
    "implementationGuidance": "${schemaExamples.implementationGuidance}"
  },
  "validation": {
    "ruleBasedAgreement": "high, medium, or low - How much you agree with the rule-based analysis results",
    "costAnalysisValidation": "${schemaExamples.costAnalysisValidation}",
    "additionalInsights": "${schemaExamples.additionalInsights}",
    "confidenceLevel": "high, medium, or low - Your confidence level in this analysis"
  }
}

You are analyzing a cloud native maturity assessment. Please provide both independent analysis and validation.

## RAW ASSESSMENT DATA FOR INDEPENDENT ANALYSIS:
${enhancedData.assessmentResponses ? JSON.stringify(enhancedData.assessmentResponses, null, 2) : 'No raw responses available'}

## ORGANIZATION CONTEXT:
${JSON.stringify(organizationInfo, null, 2)}

## RULE-BASED ANALYSIS TO VALIDATE:
${enhancedData.ruleBasedAnalysis ? JSON.stringify(enhancedData.ruleBasedAnalysis, null, 2) : 'No rule-based analysis provided'}

## COST ANALYSIS TO VALIDATE:
${enhancedData.calculatedCostAnalysis ? JSON.stringify(enhancedData.calculatedCostAnalysis, null, 2) : 'No cost analysis provided'}

REQUIREMENTS:
1. NO duplicate content between any fields - each section must be unique
2. executiveSummary.content: 300 words max, high-level, executive-focused
3. detailedAnalysis.content: 800-1200 words, technical depth, implementation-focused  
4. All other fields must contain different, non-overlapping information
5. Use specific, actionable language throughout
6. Focus on business value and practical next steps
7. Validate our rule-based analysis and provide independent insights
8. CRITICAL: Ensure all JSON strings are properly escaped and valid
9. CRITICAL: validation object must be at root level, NOT nested inside detailedAnalysis`;
      
    } else {
      // Fallback to original format for backward compatibility
      const finalAssessmentData = assessmentData || {
        categoryScores,
        organizationInfo,
        userRole
      };
      
      const assessmentDataString = JSON.stringify(finalAssessmentData, null, 2);
      
      prompt = `Generate an executive summary based on the following cloud native maturity assessment data:
      
${assessmentDataString}
      
Please provide a comprehensive executive summary that includes:

1. **Overall Maturity Assessment**: Current maturity level (beginner/intermediate/advanced/expert) and what this means for the organization
2. **Key Findings**: Top 3 most important findings from the assessment
3. **Strengths**: Top 3 areas where the organization is performing well
4. **Areas for Improvement**: Top 3 areas that need attention
5. **Strategic Recommendations**: 3-5 actionable recommendations prioritized by impact
6. **Business Impact**: Potential benefits of addressing the recommendations
7. **Implementation Guidance**: Next steps and timeline considerations

Format the response as clear, professional text suitable for executive audiences. Use proper headings and bullet points for readability. Focus on actionable insights and business value rather than technical details.

Keep the summary concise but comprehensive - aim for 800-1200 words total. Use professional language appropriate for ${userRole || 'executive'} level audience.`;
    }
    
    const message = await anthropic.messages.create({
      model: config.anthropic.model,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [
        { role: "user", content: prompt }
      ]
    });

    return {
      content: this.getContentText(message),
      provider: 'anthropic',
      language
    };
  }

  /**
   * トレイルマップマイルストーンを生成
   */
  async generateTrailMapMilestones(options: TrailMapMilestonesRequest): Promise<AIResponse> {
    const { assessmentData, maxTokens = 2000, language = 'en' } = options;
    
    let systemPrompt = "You are an AI assistant creating a trail map with milestones for cloud native maturity improvement.";
    
    if (language === 'ja') {
      systemPrompt += " Please respond in Japanese with natural, professional phrasing appropriate for business contexts in Japan.";
    }
    
    const prompt = `Based on the following cloud native maturity assessment data, generate a trail map with specific milestones for the organization to improve their cloud native maturity:
    
    ${JSON.stringify(assessmentData, null, 2)}
    
    For the ${assessmentData.maturityLevel} level in the ${assessmentData.categoryId} category, provide:
    
    1. A set of 3-5 clear milestones to achieve
    2. For each milestone, include:
       - Title: A short, descriptive title
       - Description: A brief explanation (1-2 sentences)
       - Implementation Tip: A practical tip for implementation
    
    Format each milestone as follows:
    
    {
      "title": "Milestone title",
      "description": "Brief description of the milestone",
      "implementationTip": "Practical implementation advice"
    }
    
    Return the milestones as a valid JSON array with no additional text.`;
    
    const message = await anthropic.messages.create({
      model: config.anthropic.model,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [
        { role: "user", content: prompt }
      ]
    });
    
    const responseContent = this.getContentText(message);
    logger.debug('Anthropic Trail Map Response:', responseContent.substring(0, 200) + '...' || 'No content');
    
    return {
      content: responseContent,
      provider: 'anthropic',
      language
    };
  }

  /**
   * 優先フォーカスエリアを生成
   */
  async generatePrioritizedFocusAreas(options: PrioritizedFocusAreasRequest): Promise<AIResponse> {
    const { assessmentData, maxTokens = 2000, language = 'en' } = options;
    
    let systemPrompt = "You are an AI assistant identifying prioritized focus areas for cloud native maturity improvement.";
    
    if (language === 'ja') {
      systemPrompt += " Please respond in Japanese with natural, professional phrasing appropriate for business contexts in Japan.";
    }
    
    const prompt = `Based on the following cloud native maturity assessment data, identify and prioritize the top focus areas for improvement:
    
    ${JSON.stringify(assessmentData, null, 2)}
    
    Please analyze the data and provide:
    1. The top 5 most critical focus areas ranked by impact vs. effort
    2. For each focus area:
       - Current state and its limitations/risks
       - Desired future state and expected benefits
       - Specific, actionable steps to address the gap
       - Estimated level of effort (Low/Medium/High)
       - Potential business impact (Low/Medium/High)
    
    Format the response as a prioritized list with clear sections for each focus area.`;
    
    const message = await anthropic.messages.create({
      model: config.anthropic.model,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [
        { role: "user", content: prompt }
      ]
    });
    
    return {
      content: this.getContentText(message),
      provider: 'anthropic',
      language
    };
  }
} 