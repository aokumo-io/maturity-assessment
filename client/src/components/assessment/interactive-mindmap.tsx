import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ReactFlow, {
  Background,
  Controls,
  Edge,
  Node,
  NodeTypes,
  useNodesState,
  useEdgesState,
  MarkerType,
  ConnectionLineType,
  Position,
  Handle,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { ASSESSMENT_CATEGORIES } from '@/lib/constants';
import { useTranslation } from 'react-i18next';

/**
 * 翻訳関数のインターフェース
 * Translation function interface for type safety
 */
interface TranslationFunction {
  (key: string, options?: { defaultValue?: string; returnObjects?: boolean }): string;
  (key: string, options: { returnObjects: true; defaultValue?: any }): any;
}

// Define custom node types
const TopicNode = ({ data }: { data: { label: string; icon?: string; description?: string } }) => {
  return (
    <div className="px-4 py-2 rounded-md shadow-md bg-[#294364] text-white text-center min-w-[150px] relative">
      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 bg-gray-200"
      />
      {data.icon && <i className={`${data.icon} text-lg mb-1`}></i>}
      <div className="font-medium">{data.label}</div>
      {data.description && <div className="text-xs mt-1 text-gray-200">{data.description}</div>}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 bg-gray-200"
      />
    </div>
  );
};

const CategoryNode = ({ data }: { data: { label: string; icon?: string } }) => {
  return (
    <div className="px-4 py-2 rounded-md shadow-md bg-[#FF8015] text-white text-center min-w-[120px] max-w-[200px] relative">
      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 bg-gray-200"
      />
      {data.icon && <i className={`${data.icon} text-lg mb-1`}></i>}
      <div className="font-medium break-words">{data.label}</div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 bg-gray-200"
      />
    </div>
  );
};

const SubCategoryNode = ({ data }: { data: { label: string; icon?: string } }) => {
  return (
    <div className="px-3 py-2 rounded-md shadow-sm bg-[#22A3F1] text-white text-center min-w-[100px] relative">
      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 bg-gray-200"
      />
      {data.icon && <i className={`${data.icon} text-sm mb-1`}></i>}
      <div className="text-sm font-medium">{data.label}</div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 bg-gray-200"
      />
    </div>
  );
};

const DetailNode = ({ data }: { data: { label: string; description?: string } }) => {
  return (
    <div className="px-3 py-2 rounded-md shadow-md bg-white border-2 border-[#FF8015] text-center min-w-[150px] relative">
      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 bg-[#FF8015]"
      />
      <div className="font-medium text-sm text-[#294364]">{data.label}</div>
      {data.description && (
        <div className="text-xs mt-1.5 text-gray-700 max-w-[180px] mx-auto bg-gray-50 p-1.5 rounded">
          {data.description}
        </div>
      )}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 bg-[#FF8015]"
      />
    </div>
  );
};

// Define node types outside of component to prevent re-creation
const nodeTypes: NodeTypes = {
  topicNode: TopicNode,
  categoryNode: CategoryNode,
  subCategoryNode: SubCategoryNode,
  detailNode: DetailNode,
};

// MindMap data for different views
const createAssessmentFlowData = (t: TranslationFunction) => {
  const nodes: Node[] = [
    {
      id: 'start',
      type: 'topicNode',
      data: { label: t('flowNodes.startAssessment', { defaultValue: 'Start Assessment' }), icon: 'ri-play-circle-line' },
      position: { x: 400, y: 0 },
    },
    {
      id: 'welcome',
      type: 'categoryNode',
      data: { label: t('flowNodes.welcomeScreen', { defaultValue: 'Welcome Screen' }), icon: 'ri-home-4-line' },
      position: { x: 400, y: 100 },
    },
    {
      id: 'screening',
      type: 'categoryNode',
      data: { label: t('flowNodes.screeningQuestions', { defaultValue: 'Screening Questions' }), icon: 'ri-question-line' },
      position: { x: 400, y: 200 },
    },
    // Assessment Customization Group
    {
      id: 'org_profile',
      type: 'categoryNode',
      data: { label: t('flowNodes.organizationProfile', { defaultValue: 'Organization Profile' }), icon: 'ri-building-line' },
      position: { x: 200, y: 300 },
    },
    {
      id: 'cloud_profile',
      type: 'categoryNode',
      data: { label: t('flowNodes.cloudNativeProfile', { defaultValue: 'Cloud Native Profile' }), icon: 'ri-cloud-line' },
      position: { x: 400, y: 300 },
    },
    {
      id: 'assessment_pref',
      type: 'categoryNode',
      data: { label: t('flowNodes.assessmentPreferences', { defaultValue: 'Assessment Preferences' }), icon: 'ri-settings-line' },
      position: { x: 600, y: 300 },
    },
    // Assessment Paths
    {
      id: 'quick_path',
      type: 'categoryNode',
      data: { label: t('flowNodes.quickAssessmentPath', { defaultValue: 'Quick Assessment Path' }), icon: 'ri-rocket-line' },
      position: { x: 200, y: 450 },
    },
    {
      id: 'standard_path',
      type: 'categoryNode',
      data: { label: t('flowNodes.standardAssessmentPath', { defaultValue: 'Standard Assessment Path' }), icon: 'ri-route-line' },
      position: { x: 400, y: 450 },
    },
    {
      id: 'comprehensive_path',
      type: 'categoryNode',
      data: { label: t('flowNodes.comprehensiveAssessmentPath', { defaultValue: 'Comprehensive Assessment Path' }), icon: 'ri-road-map-line' },
      position: { x: 600, y: 450 },
    },
    // Results section
    {
      id: 'results_dashboard',
      type: 'topicNode',
      data: { label: t('flowNodes.resultsDashboard', { defaultValue: 'Results Dashboard' }), icon: 'ri-dashboard-line' },
      position: { x: 400, y: 600 },
    },
    {
      id: 'maturity_analysis',
      type: 'categoryNode',
      data: { label: t('flowNodes.cloudNativeMaturityAnalysis', { defaultValue: 'Cloud Native Maturity Analysis' }), icon: 'ri-bar-chart-box-line' },
      position: { x: 200, y: 700 },
    },
    {
      id: 'business_impact',
      type: 'categoryNode',
      data: { label: t('flowNodes.businessImpactAnalysis', { defaultValue: 'Business Impact Analysis' }), icon: 'ri-funds-line' },
      position: { x: 400, y: 700 },
    },
    {
      id: 'trail_map',
      type: 'categoryNode',
      data: { label: t('flowNodes.enhancedTrailMap', { defaultValue: 'Enhanced Trail Map' }), icon: 'ri-map-2-line' },
      position: { x: 600, y: 700 },
    },
    {
      id: 'roadmap',
      type: 'categoryNode',
      data: { label: t('flowNodes.prioritizedImplementationRoadmap', { defaultValue: 'Prioritized Implementation Roadmap' }), icon: 'ri-git-branch-line' },
      position: { x: 800, y: 700 },
    },
  ];

  const edges: Edge[] = [
    // Main flow
    { id: 'e-start-welcome', source: 'start', target: 'welcome', animated: true, type: 'smoothstep', style: { stroke: '#FF8015' } },
    { id: 'e-welcome-screening', source: 'welcome', target: 'screening', animated: true, type: 'smoothstep', style: { stroke: '#FF8015' } },
    
    // Assessment customization
    { id: 'e-screening-org', source: 'screening', target: 'org_profile', type: 'smoothstep', style: { stroke: '#22A3F1' } },
    { id: 'e-org-cloud', source: 'org_profile', target: 'cloud_profile', type: 'smoothstep', style: { stroke: '#22A3F1' } },
    { id: 'e-cloud-pref', source: 'cloud_profile', target: 'assessment_pref', type: 'smoothstep', style: { stroke: '#22A3F1' } },
    
    // Assessment paths
    { id: 'e-pref-quick', source: 'assessment_pref', target: 'quick_path', type: 'smoothstep', label: 'Quick', labelBgPadding: [8, 4], labelBgBorderRadius: 4, labelBgStyle: { fill: '#EEF1F4', color: '#294364', fillOpacity: 0.7 } },
    { id: 'e-pref-standard', source: 'assessment_pref', target: 'standard_path', type: 'smoothstep', label: 'Standard', labelBgPadding: [8, 4], labelBgBorderRadius: 4, labelBgStyle: { fill: '#EEF1F4', color: '#294364', fillOpacity: 0.7 } },
    { id: 'e-pref-comprehensive', source: 'assessment_pref', target: 'comprehensive_path', type: 'smoothstep', label: 'Comprehensive', labelBgPadding: [8, 4], labelBgBorderRadius: 4, labelBgStyle: { fill: '#EEF1F4', color: '#294364', fillOpacity: 0.7 } },
    
    // Results
    { id: 'e-quick-results', source: 'quick_path', target: 'results_dashboard', type: 'smoothstep', animated: true, style: { stroke: '#22A3F1' } },
    { id: 'e-standard-results', source: 'standard_path', target: 'results_dashboard', type: 'smoothstep', animated: true, style: { stroke: '#22A3F1' } },
    { id: 'e-comprehensive-results', source: 'comprehensive_path', target: 'results_dashboard', type: 'smoothstep', animated: true, style: { stroke: '#22A3F1' } },
    
    // Outputs
    { id: 'e-results-maturity', source: 'results_dashboard', target: 'maturity_analysis', type: 'smoothstep', style: { stroke: '#294364' } },
    { id: 'e-results-business', source: 'results_dashboard', target: 'business_impact', type: 'smoothstep', style: { stroke: '#294364' } },
    { id: 'e-results-trail', source: 'results_dashboard', target: 'trail_map', type: 'smoothstep', style: { stroke: '#294364' } },
    { id: 'e-results-roadmap', source: 'results_dashboard', target: 'roadmap', type: 'smoothstep', style: { stroke: '#294364' } },
  ];

  return { nodes, edges };
};

const createAssessmentModulesData = (t: TranslationFunction, tCategories: TranslationFunction, expandedCategory: string | null = 'foundations_culture', expandedSubcategory: string | null = null) => {
  const centerX = 600;
  const centerY = 100; // Move to top
  const categorySpacing = 300; // Increase spacing between categories
  const categoriesPerRow = 5; // 5 categories per row
  
  const nodes: Node[] = [
    {
      id: 'root',
      type: 'topicNode',
      data: { label: t('title', { defaultValue: 'Cloud Native Maturity Assessment' }), icon: 'ri-cloud-line' },
      position: { x: centerX, y: centerY },
    }
  ];

  // Arrange all 15 categories in a 3x5 grid below the center
  ASSESSMENT_CATEGORIES.forEach((category, index) => {
    const row = Math.floor(index / categoriesPerRow);
    const col = index % categoriesPerRow;
    
    // Calculate position for grid layout
    const startX = centerX - (categoriesPerRow - 1) * categorySpacing / 2;
    const x = startX + col * categorySpacing;
    const y = centerY + 200 + row * 220; // Start 200px below center, 220px between rows
    
    nodes.push({
      id: category.id,
      type: 'categoryNode',
      data: { 
        label: tCategories(`${category.id}.title`, { defaultValue: category.title }), 
        icon: category.icon 
      },
      position: { x, y },
      style: expandedCategory === category.id ? { 
        boxShadow: '0 0 10px #FF8015', 
        border: '2px solid #FF8015' 
      } : undefined,
    });
  });

  // Add subcategories for the expanded category in a row below it
  if (expandedCategory) {
    const subcategories = getSubcategoriesForCategory(expandedCategory, tCategories);
    const expandedCategoryNode = nodes.find(n => n.id === expandedCategory);
    
    if (expandedCategoryNode && subcategories.length > 0) {
      const subStartX = expandedCategoryNode.position.x - (subcategories.length - 1) * 200 / 2;
      
      subcategories.forEach((subcat, index) => {
        const subX = subStartX + index * 200; // 200px spacing between subcategories
        const subY = expandedCategoryNode.position.y + 120; // 120px below the category
        
        const subcategoryId = `${expandedCategory}_${subcat.id}`;
        
        nodes.push({
          id: subcategoryId,
          type: 'subCategoryNode',
          data: { label: subcat.label, icon: subcat.icon },
          position: { x: subX, y: subY },
          style: expandedSubcategory === subcategoryId ? { 
            boxShadow: '0 0 8px #22A3F1', 
            border: '2px solid #22A3F1' 
          } : undefined,
        });
      });
    }
  }

  // Add detail nodes for the expanded subcategory
  if (expandedSubcategory) {
    const details = getDetailsForSubcategory(expandedSubcategory, tCategories);
    const expandedSubcategoryNode = nodes.find(n => n.id === expandedSubcategory);
    
    if (expandedSubcategoryNode && details.length > 0) {
      const detailStartX = expandedSubcategoryNode.position.x - (details.length - 1) * 150 / 2;
      
      details.forEach((detail, index) => {
        const detailX = detailStartX + index * 150; // 150px spacing between details
        const detailY = expandedSubcategoryNode.position.y + 100; // 100px below the subcategory
        
        nodes.push({
          id: `${expandedSubcategory}_${detail.id}`,
          type: 'detailNode',
          data: { label: detail.label, description: detail.description },
          position: { x: detailX, y: detailY },
        });
      });
    }
  }

  // Create edges
  const edges: Edge[] = [];
  
  // Connect root to all categories
  ASSESSMENT_CATEGORIES.forEach(category => {
    edges.push({
      id: `e-root-${category.id}`,
      source: 'root',
      target: category.id,
      type: 'smoothstep',
      animated: false, // Remove animation for cleaner look
      style: { stroke: '#294364', strokeWidth: 2 }
    });
  });

  // Connect expanded category to its subcategories
  if (expandedCategory) {
    const subcategories = getSubcategoriesForCategory(expandedCategory, tCategories);
    subcategories.forEach(subcat => {
      edges.push({
        id: `e-${expandedCategory}-${subcat.id}`,
        source: expandedCategory,
        target: `${expandedCategory}_${subcat.id}`,
        type: 'smoothstep',
        style: { stroke: '#FF8015', strokeWidth: 2 }
      });
    });
  }

  // Connect expanded subcategory to its details
  if (expandedSubcategory) {
    const details = getDetailsForSubcategory(expandedSubcategory, tCategories);
    details.forEach(detail => {
      edges.push({
        id: `e-${expandedSubcategory}-${detail.id}`,
        source: expandedSubcategory,
        target: `${expandedSubcategory}_${detail.id}`,
        type: 'smoothstep',
        style: { stroke: '#22A3F1', strokeWidth: 1 }
      });
    });
  }

  return { nodes, edges };
};

// Helper function to get subcategories for each category
const getSubcategoriesForCategory = (categoryId: string, tCategories: TranslationFunction) => {
  const subcategoryMap: Record<string, Array<{id: string, label: string, icon: string}>> = {
    foundations_culture: [
      { id: 'team_structure', label: tCategories(`${categoryId}.subcategories.team_structure.title`, { defaultValue: 'Team Structure' }), icon: 'ri-team-line' },
      { id: 'engineering_culture', label: tCategories(`${categoryId}.subcategories.engineering_culture.title`, { defaultValue: 'Engineering Culture' }), icon: 'ri-group-line' },
      { id: 'leadership', label: tCategories(`${categoryId}.subcategories.leadership.title`, { defaultValue: 'Leadership' }), icon: 'ri-user-star-line' },
    ],
    business_value_strategy: [
      { id: 'business_alignment', label: tCategories(`${categoryId}.subcategories.business_alignment.title`, { defaultValue: 'Business Alignment' }), icon: 'ri-target-line' },
      { id: 'roi_measurement', label: tCategories(`${categoryId}.subcategories.roi_measurement.title`, { defaultValue: 'ROI Measurement' }), icon: 'ri-money-dollar-circle-line' },
      { id: 'strategic_planning', label: tCategories(`${categoryId}.subcategories.strategic_planning.title`, { defaultValue: 'Strategic Planning' }), icon: 'ri-roadmap-line' },
    ],
    application_architecture: [
      { id: 'twelve_factor', label: tCategories(`${categoryId}.subcategories.twelve_factor.title`, { defaultValue: 'Twelve-Factor App' }), icon: 'ri-pages-line' },
      { id: 'microservices', label: tCategories(`${categoryId}.subcategories.microservices.title`, { defaultValue: 'Microservices Patterns' }), icon: 'ri-node-tree' },
      { id: 'database_practices', label: tCategories(`${categoryId}.subcategories.database_practices.title`, { defaultValue: 'Database Practices' }), icon: 'ri-database-line' },
    ],
    app_migration_modernization: [
      { id: 'migration_strategy', label: tCategories(`${categoryId}.subcategories.migration_strategy.title`, { defaultValue: 'Migration Strategy' }), icon: 'ri-arrow-right-line' },
      { id: 'legacy_modernization', label: tCategories(`${categoryId}.subcategories.legacy_modernization.title`, { defaultValue: 'Legacy Modernization' }), icon: 'ri-refresh-line' },
      { id: 'refactoring_patterns', label: tCategories(`${categoryId}.subcategories.refactoring_patterns.title`, { defaultValue: 'Refactoring Patterns' }), icon: 'ri-code-box-line' },
    ],
    container_infrastructure: [
      { id: 'container_adoption', label: tCategories(`${categoryId}.subcategories.container_adoption.title`, { defaultValue: 'Container Adoption' }), icon: 'ri-ship-line' },
      { id: 'registry_management', label: tCategories(`${categoryId}.subcategories.registry_management.title`, { defaultValue: 'Registry Management' }), icon: 'ri-archive-line' },
      { id: 'orchestration', label: tCategories(`${categoryId}.subcategories.orchestration.title`, { defaultValue: 'Orchestration' }), icon: 'ri-steering-2-line' },
    ],
    cicd_practices: [
      { id: 'continuous_integration', label: tCategories(`${categoryId}.subcategories.continuous_integration.title`, { defaultValue: 'Continuous Integration' }), icon: 'ri-git-merge-line' },
      { id: 'continuous_deployment', label: tCategories(`${categoryId}.subcategories.continuous_deployment.title`, { defaultValue: 'Continuous Deployment' }), icon: 'ri-rocket-2-line' },
      { id: 'gitops', label: tCategories(`${categoryId}.subcategories.gitops.title`, { defaultValue: 'GitOps' }), icon: 'ri-git-branch-line' },
    ],
    dora_metrics: [
      { id: 'deployment_frequency', label: tCategories(`${categoryId}.subcategories.deployment_frequency.title`, { defaultValue: 'Deployment Frequency' }), icon: 'ri-speed-line' },
      { id: 'lead_time', label: tCategories(`${categoryId}.subcategories.lead_time.title`, { defaultValue: 'Lead Time for Changes' }), icon: 'ri-time-line' },
      { id: 'mttr', label: tCategories(`${categoryId}.subcategories.mttr.title`, { defaultValue: 'Mean Time to Recovery' }), icon: 'ri-refresh-line' },
      { id: 'change_failure_rate', label: tCategories(`${categoryId}.subcategories.change_failure_rate.title`, { defaultValue: 'Change Failure Rate' }), icon: 'ri-error-warning-line' },
    ],
    security_compliance: [
      { id: 'security_practices', label: tCategories(`${categoryId}.subcategories.security_practices.title`, { defaultValue: 'Security Practices' }), icon: 'ri-lock-line' },
      { id: 'compliance_management', label: tCategories(`${categoryId}.subcategories.compliance_management.title`, { defaultValue: 'Compliance Management' }), icon: 'ri-file-list-3-line' },
      { id: 'network_security', label: tCategories(`${categoryId}.subcategories.network_security.title`, { defaultValue: 'Network Security' }), icon: 'ri-shield-line' },
    ],
    infrastructure_platform: [
      { id: 'infrastructure_as_code', label: tCategories(`${categoryId}.subcategories.infrastructure_as_code.title`, { defaultValue: 'Infrastructure as Code' }), icon: 'ri-code-box-line' },
      { id: 'platform_engineering', label: tCategories(`${categoryId}.subcategories.platform_engineering.title`, { defaultValue: 'Platform Engineering' }), icon: 'ri-apps-2-line' },
      { id: 'cloud_strategy', label: tCategories(`${categoryId}.subcategories.cloud_strategy.title`, { defaultValue: 'Cloud Strategy' }), icon: 'ri-cloud-line' },
    ],
    data_management: [
      { id: 'storage_solutions', label: tCategories(`${categoryId}.subcategories.storage_solutions.title`, { defaultValue: 'Storage Solutions' }), icon: 'ri-hard-drive-line' },
      { id: 'data_services', label: tCategories(`${categoryId}.subcategories.data_services.title`, { defaultValue: 'Data Services' }), icon: 'ri-bubble-chart-line' },
      { id: 'disaster_recovery', label: tCategories(`${categoryId}.subcategories.disaster_recovery.title`, { defaultValue: 'Disaster Recovery' }), icon: 'ri-shield-check-line' },
    ],
    observability: [
      { id: 'monitoring', label: tCategories(`${categoryId}.subcategories.monitoring.title`, { defaultValue: 'Monitoring' }), icon: 'ri-dashboard-3-line' },
      { id: 'logging', label: tCategories(`${categoryId}.subcategories.logging.title`, { defaultValue: 'Logging' }), icon: 'ri-file-list-3-line' },
      { id: 'tracing', label: tCategories(`${categoryId}.subcategories.tracing.title`, { defaultValue: 'Distributed Tracing' }), icon: 'ri-route-line' },
      { id: 'slo_sli', label: tCategories(`${categoryId}.subcategories.slo_sli.title`, { defaultValue: 'SLO/SLI' }), icon: 'ri-bar-chart-line' },
    ],
    finops_cost_management: [
      { id: 'cost_optimization', label: tCategories(`${categoryId}.subcategories.cost_optimization.title`, { defaultValue: 'Cost Optimization' }), icon: 'ri-money-dollar-circle-line' },
      { id: 'financial_governance', label: tCategories(`${categoryId}.subcategories.financial_governance.title`, { defaultValue: 'Financial Governance' }), icon: 'ri-government-line' },
      { id: 'cost_aware_engineering', label: tCategories(`${categoryId}.subcategories.cost_aware_engineering.title`, { defaultValue: 'Cost-Aware Engineering' }), icon: 'ri-calculator-line' },
    ],
    operations_resilience: [
      { id: 'business_continuity', label: tCategories(`${categoryId}.subcategories.business_continuity.title`, { defaultValue: 'Business Continuity' }), icon: 'ri-shield-check-line' },
      { id: 'recovery_strategies', label: tCategories(`${categoryId}.subcategories.recovery_strategies.title`, { defaultValue: 'Recovery Strategies' }), icon: 'ri-restart-line' },
      { id: 'sustainable_operations', label: tCategories(`${categoryId}.subcategories.sustainable_operations.title`, { defaultValue: 'Sustainable Operations' }), icon: 'ri-leaf-line' },
    ],
    multicloud_hybrid_governance: [
      { id: 'multicloud_strategy', label: tCategories(`${categoryId}.subcategories.multicloud_strategy.title`, { defaultValue: 'Multi-cloud Strategy' }), icon: 'ri-cloud-line' },
      { id: 'hybrid_management', label: tCategories(`${categoryId}.subcategories.hybrid_management.title`, { defaultValue: 'Hybrid Management' }), icon: 'ri-links-line' },
      { id: 'governance_policies', label: tCategories(`${categoryId}.subcategories.governance_policies.title`, { defaultValue: 'Governance Policies' }), icon: 'ri-government-line' },
    ],
    ai_ml_integration: [
      { id: 'ai_ml_services', label: tCategories(`${categoryId}.subcategories.ai_ml_services.title`, { defaultValue: 'AI/ML Services' }), icon: 'ri-brain-line' },
      { id: 'mlops_practices', label: tCategories(`${categoryId}.subcategories.mlops_practices.title`, { defaultValue: 'MLOps Practices' }), icon: 'ri-robot-line' },
      { id: 'data_pipelines', label: tCategories(`${categoryId}.subcategories.data_pipelines.title`, { defaultValue: 'Data Pipelines' }), icon: 'ri-flow-chart' },
    ],
  };
  
  return subcategoryMap[categoryId] || [];
};

// Helper function to get educational details for subcategories
const getDetailsForSubcategory = (subcategoryId: string, tCategories: TranslationFunction): Array<{id: string, label: string, description: string}> => {
  // Find the correct category ID by checking which category ID the subcategoryId starts with
  let categoryId = '';
  let subcategoryKey = '';
  
  // Check each known category ID to see if the subcategoryId starts with it
  for (const category of ASSESSMENT_CATEGORIES) {
    if (subcategoryId.startsWith(category.id + '_')) {
      categoryId = category.id;
      subcategoryKey = subcategoryId.substring(category.id.length + 1); // +1 for the underscore
      break;
    }
  }
  
  if (!categoryId || !subcategoryKey) {
    return [];
  }
  
  // Try to get the details from the categories translation
  try {
    const categoryData = tCategories(`${categoryId}`, { returnObjects: true, defaultValue: null });
    
    if (!categoryData || !categoryData.subcategories || !categoryData.subcategories[subcategoryKey]) {
      return [];
    }
    
    const subcategoryData = categoryData.subcategories[subcategoryKey];
    
    if (!subcategoryData.details) {
      return [];
    }
    
    // Convert the details object to an array
    const details = Object.entries(subcategoryData.details).map(([detailKey, detailData]: [string, any]) => ({
      id: detailKey,
      label: detailData.title || detailKey,
      description: detailData.description || ''
    }));
    
    return details;
  } catch (error) {
    console.error(`Error getting details for ${subcategoryId}:`, error);
    return [];
  }
};

const createMaturityAnalysisData = (t: TranslationFunction) => {
  const nodes: Node[] = [
    {
      id: 'maturity_analysis',
      type: 'topicNode',
      data: { label: t('maturityNodes.maturityAnalysis', { defaultValue: 'Maturity Analysis' }), icon: 'ri-bar-chart-box-line' },
      position: { x: 400, y: 0 },
    },
    // Technical maturity
    {
      id: 'technical_maturity',
      type: 'categoryNode',
      data: { label: t('maturityNodes.technicalMaturity', { defaultValue: 'Technical Maturity' }), icon: 'ri-code-box-line' },
      position: { x: 200, y: 100 },
    },
    {
      id: 'category_scores',
      type: 'subCategoryNode',
      data: { label: t('maturityNodes.categoryScores', { defaultValue: 'Category Scores' }), icon: 'ri-bar-chart-grouped-line' },
      position: { x: 100, y: 200 },
    },
    {
      id: 'maturity_level',
      type: 'subCategoryNode',
      data: { label: t('maturityNodes.overallMaturityLevel', { defaultValue: 'Overall Maturity Level' }), icon: 'ri-number-5' },
      position: { x: 300, y: 200 },
    },
    
    // Business value
    {
      id: 'business_value',
      type: 'categoryNode',
      data: { label: t('maturityNodes.businessValueRealization', { defaultValue: 'Business Value Realization' }), icon: 'ri-funds-line' },
      position: { x: 600, y: 100 },
    },
    {
      id: 'value_metrics',
      type: 'subCategoryNode',
      data: { label: t('maturityNodes.valueMetrics', { defaultValue: 'Value Metrics' }), icon: 'ri-line-chart-line' },
      position: { x: 500, y: 200 },
    },
    {
      id: 'roi_analysis',
      type: 'subCategoryNode',
      data: { label: t('maturityNodes.roiAnalysis', { defaultValue: 'ROI Analysis' }), icon: 'ri-money-dollar-circle-line' },
      position: { x: 700, y: 200 },
    },
    
    // Industry comparison
    {
      id: 'industry_comparison',
      type: 'categoryNode',
      data: { label: t('maturityNodes.industryComparison', { defaultValue: 'Industry Comparison' }), icon: 'ri-building-4-line' },
      position: { x: 200, y: 300 },
    },
    {
      id: 'benchmarks',
      type: 'subCategoryNode',
      data: { label: t('maturityNodes.industryBenchmarks', { defaultValue: 'Industry Benchmarks' }), icon: 'ri-scales-line' },
      position: { x: 100, y: 400 },
    },
    {
      id: 'peer_comparison',
      type: 'subCategoryNode',
      data: { label: t('maturityNodes.peerComparison', { defaultValue: 'Peer Comparison' }), icon: 'ri-group-line' },
      position: { x: 300, y: 400 },
    },
    
    // Improvement roadmap
    {
      id: 'improvement_roadmap',
      type: 'categoryNode',
      data: { label: t('maturityNodes.improvementRoadmap', { defaultValue: 'Improvement Roadmap' }), icon: 'ri-road-map-line' },
      position: { x: 600, y: 300 },
    },
    {
      id: 'priority_recommendations',
      type: 'subCategoryNode',
      data: { label: t('maturityNodes.priorityRecommendations', { defaultValue: 'Priority Recommendations' }), icon: 'ri-list-check-2' },
      position: { x: 500, y: 400 },
    },
    {
      id: 'implementation_phases',
      type: 'subCategoryNode',
      data: { label: t('maturityNodes.implementationPhases', { defaultValue: 'Implementation Phases' }), icon: 'ri-calendar-check-line' },
      position: { x: 700, y: 400 },
    },
  ];

  const edges: Edge[] = [
    // Connect to main categories
    { id: 'e-ma-technical', source: 'maturity_analysis', target: 'technical_maturity', type: 'smoothstep', animated: true, style: { stroke: '#294364' } },
    { id: 'e-ma-business', source: 'maturity_analysis', target: 'business_value', type: 'smoothstep', animated: true, style: { stroke: '#294364' } },
    { id: 'e-ma-industry', source: 'maturity_analysis', target: 'industry_comparison', type: 'smoothstep', animated: true, style: { stroke: '#294364' } },
    { id: 'e-ma-improvement', source: 'maturity_analysis', target: 'improvement_roadmap', type: 'smoothstep', animated: true, style: { stroke: '#294364' } },
    
    // Connect technical maturity to subcategories
    { id: 'e-technical-scores', source: 'technical_maturity', target: 'category_scores', type: 'smoothstep', style: { stroke: '#FF8015' } },
    { id: 'e-technical-level', source: 'technical_maturity', target: 'maturity_level', type: 'smoothstep', style: { stroke: '#FF8015' } },
    
    // Connect business value to subcategories
    { id: 'e-business-metrics', source: 'business_value', target: 'value_metrics', type: 'smoothstep', style: { stroke: '#FF8015' } },
    { id: 'e-business-roi', source: 'business_value', target: 'roi_analysis', type: 'smoothstep', style: { stroke: '#FF8015' } },
    
    // Connect industry comparison to subcategories
    { id: 'e-industry-benchmarks', source: 'industry_comparison', target: 'benchmarks', type: 'smoothstep', style: { stroke: '#FF8015' } },
    { id: 'e-industry-peer', source: 'industry_comparison', target: 'peer_comparison', type: 'smoothstep', style: { stroke: '#FF8015' } },
    
    // Connect improvement roadmap to subcategories
    { id: 'e-improvement-recommendations', source: 'improvement_roadmap', target: 'priority_recommendations', type: 'smoothstep', style: { stroke: '#FF8015' } },
    { id: 'e-improvement-phases', source: 'improvement_roadmap', target: 'implementation_phases', type: 'smoothstep', style: { stroke: '#FF8015' } },
  ];

  return { nodes, edges };
};

interface NodeDetail {
  id: string;
  label: string;
  description: string;
}

interface NodeDetailsInfo {
  title: string;
  description: string;
  details: NodeDetail[];
  expanded?: boolean;
}

interface NodeDetailsMap {
  [key: string]: NodeDetailsInfo;
}

interface InteractiveMindMapProps {
  initialView?: string;
}

const InteractiveMindMap: React.FC<InteractiveMindMapProps> = ({ initialView = 'assessment_modules' }) => {
  const [activeTab, setActiveTab] = useState(initialView);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [nodeInfo, setNodeInfo] = useState<{ title: string, description: string } | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>('foundations_culture');
  const [expandedSubcategory, setExpandedSubcategory] = useState<string | null>(null);
  const { t } = useTranslation('mindmap');
  const { t: tCategories } = useTranslation('categories');
  
  // Memoize node types to prevent recreation on each render
  const memoizedNodeTypes = React.useMemo(() => nodeTypes, []);
  
  // Create a ref to store node positions between tab switches
  const savedNodePositions = React.useRef<{
    assessmentFlow: Record<string, { x: number, y: number }>;
    assessmentModules: Record<string, { x: number, y: number }>;
    maturityAnalysis: Record<string, { x: number, y: number }>;
  }>({
    assessmentFlow: {},
    assessmentModules: {},
    maturityAnalysis: {}
  });
  
  // Assessment flow data - memoize to prevent recreation
  const assessmentFlowData = React.useMemo(() => {
    const baseData = createAssessmentFlowData(t);
    
    // Apply saved positions if available
    const nodesWithSavedPositions = baseData.nodes.map(node => {
      const savedPosition = savedNodePositions.current.assessmentFlow[node.id];
      if (savedPosition) {
        return { ...node, position: savedPosition };
      }
      return node;
    });
    
    return {
      ...baseData,
      nodes: nodesWithSavedPositions
    };
  }, [t]);
  
  const [assessmentFlowNodes, setAssessmentFlowNodes, onAssessmentFlowNodesChange] = useNodesState(assessmentFlowData.nodes);
  const [assessmentFlowEdges, setAssessmentFlowEdges, onAssessmentFlowEdgesChange] = useEdgesState(assessmentFlowData.edges);
  
  // Assessment modules data - memoize to prevent recreation and include expanded category
  const assessmentModulesData = React.useMemo(() => {
    const baseData = createAssessmentModulesData(t, tCategories, expandedCategory, expandedSubcategory);
    
    // Apply saved positions if available
    const nodesWithSavedPositions = baseData.nodes.map(node => {
      const savedPosition = savedNodePositions.current.assessmentModules[node.id];
      if (savedPosition) {
        return { ...node, position: savedPosition };
      }
      return node;
    });
    
    return {
      ...baseData,
      nodes: nodesWithSavedPositions
    };
  }, [t, tCategories, expandedCategory, expandedSubcategory]);
  
  const [assessmentModulesNodes, setAssessmentModulesNodes, onAssessmentModulesNodesChange] = useNodesState(assessmentModulesData.nodes);
  const [assessmentModulesEdges, setAssessmentModulesEdges, onAssessmentModulesEdgesChange] = useEdgesState(assessmentModulesData.edges);
  
  // Update nodes and edges when expanded category changes
  React.useEffect(() => {
    const newData = createAssessmentModulesData(t, tCategories, expandedCategory, expandedSubcategory);
    setAssessmentModulesNodes(newData.nodes);
    setAssessmentModulesEdges(newData.edges);
  }, [t, tCategories, expandedCategory, expandedSubcategory, setAssessmentModulesNodes, setAssessmentModulesEdges]);
  
  // Maturity analysis data - memoize to prevent recreation
  const maturityAnalysisData = React.useMemo(() => {
    const baseData = createMaturityAnalysisData(t);
    
    // Apply saved positions if available
    const nodesWithSavedPositions = baseData.nodes.map(node => {
      const savedPosition = savedNodePositions.current.maturityAnalysis[node.id];
      if (savedPosition) {
        return { ...node, position: savedPosition };
      }
      return node;
    });
    
    return {
      ...baseData,
      nodes: nodesWithSavedPositions
    };
  }, [t]);
  
  const [maturityAnalysisNodes, setMaturityAnalysisNodes, onMaturityAnalysisNodesChange] = useNodesState(maturityAnalysisData.nodes);
  const [maturityAnalysisEdges, setMaturityAnalysisEdges, onMaturityAnalysisEdgesChange] = useEdgesState(maturityAnalysisData.edges);
  
  // Save node positions whenever they change
  React.useEffect(() => {
    // Update saved positions for current active tab
    if (activeTab === 'assessment_flow') {
      savedNodePositions.current.assessmentFlow = assessmentFlowNodes.reduce(
        (positions, node) => ({ ...positions, [node.id]: node.position }), 
        {}
      );
    } else if (activeTab === 'assessment_modules') {
      savedNodePositions.current.assessmentModules = assessmentModulesNodes.reduce(
        (positions, node) => ({ ...positions, [node.id]: node.position }), 
        {}
      );
    } else if (activeTab === 'maturity_analysis') {
      savedNodePositions.current.maturityAnalysis = maturityAnalysisNodes.reduce(
        (positions, node) => ({ ...positions, [node.id]: node.position }), 
        {}
      );
    }
  }, [activeTab, assessmentFlowNodes, assessmentModulesNodes, maturityAnalysisNodes]);
  
  // Store node details for various components
  const nodeDetailsMap: NodeDetailsMap = React.useMemo(() => ({
    'twelve_factor': {
      title: 'Twelve-Factor App',
      description: 'The Twelve-Factor App methodology is a set of best practices for building modern, scalable applications that can be deployed to the cloud.',
      details: [
        { id: 'twelve_factor_1', label: 'Codebase', description: 'One codebase tracked in revision control, many deploys' },
        { id: 'twelve_factor_2', label: 'Dependencies', description: 'Explicitly declare and isolate dependencies' },
        { id: 'twelve_factor_3', label: 'Config', description: 'Store config in the environment' },
        { id: 'twelve_factor_4', label: 'Backing Services', description: 'Treat backing services as attached resources' },
        { id: 'twelve_factor_5', label: 'Build, Release, Run', description: 'Strictly separate build and run stages' },
        { id: 'twelve_factor_6', label: 'Processes', description: 'Execute the app as one or more stateless processes' },
        { id: 'twelve_factor_7', label: 'Port Binding', description: 'Export services via port binding' },
        { id: 'twelve_factor_8', label: 'Concurrency', description: 'Scale out via the process model' },
        { id: 'twelve_factor_9', label: 'Disposability', description: 'Maximize robustness with fast startup and graceful shutdown' },
        { id: 'twelve_factor_10', label: 'Dev/Prod Parity', description: 'Keep development, staging, and production as similar as possible' },
        { id: 'twelve_factor_11', label: 'Logs', description: 'Treat logs as event streams' },
        { id: 'twelve_factor_12', label: 'Admin Processes', description: 'Run admin/management tasks as one-off processes' }
      ]
    },
    'team_structure': {
      title: 'Team Structure',
      description: 'Organization of teams for cloud-native development and operations.',
      details: [
        { id: 'team_structure_1', label: 'Cross-functional Teams', description: 'Teams with diverse skill sets focused on product delivery' },
        { id: 'team_structure_2', label: 'DevOps Culture', description: 'Breaking down silos between development and operations' },
        { id: 'team_structure_3', label: 'Platform Teams', description: 'Dedicated teams that build and maintain the cloud platform' },
        { id: 'team_structure_4', label: 'SRE Model', description: 'Site Reliability Engineering practices for operational excellence' }
      ]
    },
    'container_adoption': {
      title: 'Container Adoption',
      description: 'Using containers for application packaging and deployment',
      details: [
        { id: 'container_adoption_1', label: 'Docker Implementation', description: 'Using Docker as the containerization platform' },
        { id: 'container_adoption_2', label: 'Container Patterns', description: 'Application of microservices and sidecar patterns' },
        { id: 'container_adoption_3', label: 'Image Optimization', description: 'Building efficient, secure, and slim container images' },
        { id: 'container_adoption_4', label: 'Development Workflow', description: 'Local development with containers for consistency' }
      ]
    },
    'container_management': {
      title: 'Container Management',
      description: 'Management and administration of containerized workloads and services',
      details: [
        { id: 'container_management_1', label: 'Cluster Strategy', description: 'Multi-cluster vs single-cluster approach' },
        { id: 'container_management_2', label: 'Deployment Models', description: 'Managed vs self-managed container platforms' },
        { id: 'container_management_3', label: 'Resource Management', description: 'Setting resource requests and limits appropriately' },
        { id: 'container_management_4', label: 'Namespace Organization', description: 'Logical separation of workloads and teams' }
      ]
    },
    'orchestration_features': {
      title: 'Orchestration Features',
      description: 'Advanced features for container orchestration platforms',
      details: [
        { id: 'orchestration_features_1', label: 'Autoscaling', description: 'Horizontal and vertical scaling of containerized applications' },
        { id: 'orchestration_features_2', label: 'Service Discovery', description: 'Automatic detection of services and endpoints' },
        { id: 'orchestration_features_3', label: 'Secret Management', description: 'Secure handling of credentials and sensitive information' },
        { id: 'orchestration_features_4', label: 'Custom Resources', description: 'Extending orchestration platforms with custom resource definitions' }
      ]
    },
    'dora': {
      title: 'DORA Metrics',
      description: 'DevOps Research and Assessment (DORA) metrics are key performance indicators that measure the effectiveness of a software development organization.',
      details: [
        { id: 'dora_1', label: 'Deployment Frequency', description: 'How often an organization successfully releases to production' },
        { id: 'dora_2', label: 'Lead Time for Changes', description: 'The time it takes for a commit to reach production' },
        { id: 'dora_3', label: 'Mean Time to Recovery', description: 'How long it takes to recover from a failure in production' },
        { id: 'dora_4', label: 'Change Failure Rate', description: 'The percentage of deployments that cause a failure in production' }
      ]
    },
    'deploy_frequency': {
      title: 'Deployment Frequency',
      description: 'How often an organization successfully releases to production, which indicates development velocity.',
      details: [
        { id: 'deploy_frequency_1', label: 'Deployment Rates', description: 'Number of deployments per day/week/month across different environments' },
        { id: 'deploy_frequency_2', label: 'Change Volume', description: 'Size and scope of changes in each deployment' },
        { id: 'deploy_frequency_3', label: 'Release Cycles', description: 'Patterns and consistency of release schedules' }
      ]
    },
    'lead_time': {
      title: 'Lead Time for Changes',
      description: 'The time it takes from code commit to code successfully running in production.',
      details: [
        { id: 'lead_time_1', label: 'Development Cycle', description: 'Time from coding to submitting for review' },
        { id: 'lead_time_2', label: 'Approval Process', description: 'Time spent in code review and approval stages' },
        { id: 'lead_time_3', label: 'Deployment Process', description: 'Time from approval to running in production' }
      ]
    },
    'mttr': {
      title: 'Mean Time to Recovery',
      description: 'How long it takes to restore service after a production incident or failure.',
      details: [
        { id: 'mttr_1', label: 'Incident Detection', description: 'Time to identify and confirm production issues' },
        { id: 'mttr_2', label: 'Remediation Process', description: 'Time to implement and deploy a fix' },
        { id: 'mttr_3', label: 'Automated Recovery', description: 'Self-healing capabilities and automated rollback systems' }
      ]
    },
    'change_failure': {
      title: 'Change Failure Rate',
      description: 'The percentage of deployments that cause a failure in production requiring remediation.',
      details: [
        { id: 'change_failure_1', label: 'Failure Percentage', description: 'Ratio of failed to successful deployments' },
        { id: 'change_failure_2', label: 'Failure Impact', description: 'Severity and business impact of deployment failures' },
        { id: 'change_failure_3', label: 'Prevention Mechanisms', description: 'Testing, quality gates, and verification processes' }
      ]
    },
    'observability': {
      title: 'Observability',
      description: 'Tools and practices that provide insight into the state and behavior of a system based on its outputs.',
      details: [
        { id: 'observability_1', label: 'Monitoring', description: 'Collecting and analyzing metrics about system health and performance' },
        { id: 'observability_2', label: 'Logging', description: 'Capturing and analyzing events and errors in the system' },
        { id: 'observability_3', label: 'Tracing', description: 'Following a request through a distributed system to identify bottlenecks' },
        { id: 'observability_4', label: 'SLOs & SLIs', description: 'Service Level Objectives and Indicators to measure reliability' }
      ]
    },
    'monitoring': {
      title: 'Monitoring',
      description: 'Collecting, processing, and analyzing metrics to maintain visibility into system health and performance.',
      details: [
        { id: 'monitoring_1', label: 'System Metrics', description: 'Infrastructure and platform-level metrics like CPU, memory, and network' },
        { id: 'monitoring_2', label: 'Application Metrics', description: 'Service and component-level metrics like response times and error rates' },
        { id: 'monitoring_3', label: 'Business Metrics', description: 'Metrics related to business outcomes and user experience' },
        { id: 'monitoring_4', label: 'Alerting System', description: 'Rules and notifications to detect and respond to anomalies' }
      ]
    },
    'logging': {
      title: 'Logging',
      description: 'Capturing, storing, and analyzing application and system logs to understand behavior and troubleshoot issues.',
      details: [
        { id: 'logging_1', label: 'Centralized Logging', description: 'Aggregating logs from all components into a unified platform' },
        { id: 'logging_2', label: 'Log Aggregation', description: 'Collecting and processing logs from diverse sources' },
        { id: 'logging_3', label: 'Log Analysis', description: 'Tools and techniques for searching and extracting insights from logs' },
        { id: 'logging_4', label: 'Retention Policies', description: 'Rules for log storage duration and lifecycle management' }
      ]
    },
    'data_management': {
      title: 'Data Management',
      description: 'Strategies and practices for managing data in cloud-native environments.',
      details: [
        { id: 'data_1', label: 'Storage Solutions', description: 'Persistent, ephemeral, and object storage for cloud-native applications' },
        { id: 'data_2', label: 'Data Services', description: 'Services that process, transform, and analyze data' },
        { id: 'data_3', label: 'Disaster Recovery', description: 'Strategies to protect data and recover from failures' },
        { id: 'data_4', label: 'Data Security', description: 'Protecting data through encryption, access control, and compliance measures' }
      ]
    },
    'storage': {
      title: 'Storage Solutions',
      description: 'Various storage options for cloud-native applications and their management strategies.',
      details: [
        { id: 'storage_1', label: 'Persistent Storage', description: 'Options for durable storage in Kubernetes like PVs and PVCs' },
        { id: 'storage_2', label: 'Object Storage', description: 'Cloud-based object stores for unstructured data and backups' },
        { id: 'storage_3', label: 'Database Services', description: 'Managed or self-hosted database services for applications' },
        { id: 'storage_4', label: 'Backup Solutions', description: 'Tools and practices for data backup and restoration' }
      ]
    },
    'data_services': {
      title: 'Data Services',
      description: 'Services and pipelines for processing, transforming, and analyzing data in cloud environments.',
      details: [
        { id: 'data_services_1', label: 'Data Pipelines', description: 'Infrastructure for extracting, transforming, and loading data' },
        { id: 'data_services_2', label: 'Streaming Services', description: 'Real-time data processing and event streaming platforms' },
        { id: 'data_services_3', label: 'Data Processing', description: 'Batch and real-time data processing frameworks' },
        { id: 'data_services_4', label: 'Analytics Capabilities', description: 'Tools for data analysis, visualization, and business intelligence' }
      ]
    }
  }), []);

  // Handle node click events
  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    setSelectedNode(node.id);
    
    // Handle category expansion in assessment modules tab
    if (activeTab === 'assessment_modules') {
      // Check if clicked node is a main category
      const isCategory = ASSESSMENT_CATEGORIES.some(cat => cat.id === node.id);
      
      if (isCategory) {
        // Toggle category expansion: if already expanded, collapse; otherwise expand
        if (expandedCategory === node.id) {
          setExpandedCategory(null);
          setExpandedSubcategory(null); // Also collapse any subcategory
        } else {
          setExpandedCategory(node.id);
          setExpandedSubcategory(null); // Reset subcategory when changing category
        }
        
        // Set node info for the category
        const category = ASSESSMENT_CATEGORIES.find(cat => cat.id === node.id);
        if (category) {
          setNodeInfo({
            title: tCategories(`${category.id}.title`, { defaultValue: category.title }),
            description: tCategories(`${category.id}.description`, { defaultValue: category.description })
          });
        }
        return;
      }
      
      // Check if clicked node is a subcategory
      const isSubcategory = node.id.includes('_') && node.type === 'subCategoryNode';
      
      if (isSubcategory) {
        // Toggle subcategory expansion
        if (expandedSubcategory === node.id) {
          setExpandedSubcategory(null);
        } else {
          setExpandedSubcategory(node.id);
        }
        
        // Set node info for the subcategory
        setNodeInfo({
          title: node.data.label,
          description: t('nodes.educationalDetails', { label: node.data.label, defaultValue: `Educational details about ${node.data.label}. Click to explore the concepts and principles.` })
        });
        return;
      }
      
      // Handle detail nodes (third level)
      if (node.type === 'detailNode') {
        setNodeInfo({
          title: node.data.label,
          description: node.data.description || t('nodes.learnMore', { label: node.data.label, defaultValue: `Learn more about ${node.data.label}` })
        });
        return;
      }
    }
    
    // Get the node details if available (for other tabs or subcategories)
    const details = nodeDetailsMap[node.id as keyof NodeDetailsMap];
    
    // Display node information
    setNodeInfo({
      title: node.data.label,
      description: details?.description || node.data.description || t('nodes.learnMore', { label: node.data.label, defaultValue: `Learn more about ${node.data.label}` })
    });
    
    // Only apply the old expansion logic for non-assessment-modules tabs
    if (activeTab !== 'assessment_modules') {
      // Determine which state to update
      let currentNodes: Node[], setCurrentNodes: (nodes: Node[]) => void;
      if (activeTab === 'assessment_flow') {
        currentNodes = assessmentFlowNodes;
        setCurrentNodes = setAssessmentFlowNodes;
      } else {
        currentNodes = maturityAnalysisNodes;
        setCurrentNodes = setMaturityAnalysisNodes;
      }
      
      // Create a new nodes array with highlight styling
      const updatedNodes = currentNodes.map(n => ({
        ...n,
        style: {
          ...n.style,
          boxShadow: n.id === node.id ? '0 0 10px #FF8015' : undefined,
          border: n.id === node.id ? '2px solid #FF8015' : undefined
        }
      }));
      
      setCurrentNodes(updatedNodes);
    }
  };

  return (
    <Card className="shadow-lg border border-gray-200">
      <CardHeader className="bg-white">
        <CardTitle className="text-[#294364]">{t('title', { defaultValue: 'Cloud Native Maturity Assessment' })}</CardTitle>
        <CardDescription>
          {t('subtitle', { defaultValue: 'Interactive visualization of the assessment process, modules, and analysis' })}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {selectedNode && nodeInfo && (
          <div className="m-6 p-4 border rounded-lg bg-blue-50 border-blue-200 shadow-sm">
            <h3 className="text-lg font-medium text-[#294364]">{nodeInfo.title}</h3>
            <p className="text-gray-600 mt-1">{nodeInfo.description}</p>
            <button 
              className="mt-3 text-sm text-[#FF8015] hover:text-[#d96500] flex items-center font-medium"
              onClick={() => setSelectedNode(null)}
            >
              <i className="ri-close-line mr-1"></i> {t('nodes.close', { defaultValue: 'Close' })}
            </button>
          </div>
        )}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-6 pt-4 bg-white border-b border-gray-200">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="assessment_flow">{t('tabs.assessmentFlow', { defaultValue: 'Assessment Flow' })}</TabsTrigger>
              <TabsTrigger value="assessment_modules">{t('tabs.assessmentModules', { defaultValue: 'Assessment Modules' })}</TabsTrigger>
              <TabsTrigger value="maturity_analysis">{t('tabs.maturityAnalysis', { defaultValue: 'Maturity Analysis' })}</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="assessment_flow" className="mt-0">
            <div className="p-3 bg-gray-50 text-sm text-gray-600 border-b border-gray-200">
              <p className="px-3">{t('tabDescriptions.assessmentFlow', { defaultValue: 'This diagram shows the entire assessment process flow from start to finish.' })}</p>
            </div>
            <div style={{ height: '600px' }} className="bg-white">
              <ReactFlow
                nodes={assessmentFlowNodes}
                edges={assessmentFlowEdges}
                onNodesChange={onAssessmentFlowNodesChange}
                onEdgesChange={onAssessmentFlowEdgesChange}
                onNodeClick={onNodeClick}
                nodeTypes={memoizedNodeTypes}
                fitView
                connectionLineType={ConnectionLineType.SmoothStep}
              >
                <Background />
                <Controls />
              </ReactFlow>
            </div>
          </TabsContent>
          
          <TabsContent value="assessment_modules" className="mt-0">
            <div className="p-3 bg-gray-50 text-sm text-gray-600 border-b border-gray-200">
              <p className="px-3">{t('tabDescriptions.assessmentModules', { defaultValue: 'Click on any category to see its subcategories. All 15 assessment categories are shown.' })}</p>
            </div>
            <div style={{ height: '700px' }} className="bg-white">
              <ReactFlow
                nodes={assessmentModulesNodes}
                edges={assessmentModulesEdges}
                onNodesChange={onAssessmentModulesNodesChange}
                onEdgesChange={onAssessmentModulesEdgesChange}
                onNodeClick={onNodeClick}
                nodeTypes={memoizedNodeTypes}
                fitView
                fitViewOptions={{
                  padding: 0.15,
                  minZoom: 0.3,
                  maxZoom: 1.2
                }}
                defaultViewport={{ x: 0, y: 0, zoom: 0.5 }}
                connectionLineType={ConnectionLineType.SmoothStep}
                nodesDraggable={true}
                nodesConnectable={false}
                elementsSelectable={true}
              >
                <Background />
                <Controls />
              </ReactFlow>
            </div>
          </TabsContent>
          
          <TabsContent value="maturity_analysis" className="mt-0">
            <div className="p-3 bg-gray-50 text-sm text-gray-600 border-b border-gray-200">
              <p className="px-3">{t('tabDescriptions.maturityAnalysis', { defaultValue: 'This diagram shows the maturity analysis framework and key insights provided.' })}</p>
            </div>
            <div style={{ height: '600px' }} className="bg-white">
              <ReactFlow
                nodes={maturityAnalysisNodes}
                edges={maturityAnalysisEdges}
                onNodesChange={onMaturityAnalysisNodesChange}
                onEdgesChange={onMaturityAnalysisEdgesChange}
                onNodeClick={onNodeClick}
                nodeTypes={memoizedNodeTypes}
                fitView
                connectionLineType={ConnectionLineType.SmoothStep}
              >
                <Background />
                <Controls />
              </ReactFlow>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default InteractiveMindMap;