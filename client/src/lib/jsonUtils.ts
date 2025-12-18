/**
 * @file jsonUtils.ts
 * @description JSON処理ユーティリティ - 堅牢なJSON抽出、クリーニング、バリデーション
 * 
 * このユーティリティは以下の機能を提供します：
 * - 不正なJSONからの安全な抽出
 * - 一般的なJSON構文エラーの自動修正
 * - Zodスキーマによる型安全なバリデーション
 * - 言語固有のフォーマット処理
 * - 寛容なJSONパーシング（軽微な構文エラーを許容）
 */

import { z } from 'zod';
import { logger } from './logger';

/**
 * エグゼクティブサマリーのZodスキーマ定義
 */
export const ExecutiveSummarySchema = z.object({
  executiveSummary: z.object({
    content: z.string(),
    overallMaturityLevel: z.string(),
    keyFindings: z.array(z.string()),
    topRecommendations: z.array(z.string())
  }),
  detailedAnalysis: z.object({
    content: z.string(),
    strengths: z.array(z.string()),
    areasForImprovement: z.array(z.string()),
    strategicRecommendations: z.array(z.string()),
    businessImpact: z.string(),
    implementationGuidance: z.string()
  }),
  validation: z.object({
    ruleBasedAgreement: z.string(),
    costAnalysisValidation: z.string(),
    additionalInsights: z.string(),
    confidenceLevel: z.string()
  }).optional()
});

export type ExecutiveSummaryData = z.infer<typeof ExecutiveSummarySchema>;

/**
 * JSONの抽出結果を表すインターフェース
 */
export interface JsonExtractionResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  warnings?: string[];
}

/**
 * 寛容なJSONパーサー - 複数の手法でJSONパースを試行
 * 
 * @param jsonText - パース対象のJSONテキスト
 * @returns パース結果またはnull
 */
function tolerantJsonParse(jsonText: string): any | null {
  // Method 1: 標準のJSON.parse
  try {
    return JSON.parse(jsonText);
  } catch (error) {
    logger.debug('Standard JSON.parse failed, trying tolerant methods', {
      error: error instanceof Error ? error.message : String(error)
    });
  }

  // Method 2: 段階的なクリーニングとリトライ
  const cleaningStrategies = [
    // Strategy 1: 基本的なクリーニング
    (text: string) => cleanJsonText(text),
    
    // Strategy 2: より積極的な引用符の修正
    (text: string) => fixQuotesInJsonStrings(cleanJsonText(text)),
    
    // Strategy 3: 日本語特有の問題を修正
    (text: string) => fixJapaneseJsonIssues(fixQuotesInJsonStrings(cleanJsonText(text))),
    
    // Strategy 4: 最後の手段 - 非常に積極的な修正
    (text: string) => aggressiveJsonFix(text)
  ];

  for (let i = 0; i < cleaningStrategies.length; i++) {
    try {
      const cleaned = cleaningStrategies[i](jsonText);
      const parsed = JSON.parse(cleaned);
      
      if (i > 0) {
        logger.debug(`JSON parsing succeeded with strategy ${i + 1}`, {
          strategy: i + 1,
          originalLength: jsonText.length,
          cleanedLength: cleaned.length
        });
      }
      
      return parsed;
    } catch (error) {
      if (i === cleaningStrategies.length - 1) {
        logger.debug(`All JSON parsing strategies failed`, {
          finalError: error instanceof Error ? error.message : String(error),
          strategiesTried: cleaningStrategies.length
        });
      }
    }
  }

  // Method 3: 手動でJSONを再構築（最後の手段）
  try {
    return reconstructJsonFromText(jsonText);
  } catch (error) {
    logger.debug('JSON reconstruction failed', {
      error: error instanceof Error ? error.message : String(error)
    });
  }

  return null;
}

/**
 * JSON文字列内の引用符を修正
 * 
 * @param jsonText - 修正対象のJSONテキスト
 * @returns 修正されたJSONテキスト
 */
function fixQuotesInJsonStrings(jsonText: string): string {
  // JSON文字列値内の未エスケープ引用符を検出して修正
  let result = jsonText;
  
  // パターン1: "key": "value with "quote" inside"
  // これを "key": "value with \"quote\" inside" に修正
  result = result.replace(
    /"([^"]*?)": "([^"]*?)"([^"]*?)"([^"]*?)"/g,
    (match, key, start, middle, end) => {
      // 中間の引用符をエスケープ
      const escapedMiddle = middle.replace(/"/g, '\\"');
      return `"${key}": "${start}\\"${escapedMiddle}\\"${end}"`;
    }
  );
  
  // パターン2: より複雑なケース - 複数の引用符
  result = result.replace(
    /"([^"]*?)": "([^"]*?(?:"[^"]*?")*[^"]*?)"/g,
    (match, key, value) => {
      // 値内の引用符をエスケープ（既にエスケープされているものは除く）
      const escapedValue = value.replace(/(?<!\\)"/g, '\\"');
      return `"${key}": "${escapedValue}"`;
    }
  );
  
  return result;
}

/**
 * 日本語コンテンツ特有のJSON問題を修正
 * 
 * @param jsonText - 修正対象のJSONテキスト
 * @returns 修正されたJSONテキスト
 */
function fixJapaneseJsonIssues(jsonText: string): string {
  return jsonText
    // 日本語の引用符を英語の引用符に統一
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    // 全角コロンを半角に
    .replace(/：/g, ':')
    // 全角カンマを半角に
    .replace(/，/g, ',')
    // 全角括弧を半角に
    .replace(/｛/g, '{')
    .replace(/｝/g, '}')
    .replace(/［/g, '[')
    .replace(/］/g, ']')
    // 日本語の句読点が引用符と混在している場合の修正
    .replace(/。"/g, '。\\"')
    .replace(/"。/g, '\\"。')
    // 改行文字が適切にエスケープされていない場合
    .replace(/\n(?=\s*["}])/g, '\\n')
    .replace(/\r(?=\s*["}])/g, '\\r');
}

/**
 * 非常に積極的なJSON修正（最後の手段）
 * 
 * @param jsonText - 修正対象のJSONテキスト
 * @returns 修正されたJSONテキスト
 */
function aggressiveJsonFix(jsonText: string): string {
  let result = jsonText;
  
  // 1. 明らかに壊れた構造を修正
  result = result
    // 連続するカンマを単一に
    .replace(/,+/g, ',')
    // オブジェクトの最後のカンマを削除
    .replace(/,(\s*[}\]])/g, '$1')
    // 配列の最後のカンマを削除
    .replace(/,(\s*\])/g, '$1')
    // 不正な改行を削除
    .replace(/\n(?!\s*["{}\[\],])/g, ' ')
    // 制御文字を削除
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  
  // 2. 引用符の問題をより積極的に修正
  // JSON文字列値内の未エスケープ引用符を全て修正
  result = result.replace(
    /"([^"]*?)": "([^"]*?)"/g,
    (match, key, value) => {
      // 値内の全ての引用符をエスケープ
      const escapedValue = value
        .replace(/\\/g, '\\\\')  // バックスラッシュを先にエスケープ
        .replace(/"/g, '\\"');   // 引用符をエスケープ
      return `"${key}": "${escapedValue}"`;
    }
  );
  
  return result;
}

/**
 * テキストからJSONを手動で再構築（最後の手段）
 * 
 * @param text - 元のテキスト
 * @returns 再構築されたJSONオブジェクト
 */
function reconstructJsonFromText(text: string): any | null {
  // 基本的なJSONオブジェクトの構造を検出して再構築
  const result: any = {};
  
  // executiveSummary セクションを抽出
  const execSummaryMatch = text.match(/"executiveSummary"\s*:\s*{([^}]+(?:{[^}]*}[^}]*)*)}/);
  if (execSummaryMatch) {
    result.executiveSummary = extractObjectFromText(execSummaryMatch[1]);
  }
  
  // detailedAnalysis セクションを抽出
  const detailedAnalysisMatch = text.match(/"detailedAnalysis"\s*:\s*{([^}]+(?:{[^}]*}[^}]*)*)}/);
  if (detailedAnalysisMatch) {
    result.detailedAnalysis = extractObjectFromText(detailedAnalysisMatch[1]);
  }
  
  // validation セクションを抽出（オプション）
  const validationMatch = text.match(/"validation"\s*:\s*{([^}]+(?:{[^}]*}[^}]*)*)}/);
  if (validationMatch) {
    result.validation = extractObjectFromText(validationMatch[1]);
  }
  
  return Object.keys(result).length > 0 ? result : null;
}

/**
 * テキストからオブジェクトのプロパティを抽出
 * 
 * @param text - オブジェクト内容のテキスト
 * @returns 抽出されたオブジェクト
 */
function extractObjectFromText(text: string): any {
  const result: any = {};
  
  // 文字列プロパティを抽出
  const stringMatches = Array.from(text.matchAll(/"([^"]+)"\s*:\s*"([^"]*(?:\\"[^"]*)*)"/g));
  for (const match of stringMatches) {
    const key = match[1];
    const value = match[2].replace(/\\"/g, '"'); // エスケープされた引用符を戻す
    result[key] = value;
  }
  
  // 配列プロパティを抽出
  const arrayMatches = Array.from(text.matchAll(/"([^"]+)"\s*:\s*\[([^\]]*)\]/g));
  for (const match of arrayMatches) {
    const key = match[1];
    const arrayContent = match[2];
    
    // 配列の要素を抽出
    const elements = arrayContent.match(/"([^"]*(?:\\"[^"]*)*)"/g) || [];
    result[key] = elements.map((el: string) => el.slice(1, -1).replace(/\\"/g, '"'));
  }
  
  return result;
}

/**
 * 生のテキストからJSONを抽出し、一般的な構文エラーを修正
 * 
 * @param rawText - 処理対象の生テキスト
 * @returns 抽出されたJSONオブジェクトまたはnull
 */
export function extractAndParseJson(rawText: string): any | null {
  if (!rawText || typeof rawText !== 'string') {
    return null;
  }

  try {
    // 最初と最後の中括弧を見つける
    const start = rawText.indexOf('{');
    const end = rawText.lastIndexOf('}');
    
    if (start === -1 || end === -1 || start >= end) {
      return null;
    }

    // JSON部分を抽出
    let jsonText = rawText.slice(start, end + 1);
    
    // 寛容なJSONパーサーを使用
    const parsed = tolerantJsonParse(jsonText);
    
    return parsed;
  } catch (error) {
    logger.warn('Failed to extract and parse JSON', {
      error: error instanceof Error ? error.message : String(error),
      textLength: rawText.length,
      textPreview: rawText.substring(0, 200) + '...'
    });
    return null;
  }
}

/**
 * JSONテキストの一般的な構文エラーを修正
 * 
 * @param jsonText - 修正対象のJSONテキスト
 * @returns 修正されたJSONテキスト
 */
function cleanJsonText(jsonText: string): string {
  return jsonText
    // 末尾のカンマを削除（オブジェクト）
    .replace(/,\s*}/g, '}')
    // 末尾のカンマを削除（配列）
    .replace(/,\s*]/g, ']')
    // 不正なエスケープシーケンスを修正
    .replace(/\\(?!["\\/bfnrt]|u[0-9a-fA-F]{4})/g, '\\\\')
    // 制御文字を削除
    .replace(/[\x00-\x1F\x7F]/g, '')
    // 重複する空白を正規化
    .replace(/\s+/g, ' ')
    // 不正な改行を修正
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
}

/**
 * エグゼクティブサマリーJSONの安全な抽出とバリデーション
 * 
 * @param rawContent - 処理対象の生コンテンツ
 * @param language - 言語コード（言語固有の処理用）
 * @returns バリデーション結果
 */
export function extractAndValidateExecutiveSummary(
  rawContent: string, 
  language: string = 'en'
): JsonExtractionResult<ExecutiveSummaryData> {
  const warnings: string[] = [];
  
  try {
    // Step 1: JSONを抽出
    const extracted = extractAndParseJson(rawContent);
    
    if (!extracted) {
      return {
        success: false,
        error: 'Failed to extract valid JSON from content'
      };
    }
    
    // Step 2: 言語固有の前処理
    const preprocessed = applyLanguageSpecificProcessing(extracted, language, warnings);
    
    // Step 3: Zodスキーマでバリデーション
    const validationResult = ExecutiveSummarySchema.safeParse(preprocessed);
    
    if (!validationResult.success) {
      const errorDetails = validationResult.error.errors
        .map(err => `${err.path.join('.')}: ${err.message}`)
        .join(', ');
      
      return {
        success: false,
        error: `Schema validation failed: ${errorDetails}`,
        warnings
      };
    }
    
    return {
      success: true,
      data: validationResult.data,
      warnings: warnings.length > 0 ? warnings : undefined
    };
    
  } catch (error) {
    return {
      success: false,
      error: `Processing failed: ${error instanceof Error ? error.message : String(error)}`,
      warnings
    };
  }
}

/**
 * 言語固有の前処理を適用
 * 
 * @param data - 処理対象のデータ
 * @param language - 言語コード
 * @param warnings - 警告メッセージの配列
 * @returns 処理されたデータ
 */
function applyLanguageSpecificProcessing(
  data: any, 
  language: string, 
  warnings: string[]
): any {
  if (!data || typeof data !== 'object') {
    return data;
  }
  
  // 深いクローンを作成して元のデータを変更しない
  let processed = JSON.parse(JSON.stringify(data));
  
  // 日本語固有の処理
  if (language === 'ja') {
    // detailedAnalysis.contentの末尾の句点を削除
    if (processed.detailedAnalysis?.content && typeof processed.detailedAnalysis.content === 'string') {
      const original = processed.detailedAnalysis.content;
      processed.detailedAnalysis.content = original.replace(/\.$/, '');
      
      if (original !== processed.detailedAnalysis.content) {
        warnings.push('Removed trailing period from Japanese detailedAnalysis.content');
      }
    }
    
    // その他の日本語固有の処理
    processed = processJapaneseText(processed, warnings);
  }
  
  // 英語固有の処理
  if (language === 'en') {
    processed = processEnglishText(processed, warnings);
  }
  
  return processed;
}

/**
 * 日本語テキストの処理
 * 
 * @param data - 処理対象のデータ
 * @param warnings - 警告メッセージの配列
 * @returns 処理されたデータ
 */
function processJapaneseText(data: any, warnings: string[]): any {
  // 日本語特有の文字や句読点の正規化
  const normalizeJapaneseText = (text: string): string => {
    return text
      // 全角英数字を半角に変換
      .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (char) => 
        String.fromCharCode(char.charCodeAt(0) - 0xFEE0))
      // 重複する句読点を削除
      .replace(/。{2,}/g, '。')
      .replace(/、{2,}/g, '、')
      // 不適切な空白を削除
      .replace(/\s+/g, ' ')
      .trim();
  };
  
  // 再帰的にテキストフィールドを処理
  const processTextFields = (obj: any): any => {
    if (typeof obj === 'string') {
      return normalizeJapaneseText(obj);
    } else if (Array.isArray(obj)) {
      return obj.map(processTextFields);
    } else if (obj && typeof obj === 'object') {
      const result: any = {};
      for (const [key, value] of Object.entries(obj)) {
        result[key] = processTextFields(value);
      }
      return result;
    }
    return obj;
  };
  
  return processTextFields(data);
}

/**
 * 英語テキストの処理
 * 
 * @param data - 処理対象のデータ
 * @param warnings - 警告メッセージの配列
 * @returns 処理されたデータ
 */
function processEnglishText(data: any, warnings: string[]): any {
  // 英語特有の処理（必要に応じて実装）
  const normalizeEnglishText = (text: string): string => {
    return text
      // 重複するピリオドを削除
      .replace(/\.{2,}/g, '.')
      // 重複するカンマを削除
      .replace(/,{2,}/g, ',')
      // 不適切な空白を正規化
      .replace(/\s+/g, ' ')
      .trim();
  };
  
  // 再帰的にテキストフィールドを処理
  const processTextFields = (obj: any): any => {
    if (typeof obj === 'string') {
      return normalizeEnglishText(obj);
    } else if (Array.isArray(obj)) {
      return obj.map(processTextFields);
    } else if (obj && typeof obj === 'object') {
      const result: any = {};
      for (const [key, value] of Object.entries(obj)) {
        result[key] = processTextFields(value);
      }
      return result;
    }
    return obj;
  };
  
  return processTextFields(data);
}

/**
 * 部分的なスキーマバリデーション（一部のフィールドが欠けていても許可）
 * 
 * @param data - バリデーション対象のデータ
 * @returns バリデーション結果
 */
export function validatePartialExecutiveSummary(data: any): JsonExtractionResult<any> {
  try {
    // 部分的なスキーマを定義
    const PartialSchema = ExecutiveSummarySchema.partial().extend({
      executiveSummary: ExecutiveSummarySchema.shape.executiveSummary.partial().optional(),
      detailedAnalysis: ExecutiveSummarySchema.shape.detailedAnalysis.partial().optional()
    });
    
    const result = PartialSchema.safeParse(data);
    
    if (!result.success) {
      const errorDetails = result.error.errors
        .map(err => `${err.path.join('.')}: ${err.message}`)
        .join(', ');
      
      return {
        success: false,
        error: `Partial validation failed: ${errorDetails}`
      };
    }
    
    return {
      success: true,
      data: result.data
    };
    
  } catch (error) {
    return {
      success: false,
      error: `Partial validation error: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

/**
 * レガシーJSONパーサー（後方互換性のため）
 * 
 * @param content - パース対象のコンテンツ
 * @returns パース結果またはnull
 */
export function parseExecutiveSummaryJSON(content: string): any | null {
  logger.warn('Using legacy parseExecutiveSummaryJSON. Consider migrating to extractAndValidateExecutiveSummary.');
  
  if (!content || typeof content !== 'string') {
    return null;
  }

  const trimmed = content.trim();
  
  // 基本的なJSON形式チェック
  if (!trimmed.startsWith('{') || !trimmed.endsWith('}')) {
    return null;
  }

  try {
    const parsed = JSON.parse(trimmed);
    
    // 基本的な構造チェック
    if (parsed && typeof parsed === 'object' && 
        (parsed.executiveSummary || parsed.detailedAnalysis)) {
      return parsed;
    }
    
    return null;
  } catch (error) {
    logger.warn('Legacy JSON parsing failed:', {
      error: error instanceof Error ? error.message : String(error),
      contentLength: content.length,
      contentPreview: content.substring(0, 100) + '...'
    });
    return null;
  }
} 