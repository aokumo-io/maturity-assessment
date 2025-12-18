import React, { useRef, useEffect, useState, Suspense, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  calculateOverallScore, 
  getMaturityLevel, 
  calculateRiskRating
} from "@/lib/assessmentUtils";
import { MATURITY_LEVELS, ASSESSMENT_CATEGORIES, RISK_RATINGS } from "@/lib/constants";
import { generateOverallScoreChartData } from "@/lib/chartUtils";
import Chart from "chart.js/auto";
import type { Assessment, CategoryScore, Organization } from "@shared/schema";
import { useTranslation } from "react-i18next";
import { fetchCostAnalysisFromServer } from "@/lib/costAnalysisService";
import { 
  enhancedTimeToNextMaturity, 
  formatTimeEstimate,
  getNextLevelName,
} from "@/lib/timeEstimationService";
import { logger } from "@/lib/logger";
import { fetchCriticalIssues, type CriticalIssue } from "@/lib/issueService";
import { useQuery } from "@tanstack/react-query";

interface ScoreCardProps {
  title: string;
  icon: string;
  iconBgColor: string;
  iconColor: string;
  value: string;
  description: string;
}

// Velocity table based on team size
const DEFAULT_VELOCITY_TABLE = {
  pointsPerIdealDay: 1.5,
  idealDaysPerSprint: 8,
  parallelStreams: {
    xs: 1,
    sm: 1,
    md: 2,
    lg: 3
  }
};

// Roadmap items derived from category scores
function deriveRoadmapItems(categoryScores: CategoryScore[]): any[] {
  return categoryScores.map(cat => ({
    id: `item-${cat.categoryId}`,
    category: cat.categoryId,
    priority: (100 - cat.score) * 2, // Higher priority for lower scores
    effort_points: Math.max(5, Math.round((100 - cat.score) / 2)), // More effort for lower scores
    currentCategoryScore: cat.score >= 0 ? cat.score : 0, // Handle knowledge gaps
    impact_level: cat.score < 30 ? 'high' : cat.score < 60 ? 'medium' : 'low'
  }));
}

/**
 * Individual score card component used in the overview dashboard
 */
function ScoreCard({
  title,
  icon,
  iconBgColor,
  iconColor,
  value,
  description
}: ScoreCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full">
      <h3 className="text-sm font-medium text-gray-600 mb-3">{title}</h3>
      <div className="flex items-start">
        <div className={`w-12 h-12 rounded-full ${iconBgColor} flex items-center justify-center mr-4`}>
          <i className={`${icon} ${iconColor} text-xl`}></i>
        </div>
        <div>
          <div className={`text-xl font-semibold ${iconColor}`}>{value}</div>
          <div className="text-sm text-gray-600">{description}</div>
        </div>
      </div>
    </div>
  );
}

interface OverallDashboardProps {
  assessment: Assessment;
  categoryScores: CategoryScore[];
  completionDate?: string;
}

// Loading fallback for Suspense
function DashboardLoadingFallback() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="lg:col-span-3 h-36 rounded-lg bg-gray-200 animate-pulse"></div>
        ))}
      </div>
    </div>
  );
}

function OverviewDashboardContent({
  assessment, 
  categoryScores,
  completionDate = new Date().toLocaleDateString("en-US", { 
    year: "numeric", 
    month: "long", 
    day: "numeric" 
  })
}: OverallDashboardProps) {
  const { t, i18n } = useTranslation('results');
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const [costAnalysis, setCostAnalysis] = useState<any>(null);
  
  // Early return for empty category scores to prevent errors
  if (!categoryScores || categoryScores.length === 0) {
    return <DashboardLoadingFallback />;
  }
  
  // Fetch organization data - just like the PDF does
  const { data: organization, isLoading: isLoadingOrganization } = useQuery<Organization>({
    queryKey: ["/api/assessment/organization"],
    enabled: !!assessment?.organizationId, // Only fetch if assessment has organizationId
    retry: false, // Don't retry if organization doesn't exist
  });
  
  // Calculate overall score
  const overallScore = useMemo(() => {
    return calculateOverallScore(categoryScores);
  }, [categoryScores]);
  
  // Check if all categories are knowledge gaps
  const isAllKnowledgeGap = useMemo(() => {
    return categoryScores.length > 0 && 
      categoryScores.every(cat => cat.score === -1 || cat.maturityLevel === "knowledge_gap");
  }, [categoryScores]);
  
  // Get maturity level
  const maturityLevel = getMaturityLevel(overallScore);
  
  // Initialize risk rating state - will be updated with sophisticated calculation
  const [riskRating, setRiskRating] = useState(RISK_RATINGS.MEDIUM);

  const riskLabel = i18n.language === 'ja' 
    ? t(`riskLevels.${riskRating.label}`)
    : t(`riskLevels.${riskRating.label}`);
    
  // Create organization info from REAL fetched data or defaults
  const organizationInfo = useMemo(() => {
    // Default values if not available
    const defaultOrgInfo = {
      industry: "technology",
      companySize: "51-250",
      region: "north_america",
      userRole: "architect",
      businessObjectives: ["faster_time_to_market", "scalability"],
      cloudProviders: ["aws"],
      deploymentModel: "public_cloud"
    };
    
    // Use REAL organization data if available
    if (organization) {
      return {
        industry: organization.industry || defaultOrgInfo.industry,
        companySize: organization.companySize || defaultOrgInfo.companySize,
        region: organization.region || defaultOrgInfo.region,
        userRole: organization.userRole || defaultOrgInfo.userRole,
        businessObjectives: organization.businessObjectives 
          ? (typeof organization.businessObjectives === 'string' 
              ? organization.businessObjectives.split(',').map(s => s.trim())
              : organization.businessObjectives)
          : defaultOrgInfo.businessObjectives,
        cloudProviders: Array.isArray(organization.cloudProviders) 
          ? organization.cloudProviders 
          : defaultOrgInfo.cloudProviders,
        deploymentModel: organization.deploymentModel || defaultOrgInfo.deploymentModel
      };
    }
    
    // Only use defaults if no organization data exists
    return defaultOrgInfo;
  }, [organization]);
  
  // Generate derived roadmap items from category scores
  const derivedRoadmapItems = useMemo(() => {
    return deriveRoadmapItems(categoryScores);
  }, [categoryScores]);
  
  // Enhanced time to next level calculation
  const enhancedTimeEstimate = useMemo(() => {
    if (isAllKnowledgeGap || !categoryScores || categoryScores.length === 0) {
      return null; // No estimate for knowledge gaps or empty scores
    }
    
    return enhancedTimeToNextMaturity(
      overallScore,
      categoryScores,
      derivedRoadmapItems,
      DEFAULT_VELOCITY_TABLE,
      organizationInfo
    );
  }, [overallScore, categoryScores, derivedRoadmapItems, organizationInfo, isAllKnowledgeGap]);
  
  // Format time to next level for display - USING ENHANCED ESTIMATION
  const timeToNextLevel = useMemo(() => {
    if (isAllKnowledgeGap) {
      return t('needAssessmentData', 'Need assessment data');
    }
    
    return enhancedTimeEstimate 
      ? formatTimeEstimate(enhancedTimeEstimate, i18n.language, (key: string, fallback?: string) => t(key, fallback || ''))
      : '';
  }, [isAllKnowledgeGap, enhancedTimeEstimate, i18n.language, t]);
  
  // Critical issues count for risk display
  const [allCriticalIssues, setAllCriticalIssues] = useState<any[]>([]);
  const [highRiskIssuesCount, setHighRiskIssuesCount] = useState<number>(0);

  // Calculate cost savings
  useEffect(() => {
    if (!isAllKnowledgeGap && categoryScores.length > 0) {
      // Request cost analysis from server API
      const fetchCostData = async () => {
        try {
          // Pass current language to ensure proper currency formatting
          const analysis = await fetchCostAnalysisFromServer(categoryScores, i18n.language);
          setCostAnalysis(analysis);
        } catch (error) {
          logger.error('[OverviewDashboard] Error fetching cost analysis', error);
          // Fallback is handled in fetchCostAnalysisFromServer
        }
      };
      
      fetchCostData();
    }
  }, [categoryScores, isAllKnowledgeGap, organizationInfo, i18n.language]);

  // Count critical issues for risk display
  useEffect(() => {
    if (!isAllKnowledgeGap && assessment) {
      const fetchIssues = async () => {
        try {
          // Fetch critical issues using the rule-based approach from the server
          const issues = await fetchCriticalIssues();
          
          setAllCriticalIssues(issues);
          // Critical issues with severity 3 are considered HIGH risk
          setHighRiskIssuesCount(issues.filter(issue => issue.severity === 3).length);
        } catch (error) {
          logger.error('[OverviewDashboard] Error fetching critical issues', error);
          // Fallback to the simplified approach if API fails
          const simplifiedIssues = categoryScores
            .filter(cat => cat.score < 40)
            .map((cat, idx) => ({
              id: `issue-${idx}`,
              categoryId: cat.categoryId,
              severity: cat.score < 30 ? 3 : 2,
              text: `Low maturity score (${cat.score}%) in ${ASSESSMENT_CATEGORIES.find(c => c.id === cat.categoryId)?.title || cat.categoryId}`
            }));
          
          setAllCriticalIssues(simplifiedIssues);
          setHighRiskIssuesCount(simplifiedIssues.filter(issue => issue.severity === 3).length);
        }
      };
      
      fetchIssues();
    } else {
      setAllCriticalIssues([]);
      setHighRiskIssuesCount(0);
    }
  }, [assessment, isAllKnowledgeGap, categoryScores]);

  // Update risk rating when critical issues change - SOPHISTICATED CALCULATION
  useEffect(() => {
    if (!isAllKnowledgeGap) {
      // Use the same sophisticated risk calculation as PDF
      const highSeverityCount = allCriticalIssues.filter(issue => issue.severity === 3).length;
      const mediumSeverityCount = allCriticalIssues.filter(issue => issue.severity === 2).length;
      
      // EXACT same logic as PDF generator - consider severity levels
      let newRiskRating;
      if (highSeverityCount > 5 || overallScore < 30) {
        newRiskRating = RISK_RATINGS.HIGH;
      } else if (highSeverityCount > 0 || mediumSeverityCount > 2 || overallScore < 50) {
        newRiskRating = RISK_RATINGS.MEDIUM;
      } else {
        newRiskRating = RISK_RATINGS.LOW;
      }
      
      // Update the risk rating state
      setRiskRating(newRiskRating);
      // Also keep track of high severity count for display
      setHighRiskIssuesCount(highSeverityCount);
    } else {
      // For knowledge gaps, use simple score-based fallback
      if (overallScore < 30) {
        setRiskRating(RISK_RATINGS.HIGH);
      } else if (overallScore < 60) {
        setRiskRating(RISK_RATINGS.MEDIUM);
      } else {
        setRiskRating(RISK_RATINGS.LOW);
      }
      setHighRiskIssuesCount(0);
    }
  }, [allCriticalIssues, isAllKnowledgeGap, overallScore]);

  useEffect(() => {
    if (!chartRef.current) return;

    // Destroy previous chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    const chartData = generateOverallScoreChartData(overallScore);

    chartInstance.current = new Chart(ctx, {
      type: "doughnut",
      data: chartData,
      options: {
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false
          }
        },
        responsive: true,
        maintainAspectRatio: true,
        cutout: "75%"
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [overallScore]);

  // Get risk color based on level
  const getRiskColor = (level: string) => {
    switch(level) {
      case "HIGH": return "text-red-600 bg-red-50";
      case "MEDIUM": return "text-orange-500 bg-orange-50";
      case "LOW": return "text-yellow-600 bg-yellow-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  // Get risk icon based on level
  const getRiskIcon = (level: string) => {
    switch(level) {
      case "HIGH": return "ri-alert-fill";
      case "MEDIUM": return "ri-error-warning-fill";
      case "LOW": return "ri-information-fill";
      default: return "ri-information-line";
    }
  };

  // Format completion date based on locale
  const formattedCompletionDate = useMemo(() => {
    const dateOptions: Intl.DateTimeFormatOptions = { 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    };
    try {
      return new Date().toLocaleDateString(i18n.language, dateOptions);
    } catch (e) {
      return completionDate; // fallback to provided date
    }
  }, [i18n.language, completionDate]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Overall Maturity Score */}
        <div className="lg:col-span-3">
          <div className="bg-white p-6 rounded-lg shadow-md h-full">
            <h3 className="text-sm font-medium text-gray-600 mb-3">{t('metrics.totalScore', 'Total Maturity Score')}</h3>
            <div className="flex items-start">
              <div className="relative w-20 h-20">
                <canvas ref={chartRef}></canvas>
                <div className="absolute inset-0 flex items-center justify-center font-bold" style={{ color: isAllKnowledgeGap ? MATURITY_LEVELS.KNOWLEDGE_GAP.color : maturityLevel.color }}>
                  {isAllKnowledgeGap ? (
                    <span className="text-lg">{t('gap', 'Gap')}</span>
                  ) : (
                    <span className="text-xl">{`${overallScore}%`}</span>
                  )}
                </div>
              </div>
              <div className="ml-4">
                <div className="text-xl font-semibold text-gray-800">{t(`maturityLevels.${maturityLevel.id}`, maturityLevel.label)}</div>
                <div className="text-sm text-gray-600">{t('completed', 'Completed')} {formattedCompletionDate}</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Risk Rating */}
        <div className="lg:col-span-3">
          <div className="bg-white p-6 rounded-lg shadow-md h-full">
            <h3 className="text-sm font-medium text-gray-600 mb-3">{t('metrics.riskRating')}</h3>
            <div className="flex items-start">
              <div className={`w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mr-4`}>
                <i className={`${riskRating.icon} text-red-500 text-xl`}></i>
              </div>
              <div>
                <div className={`text-xl font-semibold`} style={{ color: riskRating.color }}>
                  {!isAllKnowledgeGap && (
                    <>
                      {t(`riskLevels.${riskRating.label}`)}
                    </>
                  )}
                  {isAllKnowledgeGap && t('unknownRisk', 'Unknown')}
                </div>
                <div className="text-sm text-gray-600">{isAllKnowledgeGap 
                  ? t('riskRequiresData', 'Risk assessment requires data')
                  : t('criticalIssuesFound', '{{count}} critical issues identified', { count: allCriticalIssues.length })
                }</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Estimated Cost Savings */}
        <div className="lg:col-span-3">
          <div className="bg-white p-6 rounded-lg shadow-md h-full">
            <h3 className="text-sm font-medium text-gray-600 mb-3">{t('metrics.costSavings', 'Potential Cost Savings')}</h3>
            <div className="flex items-start">
              <div className={`w-12 h-12 rounded-full bg-[#D8F8E8] flex items-center justify-center mr-4`}>
                <i className={`ri-money-dollar-circle-line text-[#10b981] text-xl`}></i>
              </div>
              <div>
                {isAllKnowledgeGap ? (
                  <div>
                    <div className={`text-xl font-semibold text-[#10b981]`}>$0</div>
                    <div className="text-sm text-gray-600">{t('needAssessmentData', 'Need assessment data')}</div>
                  </div>
                ) : costAnalysis ? (
                  <div>
                    <div className={`text-xl font-semibold text-[#10b981]`}>
                      {costAnalysis.formattedTotal}
                    </div>
                    <div className="text-sm text-gray-600">{costAnalysis.savingsPercentage} {t('costAnalysis.ofTotalBaseline', 'of total baseline')}</div>
                    <div className="text-xs text-gray-500 mt-1">{costAnalysis.biggestLever}</div>
                  </div>
                ) : (
                  <div className="animate-pulse">
                    <div className="h-5 bg-gray-200 rounded w-24 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Time to Next Level */}
        <div className="lg:col-span-3">
          <div className="bg-white p-6 rounded-lg shadow-md h-full">
            <h3 className="text-sm font-medium text-gray-600 mb-3">{t('metrics.timeToNextLevel')}</h3>
            <div className="flex items-start">
              <div className={`w-12 h-12 rounded-full bg-[#D0D9E8] flex items-center justify-center mr-4`}>
                <i className={`ri-time-line text-[#294364] text-xl`}></i>
              </div>
              <div>
                <div className={`text-xl font-semibold text-[#294364]`}>{timeToNextLevel}</div>
                <div className="text-sm text-gray-600">{isAllKnowledgeGap 
                  ? t('needToCompleteAssessment', 'Need to complete assessment')
                  : t('toReachLevel', 'To reach {{level}} level', {
                    level: maturityLevel.id === "beginner" 
                      ? t('maturityLevels.intermediate', 'Intermediate')
                      : maturityLevel.id === "intermediate" 
                        ? t('maturityLevels.advanced', 'Advanced') 
                        : t('maturityLevels.expert', 'Expert')
                  })
                }</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function OverviewDashboard(props: OverallDashboardProps) {
  return (
    <Suspense fallback={<DashboardLoadingFallback />}>
      <OverviewDashboardContent {...props} />
    </Suspense>
  );
}

export default OverviewDashboard;