/**
 * Google Analytics 4 (GA4) 統合ユーティリティ
 * 
 * このモジュールは以下の機能を提供します：
 * - GA4の初期化と設定
 * - ページビューの追跡
 * - カスタムイベントの追跡
 * - ユーザープロパティの設定
 * - 環境に応じた条件付き実行
 * 
 * 使用方法：
 * 1. 環境変数にGOOGLE_ANALYTICS_IDを設定
 * 2. アプリケーション開始時にinitializeAnalytics()を呼び出し
 * 3. ページ遷移時にtrackPageView()を使用
 * 4. カスタムイベントにtrackEvent()を使用
 */

import ReactGA from 'react-ga4';
import { logger } from './logger';

// 設定可能な Google Analytics 設定
interface AnalyticsConfig {
  trackingId: string;
  debug?: boolean;
  testMode?: boolean;
  gtagOptions?: {
    custom_map?: Record<string, string>;
    cookie_domain?: string;
    cookie_expires?: number;
    cookie_prefix?: string;
    cookie_update?: boolean;
    cookie_flags?: string;
  };
}

// イベント追跡用の型定義
export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  nonInteraction?: boolean;
  customParameters?: Record<string, any>;
}

// アセスメント固有のイベント型
export interface AssessmentEvent {
  eventName: 'assessment_started' | 'assessment_completed' | 'question_answered' | 'knowledge_resource_viewed' | 'language_changed' | 'assessment_shared';
  assessmentType?: string;
  categoryId?: string;
  questionId?: string;
  responseValue?: string | number;
  language?: string;
  resourceUrl?: string;
  shareMethod?: string;
  customParameters?: Record<string, any>;
}

class AnalyticsService {
  private isInitialized = false;
  private config: AnalyticsConfig | null = null;
  private isDevelopment = false;

  /**
   * Google Analytics を初期化
   * @param trackingId GA4 測定ID (例: "G-XXXXXXXXXX")
   * @param options 追加設定オプション
   */
  public initializeAnalytics(trackingId: string, options: Partial<AnalyticsConfig> = {}): void {
    // 環境チェック
    this.isDevelopment = import.meta.env.DEV || import.meta.env.NODE_ENV === 'development';
    
    if (!trackingId) {
      logger.warn('Google Analytics tracking ID not provided');
      return;
    }

    // トラッキングIDの形式チェック
    if (!trackingId.startsWith('G-')) {
      logger.error('Invalid Google Analytics tracking ID format. Expected format: G-XXXXXXXXXX');
      return;
    }

    this.config = {
      trackingId,
      debug: options.debug || this.isDevelopment,
      testMode: options.testMode || this.isDevelopment,
      gtagOptions: options.gtagOptions || {}
    };

    try {
      // Dynamically load the Google Analytics script
      this.loadGoogleAnalyticsScript(trackingId);

      // ReactGA4を初期化
      ReactGA.initialize(trackingId, {
        testMode: this.config.testMode,
        gtagOptions: this.config.gtagOptions
      });

      this.isInitialized = true;
      
      logger.info('Google Analytics initialized successfully', {
        trackingId,
        debug: this.config.debug,
        testMode: this.config.testMode
      });

      // 初期ページビューを送信
      this.trackPageView();

    } catch (error) {
      logger.error('Failed to initialize Google Analytics:', error);
    }
  }

  /**
   * Google Analytics スクリプトを動的に読み込み
   * @param trackingId GA4 測定ID
   */
  private loadGoogleAnalyticsScript(trackingId: string): void {
    // Check if script is already loaded
    if (document.querySelector(`script[src*="gtag/js?id=${trackingId}"]`)) {
      logger.debug('Google Analytics script already loaded');
      return;
    }

    // Create and append the script tag
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
    document.head.appendChild(script);

    logger.debug('Google Analytics script loaded dynamically');
  }

  /**
   * ページビューを追跡
   * @param path ページパス（省略時は現在のパスを使用）
   * @param title ページタイトル（省略時は現在のタイトルを使用）
   */
  public trackPageView(path?: string, title?: string): void {
    if (!this.isInitialized) {
      logger.warn('Analytics not initialized. Call initializeAnalytics() first.');
      return;
    }

    try {
      const pageOptions = {
        page_title: title || document.title,
        page_location: window.location.href,
        page_path: path || window.location.pathname + window.location.search
      };

      ReactGA.send({
        hitType: 'pageview',
        ...pageOptions
      });

      if (this.config?.debug) {
        logger.debug('Page view tracked:', pageOptions);
      }
    } catch (error) {
      logger.error('Failed to track page view:', error);
    }
  }

  /**
   * カスタムイベントを追跡
   * @param event イベントデータ
   */
  public trackEvent(event: AnalyticsEvent): void {
    if (!this.isInitialized) {
      logger.warn('Analytics not initialized. Call initializeAnalytics() first.');
      return;
    }

    try {
      ReactGA.event(event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        non_interaction: event.nonInteraction,
        ...event.customParameters
      });

      if (this.config?.debug) {
        logger.debug('Event tracked:', event);
      }
    } catch (error) {
      logger.error('Failed to track event:', error);
    }
  }

  /**
   * アセスメント固有のイベントを追跡
   * @param event アセスメントイベントデータ
   */
  public trackAssessmentEvent(event: AssessmentEvent): void {
    const analyticsEvent: AnalyticsEvent = {
      action: event.eventName,
      category: 'assessment',
      label: event.categoryId || event.assessmentType,
      customParameters: {
        assessment_type: event.assessmentType,
        category_id: event.categoryId,
        question_id: event.questionId,
        response_value: event.responseValue,
        language: event.language,
        resource_url: event.resourceUrl,
        share_method: event.shareMethod,
        ...event.customParameters
      }
    };

    this.trackEvent(analyticsEvent);
  }

  /**
   * ユーザープロパティを設定
   * @param properties ユーザープロパティのオブジェクト
   */
  public setUserProperties(properties: Record<string, any>): void {
    if (!this.isInitialized) {
      logger.warn('Analytics not initialized. Call initializeAnalytics() first.');
      return;
    }

    try {
      ReactGA.set(properties);

      if (this.config?.debug) {
        logger.debug('User properties set:', properties);
      }
    } catch (error) {
      logger.error('Failed to set user properties:', error);
    }
  }

  /**
   * Analytics が初期化されているかチェック
   * @returns 初期化状態
   */
  public isReady(): boolean {
    return this.isInitialized;
  }

  /**
   * 現在の設定を取得
   * @returns 現在の Analytics 設定
   */
  public getConfig(): AnalyticsConfig | null {
    return this.config;
  }

  /**
   * Analytics を無効化（GDPR準拠など）
   */
  public disable(): void {
    if (this.isInitialized && this.config) {
      try {
        // Google Analytics のオプトアウト
        (window as any)[`ga-disable-${this.config.trackingId}`] = true;
        logger.info('Google Analytics disabled');
      } catch (error) {
        logger.error('Failed to disable Analytics:', error);
      }
    }
  }

  /**
   * Analytics を有効化
   */
  public enable(): void {
    if (this.isInitialized && this.config) {
      try {
        // Google Analytics のオプトイン
        (window as any)[`ga-disable-${this.config.trackingId}`] = false;
        logger.info('Google Analytics enabled');
      } catch (error) {
        logger.error('Failed to enable Analytics:', error);
      }
    }
  }
}

// シングルトンインスタンスを作成
const analytics = new AnalyticsService();

// 便利な関数をエクスポート
export const initializeAnalytics = (trackingId: string, options?: Partial<AnalyticsConfig>) => 
  analytics.initializeAnalytics(trackingId, options);

export const trackPageView = (path?: string, title?: string) => 
  analytics.trackPageView(path, title);

export const trackEvent = (event: AnalyticsEvent) => 
  analytics.trackEvent(event);

export const trackAssessmentEvent = (event: AssessmentEvent) => 
  analytics.trackAssessmentEvent(event);

export const setUserProperties = (properties: Record<string, any>) => 
  analytics.setUserProperties(properties);

export const isAnalyticsReady = () => 
  analytics.isReady();

export const getAnalyticsConfig = () => 
  analytics.getConfig();

export const disableAnalytics = () => 
  analytics.disable();

export const enableAnalytics = () => 
  analytics.enable();

// デフォルトエクスポート
export default analytics; 