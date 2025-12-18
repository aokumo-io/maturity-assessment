/**
 * @file ai-service.ts
 * @description AIサービスの統合インターフェース
 * 複数のAIプロバイダーの共通インターフェースとファクトリーを提供します。
 */

import { logger } from '../utils/logger';
import { 
  AIProvider, 
  AIResponse, 
  PromptRequest,
  EducationalContentRequest,
  ExecutiveSummaryRequest,
  TrailMapMilestonesRequest,
  PrioritizedFocusAreasRequest,
  APIKeyStatus
} from '../types/ai-types';
import OpenAIService from './openai-service';
import AnthropicService from './anthropic-service';
import config from '../config';

/**
 * AIサービスクラス
 * プロバイダーの選択と共通インターフェースを提供します
 */
export default class AIService {
  /**
   * 指定されたプロバイダーのサービスを取得
   */
  private static getProviderService(provider?: AIProvider) {
    const selectedProvider = provider || config.defaultProvider || 'openai';
    
    logger.debug(`Using AI provider: ${selectedProvider}, default from config: ${config.defaultProvider}`);
    
    switch (selectedProvider) {
      case 'openai':
        return new OpenAIService();
      case 'anthropic':
        return new AnthropicService();
      default:
        logger.warn(`Invalid provider: ${selectedProvider}, falling back to OpenAI`);
        return new OpenAIService();
    }
  }
  
  /**
   * API キーの設定状況を確認
   */
  static checkAPIKeys(): APIKeyStatus {
    const openaiService = new OpenAIService();
    const anthropicService = new AnthropicService();
    
    return {
      openai: openaiService.hasValidApiKey(),
      anthropic: anthropicService.hasValidApiKey()
    };
  }
  
  /**
   * AIプロンプトに基づいてレスポンスを生成
   */
  static async generateResponse(options: PromptRequest): Promise<AIResponse> {
    const service = this.getProviderService(options.provider);
    return service.generateResponse(options);
  }
  
  /**
   * 教育コンテンツを生成
   */
  static async generateEducationalContent(options: EducationalContentRequest): Promise<AIResponse> {
    const service = this.getProviderService(options.provider);
    return service.generateEducationalContent(options);
  }
  
  /**
   * エグゼクティブサマリーを生成
   */
  static async generateExecutiveSummary(options: ExecutiveSummaryRequest): Promise<AIResponse> {
    const service = this.getProviderService(options.provider);
    return service.generateExecutiveSummary(options);
  }
  
  /**
   * トレイルマップマイルストーンを生成
   */
  static async generateTrailMapMilestones(options: TrailMapMilestonesRequest): Promise<AIResponse> {
    const service = this.getProviderService(options.provider);
    return service.generateTrailMapMilestones(options);
  }
  
  /**
   * 優先フォーカスエリアを生成
   */
  static async generatePrioritizedFocusAreas(options: PrioritizedFocusAreasRequest): Promise<AIResponse> {
    const service = this.getProviderService(options.provider);
    return service.generatePrioritizedFocusAreas(options);
  }
} 