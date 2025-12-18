/**
 * React互換性レイヤー
 * 
 * このファイルは、アプリケーション全体でReactの使用方法を一貫させるためのユーティリティを提供します。
 * 異なるReactインポートパターン（デフォルトインポートと名前空間インポート）の間の一貫性を確保します。
 */

import React from 'react';

// デフォルトエクスポートとしてReactインスタンスをエクスポート
export default React;

// 必要なReactタイプを個別にエクスポート
export type ElementRef<T> = React.ElementRef<T>;
export type ComponentPropsWithoutRef<T> = React.ComponentPropsWithoutRef<T>;
export type ReactElement<T> = React.ReactElement<T>;
export type ReactNode = React.ReactNode;
export type ForwardRefExoticComponent<T> = React.ForwardRefExoticComponent<T>;
export type RefAttributes<T> = React.RefAttributes<T>;

// 一般的なReactフックもエクスポートして簡単にアクセスできるようにします
export const {
  useState,
  useEffect,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  useRef,
  useImperativeHandle,
  useLayoutEffect,
  useDebugValue,
  useDeferredValue,
  useTransition,
  useId,
  startTransition,
  Children,
  createContext,
  createElement,
  forwardRef,
  Fragment,
  isValidElement,
  memo,
  StrictMode,
  Suspense,
} = React; 