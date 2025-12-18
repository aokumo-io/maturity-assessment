/**
 * @file sanitization.ts
 * @description 入力データのサニタイゼーションサービス
 * 
 * セキュアな入力処理のための専用サービス。
 * XSS攻撃、SQLインジェクション、その他の悪意のある入力から保護する。
 * Clean Architectureの原則に従い、ビジネスロジックから分離している。
 */

import { z } from 'zod';
import validator from 'validator';
import { logger } from './logger';

/**
 * フィードバックデータのバリデーションスキーマ
 * Zodを使用してタイプセーフな検証を提供
 */
export const feedbackValidationSchema = z.object({
  rating: z.number().int().min(1).max(5),
  workingWell: z.string().optional(),
  needsImprovement: z.string().optional(),
  featureRequests: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  resultId: z.string().optional(),
  userAgent: z.string().optional(),
  ip: z.string().optional()
});

/**
 * バリデーション済みフィードバックデータの型
 */
export type ValidatedFeedbackData = z.infer<typeof feedbackValidationSchema>;

/**
 * テキスト入力をサニタイズする
 * XSS攻撃を防ぐために危険なHTMLタグとスクリプトを除去
 * 
 * @param text - サニタイズするテキスト
 * @param maxLength - 最大文字数（デフォルト: 100）
 * @returns サニタイズされたテキスト
 */
export function sanitizeText(text: string | undefined | null, maxLength: number = 100): string {
  if (!text || typeof text !== 'string') {
    return '';
  }

  // 基本的なトリミングと長さ制限
  let sanitized = text.trim();
  
  // validator.jsを使用してHTMLエスケープ
  sanitized = validator.escape(sanitized);
  
  // 追加のセキュリティ対策: 危険なパターンを除去
  sanitized = sanitized
    .replace(/javascript:/gi, '') // JavaScriptプロトコルの除去
    .replace(/data:/gi, '') // データURLの除去
    .replace(/vbscript:/gi, '') // VBScriptプロトコルの除去
    .replace(/on\w+\s*=/gi, ''); // イベントハンドラーの除去
  
  // 文字数制限を適用
  if (sanitized.length > maxLength) {
    sanitized = sanitized.slice(0, maxLength);
    logger.debug(`Text truncated to ${maxLength} characters`);
  }
  
  return sanitized;
}

/**
 * メールアドレスをバリデートおよびサニタイズする
 * RFC準拠の検証とセキュリティチェックを実行
 * 
 * @param email - バリデートするメールアドレス
 * @returns バリデート済みメールアドレス、または空文字列
 */
export function sanitizeEmail(email: string | undefined | null): string {
  if (!email || typeof email !== 'string') {
    return '';
  }

  // トリミングと基本的なクリーニング
  const trimmed = email.trim().toLowerCase();
  
  // RFC 5321の長さ制限（320文字）を適用
  if (trimmed.length > 320) {
    logger.warn('Email address exceeds RFC 5321 length limit', { length: trimmed.length });
    return '';
  }
  
  // validator.jsを使用してメールアドレスをバリデート
  if (!validator.isEmail(trimmed)) {
    logger.debug('Invalid email format detected', { email: trimmed });
    return '';
  }
  
  // 追加のセキュリティチェック: 危険な文字の除去
  const cleaned = trimmed.replace(/[<>'"]/g, '');
  
  // 再度バリデートして確実性を保つ
  return validator.isEmail(cleaned) ? cleaned : '';
}

/**
 * フィードバックデータを包括的にバリデートおよびサニタイズする
 * 
 * @param rawData - 生のフィードバックデータ
 * @returns バリデーション結果とサニタイズされたデータ
 */
export function validateAndSanitizeFeedback(rawData: any): {
  success: boolean;
  data?: ValidatedFeedbackData;
  errors?: string[];
} {
  try {
    // 最初にZodでの基本構造バリデーション
    const parseResult = feedbackValidationSchema.safeParse({
      rating: rawData.rating,
      workingWell: rawData.workingWell,
      needsImprovement: rawData.needsImprovement,
      featureRequests: rawData.featureRequests,
      email: rawData.email,
      resultId: rawData.resultId,
      userAgent: rawData.userAgent,
      ip: rawData.ip
    });

    if (!parseResult.success) {
      const errors = parseResult.error.errors.map(err => 
        `${err.path.join('.')}: ${err.message}`
      );
      logger.warn('Feedback validation failed', { errors });
      return { success: false, errors };
    }

    // サニタイゼーション処理
    const sanitizedData: ValidatedFeedbackData = {
      rating: parseResult.data.rating,
      workingWell: sanitizeText(parseResult.data.workingWell),
      needsImprovement: sanitizeText(parseResult.data.needsImprovement),
      featureRequests: sanitizeText(parseResult.data.featureRequests),
      email: sanitizeEmail(parseResult.data.email),
      resultId: parseResult.data.resultId,
      userAgent: parseResult.data.userAgent,
      ip: parseResult.data.ip
    };

    // 空文字列のフィールドをundefinedに変換（オプショナルフィールド用）
    if (sanitizedData.workingWell === '') sanitizedData.workingWell = undefined;
    if (sanitizedData.needsImprovement === '') sanitizedData.needsImprovement = undefined;
    if (sanitizedData.featureRequests === '') sanitizedData.featureRequests = undefined;
    if (sanitizedData.email === '') sanitizedData.email = undefined;

    logger.debug('Feedback data successfully validated and sanitized', {
      hasEmail: !!sanitizedData.email,
      rating: sanitizedData.rating
    });

    return { success: true, data: sanitizedData };
  } catch (error) {
    logger.error('Unexpected error during feedback validation', error);
    return { 
      success: false, 
      errors: ['Internal validation error occurred'] 
    };
  }
}

/**
 * IPアドレスをサニタイズする
 * 
 * @param ip - 生のIPアドレス（文字列または文字列配列）
 * @returns サニタイズされたIPアドレス
 */
export function sanitizeIpAddress(ip: string | string[] | undefined): string {
  if (!ip) return 'unknown';
  
  // 配列の場合は最初の要素を使用
  const ipString = Array.isArray(ip) ? ip[0] : ip;
  
  if (!ipString || typeof ipString !== 'string') return 'unknown';
  
  // IPアドレスの基本的な検証
  if (validator.isIP(ipString)) {
    return ipString;
  }
  
  // IPv6の場合やプロキシ経由の場合の処理
  const cleaned = ipString.trim().split(',')[0].trim(); // カンマ区切りの場合の最初のIP
  
  return validator.isIP(cleaned) ? cleaned : 'unknown';
} 