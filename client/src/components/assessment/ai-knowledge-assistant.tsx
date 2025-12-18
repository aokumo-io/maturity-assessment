import React, { useState, useEffect } from 'react';
import { logger } from '@/lib/logger';
import { useTranslation } from 'react-i18next';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AlertCircle, Book, Sparkles, Brain, ExternalLink, Info, X } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { apiRequest } from '@/lib/queryClient';
import type { AssessmentQuestion } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

interface AIKnowledgeAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  question?: AssessmentQuestion;
  category: string;
}

type AIProvider = 'openai' | 'anthropic';

export function AIKnowledgeAssistant({
  isOpen,
  onClose,
  question,
  category
}: AIKnowledgeAssistantProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [explanationContent, setExplanationContent] = useState<string>('');
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>('openai');
  const [apiStatus, setApiStatus] = useState<{openai: boolean; anthropic: boolean}>({ openai: false, anthropic: false });
  const { toast } = useToast();
  const { t, i18n } = useTranslation(['common', 'assessment']);
  
  // Check whether API keys are configured
  useEffect(() => {
    const checkApiKeys = async () => {
      try {
        const response = await apiRequest('GET', '/api/ai/status');
        const status = await response.json();
        setApiStatus(status);
        
        // Default to whichever API is available
        if (!status.openai && status.anthropic) {
          setSelectedProvider('anthropic');
        }
      } catch (error) {
        logger.debug('Failed to check API status:', error);
      }
    };
    
    if (isOpen) {
      checkApiKeys();
    }
  }, [isOpen]);
  
  const generateExplanation = async () => {
    if (!question) return;
    
    setIsLoading(true);
    
    try {
      // Get the user role from localStorage or session storage
      const userRole = localStorage.getItem('userRole') || sessionStorage.getItem('userRole') || 'practitioner';
      
      // Use the question's skill level if available, otherwise default to beginner
      const skillLevel = question.skillLevel || 'beginner';
      
      // Use the new smart knowledge endpoint
      const response = await apiRequest('POST', '/api/knowledge/smart', {
        category: category,
        questionId: question.id,
        topic: question.text,
        skillLevel: skillLevel as 'beginner' | 'intermediate' | 'advanced',
        userRole,
        language: i18n.language,
        provider: selectedProvider
      });
      
      const data = await response.json();
      
      if (data.error) {
        toast({
          title: 'Error generating explanation',
          description: data.error,
          variant: 'destructive'
        });
        setExplanationContent('Sorry, I was unable to generate an explanation. Please try again later.');
      } else {
        setExplanationContent(data.content);
        
        // Show cache status in debug mode
        if (data.source && data.cached !== undefined) {
          logger.debug(`Knowledge source: ${data.source}, cached: ${data.cached}, provider: ${data.provider}`);
        }
      }
    } catch (error: any) {
      logger.debug('Failed to generate explanation:', error);
      
      // Handle authentication errors
      if (error.response?.status === 401) {
        toast({
          title: 'Authentication required',
          description: 'You need to log in to use AI features',
          variant: 'destructive'
        });
        setExplanationContent('Authentication is required to use AI features. Please log in or start an assessment session first.');
      } else {
        setExplanationContent('Sorry, I was unable to generate an explanation. Please try again later.');
        
        toast({
          title: 'Error',
          description: 'Failed to connect to knowledge service. Please try again later.',
          variant: 'destructive'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Generate explanation when dialog opens and provider changes
  useEffect(() => {
    if (isOpen && question && selectedProvider) {
      // Check if the selected provider is available
      if ((selectedProvider === 'openai' && apiStatus.openai) || 
          (selectedProvider === 'anthropic' && apiStatus.anthropic)) {
        generateExplanation();
      } else if (!apiStatus.openai && !apiStatus.anthropic) {
        setExplanationContent('No AI providers are currently configured. Please add your OpenAI or Anthropic API key to use this feature.');
      }
    }
  }, [isOpen, question, selectedProvider, apiStatus]);
  
  // If no API keys are configured, show a warning
  const noApisConfigured = !apiStatus.openai && !apiStatus.anthropic;
  
  // Format content with markdown-like processing
  const formatContent = (content: string) => {
    // First, normalize line endings and clean up content
    let processed = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
    
    // Handle the specific case of "## ## Header" or multiple ## symbols
    processed = processed.replace(/^##\s*##\s*(.+)$/m, '<h3 class="text-lg font-bold mt-4 mb-3 text-gray-900 border-b border-gray-200 pb-1">$1</h3>');
    
    // Handle normal ## headers
    processed = processed.replace(/^##\s+(.+)$/gm, '<h3 class="text-lg font-bold mt-4 mb-3 text-gray-900 border-b border-gray-200 pb-1">$1</h3>');
    
    // Handle ### headers
    processed = processed.replace(/^###\s+(.+)$/gm, '<h4 class="text-base font-semibold mt-3 mb-2 text-gray-900">$1</h4>');
    
    // Handle single # headers
    processed = processed.replace(/^#\s+(.+)$/gm, '<h2 class="text-xl font-bold mt-5 mb-3 text-gray-900">$1</h2>');
    
    // Replace markdown links [text](url) with proper HTML
    processed = processed.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline font-medium">$1</a>');
    
    // Replace bold (**text**) with proper HTML
    processed = processed.replace(/\*\*([^*\n]+)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>');
    
    // Handle bullet lists
    processed = processed.replace(/^[\-\*]\s+(.+)$/gm, '<li class="mb-1 ml-4">$1</li>');
    
    // Replace double newlines with paragraph breaks
    processed = processed.replace(/\n\n/g, '</p><p class="my-3 text-gray-700 leading-relaxed">');
    
    // Wrap the entire content in a paragraph (unless it starts with a header)
    if (!processed.startsWith('<h')) {
      processed = '<p class="my-3 text-gray-700 leading-relaxed">' + processed;
    }
    if (!processed.endsWith('</p>') && !processed.endsWith('>')) {
      processed = processed + '</p>';
    }
    
    return processed;
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl h-[80vh] flex flex-col p-0 overflow-hidden">
        {/* Fixed Header */}
        <div className="flex-shrink-0 border-b bg-white relative z-10">
          <div className="flex items-center justify-between p-6 pb-4">
            <div className="flex-1">
              <DialogTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary-500" />
                {t('common:aiKnowledge.title', 'AI Knowledge Assistant')}
                {isLoading && <div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary-500 ml-2"></div>}
              </DialogTitle>
              <DialogDescription className="mt-1">
                {t('common:aiKnowledge.subtitle', 'AI-powered explanations and educational content')}
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-gray-100 flex-shrink-0 ml-4"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </div>
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Provider selection */}
          {!noApisConfigured && (
            <>
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">AI Provider</h3>
                <RadioGroup 
                  value={selectedProvider} 
                  onValueChange={(value) => setSelectedProvider(value as AIProvider)}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem 
                      value="openai" 
                      id="openai"
                      disabled={!apiStatus.openai}
                    />
                    <Label 
                      htmlFor="openai" 
                      className={`flex items-center ${!apiStatus.openai ? 'text-gray-400' : ''}`}
                    >
                      <Sparkles className="h-4 w-4 mr-1 text-emerald-500" />
                      OpenAI GPT-4o
                      {!apiStatus.openai && <Info className="h-4 w-4 ml-1 text-gray-400" />}
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem 
                      value="anthropic" 
                      id="anthropic"
                      disabled={!apiStatus.anthropic}
                    />
                    <Label 
                      htmlFor="anthropic" 
                      className={`flex items-center ${!apiStatus.anthropic ? 'text-gray-400' : ''}`}
                    >
                      <Brain className="h-4 w-4 mr-1 text-purple-500" />
                      Anthropic Claude
                      {!apiStatus.anthropic && <Info className="h-4 w-4 ml-1 text-gray-400" />}
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              <Separator className="my-4" />
            </>
          )}
          
          {/* Question being explained */}
          {question && (
            <div className="mb-4 p-3 bg-gray-50 rounded-md border border-gray-200">
              <div className="font-medium text-gray-800 mb-1">
                {typeof question.text === 'string' 
                  ? question.text 
                  : question.text?.[i18n.language] || question.text?.en || ''}
              </div>
              {question.description && (
                <div className="text-sm text-gray-600">
                  {typeof question.description === 'string' 
                    ? question.description 
                    : ''}
                </div>
              )}
            </div>
          )}
          
          {/* AI-generated explanation */}
          <div className="ai-explanation">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500 mb-4"></div>
                <p className="text-gray-600">{t('common:aiKnowledge.loading', 'Generating explanation...')}</p>
              </div>
            ) : noApisConfigured ? (
              <div className="bg-amber-50 border border-amber-200 rounded-md p-4 my-4">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 mr-2" />
                  <div>
                    <h3 className="font-medium text-amber-800">API Keys Required</h3>
                    <p className="text-amber-700 mt-1">
                      To use AI features, you need to configure either an OpenAI or Anthropic API key.
                      Please contact your administrator to set up these keys.
                    </p>
                    <Button className="mt-4 bg-amber-500 hover:bg-amber-600 text-white" onClick={onClose}>
                      Continue Without AI
                    </Button>
                  </div>
                </div>
              </div>
            ) : explanationContent.includes('Authentication is required') ? (
              <div className="bg-amber-50 border border-amber-200 rounded-md p-4 my-4">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 mr-2" />
                  <div>
                    <h3 className="font-medium text-amber-800">{t('common:aiKnowledge.authRequired', 'Authentication Required')}</h3>
                    <p className="text-amber-700 mt-1">
                      {t('common:aiKnowledge.loginRequired', 'You need to log in or start an assessment session to use AI features.')}
                    </p>
                    <Button className="mt-4 bg-amber-500 hover:bg-amber-600 text-white" onClick={onClose}>
                      {t('common:aiKnowledge.continue', 'Continue Without AI')}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: formatContent(explanationContent) }}
              />
            )}
          </div>
        </div>
        
        {/* Fixed Footer */}
        <div className="flex-shrink-0 border-t bg-white p-6 relative z-10">
          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-500 flex items-center">
              <div className="flex items-center">
                {selectedProvider === 'openai' ? (
                  <Sparkles className="h-3 w-3 mr-1 text-emerald-500" />
                ) : (
                  <Brain className="h-3 w-3 mr-1 text-purple-500" />
                )}
                Powered by {selectedProvider === 'openai' ? 'OpenAI GPT-4o' : 'Anthropic Claude'}
              </div>
            </div>
            
            <Button onClick={onClose}>
              {t('common:aiKnowledge.continue', 'Continue Assessment')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AIKnowledgeAssistant;