import React, { useState } from 'react';
import { AIKeyChecker } from '@/components/assessment/ai-key-checker';
import { AIKnowledgeAssistant } from '@/components/assessment/ai-knowledge-assistant';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Sparkles } from 'lucide-react';
import { generateAIResponse, generateEducationalContent, AIProvider } from '@/lib/ai-service';

export default function AITestPage() {
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [responseText, setResponseText] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>('openai');

  // Sample question for testing
  const sampleQuestion = {
    id: 'sample-1',
    text: 'Do you have Kubernetes deployments organized using namespaces?',
    description: 'Namespaces help isolate and organize resources in a Kubernetes cluster',
    category: 'kubernetes_orchestration',
    hasKnowledgeResource: true,
    knowledgeSummary: 'Namespaces are a way to divide cluster resources between multiple users or projects',
    knowledgeResourceUrl: 'https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/',
    officialDocUrl: 'https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/',
    skillLevel: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    options: [
      { value: 1, label: 'No', description: 'We don\'t use namespaces' },
      { value: 2, label: 'Beginning', description: 'We use default and a few basic namespaces' },
      { value: 3, label: 'Intermediate', description: 'We use namespaces for separation of environments' },
      { value: 4, label: 'Advanced', description: 'We have a well-defined namespace strategy with policies' },
      { value: 5, label: 'Expert', description: 'We use namespaces extensively with network policies and RBAC' }
    ]
  };

  const runGeneralTest = async () => {
    setIsLoading(true);
    setResponseText('');
    
    try {
      const prompt = "Explain 3 key benefits of using Kubernetes namespaces, and provide a simple example of creating a namespace using kubectl commands.";
      
      const response = await generateAIResponse({
        provider: selectedProvider,
        prompt,
        maxTokens: 800
      });
      
      setResponseText(response.content || response.error || 'No response received');
    } catch (error: any) {
      setResponseText(`Error: ${error.message || 'Unknown error occurred'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const runEducationalTest = async () => {
    setIsLoading(true);
    setResponseText('');
    
    try {
      const response = await generateEducationalContent(
        'kubernetes_orchestration',
        'Kubernetes Namespaces',
        'beginner', 
        selectedProvider
      );
      
      setResponseText(response.content || response.error || 'No response received');
    } catch (error: any) {
      setResponseText(`Error: ${error.message || 'Unknown error occurred'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-8 max-w-4xl">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">AI Integration Test</h2>
          <p className="text-gray-600">Test different AI providers with your API keys</p>
        </div>
      </div>
      
      <AIKeyChecker />
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>AI Assistant Test</CardTitle>
          <CardDescription>
            Test the AI assistant dialog that appears when users click "AI Explanation"
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setIsAssistantOpen(true)}>
            <Brain className="mr-2 h-4 w-4" />
            Open AI Assistant
          </Button>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="general">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General API Test</TabsTrigger>
          <TabsTrigger value="educational">Educational Content Test</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General AI Response Test</CardTitle>
              <CardDescription>
                Test basic AI completion functionality
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <Button 
                  variant="outline" 
                  className={`flex items-center ${selectedProvider === 'openai' ? 'bg-blue-50 border-blue-200' : ''}`}
                  onClick={() => setSelectedProvider('openai')}
                >
                  <Sparkles className="mr-2 h-4 w-4 text-blue-500" />
                  OpenAI
                </Button>
                <Button 
                  variant="outline" 
                  className={`flex items-center ${selectedProvider === 'anthropic' ? 'bg-purple-50 border-purple-200' : ''}`}
                  onClick={() => setSelectedProvider('anthropic')}
                >
                  <Brain className="mr-2 h-4 w-4 text-purple-500" />
                  Anthropic
                </Button>
              </div>
              
              <Button onClick={runGeneralTest} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-current"></div>
                    Testing...
                  </>
                ) : (
                  'Run General AI Test'
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="educational">
          <Card>
            <CardHeader>
              <CardTitle>Educational Content Test</CardTitle>
              <CardDescription>
                Test generating educational content for a specific topic
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <Button 
                  variant="outline" 
                  className={`flex items-center ${selectedProvider === 'openai' ? 'bg-blue-50 border-blue-200' : ''}`}
                  onClick={() => setSelectedProvider('openai')}
                >
                  <Sparkles className="mr-2 h-4 w-4 text-blue-500" />
                  OpenAI
                </Button>
                <Button 
                  variant="outline" 
                  className={`flex items-center ${selectedProvider === 'anthropic' ? 'bg-purple-50 border-purple-200' : ''}`}
                  onClick={() => setSelectedProvider('anthropic')}
                >
                  <Brain className="mr-2 h-4 w-4 text-purple-500" />
                  Anthropic
                </Button>
              </div>
              
              <Button onClick={runEducationalTest} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-current"></div>
                    Testing...
                  </>
                ) : (
                  'Test Educational Content'
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {responseText && (
        <div className="mt-6">
          <Separator className="mb-4" />
          <h2 className="text-xl font-semibold mb-4">Response:</h2>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 whitespace-pre-wrap">
            {responseText}
          </div>
        </div>
      )}
      
      {/* AI Knowledge Assistant */}
      <AIKnowledgeAssistant 
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        question={sampleQuestion}
        category="kubernetes_orchestration"
      />
    </div>
  );
}