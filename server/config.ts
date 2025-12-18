/**
 * 設定管理クラス
 * 環境変数を安全に読み込み、アプリケーション全体で使用するための設定を提供します。
 */
import { getApiKey } from './direct-env';
import { logger } from './utils/logger';
import { TIMING } from './constants/timing';

/**
 * Session configuration with different duration options
 */
export const SESSION_CONFIG = {
  EXPIRATION: {
    // Short-lived sessions (30 minutes) for viewing results directly after assessment
    SHORT: TIMING.SESSION_SHORT_MS,
    
    // Medium-lived sessions (24 hours) for sharing with immediate team
    MEDIUM: TIMING.SESSION_MEDIUM_MS,
    
    // Long-lived sessions (30 days) for formal reports that need broader distribution
    LONG: TIMING.SESSION_LONG_MS,
  },
  // Default session type if not specified
  DEFAULT_TYPE: 'MEDIUM' as 'SHORT' | 'MEDIUM' | 'LONG',
  // Maximum number of executive summary generations per session
  MAX_EXECUTIVE_SUMMARY_GENERATIONS: parseInt(process.env.EXECUTIVE_SUMMARY_GENERATION_LIMIT || '3', 10)
};

class AppConfig {
  // OpenAI設定
  readonly openai: {
    apiKey: string;
    model: string;
    maxTokens: number;
    temperature: number;
  };

  // Anthropic設定
  readonly anthropic: {
    apiKey: string;
    model: string;
    maxTokens: number;
    temperature: number;
  };

  // デフォルトAIプロバイダー設定
  readonly defaultProvider: 'openai' | 'anthropic';

  // サーバー設定
  readonly server: {
    port: number;
    environment: string;
    isDevelopment: boolean;
  };

  // AIフィーチャー設定
  readonly features: {
    enableExecutiveSummary: boolean;
    enableTrailMap: boolean;
    enableFocusAreas: boolean;
    executiveSummaryGenerationLimit: number;
  };

  /**
   * 設定を環境変数から初期化します
   */
  constructor() {
    // サーバー環境設定
    const environment = process.env.NODE_ENV || 'development';
    const isDevelopment = environment === 'development';
    
    // OpenAI設定の初期化
    const openaiApiKey = this.getOpenAIKey();
    const openaiModel = process.env.OPENAI_MODEL || 'gpt-4o-mini';
    
    // Anthropic設定の初期化
    const anthropicApiKey = this.getAnthropicKey();
    const anthropicModel = process.env.ANTHROPIC_MODEL || 'claude-3-sonnet-20240229';
    
    // デフォルトAIプロバイダーの設定
    const defaultAiProvider = process.env.DEFAULT_AI_PROVIDER?.toLowerCase() || 'openai';
    this.defaultProvider = (defaultAiProvider === 'anthropic') ? 'anthropic' : 'openai';
    
    // 設定オブジェクトの初期化
    this.openai = {
      apiKey: openaiApiKey,
      model: openaiModel,
      maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || '1500', 10),
      temperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.7')
    };
    
    this.anthropic = {
      apiKey: anthropicApiKey,
      model: anthropicModel,
      maxTokens: parseInt(process.env.ANTHROPIC_MAX_TOKENS || '1500', 10),
      temperature: parseFloat(process.env.ANTHROPIC_TEMPERATURE || '0.7')
    };
    
    this.server = {
      port: parseInt(process.env.PORT || '5001', 10),
      environment,
      isDevelopment
    };
    
    this.features = {
      enableExecutiveSummary: true,
      enableTrailMap: true,
      enableFocusAreas: true,
      executiveSummaryGenerationLimit: parseInt(process.env.EXECUTIVE_SUMMARY_GENERATION_LIMIT || '3', 10)
    };
    
    // 設定の検証とログ出力
    this.validateConfig();
  }

  /**
   * 直接環境変数ファイルからOpenAI APIキーを取得します
   */
  private getOpenAIKey(): string {
    return getApiKey('OPENAI_API_KEY');
  }
  
  /**
   * 直接環境変数ファイルからAnthropic APIキーを取得します
   */
  private getAnthropicKey(): string {
    return getApiKey('ANTHROPIC_API_KEY');
  }

  /**
   * 環境変数の値を整形します
   * 空白、改行、インデントなどを削除します
   */
  private cleanEnvVar(value?: string): string {
    if (!value) return '';
    
    // 全ての空白文字（改行、スペース、タブなど）を削除
    return value.replace(/[\s\n\r]+/g, '');
  }

  /**
   * APIキーが有効かどうかを確認します
   */
  isOpenAIConfigured(): boolean {
    return !!this.openai.apiKey && (
      this.openai.apiKey.startsWith('sk-') || 
      this.openai.apiKey.startsWith('sk-proj-')
    );
  }
  
  /**
   * Anthropic APIキーが有効かどうかを確認します
   */
  isAnthropicConfigured(): boolean {
    return !!this.anthropic.apiKey && this.anthropic.apiKey.startsWith('sk-ant');
  }

  /**
   * 設定の検証とログ出力を行います
   */
  private validateConfig(): void {
    // 必要最小限のログ出力
    logger.info(`[CONFIG] Environment: ${this.server.environment}`);
    
    // OpenAI設定の検証
    const openaiStatus = this.isOpenAIConfigured() ? '設定済み' : '未設定';
    logger.info(`[CONFIG] OpenAI API Key: ${openaiStatus}`);
    
    // Anthropic設定の検証
    const anthropicStatus = this.isAnthropicConfigured() ? '設定済み' : '未設定';
    logger.info(`[CONFIG] Anthropic API Key: ${anthropicStatus}`);
    
    // デフォルトプロバイダーのログ出力
    logger.info(`[CONFIG] Default AI Provider: ${this.defaultProvider}`);
    
    // 警告の表示（どちらのAPIキーも設定されていない場合）
    if (!this.isOpenAIConfigured() && !this.isAnthropicConfigured()) {
      logger.warn('警告: OpenAIとAnthropicのAPIキーが両方とも設定されていません。AI機能は動作しません。');
    }
    
    // デフォルトプロバイダーが設定されていないが、そのプロバイダーのAPIキーが設定されていない場合の警告
    if (this.defaultProvider === 'openai' && !this.isOpenAIConfigured()) {
      logger.warn('警告: デフォルトプロバイダーがOpenAIですが、OpenAI APIキーが設定されていません。');
    } else if (this.defaultProvider === 'anthropic' && !this.isAnthropicConfigured()) {
      logger.warn('警告: デフォルトプロバイダーがAnthropicですが、Anthropic APIキーが設定されていません。');
    }
  }
  
  /**
   * AI機能が利用可能かどうかを判定
   */
  isAIFunctionalityAvailable(): boolean {
    return this.isOpenAIConfigured() || this.isAnthropicConfigured();
  }
  
  /**
   * 静的ファクトリメソッド - 環境変数から設定を作成します
   */
  static fromEnv(): AppConfig {
    // dotenvが既にindex.tsで読み込まれていることを前提とします
    return new AppConfig();
  }
}

// シングルトンインスタンスとしてエクスポート
const config = AppConfig.fromEnv();
export default config; 