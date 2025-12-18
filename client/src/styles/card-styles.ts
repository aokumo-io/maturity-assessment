/**
 * @file card-styles.ts
 * @description カードスタイルの統一コンポーネント
 * アプリケーション全体で一貫したカードスタイルを提供します。
 */

import { cn } from "@/lib/utils";

// Card container styles
export const cardStyles = {
  container: "bg-white p-6 rounded-lg shadow-md border-0",
  header: "mb-6",
  content: "", // Default empty to allow flexibility
  footer: "border-t pt-6 mt-4",
};

// Typography styles that match the Maturity Analysis
export const textStyles = {
  // Headings
  heading: {
    primary: "text-xl font-bold mb-4",
    secondary: "text-lg font-medium text-primary-800 mb-4",
  },
  // Body text
  body: {
    default: "text-sm text-gray-600",
    emphasized: "text-sm font-medium text-gray-700",
  },
  // Link text
  link: "text-sm font-medium text-primary-500 hover:text-primary-600",
};

// Helper function to apply card styles with any additional classes
export function applyCardStyle(additionalClasses?: string) {
  return cn(cardStyles.container, additionalClasses);
}

// Helper function to apply heading styles with any additional classes
export function applyHeadingStyle(variant: 'primary' | 'secondary' = 'primary', additionalClasses?: string) {
  return cn(textStyles.heading[variant], additionalClasses);
}

// Helper function to apply body text styles with any additional classes
export function applyBodyStyle(variant: 'default' | 'emphasized' = 'default', additionalClasses?: string) {
  return cn(textStyles.body[variant], additionalClasses);
} 