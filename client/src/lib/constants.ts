// Assessment categories based on the comprehensive mindmap structure
export const ASSESSMENT_CATEGORIES = [
  { 
    id: "foundations_culture", 
    title: "Foundations & Culture", 
    description: "Assess the organization's team structure, engineering culture, and leadership approach to cloud native.",
    icon: "ri-building-line"
  },
  { 
    id: "business_value_strategy", 
    title: "Business Value and Cloud Native Strategy", 
    description: "Evaluate alignment between cloud native initiatives and business goals, ROI measurement, and strategic planning.",
    icon: "ri-line-chart-line"
  },
  { 
    id: "application_architecture", 
    title: "Application Architecture", 
    description: "Evaluate adherence to Twelve-Factor App principles, architectural patterns, and database practices.",
    icon: "ri-layout-line"
  },
  { 
    id: "app_migration_modernization", 
    title: "App Migration & Modernization", 
    description: "Assess strategies for migrating and modernizing legacy applications to cloud native architectures.",
    icon: "ri-recycle-line"
  },
  { 
    id: "container_infrastructure", 
    title: "Container Infrastructure", 
    description: "Evaluate container adoption, registry management, container orchestration, and platform capabilities.",
    icon: "ri-archive-line"
  },
  { 
    id: "cicd_practices", 
    title: "CI/CD Practices", 
    description: "Evaluate continuous integration, delivery, deployment automation, and GitOps adoption.",
    icon: "ri-git-branch-line"
  },
  { 
    id: "dora_metrics", 
    title: "DORA Metrics", 
    description: "Assess key performance indicators like deployment frequency, lead time, recovery time, and failure rate.",
    icon: "ri-bar-chart-line"
  },
  { 
    id: "security_compliance", 
    title: "Security & Compliance", 
    description: "Evaluate security practices, compliance management, and network security approaches.",
    icon: "ri-shield-check-line"
  },
  { 
    id: "infrastructure_platform", 
    title: "Infrastructure & Platform", 
    description: "Assess infrastructure as code, platform engineering practices, and cloud strategy.",
    icon: "ri-server-line"
  },
  { 
    id: "data_management", 
    title: "Data Management", 
    description: "Evaluate storage solutions, data services, and disaster recovery approaches.",
    icon: "ri-database-2-line"
  },
  { 
    id: "observability", 
    title: "Observability", 
    description: "Assess monitoring, logging, tracing, and SLO/SLI implementation capabilities.",
    icon: "ri-eye-line"
  },
  { 
    id: "finops_cost_management", 
    title: "FinOps & Cost Management", 
    description: "Evaluate cloud cost optimization, financial governance, and cost-aware engineering practices.",
    icon: "ri-money-dollar-circle-line"
  },
  { 
    id: "operations_resilience", 
    title: "Operations & Resilience", 
    description: "Assess business continuity planning, recovery strategies, disaster response, and sustainable operations.",
    icon: "ri-refresh-line"
  },
  { 
    id: "multicloud_hybrid_governance", 
    title: "Multi-cloud & Hybrid Governance", 
    description: "Evaluate strategies for managing multiple cloud providers and hybrid cloud environments.",
    icon: "ri-cloud-line"
  },
  { 
    id: "ai_ml_integration", 
    title: "AI/ML and Cloud Native Integration", 
    description: "Assess adoption of AI/ML services, integration with cloud native platforms, and MLOps practices.",
    icon: "ri-brain-line"
  }
];

// Maturity levels
export const MATURITY_LEVELS = {
  BEGINNER: { id: "beginner", label: "Beginner", color: "#F9B44D", range: [0, 50] },
  INTERMEDIATE: { id: "intermediate", label: "Intermediate", color: "#22A3F1", range: [51, 75] },
  ADVANCED: { id: "advanced", label: "Advanced", color: "#47B375", range: [76, 100] },
  NOT_STARTED: { id: "not_started", label: "Not Started", color: "#d1d5db", range: [-1, -1] },
  KNOWLEDGE_GAP: { id: "knowledge_gap", label: "Knowledge Gap", color: "#9470DC", range: [0, 0] }
};

// Risk ratings
export const RISK_RATINGS = {
  LOW: { label: "LOW", color: "#10b981", icon: "ri-shield-check-line" },
  MEDIUM: { label: "MEDIUM", color: "#fbbf24", icon: "ri-alert-line" },
  HIGH: { label: "HIGH", color: "#ef4444", icon: "ri-alarm-warning-line" }
};

// Assessment workflow steps based on the flowchart
export const ASSESSMENT_STEPS = [
  { id: "welcome", label: "Welcome", path: "/" },
  { id: "instructions", label: "Instructions", path: "/instructions" },
  { id: "organization", label: "Organization Info", path: "/organization-info" },

  /* ----------  Core / Quick  ---------- */
  { id: "foundations_culture",       label: "Foundations & Culture",            path: "/assessment/foundations_culture" },
  { id: "business_value_strategy",   label: "Business Value & Strategy",        path: "/assessment/business_value_strategy" },
  { id: "application_architecture",  label: "Application Architecture",         path: "/assessment/application_architecture" },

  /* ----------  Design & Modernise  ---------- */
  { id: "app_migration_modernization", label: "App Migration & Modernization",  path: "/assessment/app_migration_modernization" },

  /* ----------  Build & Ship  ---------- */
  { id: "container_infrastructure",  label: "Container Infrastructure",         path: "/assessment/container_infrastructure" },
  { id: "cicd_practices",            label: "CI/CD Practices",                  path: "/assessment/cicd_practices" },
  { id: "dora_metrics",              label: "DORA Metrics",                     path: "/assessment/dora_metrics" },

  /* ----------  Protect & Manage  ---------- */
  { id: "security_compliance",       label: "Security & Compliance",            path: "/assessment/security_compliance" },
  { id: "infrastructure_platform",   label: "Infrastructure & Platform",        path: "/assessment/infrastructure_platform" },
  { id: "data_management",           label: "Data Management",                  path: "/assessment/data_management" },

  /* ----------  Observe & Optimise  ---------- */
  { id: "observability",             label: "Observability",                    path: "/assessment/observability" },
  { id: "finops_cost_management",    label: "FinOps & Cost Management",         path: "/assessment/finops_cost_management" },
  { id: "operations_resilience",     label: "Operations & Resilience",          path: "/assessment/operations_resilience" },

  /* ----------  Future-proof  ---------- */
  { id: "multicloud_hybrid_governance", label: "Multi-cloud & Hybrid Governance", path: "/assessment/multicloud_hybrid_governance" },
  { id: "ai_ml_integration",            label: "AI/ML Integration",               path: "/assessment/ai_ml_integration" },

  /* ----------  Results flow  ---------- */
  { id: "processing",            label: "Processing",           path: "/processing" },
  { id: "results",               label: "Results Dashboard",    path: "/results" },
  { id: "maturity_analysis",     label: "Maturity Analysis",    path: "/maturity-analysis" },
  { id: "trail_map",             label: "Trail Map",            path: "/trail-map" },
  { id: "implementation_plan",   label: "Implementation Plan",  path: "/implementation-plan" }
];

// Focus area impact levels
export const IMPACT_LEVELS = {
  HIGH: { label: "High Impact", color: "accent" },
  MEDIUM: { label: "Medium Impact", color: "secondary" },
  LOW: { label: "Low Impact", color: "green" }
};

// Focus area effort levels
export const EFFORT_LEVELS = {
  HIGH: { label: "High Effort", color: "red" },
  MEDIUM: { label: "Medium Effort", color: "yellow" },
  LOW: { label: "Low Effort", color: "green" }
};

// Category priority boosts for implementation roadmap
export const BASE_CATEGORY_BOOSTS: Record<string, number> = {
  // Highest priority for your security work
  security_compliance:       10,
  // Observability to help you detect and debug
  observability:             5,
  // DORA metrics for dev productivity
  dora_metrics:              3,

  // Financial ops: cost control
  finops_cost_management:    4,
  // Resilience & uptime
  operations_resilience:     4,

  // Architecture & design
  application_architecture:  3,
  // CI/CD practices
  cicd_practices:            3,

  // Container platform fundamentals
  container_infrastructure:  2,
  // Higher-level platform concerns
  infrastructure_platform:   2,

  // Data stewardship
  data_management:           2,
  // AI/ML integration
  ai_ml_integration:         1,

  // Multi-cloud governance
  multicloud_hybrid_governance: 2,
  // Culture & org foundations
  foundations_culture:          2,
  // Business-value strategy
  business_value_strategy:     3,

  // App migration & modernization
  app_migration_modernization: 2,
};

// Assessment Types
export const ASSESSMENT_TYPES = {
  QUICK: { 
    id: "quick", 
    name: "Quick Assessment", 
    description: "15-20 minutes to complete. Core questions only across 5 fundamental areas.",
    time: "15-20 minutes",
    features: [
      "High-level maturity evaluation",
      "Basic recommendations and next steps",
      "Core modules only (5 areas)"
    ]
  },
  STANDARD: { 
    id: "standard", 
    name: "Standard Assessment",
    description: "30-40 minutes to complete. Core modules plus selected detailed modules across 10 key areas.",
    time: "30-40 minutes",
    features: [
      "Comprehensive maturity analysis",
      "Detailed implementation roadmap",
      "Core and selected detailed modules (10 areas)"
    ]
  },
  COMPREHENSIVE: { 
    id: "comprehensive", 
    name: "Comprehensive Assessment",
    description: "60+ minutes to complete. All 15 modules with advanced questions.",
    time: "60+ minutes",
    features: [
      "In-depth maturity analysis with industry benchmarking",
      "Sophisticated implementation planning",
      "All 15 modules with advanced questions",
      "Business value assessment"
    ]
  }
};

// Assessment Module Categories
export const ASSESSMENT_MODULES = {
  CORE: [
    "foundations_culture",      // Culture & operating model
    "business_value_strategy",  // Why we're doing this
    "application_architecture", // Target design
    "cicd_practices",           // How code ships
    "security_compliance"       // Baseline safety gate
  ],

  STANDARD: [
    // 1. Context
    "foundations_culture",
    "business_value_strategy",

    // 2. Design & modernise
    "application_architecture",
    "app_migration_modernization",

    // 3. Build & ship
    "container_infrastructure",
    "cicd_practices",
    "dora_metrics",

    // 4. Protect & manage
    "security_compliance",

    // 5. Observe & optimise
    "observability",
    "finops_cost_management"
  ],

  COMPREHENSIVE: [
    // 1. Context
    "foundations_culture",
    "business_value_strategy",

    // 2. Design & modernise
    "application_architecture",
    "app_migration_modernization",

    // 3. Build & ship
    "container_infrastructure",
    "cicd_practices",
    "dora_metrics",

    // 4. Protect & manage
    "security_compliance",
    "infrastructure_platform",
    "data_management",

    // 5. Observe & optimise
    "observability",
    "finops_cost_management",
    "operations_resilience",

    // 6. Future-proof
    "multicloud_hybrid_governance",
    "ai_ml_integration"
  ]
};
