import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useAIApiKeysAvailable } from '@/lib/ai-service';

export function AIKeyChecker() {
  const { openai, anthropic, loading } = useAIApiKeysAvailable();
  
  if (loading) {
    return (
      <div className="flex items-center text-gray-500 text-sm">
        <div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary-500 mr-2"></div>
        Checking AI capabilities...
      </div>
    );
  }

  if (!openai && !anthropic) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>AI assistance unavailable</AlertTitle>
        <AlertDescription>
          No AI providers are configured. Contact your administrator to enable AI-powered explanations.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert variant="default" className="mb-4 bg-green-50 border-green-200">
      <CheckCircle2 className="h-4 w-4 text-green-600" />
      <AlertTitle className="text-green-800">AI assistance available</AlertTitle>
      <AlertDescription className="text-green-700">
        {openai && anthropic ? (
          "Both OpenAI and Anthropic AI providers are available for customized explanations."
        ) : openai ? (
          "OpenAI is available for customized explanations."
        ) : (
          "Anthropic Claude is available for customized explanations."
        )}
      </AlertDescription>
    </Alert>
  );
}

export default AIKeyChecker;