import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { CategoryScore, Assessment, AssessmentCategory } from "@shared/schema";
import { useTranslation } from "react-i18next";

// Define the enhanced critical issue format with multilingual support
interface EnhancedCriticalIssue {
  id: string;
  text: string | Record<string, string>;
  severity: number;
}

// Define the internal format we'll use for rendering
interface FormattedCriticalIssue {
  issue: string;
  category: string;
  categoryId: string;
  riskLevel: string;
  severity?: number;
  id?: string;
}

interface CriticalIssuesProps {
  assessment: Assessment;
  categoryScores: CategoryScore[];
  onViewAllToggle?: (showAll: boolean) => void;
  showAll?: boolean;
}

export function CriticalIssues({ assessment, categoryScores, onViewAllToggle, showAll }: CriticalIssuesProps) {
  const { t, i18n } = useTranslation(['results']);
  
  // Get all critical issues from category scores
  const criticalIssues = categoryScores
    .filter(score => score.criticalIssues && score.criticalIssues.length > 0)
    .flatMap(score => {
      // Get category name
      const category = formatCategoryName(score.categoryId);
      
      // Format issues with category name - handle both string[] and object[] formats
      return (score.criticalIssues || []).map(issue => {
        // Check if the issue is the new format (object with id, text, severity)
        if (typeof issue === 'object' && 'text' in issue) {
          // If text is an object with language keys, select the current language
          let issueText: string;
          if (typeof issue.text === 'object' && issue.text !== null) {
            // Get text in current language or fall back to English
            issueText = issue.text[i18n.language] || issue.text.en || Object.values(issue.text)[0];
          } else {
            // Text is already a string
            issueText = issue.text as string;
          }
          
          return {
            category,
            categoryId: score.categoryId,
            issue: issueText,
            id: issue.id,
            severity: issue.severity,
            riskLevel: score.riskLevel || "MEDIUM"
          };
        } else {
          // Handle old format (plain string)
          return {
            category,
            categoryId: score.categoryId,
            issue: issue as string,
            riskLevel: score.riskLevel || "MEDIUM"
          };
        }
      });
    });

  // Sort issues by severity (if available), then by risk level
  const sortedIssues = [...criticalIssues].sort((a, b) => {
    // Sort by severity if available (higher severity first)
    if (a.severity !== undefined && b.severity !== undefined) {
      return b.severity - a.severity;
    }
    // Otherwise sort by risk level
    const riskOrder = { HIGH: 3, MEDIUM: 2, LOW: 1, NONE: 0 };
    return riskOrder[b.riskLevel as keyof typeof riskOrder] - riskOrder[a.riskLevel as keyof typeof riskOrder];
  });

  // Format a category ID into a readable name
  function formatCategoryName(categoryId: string): string {
    // For Japanese, we should use translated category names
    if (i18n.language === 'ja') {
      const jaCategories: {[key: string]: string} = {
        foundations_culture: '基盤と文化',
        application_architecture: 'アプリケーションアーキテクチャ',
        container_infrastructure: 'コンテナインフラストラクチャ',
        cicd_practices: 'CI/CDプラクティス',
        dora_metrics: 'DORAメトリクス',
        observability: '可観測性',
        security_compliance: 'セキュリティとコンプライアンス',
        infrastructure_platform: 'インフラストラクチャプラットフォーム',
        data_management: 'データ管理',
        business_value_strategy: 'ビジネス価値と戦略',
        finops_cost_management: 'FinOpsとコスト管理',
        app_migration_modernization: 'アプリケーション移行と最新化',
        operations_resilience: '運用と回復力',
        multicloud_hybrid_governance: 'マルチクラウド/ハイブリッドガバナンス',
        ai_ml_integration: 'AI/ML統合'
      };
      
      return jaCategories[categoryId] || formatCategoryName(categoryId);
    }
    
    // Default English formatting
    return categoryId
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  // Get severity class based on severity level or risk level
  function getSeverityClass(item: FormattedCriticalIssue): string {
    // Use severity level if available
    if (item.severity !== undefined) {
      switch (item.severity) {
        case 3: return "bg-red-50";
        case 2: return "bg-orange-50";
        case 1: return "bg-yellow-50";
        default: return "bg-gray-50";
      }
    }
    
    // Fall back to risk level
    switch (item.riskLevel) {
      case "HIGH": return "bg-red-50";
      case "MEDIUM": return "bg-orange-50";
      case "LOW": return "bg-yellow-50";
      default: return "bg-gray-50";
    }
  }

  // Get icon color based on severity or risk level
  function getIconColor(item: FormattedCriticalIssue): string {
    if (item.severity !== undefined) {
      switch (item.severity) {
        case 3: return "text-red-500";
        case 2: return "text-orange-500";
        case 1: return "text-yellow-500";
        default: return "text-gray-500";
      }
    }
    
    switch (item.riskLevel) {
      case "HIGH": return "text-red-500";
      case "MEDIUM": return "text-orange-500";
      case "LOW": return "text-yellow-500";
      default: return "text-gray-500";
    }
  }

  // Handle view all issues
  const toggleShowAllIssues = () => {
    if (onViewAllToggle) {
      onViewAllToggle(!showAll);
    }
  };

  if (sortedIssues.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <i className="ri-alert-fill text-red-500 mr-2 text-xl"></i>
          <h2 className="text-xl font-bold">
            {t('criticalIssues.title', 'Critical Issues')} 
            <span className="text-red-500 font-medium text-sm ml-1">({sortedIssues.length})</span>
          </h2>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-blue-600 hover:text-blue-700 font-semibold"
          onClick={toggleShowAllIssues}
        >
          {showAll 
            ? t('criticalIssues.showLess', 'Show less') 
            : t('criticalIssues.viewAll', 'View all issues')} 
          <i className={`ri-arrow-${showAll ? 'up' : 'right'}-line ml-1`}></i>
        </Button>
      </div>
      <div className="space-y-4">
        {(showAll ? sortedIssues : sortedIssues.slice(0, 4)).map((item, index) => (
          <div key={index} className={`flex items-start p-4 rounded-md ${getSeverityClass(item)}`}>
            <div className={`${getIconColor(item)} mt-0.5 mr-3`}>
              <i className="ri-alert-fill text-xl"></i>
            </div>
            <div className="flex-grow">
              <p className="font-medium text-gray-800">{item.issue}</p>
              <p className="text-sm text-gray-600">
                {item.category}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CriticalIssues;