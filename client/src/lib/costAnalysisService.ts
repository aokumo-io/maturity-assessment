/**
 * @file costAnalysisService.ts
 * @description コスト分析サービス
 * サーバーAPIを通じてコスト分析データを取得するサービスを提供します。
 */

import { persistenceManager, STORAGE_KEYS } from './assessmentUtils';
import type { CategoryScore } from '@shared/schema';
import { logger } from './logger';
import { apiRequest } from './queryClient';

// サーバーから取得するコスト分析データの型定義
export interface CostSavings {
  IC: number;
  OE: number;
  DP: number;
  IM: number;
  TM: number;
  total: number;
  confidence: number;
  confidenceFactors: {
    dataCompleteness: number;
    industryMatch: number;
    organizationSize: number;
    scoreReliability: number;
  };
}

export interface QuickWin {
  category: string;            // カテゴリーID (Category ID for translation)
  score: number;               // 現在のスコア
  targetScore: number;         // ターゲットスコア
  impact: number;              // インパクト（削減額）
  complexity: number;          // 複雑さ（1-10）
  roi: number;                 // 投資対効果
  percentileRank: number;      // ROIのパーセンタイルランク（0-100）
  primaryArea: string;         // 主な影響領域
}

// 通貨フォーマット機能（UI表示用）
export function formatCurrency(amount: number, currency: string = 'JPY'): string {
  logger.debug(`[formatCurrency] Input details`, { amount, currency });
  
  if (!amount || isNaN(amount)) amount = 0;
  
  // Normalize currency code
  const currencyCode = (currency || 'JPY').toUpperCase();
  logger.debug(`[formatCurrency] Normalized currencyCode: ${currencyCode}`);
  
  // For JPY, always use direct formatting with yen symbol
  if (currencyCode === 'JPY') {
    // For very large amounts (>=100,000,000 JPY = 10,000万円), use 億円 units
    if (amount >= 100_000_000) {
      const inOkuYen = amount / 100_000_000;
      // Round to one decimal place for readability
      const roundedOkuYen = Math.round(inOkuYen * 10) / 10;
      // Format with Japanese locale
      const formattedOkuYen = roundedOkuYen.toLocaleString('ja-JP');
      const result = `${formattedOkuYen}億円`;
      logger.debug(`[formatCurrency] Using 億円 units for very large amount: ${result}`);
      return result;
    }
    
    // For large amounts (>=10,000), use 万円 (10,000 yen) units which is common in Japan
    if (amount >= 10000) {
      const inManYen = amount / 10000;
      // Round to whole number
      const roundedManYen = Math.round(inManYen);
      // Format with Japanese locale
      const formattedManYen = roundedManYen.toLocaleString('ja-JP');
      const result = `${formattedManYen}万円`;
      logger.debug(`[formatCurrency] Using 万円 units for large amount: ${result}`);
      return result;
    }
    
    // For smaller amounts, use regular formatting
    const formattedNumber = amount.toLocaleString('ja-JP');
    const result = `¥${formattedNumber}`;
    logger.debug(`[formatCurrency] Direct JPY formatting result: ${result}`);
    return result;
  }
  
  // For all other currencies, use Intl API
  const locale = currencyCode === 'EUR' ? 'de-DE' : 'en-US';
  logger.debug(`[formatCurrency] Using locale: ${locale} for currency: ${currencyCode}`);
  
  try {
    const result = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      maximumFractionDigits: 0
    }).format(amount);
    logger.debug(`[formatCurrency] Intl API result: ${result}`);
    return result;
  } catch (error) {
    logger.error('[formatCurrency] Error', error);
    // Fallback formatting
    const fallbackResult = currencyCode === 'USD' 
      ? `$${amount.toLocaleString('en-US')}` 
      : `${currencyCode} ${amount.toLocaleString()}`;
    logger.debug(`[formatCurrency] Fallback result: ${fallbackResult}`);
    return fallbackResult;
  }
}

// API呼び出しのためのキャッシュデータ型
interface CachedCostAnalysisData {
  data: {
    costSavings: CostSavings;
    quickWins: QuickWin[];
    formattedTotal: string;
    currency: string;
    savingsPercentage: string;
  };
  timestamp: number;
  language: string;
}

// 現在進行中のリクエストを追跡するためのグローバル変数
let currentCostAnalysisRequest: Promise<any> | null = null;
let currentRequestLanguage: string | null = null;

/**
 * サーバーからコスト分析データを取得する
 * @param categoryScores カテゴリースコアの配列
 * @param language 言語
 * @returns コスト分析結果
 */
export async function fetchCostAnalysisFromServer(
  categoryScores: CategoryScore[] = [],
  language?: string
): Promise<{
  costSavings: CostSavings;
  quickWins: QuickWin[];
  formattedTotal: string;
  currency: string;
  savingsPercentage: string;
}> {
  try {
    // 言語設定の取得
    let userLang = language || 'en';
    if (!language) {
      try {
        const storedLang = localStorage.getItem('i18nextLng');
        userLang = storedLang || 'en';
        logger.debug(`[fetchCostAnalysisFromServer] Detected language: ${userLang}`);
      } catch (error) {
        logger.error('[fetchCostAnalysisFromServer] Error getting language', error);
      }
    }
    
    // キャッシュから読み込み
    const cachedData = persistenceManager.loadFormData<CachedCostAnalysisData | null>(
      STORAGE_KEYS.COST_ANALYSIS_DATA,
      null
    );
    
    // キャッシュの検証（60分以内かつ同じ言語）
    const cacheIsValid = cachedData && 
      (Date.now() - cachedData.timestamp < 60 * 60 * 1000) && 
      cachedData.language === userLang;
    
    if (cacheIsValid) {
      logger.debug('[fetchCostAnalysisFromServer] Using cached cost analysis data');
      return cachedData.data;
    }
    
    // 既に進行中のリクエストがあり、同じ言語ならそれを再利用
    if (currentCostAnalysisRequest && currentRequestLanguage === userLang) {
      logger.debug('[fetchCostAnalysisFromServer] Using in-flight request');
      return currentCostAnalysisRequest;
    }
    
    // 新しいリクエストを作成
    logger.debug('[fetchCostAnalysisFromServer] Making new request', {
      cacheIsValid, 
      hasCachedData: !!cachedData,
      cacheAge: cachedData ? (Date.now() - cachedData.timestamp) / 1000 / 60 : 'N/A',
      userLang,
      cachedLang: cachedData?.language || 'none',
      hasInFlightRequest: !!currentCostAnalysisRequest,
      currentRequestLang: currentRequestLanguage,
    });
    
    // リクエストトラッキング変数を設定
    currentRequestLanguage = userLang;
    currentCostAnalysisRequest = (async () => {
      try {
        logger.debug('[fetchCostAnalysisFromServer] Requesting cost analysis from server API', {
          language: userLang
        });
        
        // APIリクエスト - Accept-Languageヘッダーに言語を設定
        const response = await apiRequest('POST', '/api/assessment/cost-analysis', {}, {
          'Accept-Language': userLang
        });
        
        logger.debug('[fetchCostAnalysisFromServer] Received response', {
          statusCode: response.status,
          dataSize: 'Response received',
        });
        
        // レスポンスデータの取得
        const data = await response.json();
        
        // キャッシュに保存
        persistenceManager.saveFormData(STORAGE_KEYS.COST_ANALYSIS_DATA, {
          data,
          timestamp: Date.now(),
          language: userLang
        });
        
        return data;
      } catch (error) {
        logger.error('[fetchCostAnalysisFromServer] API call failed', error);
        // API呼び出しに失敗した場合はデフォルト値を返す
        return {
          costSavings: {
            IC: 0,
            OE: 0,
            DP: 0,
            IM: 0,
            TM: 0,
            total: 0,
            confidence: 0,
            confidenceFactors: { dataCompleteness: 0, industryMatch: 0, organizationSize: 0, scoreReliability: 0 }
          },
          quickWins: [],
          formattedTotal: formatCurrency(0, userLang === 'ja' ? 'JPY' : 'USD'),
          currency: userLang === 'ja' ? 'JPY' : 'USD',
          savingsPercentage: '0%'
        };
      } finally {
        currentCostAnalysisRequest = null;
        currentRequestLanguage = null;
      }
    })();
    
    return currentCostAnalysisRequest;
  } catch (error) {
    logger.error('[fetchCostAnalysisFromServer] Error in request handling', error);
    // エラー時のフォールバック
    return {
      costSavings: {
        IC: 0,
        OE: 0,
        DP: 0,
        IM: 0,
        TM: 0,
        total: 0,
        confidence: 0,
        confidenceFactors: { dataCompleteness: 0, industryMatch: 0, organizationSize: 0, scoreReliability: 0 }
      },
      quickWins: [],
      formattedTotal: formatCurrency(0, 'USD'),
      currency: 'USD',
      savingsPercentage: '0%'
    };
  }
}