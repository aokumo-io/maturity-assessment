import React, { useState, useEffect, Suspense, useCallback } from "react";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import AppLayout from "@/components/layout/app-layout";
import OverviewDashboard from "@/components/analysis/overview-dashboard";
import CategoryScoresChart from "@/components/analysis/category-scores-chart";
import TopPriorityRecommendations from "@/components/analysis/top-priority-recommendations";
import { ExecutiveSummary } from "@/components/results/executive-summary";
import CriticalIssues from "@/components/analysis/critical-issues";
import { useQuery } from "@tanstack/react-query";
import type { Assessment, CategoryScore, Organization } from "@shared/schema";
import { useTranslation } from "react-i18next";
import RadarChart from "@/components/analysis/radar-chart";
import { fetchCostAnalysisFromServer, formatCurrency, type CostSavings, type QuickWin } from "@/lib/costAnalysisService";
import { Card, CardContent } from "@/components/ui/card";
import IndustryComparisonRecharts from "@/components/analysis/industry-comparison-recharts";
import { persistenceManager, STORAGE_KEYS } from "@/lib/assessmentUtils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Toast } from "@/components/ui/toast";
import { logger } from '@/lib/logger';
import api from "@/lib/axios-config";
import FeedbackModal from "@/components/feedback/feedback-modal";
import { useFeedback } from "@/hooks/useFeedback";
import { apiRequest } from '@/lib/queryClient';

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="p-6">
      <div className="animate-pulse space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-white p-6 rounded-lg shadow-md">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="flex">
                <div className="w-12 h-12 bg-gray-200 rounded-full mr-3"></div>
                <div>
                  <div className="h-5 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResultsDashboardContent() {
  const [, navigate] = useLocation();
  const { id = "" } = useParams();
  const { t, i18n } = useTranslation(['results', 'common']);
  const [sessionValid, setSessionValid] = useState<boolean | null>(null);
  const [showAllCriticalIssues, setShowAllCriticalIssues] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  
  // Normalize language for consistent queryKey
  const normalizedLang = i18n.language || 'en';
  
  const { submitFeedback } = useFeedback();

  // Check if id exists, if so, redirect to /processing/:id
  useEffect(() => {
    const checkSessionAndRedirect = async () => {
      if (!id) {
        // If no ID, redirect to welcome page
        navigate("/");
        return;
      }
  
      try {
        const res = await apiRequest('GET', `/api/assessment/session/${id}`, null);
  
        if (!res.ok) {
          // Session exists – go to processing
          navigate(`/processing/${id}`);
        } else {
          setSessionValid(true)
        }
      } catch (error) {
        logger.error("Error checking session", error);
        // Optional fallback: navigate('/error');
      }
    };
  
    checkSessionAndRedirect();
  }, [id, navigate]);

  // Fetch assessment data
  const { data: assessment, isLoading: isLoadingAssessment } = useQuery<Assessment>({
    queryKey: ["/api/assessment/current"],
    enabled: sessionValid !== null, // Only fetch if ID is NOT present (normal page flow)
  });

  // Fetch category scores
  const { data: categoryScores, isLoading: isLoadingScores } = useQuery<CategoryScore[]>({
    queryKey: ["/api/assessment/scores"],
    enabled: sessionValid !== null,
  });
  
  // Fetch organization info - always fetch if we have an assessment
  const { data: organization, isLoading: isLoadingOrganization } = useQuery<Organization>({
    queryKey: ["/api/assessment/organization"],
    // Fetch organization if we have an assessment (even if organizationId is null)
    enabled: !!assessment,
  });

  // Prefetch roadmap data for trail-map and implementation-plan pages
  const { data: roadmap } = useQuery({
    queryKey: ["/api/roadmap", normalizedLang],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/roadmap', null, {
        'Accept-Language': normalizedLang
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch roadmap: ${response.status}`);
      }
      return await response.json();
    },
    enabled: !!assessment,
  });

  const { data: result } = useQuery<string>({
    queryKey: ["/api/assessment/results", id],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/assessment/results/${id}`, null);
      if (!response.ok) {
        throw new Error('Failed to fetch results');
      }
      return response.json();
    },
    enabled: !!assessment && !!id,
  });
  
  // Debug what's happening with the results
  useEffect(() => {
    logger.debug("Assessment data loaded", { assessment });
    logger.debug("Category scores", { count: categoryScores?.length, scores: categoryScores });
    logger.debug("Organization data loaded", { organization });
  }, [assessment, categoryScores, organization]);
  
  // Export as PDF
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  
  const handleExportPDF = async () => {
    if (isExportingPDF) return; // Prevent multiple clicks
    
    try {
      setIsExportingPDF(true);
      logger.debug(`Exporting dashboard as PDF in ${normalizedLang} language`);
      
      // Call the new PDF export endpoint with the current language in headers
      // and enhanced=true query parameter
      const response = await api.post('/api/assessment/export-pdf?enhanced=true', {}, {
        responseType: 'blob', // Important for binary data like PDFs
        headers: {
          'Accept-Language': normalizedLang // Pass current language (ja or en)
        }
      });
      
      // Create a blob URL for the PDF data
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      
      // Get filename from Content-Disposition header or use default
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'assessment-report.pdf';
      
      if (contentDisposition) {
        // RFC 6266: Try to extract UTF-8 filename first (filename*=UTF-8''...)
        const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/);
        if (utf8Match) {
          // Decode the UTF-8 encoded filename
          filename = decodeURIComponent(utf8Match[1]);
        } else {
          // Fallback to regular filename="..." 
          const regularMatch = contentDisposition.match(/filename="([^"]+)"/);
          if (regularMatch) {
            filename = regularMatch[1];
          }
        }
      }
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      logger.error("Error exporting PDF:", error);
      // Show error message to user
      alert(t('pdfExportError', 'An error occurred while exporting the PDF. Please try again.'));
    } finally {
      setIsExportingPDF(false);
    }
  };
  
  // Share results
  const handleShare = () => {
    // In a real app, this would show a share dialog
    window.open(result, "_blank");
  };
  
  // Navigation actions
  const handleViewMaturityAnalysis = () => {
    navigate(`/results/${id}/maturity-analysis`);
  };
  
  const handleViewTrailMap = () => {
    navigate(`/results/${id}/trail-map`);
  };
  
  const handleViewImplementationPlan = () => {
    navigate(`/results/${id}/implementation-plan`);
  };
  
  const handleViewCostAnalysis = () => {
    navigate(`/results/${id}/maturity-analysis?tab=cost`);
  };
  
  const renderActions = () => (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        className="text-primary-500 bg-primary-50 hover:bg-primary-100 border-primary-100"
        onClick={handleExportPDF}
        disabled={isExportingPDF}
        aria-label={isExportingPDF ? t('generating', 'Generating...') : t('dashboard.exportPDF')}
        aria-describedby="export-pdf-desc"
      >
        <div className="sr-only" id="export-pdf-desc">
          Export assessment results as PDF document
        </div>
        {isExportingPDF ? (
          <>
            <i className="ri-loader-2-line animate-spin mr-1" aria-hidden="true"></i> {t('generating', 'Generating...')}
          </>
        ) : (
          <>
            <i className="ri-download-line mr-1" aria-hidden="true"></i> {t('dashboard.exportPDF')}
          </>
        )}
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        className="text-secondary-700 bg-secondary-50 hover:bg-secondary-100 border-secondary-100"
        onClick={() => navigate(`/results/${id}/review-responses`)}
        aria-label={t('dashboard.reviewAnswers', 'Review Answers')}
        aria-describedby="review-answers-desc"
      >
        <div className="sr-only" id="review-answers-desc">
          Review all your assessment answers and scores
        </div>
        <i className="ri-file-list-3-line mr-1" aria-hidden="true"></i> {t('dashboard.reviewAnswers', 'Review Answers')}
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        className="text-secondary-700 bg-secondary-50 hover:bg-secondary-100 border-secondary-100"
        onClick={() => setShowFeedbackModal(true)}
        aria-label={t('dashboard.feedback')}
      >
        <i className="ri-feedback-line mr-1" aria-hidden="true"></i> {t('dashboard.feedback')}
      </Button>
    </>
  );
  
  // Loading state
  if (isLoadingAssessment || isLoadingScores || isLoadingOrganization) {
    return (
      <AppLayout title={t('dashboard.title')} subtitle={t('loading', 'Loading your assessment results...')}>
        <LoadingFallback />
      </AppLayout>
    );
  }

  // No assessment found
  if (!assessment) {
    return (
      <AppLayout title={t('dashboard.title')} subtitle={t('noAssessment', 'No assessment results available')}>
        <div className="p-6 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-10 text-center">
            <div className="text-5xl text-gray-300 mb-6">
              <i className="ri-file-search-line"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">{t('noResultsTitle', 'No Assessment Results')}</h2>
            <p className="text-gray-600 mb-8">{t('noResultsMessage', 'You haven\'t completed an assessment yet.')}</p>
            <Button onClick={() => navigate("/")} className="bg-blue-600 hover:bg-blue-700 text-white">{t('startAssessment', 'Start an Assessment')}</Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Show results even if categoryScores is empty or all responses were "I don't know"
  // We'll handle appropriate UI within each component
  const safeScores = categoryScores || [];

  return (
    <AppLayout 
      title={t('dashboard.title')}
      subtitle={t('dashboard.subtitle')}
      actions={renderActions()}
    >
      <div className="p-6">
        {/* Summary section with metrics */}
        <div className="mb-6">
          <OverviewDashboard 
            assessment={assessment} 
            categoryScores={safeScores} 
          />
        </div>
        
        {/* Executive Summary (if organization data is available) */}
        {organization && (
          <div className="mb-6">
            <ExecutiveSummary 
              categoryScores={safeScores}
              organizationInfo={organization}
              userRole={organization.userRole || undefined}
            />
          </div>
        )}
        
        {/* Critical Issues and Enhanced Cost Savings Analysis - Dynamic Layout */}
        {showAllCriticalIssues ? (
          /* When viewing all critical issues, give it full width */
          <>
            <div className="mb-6">
              <CriticalIssues 
                assessment={assessment}
                categoryScores={safeScores}
                onViewAllToggle={setShowAllCriticalIssues}
                showAll={showAllCriticalIssues}
              />
            </div>
            <div className="mb-6">
              <EnhancedCostSavings categoryScores={safeScores} />
            </div>
          </>
        ) : (
          /* Normal side-by-side layout */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="h-full">
              <CriticalIssues 
                assessment={assessment}
                categoryScores={safeScores}
                onViewAllToggle={setShowAllCriticalIssues}
                showAll={showAllCriticalIssues}
              />
            </div>
            <div className="h-full">
              <EnhancedCostSavings categoryScores={safeScores} />
            </div>
          </div>
        )}
        
        {/* Category Scores and Radar Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          <div className="lg:col-span-7">
            <CategoryScoresChart categoryScores={safeScores} />
          </div>
          <div className="lg:col-span-5">
            <RadarChart categoryScores={safeScores} title="Maturity Radar" simplified={false} />
          </div>
        </div>
        
        {/* Industry Comparison and Top Priority Recommendations in 2 columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          <div className="lg:col-span-7">
            <IndustryComparisonRecharts 
              categoryScores={safeScores} 
              onViewMore={handleViewMaturityAnalysis}
            />
          </div>
          <div className="lg:col-span-5">
            <TopPriorityRecommendations
              onViewImplementationPlan={handleViewImplementationPlan}
            />
          </div>
        </div>
        
        {/* Navigation Buttons */}
        <div className="mt-8 flex flex-wrap justify-center gap-4" role="navigation" aria-label="Detailed analysis options">
          <Button
            size="lg"
            className="bg-primary-500 hover:bg-primary-600"
            onClick={handleViewMaturityAnalysis}
            aria-label={t('navigation.maturityAnalysis', 'Detailed Maturity Analysis')}
            aria-describedby="maturity-analysis-desc"
          >
            <div className="sr-only" id="maturity-analysis-desc">
              View comprehensive maturity analysis with detailed insights and industry comparisons
            </div>
            <i className="ri-bar-chart-box-line mr-2" aria-hidden="true"></i>
            {t('navigation.maturityAnalysis', 'Detailed Maturity Analysis')}
          </Button>
          <Button
            size="lg"
            className="bg-secondary-500 hover:bg-secondary-600"
            onClick={handleViewTrailMap}
            aria-label={t('navigation.trailMap', 'Cloud Native Trail Map')}
            aria-describedby="trail-map-desc"
          >
            <div className="sr-only" id="trail-map-desc">
              Explore interactive trail map with categorized recommendations and implementation paths
            </div>
            <i className="ri-road-map-line mr-2" aria-hidden="true"></i>
            {t('navigation.trailMap', 'Cloud Native Trail Map')}
          </Button>
          <Button
            size="lg"
            className="bg-accent-500 hover:bg-accent-600"
            onClick={handleViewImplementationPlan}
            aria-label={t('navigation.implementationPlan', 'Implementation Roadmap')}
            aria-describedby="implementation-plan-desc"
          >
            <div className="sr-only" id="implementation-plan-desc">
              View detailed implementation roadmap with prioritized steps and timeline
            </div>
            <i className="ri-route-line mr-2" aria-hidden="true"></i>
            {t('navigation.implementationPlan', 'Implementation Roadmap')}
          </Button>
        </div>
      </div>
      
      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        onSubmit={submitFeedback.mutate}
        isLoading={submitFeedback.isPending}
        resultId={id}
      />
    </AppLayout>
  );
}

// New Enhanced Cost Savings component using the fetchCostAnalysisFromServer function
function EnhancedCostSavings({ categoryScores }: { categoryScores: CategoryScore[] }) {
  const { t, i18n } = useTranslation(['results']);
  const [, navigate] = useLocation();
  const { id } = useParams<{ id: string }>();
  const [costAnalysis, setCostAnalysis] = useState<{
    costSavings: CostSavings;
    quickWins: QuickWin[];
    formattedTotal: string;
    currency: string;
    savingsPercentage: string;
  } | null>(null);
  const [topSavingsAreas, setTopSavingsAreas] = useState<string[]>([]);

  // Check if all categories are knowledge gaps
  const isAllKnowledgeGap = categoryScores.length > 0 && 
    categoryScores.every(cat => cat.score === -1 || cat.maturityLevel === "knowledge_gap");

  // Memoize the fetch function to prevent unnecessary re-renders
  const fetchData = useCallback(async () => {
    if (categoryScores.length === 0 || isAllKnowledgeGap) return;
    
    try {
      logger.debug("Fetching enhanced cost savings from server", { 
        language: i18n.language, 
        scoresCount: categoryScores.length 
      });
      
      // Get cost analysis from server API
      const result = await fetchCostAnalysisFromServer(categoryScores, i18n.language);
      logger.debug("Enhanced cost savings analysis result from server", result);
      setCostAnalysis(result);
      
      // Store areas that have the highest potential savings
      const costSavingsAreas = Object.entries(result.costSavings)
        .filter(([key]) => !['total', 'confidence', 'confidenceFactors'].includes(key))
        .sort((a, b) => (b[1] as number) - (a[1] as number))
        .map(([key]) => key);
      
      setTopSavingsAreas(costSavingsAreas);
    } catch (error) {
      logger.error("Error fetching cost analysis data", error);
      // Fallback is handled in fetchCostAnalysisFromServer
    }
  }, [categoryScores.length, i18n.language, isAllKnowledgeGap]); // Use stable references

  useEffect(() => {
    fetchData();
  }, [fetchData]); // Only depend on the memoized function

  const handleViewCostAnalysis = () => {
    navigate(`/results/${id}/maturity-analysis?tab=cost`);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <i className="ri-money-dollar-circle-line text-green-600 mr-2 text-xl" aria-hidden="true"></i>
          <h3 className="text-xl font-bold">{t('costSavings.title', 'Cost Savings Potential')}</h3>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-blue-600 hover:text-blue-700 font-semibold"
          onClick={handleViewCostAnalysis}
          aria-label={`${t('viewAllIssues', 'View details')} - ${t('costSavings.title', 'Cost Savings Potential')}`}
          aria-describedby="cost-savings-desc"
        >
          <div className="sr-only" id="cost-savings-desc">
            View detailed cost analysis and financial projections
          </div>
          {t('viewAllIssues', 'View details')}
          <i className="ri-arrow-right-line ml-1" aria-hidden="true"></i>
        </Button>
      </div>
        
      {isAllKnowledgeGap ? (
        <div className="py-6 text-center flex-1 flex items-center justify-center">
          <div>
            <div className="text-purple-500 mb-2">
              <i className="ri-question-mark-circle-line text-3xl"></i>
            </div>
            <p className="text-gray-600">{t('costSavings.noEstimate', 'Unable to estimate cost savings without assessment data.')}</p>
            <p className="text-sm text-gray-500 mt-2">{t('costSavings.completeAssessment', 'Complete the assessment with specific answers to get cost savings estimates.')}</p>
          </div>
        </div>
      ) : !costAnalysis ? (
        <div className="animate-pulse space-y-3 flex-1">
          <div className="h-6 bg-gray-100 rounded"></div>
          <div className="h-6 bg-gray-100 rounded"></div>
          <div className="h-6 bg-gray-100 rounded"></div>
        </div>
      ) : (
        <div className="flex flex-col flex-1">
          <div className="flex-1">
            <h2 className="font-semibold text-lg mb-4">{t('costAnalysis.topSavingsAreas')}</h2>
            <div className="space-y-3">
              {/* Show top savings areas dynamically */}
              {topSavingsAreas.map((area) => (
                <div key={area} className="flex justify-between items-center py-2 px-4 rounded-md bg-gray-50">
                  <div className="text-gray-800 text-sm">
                    {t(`costAnalysis.costAreas.${area}`, area)}
                  </div>
                  <div className="font-semibold text-gray-800 text-sm">
                    {formatCurrency(
                      costAnalysis?.costSavings[area as keyof CostSavings] as number || 0,
                      costAnalysis?.currency || 'JPY'
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-gray-100 pt-3 mt-4">
            <div className="flex justify-between items-center">
              <div className="text-gray-800 font-semibold">
                {t('costSavings.totalAnnualSavings', 'Total Annual Savings')}
              </div>
              <div className="text-green-600 text-xl font-bold">
                {costAnalysis.formattedTotal}
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-1 text-right">
              {costAnalysis.savingsPercentage} {t('costAnalysis.ofTotalBaseline', 'of total baseline')}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ResultsDashboard() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ResultsDashboardContent />
    </Suspense>
  );
}
