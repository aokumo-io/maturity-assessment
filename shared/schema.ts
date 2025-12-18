import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema (existing)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Define organization roles
export const organizationRolesEnum = z.enum([
  'executive', // C-level, VP, Director
  'manager',   // Team Lead, Project Manager
  'architect', // Solution Architect, Technical Lead
  'developer', // Software Engineer, DevOps Engineer
  'operations', // SRE, System Admin
  'security',  // Security Engineer, Compliance
  'business',  // Business Analyst, Product Owner
]);

export type OrganizationRole = z.infer<typeof organizationRolesEnum>;

// Define cloud providers enum
export const cloudProvidersEnum = z.array(z.enum([
  'aws',       // Amazon Web Services
  'azure',     // Microsoft Azure 
  'gcp',       // Google Cloud Platform
  'alibaba',   // Alibaba Cloud
  'on_prem',   // On-Premises / Self-Hosted
  'private',   // Private Cloud
  'other',     // Other providers
]));

export type CloudProviders = z.infer<typeof cloudProvidersEnum>;

// Define deployment model enum
export const deploymentModelEnum = z.enum([
  'public_cloud',
  'private_cloud',
  'hybrid_cloud',
  'multi_cloud',
  'traditional_on_premise',
  'other'
]);

export type DeploymentModel = z.infer<typeof deploymentModelEnum>;

// Organization schema
export const organizations = pgTable("organizations", {
  id: serial("id").primaryKey(),
  industry: text("industry").notNull(),
  companySize: text("company_size").notNull(),
  region: text("region").notNull(),
  cloudProviders: jsonb("cloud_providers").notNull(), // Changed to jsonb array
  deploymentModel: text("deployment_model").notNull(),
  businessObjectives: text("business_objectives"),
  userRole: text("user_role"), // Stores the user's role in the organization
  createdAt: timestamp("created_at").defaultNow().notNull(),
  // Removed PII fields: companyName, contactName, contactEmail
});

// Define a direct Zod schema for organization instead of using createInsertSchema
export const insertOrganizationSchema = z.object({
  industry: z.string().min(1, "Industry is required"),
  companySize: z.string().min(1, "Company size is required"),
  region: z.string().min(1, "Region is required"),
  cloudProviders: cloudProvidersEnum,
  deploymentModel: deploymentModelEnum,
  businessObjectives: z.string().optional(),
  userRole: organizationRolesEnum.optional(),
});

export type InsertOrganization = z.infer<typeof insertOrganizationSchema>;
export type Organization = typeof organizations.$inferSelect;

// Assessment schema
export const assessments = pgTable("assessments", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").references(() => organizations.id),
  title: text("title").notNull(),
  description: text("description"),
  assessmentType: text("assessment_type").notNull(), // quick, standard, comprehensive
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  categories: jsonb("categories").notNull(),
  questions: jsonb("questions").notNull(),
  language: text("language").default("en").notNull(), // Default language is English
});

export const insertAssessmentSchema = createInsertSchema(assessments).omit({
  id: true,
  createdAt: true,
});

export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;
export type Assessment = typeof assessments.$inferSelect;

// Assessment response schema
export const assessmentResponses = pgTable("assessment_responses", {
  id: serial("id").primaryKey(),
  assessmentId: integer("assessment_id").references(() => assessments.id),
  questionId: text("question_id").notNull(),
  score: integer("score").notNull(),
  dontKnow: boolean("dont_know").default(false), // New field to track "I don't know" responses
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAssessmentResponseSchema = createInsertSchema(assessmentResponses).omit({
  id: true,
  createdAt: true,
});

export type InsertAssessmentResponse = typeof assessmentResponses.$inferInsert;
export type AssessmentResponse = typeof assessmentResponses.$inferSelect;

// Feedback data interface
export interface FeedbackData {
  id?: string;
  rating: number; // 1-5 stars
  workingWell?: string;
  needsImprovement?: string;
  featureRequests?: string;
  email?: string;
  resultId?: string;
  userAgent?: string;
  ip?: string;
  timestamp?: string;
}

// Assessment question schema (used in jsonb field)
export const assessmentQuestionSchema = z.object({
  id: z.string(),
  category: z.string(),
  text: z.union([
    z.string(), // For backward compatibility
    z.record(z.string(), z.string()) // Language code -> question text
  ]),
  description: z.string().optional(),
  weight: z.number().optional(),
  maturityImportance: z.enum(['high', 'medium', 'low']).optional(),
  roleRelevance: z.object({
    executive: z.enum(['high', 'medium', 'low', 'none']).optional(),
    manager: z.enum(['high', 'medium', 'low', 'none']).optional(),
    practitioner: z.enum(['high', 'medium', 'low', 'none']).optional()
  }).optional(),
  assessmentType: z.enum(['quick', 'standard', 'comprehensive', 'optional']).optional(),
  baseQuestion: z.boolean().optional(), // For first-page questions
  dependencies: z.array(
    z.object({
      questionId: z.string(),
      minValue: z.number()
    })
  ).optional(),
  maturityLevel: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  options: z.array(
    z.object({
      value: z.number(),
      label: z.union([
        z.string(), // For backward compatibility
        z.record(z.string(), z.string()) // Language code -> option label
      ]),
      description: z.union([
        z.string().optional(), // For backward compatibility
        z.record(z.string(), z.string()).optional() // Language code -> description
      ]),
      isDontKnow: z.boolean().optional(), // Flag for "I don't know" option
    })
  ),
  // Knowledge resource fields
  hasKnowledgeResource: z.boolean().optional(), // Flag indicating if this question has an associated knowledge resource
  knowledgeSummary: z.string().optional(), // For backward compatibility
  knowledgeResourceUrl: z.string().optional(), // For backward compatibility 
  officialDocUrl: z.string().optional(), // For backward compatibility
  tutorialUrl: z.string().optional(), // For backward compatibility
  knowledge: z.record(
    z.string(), 
    z.object({
      summary: z.string(),
      links: z.array(
        z.object({
          text: z.string(),
          url: z.string()
        })
      )
    })
  ).optional(), // Language code -> knowledge resource
  skillLevel: z.enum(['beginner', 'intermediate', 'advanced']).optional(), // Difficulty level of the concept
  estimatedLearningTimeMinutes: z.number().optional(), // Estimated time to learn this concept
});

export type AssessmentQuestion = z.infer<typeof assessmentQuestionSchema>;

// Assessment category schema (used in jsonb field)
export const assessmentCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
});

export type AssessmentCategory = z.infer<typeof assessmentCategorySchema>;

// Category score schema (for results)
export const categoryScoreSchema = z.object({
  categoryId: z.string(),
  score: z.number(),
  maturityLevel: z.string(),
  riskLevel: z.enum(["HIGH", "MEDIUM", "LOW", "NONE"]).optional(),
  criticalIssues: z.union([
    z.array(z.string()), // For backward compatibility
    z.array(z.object({
      id: z.string(),
      text: z.union([
        z.string(), // For backward compatibility
        z.record(z.string(), z.string()) // Language code -> issue text
      ]),
      severity: z.number()
    }))
  ]).optional(),
  costSavingPotential: z.number().optional(), // Potential cost savings as percentage
  businessImpact: z.enum(["HIGH", "MEDIUM", "LOW"]).optional(),
  knowledgeGapPercentage: z.number().optional(), // Percentage of "I don't know" responses
  knowledgeGapAreas: z.array(z.string()).optional(), // List of specific knowledge gap topics
  recommendedLearningResources: z.array(
    z.object({
      title: z.string(),
      url: z.string(),
      type: z.enum(["ARTICLE", "VIDEO", "TUTORIAL", "COURSE"]),
      estimatedTimeMinutes: z.number().optional(),
    })
  ).optional(), // Learning resources for identified knowledge gaps
});

export type CategoryScore = z.infer<typeof categoryScoreSchema>;

// Implementation roadmap schema
export const implementationRecommendationSchema = z.object({
  id: z.string(),
  categoryId: z.string(),
  title: z.string(),
  description: z.string(),
  impact: z.enum(["HIGH", "MEDIUM", "LOW"]),
  effort: z.enum(["HIGH", "MEDIUM", "LOW"]),
  timeline: z.string(),
  priority: z.number(),
  phase: z.string(),
});

export type ImplementationRecommendation = z.infer<typeof implementationRecommendationSchema>;

// Executive Summary schema
export const executiveSummarySchema = z.object({
  id: z.string(),
  assessmentId: z.number(),
  userRole: organizationRolesEnum,
  summaryText: z.string(),
  keyFindings: z.array(z.string()),
  businessImpact: z.string(),
  recommendedActions: z.array(z.string()),
  riskAssessment: z.string(),
  timeToValue: z.string(),
  costSavings: z.string(),
  competitiveAdvantage: z.string().optional(),
  generatedAt: z.date(),
});

export type ExecutiveSummary = z.infer<typeof executiveSummarySchema>;
