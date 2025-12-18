import React, { useState, useMemo, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { AlertCircle, ExternalLink, Book, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AssessmentQuestion as BaseAssessmentQuestion } from "@shared/schema";
import { AIKnowledgeAssistant } from "./ai-knowledge-assistant";
import { useTranslation } from "react-i18next";
import { logger } from '@/lib/logger';

// Extend the base question type to include additional dependency properties
interface QuestionDependency {
  questionId: string;
  minValue?: number;
  maxValue?: number;
  specificValue?: number;
}

// Extended AssessmentQuestion type with the enhanced dependencies
type AssessmentQuestion = Omit<BaseAssessmentQuestion, 'dependencies'> & {
  dependencies?: QuestionDependency[];
};

// Question with visibility flag
interface QuestionWithVisibility extends AssessmentQuestion {
  show: boolean;
}

interface QuestionSectionProps {
  questionIdChoose: string;
  setQuestionIdChoose: (value: string) => void;
  questions: AssessmentQuestion[];
  responses: Record<string, number>;
  onResponseChange: (questionId: string, value: number) => void;
  onDontKnowResponse?: (questionId: string, isDontKnow: boolean) => void;
}

// Type guard functions to safely check for extended fields
function hasSkillLevel(question: AssessmentQuestion): question is AssessmentQuestion & { skillLevel: 'beginner' | 'intermediate' | 'advanced' } {
  return 'skillLevel' in question;
}

function hasOfficialDocUrl(question: AssessmentQuestion): question is AssessmentQuestion & { officialDocUrl: string } {
  return 'officialDocUrl' in question && typeof question.officialDocUrl === 'string';
}

function hasTutorialUrl(question: AssessmentQuestion): question is AssessmentQuestion & { tutorialUrl: string } {
  return 'tutorialUrl' in question && typeof question.tutorialUrl === 'string';
}

export function QuestionSection({ 
  questionIdChoose,
  setQuestionIdChoose,
  questions,
  responses,
  onResponseChange,
  onDontKnowResponse
}: QuestionSectionProps) {
  const { t, i18n } = useTranslation(['common', 'assessment', 'questions']);
  // Track which questions have knowledge resources expanded
  const [expandedKnowledge, setExpandedKnowledge] = useState<Record<string, boolean>>({});
  // Track AI assistant state
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<AssessmentQuestion | undefined>(undefined);
  const [currentCategory, setCurrentCategory] = useState<string>("");
  
  // Create refs for each question
  const questionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  
  // Last answered question ID for tracking auto-scroll
  const [lastAnsweredId, setLastAnsweredId] = useState<string | null>(null);

  // Toggle knowledge resource expansion
  const toggleKnowledge = (questionId: string) => {
    setExpandedKnowledge(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  // Open AI assistant for a question
  const openAIAssistant = (question: AssessmentQuestion) => {
    setCurrentQuestion(question);
    setCurrentCategory(question.category || "");
    setIsAIAssistantOpen(true);
  };

  // Handle response change with auto-scroll
  const handleResponseChange = (questionId: string, value: number) => {
    // Call the original response handler
    onResponseChange(questionId, value);
    
    // Always set the last answered question for potential auto-scroll
    setLastAnsweredId(questionId);
    
    // Handle "I don't know" special value (-1)
    const isSelectingDontKnow = value === -1;
    
    if (isSelectingDontKnow) {
      logger.debug(`User selected "I don't know" for question ${questionId} - auto-scroll will be prevented`);
    }
    
    // If we have a dontKnow handler, call it
    if (onDontKnowResponse && isSelectingDontKnow) {
      onDontKnowResponse(questionId, true);
      
      // Show knowledge resource if available
      if (questions.find(q => q.id === questionId)?.hasKnowledgeResource) {
        setExpandedKnowledge(prev => ({
          ...prev,
          [questionId]: true
        }));
      }
    }
  };

  // Use useMemo to compute which questions should be shown based on dependencies
  const questionsWithVisibility: QuestionWithVisibility[] = useMemo(() => {
    const result = questions.map((question) => {
      // Question with no dependencies is always visible
      if (!question.dependencies || question.dependencies.length === 0) {
        return { ...question, show: true };
      }
      
      // Check if all dependencies are met
      const dependenciesMet = question.dependencies.every(dep => {
        const response = responses[dep.questionId];
        return dep.minValue === undefined || (response !== undefined && response >= dep.minValue);
      });
      
      return { ...question, show: dependenciesMet };
    });
    
    // Log when filtering happens
    const visibleCount = result.filter(q => q.show).length;
    if (visibleCount !== questions.length) {
      logger.debug(`Displaying ${visibleCount} of ${questions.length} questions based on dependencies`);
    }
    
    return result;
  }, [questions, responses]);

  // Auto-scroll to the next unanswered question when a question is answered
  useEffect(() => {
    if (!lastAnsweredId) return;
    
    // Check if the last answered question was "I don't know" - if so, don't auto-scroll
    const lastAnsweredResponse = responses[lastAnsweredId];
    if (lastAnsweredResponse === -1) {
      logger.debug(`Skipping auto-scroll because "I don't know" was selected for question: ${lastAnsweredId}`);
      setLastAnsweredId(null); // Clear to prevent future triggers
      return;
    }
    
    // Find visible questions
    const visibleQuestions = questionsWithVisibility.filter(q => q.show);
    
    // Find the index of the last answered question
    const lastAnsweredIndex = visibleQuestions.findIndex(q => q.id === lastAnsweredId);
    if (lastAnsweredIndex === -1) return;
    
    // Find the next unanswered question
    const nextUnansweredQuestion = visibleQuestions
      .slice(lastAnsweredIndex + 1)
      .find(q => responses[q.id] === undefined);
    
    // If we found a next unanswered question, scroll to it
    if (nextUnansweredQuestion) {
      const nextQuestionRef = questionRefs.current[nextUnansweredQuestion.id];
      if (nextQuestionRef) {
        // Use smooth scrolling with a slight delay to ensure UI updates first
        setTimeout(() => {
          nextQuestionRef.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start'
          });
        }, 150);
        
        logger.debug(`Auto-scrolling to next unanswered question: ${nextUnansweredQuestion.id}`);
      }
    } else {
      // If no more unanswered questions in the current view, clear lastAnsweredId
      setLastAnsweredId(null);
    }
  }, [lastAnsweredId, questionsWithVisibility, responses]);

  useEffect(() => {
    if (!questionIdChoose) return;

    const visibleQuestions = questionsWithVisibility.filter(q => q.show);
    const targetQuestion = visibleQuestions.find(q => q.id === questionIdChoose);
    if (targetQuestion) {
      const ref = questionRefs.current[questionIdChoose];
      if (ref) {
        setTimeout(() => {
          ref.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }, 150);
        setQuestionIdChoose('')
      }
    }
  }, [questionIdChoose]);

  return (
    <div className="flex flex-col">
      <Card className="bg-white shadow-md border-0">
        <CardContent className="pt-6">
          {questionsWithVisibility.filter(q => q.show).map((question, index) => {
            // Determine if the current response is "I don't know"
            const isDontKnow = responses[question.id] === -1;
            
            return (
              <div 
                key={question.id} 
                className={index !== 0 ? "mt-6" : ""}
                ref={el => questionRefs.current[question.id] = el}
              >
                {index !== 0 && <Separator className="mb-6" />}

                <div className="mb-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-3 mt-1">
                      <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-500 flex items-center justify-center text-base font-medium">
                        {index + 1}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 leading-[1.3]">
                        {/* Use the processed text from the server instead of attempting translation */}
                        {typeof question.text === 'string' ? question.text : (
                          typeof question.text === 'object' 
                            ? question.text[i18n.language] || question.text.en || 'Question text not available'
                            : 'Question text not available'
                        )}
                      </h3>
                      {question.description && (
                        <p className="mt-1 text-sm text-gray-600">{question.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 ml-11">
                    <RadioGroup
                      value={responses[question.id]?.toString() || ""}
                      onValueChange={(value) => {
                        const numValue = parseInt(value);
                        handleResponseChange(question.id, numValue);
                      }}
                    >
                      {/* Regular options */}
                      {question.options.map((option) => (
                        <div key={option.value} className={`flex items-start space-x-3 mt-3 group ${
                          responses[question.id] === option.value 
                            ? 'bg-blue-50' 
                            : 'hover:bg-gray-50'
                        }`}>
                          <RadioGroupItem
                            value={option.value.toString()}
                            id={`${question.id}-${option.value}`}
                            className="mt-0.5"
                          />
                          <div className="grid gap-1">
                            <Label
                              htmlFor={`${question.id}-${option.value}`}
                              className={`font-medium leading-[1.3] ${option.isDontKnow ? 'text-amber-600 flex items-center' : ''} group-hover:text-primary-600 cursor-pointer`}
                            >
                              {option.isDontKnow && <AlertCircle className="w-4 h-4 mr-1" />}
                              {/* Use the processed label from the server instead of attempting translation */}
                              {typeof option.label === 'string' 
                                ? option.label 
                                : (typeof option.label === 'object'
                                  ? option.label[i18n.language] || option.label.en || 'Option text not available'
                                  : 'Option text not available'
                                )}
                              {option.isDontKnow && question.hasKnowledgeResource && (
                                <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full border border-amber-200 flex items-center">
                                  <Book className="w-3 h-3 mr-1" />
                                  {t('assessment:responses.resourcesAvailable', 'Resources available')}
                                </span>
                              )}
                            </Label>
                            {option.description && (
                              <p className="text-sm text-gray-600">
                                {typeof option.description === 'string' ? option.description : ''}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}

                      {/* Add standalone "I don't know" option only if not already included in options */}
                      {!question.options.some(option => option.value === -1 || option.isDontKnow) && (
                        <div className={`flex items-start space-x-3 mt-3 group ${
                          responses[question.id] === -1 
                            ? 'bg-blue-50' 
                            : 'hover:bg-gray-50'
                        }`}>
                          <RadioGroupItem
                            value="-1"
                            id={`${question.id}-dont-know`}
                            className="mt-0.5"
                          />
                          <div className="grid gap-1">
                            <Label
                              htmlFor={`${question.id}-dont-know`}
                              className="font-medium text-amber-600 flex items-center group-hover:text-amber-700 cursor-pointer"
                            >
                              <AlertCircle className="w-4 h-4 mr-1" />
                              {t('assessment:responses.dontKnow', "I don't know / Not sure")}
                              {question.hasKnowledgeResource && (
                                <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full border border-amber-200 flex items-center">
                                  <Book className="w-3 h-3 mr-1" />
                                  {t('assessment:responses.resourcesAvailable', 'Resources available')}
                                </span>
                              )}
                            </Label>
                            <p className="text-sm text-gray-600">
                              {t('assessment:responses.dontKnowExplanation', "Choose this option if you're not familiar with this topic.")}
                            </p>
                          </div>
                        </div>
                      )}
                    </RadioGroup>

                    {/* Knowledge resources section (shown when "I don't know" is selected) */}
                    {isDontKnow && question.knowledgeSummary && (
                      <div className="mt-4 p-4 bg-amber-50 rounded-md">
                        <Collapsible
                          open={expandedKnowledge[question.id] || false}
                          onOpenChange={() => toggleKnowledge(question.id)}
                        >
                          <div className="flex items-start">
                            <Book className="w-5 h-5 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
                            <div>
                              <div className="flex items-center justify-between">
                                <h4 className="text-sm font-medium text-amber-800">{t('assessment:knowledgeResources.title', 'Knowledge Resource')}</h4>
                                {hasSkillLevel(question) && (
                                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${question.skillLevel === 'beginner' ? 'bg-green-100 text-green-700 border border-green-200' :
                                      question.skillLevel === 'intermediate' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                                        'bg-purple-100 text-purple-700 border border-purple-200'
                                    }`}>
                                    {question.skillLevel.charAt(0).toUpperCase() + question.skillLevel.slice(1)}
                                  </span>
                                )}
                              </div>
                              <div className="flex justify-between items-center">
                                <p className="text-sm text-amber-700 mt-1">
                                  {question.knowledgeSummary}
                                </p>

                                {/* AI Assistant Button */}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="ml-2 text-xs border-purple-300 text-purple-700 hover:bg-purple-100 flex-shrink-0"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    openAIAssistant(question);
                                  }}
                                >
                                  <Brain className="w-3 h-3 mr-1.5" />
                                  {t('common:aiKnowledge.explanation', 'AI Explanation')}
                                </Button>
                              </div>

                              {/* Knowledge Resource Links Section */}
                              <CollapsibleContent>
                                <div className="mt-3 space-y-2">
                                  {/* Official Documentation */}
                                  {hasOfficialDocUrl(question) && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-xs border-amber-300 text-amber-700 hover:bg-amber-100 w-full justify-start"
                                      onClick={() => window.open(question.officialDocUrl!, '_blank', 'noopener,noreferrer')}
                                    >
                                      <Book className="w-3 h-3 mr-1.5" />
                                      {t('assessment:knowledgeResources.officialDocumentation', 'Official Documentation')}
                                      <ExternalLink className="w-3 h-3 ml-auto" />
                                    </Button>
                                  )}

                                  {/* Tutorial Resource */}
                                  {hasTutorialUrl(question) && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-xs border-amber-300 text-amber-700 hover:bg-amber-100 w-full justify-start"
                                      onClick={() => window.open(question.tutorialUrl!, '_blank', 'noopener,noreferrer')}
                                    >
                                      <i className="ri-video-line mr-1.5 text-sm"></i>
                                      {t('assessment:knowledgeResources.tutorialVideo', 'Tutorial Video')}
                                      <ExternalLink className="w-3 h-3 ml-auto" />
                                    </Button>
                                  )}

                                  {/* Main Knowledge Resource */}
                                  {question.knowledgeResourceUrl && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-xs border-amber-300 text-amber-700 hover:bg-amber-100 w-full justify-start"
                                      onClick={() => window.open(question.knowledgeResourceUrl!, '_blank', 'noopener,noreferrer')}
                                    >
                                      <i className="ri-article-line mr-1.5 text-sm"></i>
                                      {t('assessment:knowledgeResources.learnMoreTopic', 'Learn more about this topic')}
                                      <ExternalLink className="w-3 h-3 ml-auto" />
                                    </Button>
                                  )}
                                </div>
                              </CollapsibleContent>

                              {/* Show More/Less Trigger Button */}
                              {(question.knowledgeResourceUrl ||
                                hasOfficialDocUrl(question) ||
                                hasTutorialUrl(question)) && (
                                  <CollapsibleTrigger asChild>
                                    <Button
                                      variant="link"
                                      size="sm"
                                      className="text-xs p-0 h-auto text-amber-600 mt-1"
                                    >
                                      {expandedKnowledge[question.id] ? t('assessment:knowledgeResources.showLess', 'Show less') : t('assessment:knowledgeResources.showMoreResources', 'Show more learning resources')}
                                    </Button>
                                  </CollapsibleTrigger>
                                )}
                            </div>
                          </div>
                        </Collapsible>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* AI Knowledge Assistant (shown when triggered) */}
      <AIKnowledgeAssistant
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
        question={currentQuestion as BaseAssessmentQuestion}
        category={currentCategory}
      />
    </div>
  );
}

export default QuestionSection;