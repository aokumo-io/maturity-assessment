/**
 * @file ai-types.ts
 * @description AIサービスの型定義
 * AIプロバイダー、リクエスト、レスポンスに関する型定義を提供します。
 */

export type AIProvider = 'openai' | 'anthropic';

/**
 * 基本的なAIリクエストのインターフェース
 */
export interface AIRequestBase {
  provider?: AIProvider;
  language?: string;
  maxTokens?: number;
}

/**
 * プロンプトリクエストのインターフェース
 */
export interface PromptRequest extends AIRequestBase {
  prompt: string;
}

/**
 * 教育コンテンツリクエストのインターフェース
 */
export interface EducationalContentRequest extends AIRequestBase {
  category: string;
  topic: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  userRole?: string;
}

/**
 * エグゼクティブサマリーリクエストのインターフェース
 */
export interface ExecutiveSummaryRequest extends AIRequestBase {
  assessmentData?: any;
  categoryScores?: any[];
  organizationInfo?: any;
  userRole?: string;
}

/**
 * トレイルマップマイルストーンリクエストのインターフェース
 */
export interface TrailMapMilestonesRequest extends AIRequestBase {
  assessmentData: any;
}

/**
 * 優先フォーカスエリアリクエストのインターフェース
 */
export interface PrioritizedFocusAreasRequest extends AIRequestBase {
  assessmentData: any;
}

/**
 * AIレスポンスのインターフェース
 */
export interface AIResponse {
  content: string;
  provider: AIProvider;
  language?: string;
}

/**
 * APIキーのステータスインターフェース
 */
export interface APIKeyStatus {
  openai: boolean;
  anthropic: boolean;
} 