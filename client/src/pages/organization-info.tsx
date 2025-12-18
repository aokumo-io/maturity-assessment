/**
 * @file organization-info.tsx
 * @description 組織情報入力フォームコンポーネント
 * ユーザーの組織に関する情報を収集し、評価のカスタマイズに使用します。
 */

import React, { useEffect, useState, useMemo } from "react";
import { logger } from '@/lib/logger';

import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { organizationRolesEnum, cloudProvidersEnum, deploymentModelEnum } from "@/../../shared/schema";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressBar } from "@/components/assessment/progress-bar";
import { ASSESSMENT_CATEGORIES, ASSESSMENT_STEPS } from "@/lib/constants";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import AppLayout from "@/components/layout/app-layout";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon, Pencil } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";
import { persistenceManager, STORAGE_KEYS } from "@/lib/assessmentUtils";
import { getStoredAssessmentType, getCategoriesForAssessmentType, getTotalCategoriesCount } from "@/lib/assessmentFlowService";
import { getCsrfToken } from "@/lib/csrf-service";
import { usePageMeta } from "@/hooks/use-meta";

// Cloud provider options for the form
const CLOUD_PROVIDER_OPTIONS = [
  { id: 'aws', label: 'AWS (Amazon Web Services)' },
  { id: 'azure', label: 'Microsoft Azure' },
  { id: 'gcp', label: 'Google Cloud' },
  { id: 'alibaba', label: 'Alibaba Cloud' },
  { id: 'on_prem', label: 'On-Prem / Self-Hosted Infrastructure' },
  { id: 'private', label: 'Private Cloud (Dedicated infrastructure)' },
  { id: 'other', label: 'Other / Specify' }
];

// Industry options for the form
const INDUSTRY_OPTIONS = [
  { id: 'finance', label: 'Finance & Banking' },
  { id: 'healthcare', label: 'Healthcare & Life Sciences' },
  { id: 'retail', label: 'Retail & E-commerce' },
  { id: 'manufacturing', label: 'Manufacturing' },
  { id: 'technology', label: 'Technology & Software' },
  { id: 'telecom', label: 'Telecommunications' },
  { id: 'media', label: 'Media & Entertainment' },
  { id: 'education', label: 'Education' },
  { id: 'government', label: 'Government & Public Sector' },
  { id: 'energy', label: 'Energy & Utilities' },
  { id: 'transportation', label: 'Transportation & Logistics' },
  { id: 'professional_services', label: 'Professional Services' },
  { id: 'hospitality', label: 'Hospitality & Tourism' },
  { id: 'nonprofit', label: 'Nonprofit & NGO' },
  { id: 'other', label: 'Other' }
];

// Business objectives options
const BUSINESS_OBJECTIVE_OPTIONS = [
  { id: 'cost_reduction', label: 'Cost reduction' },
  { id: 'faster_time_to_market', label: 'Faster time to market' },
  { id: 'scalability', label: 'Scalability' },
  { id: 'reliability', label: 'Reliability' },
  { id: 'security', label: 'Security improvements' },
  { id: 'developer_productivity', label: 'Developer productivity' },
  { id: 'innovation', label: 'Innovation' },
  { id: 'technical_debt', label: 'Technical debt reduction' }
];

// Form schema
const formSchema = z.object({
  industry: z.string({ required_error: "Please select an industry" }),
  companySize: z.string({ required_error: "Please select company size" }),
  region: z.string({ required_error: "Please select a region" }),
  userRole: z.string({ required_error: "Please select your role" }),
  cloudProviders: z.array(z.string()).min(1, "Please select at least one cloud provider").default([]),
  deploymentModel: z.string({ required_error: "Please select a deployment model" }),
  businessObjectives: z.array(z.string()).max(3, "Please select up to 3 objectives").optional().default([]),
  additionalObjectives: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

// Helper function to derive deployment model from cloud providers
function deriveDeploymentModel(providers: string[]): string {
  const hyperscalers = ['aws', 'azure', 'gcp', 'alibaba'];
  
  // Check if exactly one hyperscaler is selected
  const selectedHyperscalers = providers.filter(p => hyperscalers.includes(p));
  
  if (selectedHyperscalers.length === 1 && providers.length === 1) {
    return 'public_cloud';
  }
  
  // Check if only on-prem is selected
  if (providers.length === 1 && providers.includes('on_prem')) {
    return 'traditional_on_premise';
  }
  
  // Check for hybrid cloud (one hyperscaler + on-prem)
  if (selectedHyperscalers.length === 1 && providers.includes('on_prem')) {
    return 'hybrid_cloud';
  }
  
  // Check for multi-cloud (multiple hyperscalers)
  if (selectedHyperscalers.length >= 2) {
    return 'multi_cloud';
  }
  
  // Check for private cloud
  if (providers.length === 1 && providers.includes('private')) {
    return 'private_cloud';
  }
  
  // Default case
  return 'other';
}

// Helper function to get human-readable deployment model name
// This should NOT use any hooks
function getDeploymentModelLabel(model: string, t: (key: string) => string): string {
  const modelMap: Record<string, string> = {
    public_cloud: t("fields.deploymentModel.options.public_cloud"),
    private_cloud: t("fields.deploymentModel.options.private_cloud"),
    hybrid_cloud: t("fields.deploymentModel.options.hybrid_cloud"),
    multi_cloud: t("fields.deploymentModel.options.multi_cloud"),
    traditional_on_premise: t("fields.deploymentModel.options.traditional_on_premise"),
    other: t("fields.deploymentModel.options.other"),
  };
  
  return modelMap[model] || model;
}

interface typeSaveData {
  industry?: string;
  companySize?: string;
  region?: string;
  cloudProviders?: string[];
  deploymentModel?: string;
  businessObjectives?: string[];
  additionalObjectives?: string;
  userRole?: string;
}

// Simple form data store using localStorage
function useLocalFormData() {
  const saveData = (data: typeSaveData) => {
    try {
      persistenceManager.saveFormData(STORAGE_KEYS.ORGANIZATION_DATA, data);
    } catch (error) {
      logger.error("Error saving form data to localStorage:", error);
    }
  };
  
  const loadData = (): typeSaveData | null => {
    try {
      return persistenceManager.loadFormData(STORAGE_KEYS.ORGANIZATION_DATA, null);
    } catch (error) {
      logger.error("Error loading form data from localStorage:", error);
      return null;
    }
  };
  
  return {
    data: loadData(),
    update: saveData
  };
}

export default function OrganizationInfo() {
  const { t } = useTranslation("organization");
  const { t: tObjectives } = useTranslation("businessObjectives");
  const { t: tCloudProviders } = useTranslation("cloudProviders");
  const { t: tIndustries } = useTranslation("industries");
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [editingDeploymentModel, setEditingDeploymentModel] = useState(false);
  const [derivedDeploymentModel, setDerivedDeploymentModel] = useState<string | null>(null);
  const { data, update } = useLocalFormData();
  
  // Enable dynamic meta tags that update with language changes
  usePageMeta();
  
  // Get the current assessment type
  const assessmentType = getStoredAssessmentType();
  
  // Fetch current assessment to ensure we have a session and generate CSRF token
  const { data: currentAssessment } = useQuery({
    queryKey: ["/api/assessment/current"],
    retry: false,
    refetchOnWindowFocus: false,
  });
  
  // Use useMemo to prevent unnecessary recalculations that might trigger re-renders
  const { progress, currentStepIndex, assessmentCategorySteps } = useMemo(() => {
    // Get the categories for the current assessment type
    const categoriesForType = getCategoriesForAssessmentType(assessmentType);
    const totalCategoryCount = getTotalCategoriesCount(assessmentType);
    
    // Calculate current progress
    const steps = [
      { id: "organization", label: "Organization" },
      ...categoriesForType.map(categoryId => {
        const category = ASSESSMENT_CATEGORIES.find(cat => cat.id === categoryId);
        return { id: categoryId, label: category?.title || categoryId };
      })
    ];
    
    const stepIndex = steps.findIndex(step => step.id === "organization") + 1;
    const calculatedProgress = (stepIndex / steps.length) * 100;
    
    return { 
      progress: calculatedProgress, 
      currentStepIndex: stepIndex,
      assessmentCategorySteps: steps
    };
  }, [assessmentType]);  // Only recalculate when assessment type changes
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      industry: data?.industry || "",
      companySize: data?.companySize || "",
      region: data?.region || "",
      cloudProviders: data?.cloudProviders || [],
      deploymentModel: data?.deploymentModel || "",
      businessObjectives: data?.businessObjectives || [],
      additionalObjectives: data?.additionalObjectives || "",
      userRole: data?.userRole || "",
    },
  });
  
  // Watch cloud providers to derive deployment model
  const watchCloudProviders = form.watch("cloudProviders");
  
  // Auto-derive deployment model when cloud providers change
  useEffect(() => {
    if (watchCloudProviders.length > 0) {
      const model = deriveDeploymentModel(watchCloudProviders);
      setDerivedDeploymentModel(model);
      
      // Only set the form value if we're not currently editing
      if (!editingDeploymentModel) {
        form.setValue("deploymentModel", model);
      }
    } else {
      // Reset deployment model when all providers are unselected
      setDerivedDeploymentModel(null);
      form.setValue("deploymentModel", "");
    }
  }, [watchCloudProviders, form, editingDeploymentModel]);

  const { mutate: saveOrganizationInfo, isPending } = useMutation({
    mutationFn: async (data: FormValues) => {
      // Convert selected business objectives and additional text into a single string
      let businessObjectivesText = "";
      if (data.businessObjectives && data.businessObjectives.length > 0) {
        const selectedLabels = data.businessObjectives.map(id => {
          const option = BUSINESS_OBJECTIVE_OPTIONS.find(opt => opt.id === id);
          return option ? tObjectives(`options.${option.id}`, option.label) : id;
        });
        businessObjectivesText = selectedLabels.join(", ");
        
        if (data.additionalObjectives) {
          businessObjectivesText += "\n\nAdditional context: " + data.additionalObjectives;
        }
      } else if (data.additionalObjectives) {
        businessObjectivesText = data.additionalObjectives;
      }

      const res = await apiRequest("POST", "/api/assessment/organization", {
        industry: data.industry,
        companySize: data.companySize,
        region: data.region,
        cloudProviders: data.cloudProviders,
        deploymentModel: data.deploymentModel,
        businessObjectives: businessObjectivesText || "",
        userRole: data.userRole,
      });
      return res.json();
    },
    onSuccess: () => {
      // Navigate to the next step
      const nextStep = ASSESSMENT_STEPS[currentStepIndex + 2];
      if (nextStep) {
        navigate(nextStep.path);
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to save organization information: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormValues) => {
    update(data);
    saveOrganizationInfo(data);
  };

  // Check if form is ready to submit (all required fields filled AND CSRF token available)
  const isFormReady = () => {
    const { industry, companySize, region, cloudProviders, deploymentModel, userRole } = form.getValues();
    const hasRequiredFields = industry && companySize && region && cloudProviders.length > 0 && deploymentModel && userRole;
    const hasCsrfToken = !!getCsrfToken();
    
    return hasRequiredFields && hasCsrfToken;
  };

  const action = <></>;

  return (
    <AppLayout 
      title={t("page.title")} 
      subtitle={t("page.subtitle")}
      hideSidebar
      actions={action}
      classHeader="max-w-7xl mx-auto"
      isHideScollbar
    >
      <div className="p-6 max-w-4xl mx-auto">
        <Card className="mb-6 bg-white shadow-md border-0">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-medium text-gray-800">{t("sections.organizationInfo")}</h2>
              </div>
              <div className="hidden sm:block">
                <Badge variant="outline" className="text-sm py-1">
                  {t('progress.stepCount', 'Step {{current}} of {{total}}', {
                    current: currentStepIndex,
                    total: assessmentCategorySteps.length
                  })}
                </Badge>
              </div>
            </div>
            <p className="mt-2 text-gray-600">
              {t("sections.organizationInfo.description")}
            </p>
            
            <div className="mt-4">
              <ProgressBar currentCategoryId="organization" progress={progress} />
            </div>
          </CardContent>
        </Card>

        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            {/* Organization Information Section */}
            <Card className="mb-6 bg-white shadow-md border-0">
              <CardHeader>
                <CardTitle className="text-lg">{t("sections.organizationInfo")}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="industry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("fields.industry.label")}</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t("fields.industry.placeholder")} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {INDUSTRY_OPTIONS.map(option => (
                              <SelectItem key={option.id} value={option.id}>{tIndustries(`options.${option.id}`, option.label)}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="companySize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("fields.companySize.label")}</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t("fields.companySize.placeholder")} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1-10">{t("fields.companySize.options.1-10")}</SelectItem>
                            <SelectItem value="11-50">{t("fields.companySize.options.11-50")}</SelectItem>
                            <SelectItem value="51-100">{t("fields.companySize.options.51-100")}</SelectItem>
                            <SelectItem value="101-250">{t("fields.companySize.options.101-250")}</SelectItem>
                            <SelectItem value="251-500">{t("fields.companySize.options.251-500")}</SelectItem>
                            <SelectItem value="501-2000">{t("fields.companySize.options.501-2000")}</SelectItem>
                            <SelectItem value="2001-5000">{t("fields.companySize.options.2001-5000")}</SelectItem>
                            <SelectItem value="5001+">{t("fields.companySize.options.5001+")}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="region"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("fields.region.label")}</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t("fields.region.placeholder")} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="japan">{t("fields.region.options.japan")}</SelectItem>
                            <SelectItem value="asia_pacific">{t("fields.region.options.asia_pacific")}</SelectItem>
                            <SelectItem value="north_america">{t("fields.region.options.north_america")}</SelectItem>
                            <SelectItem value="europe">{t("fields.region.options.europe")}</SelectItem>
                            <SelectItem value="south_america">{t("fields.region.options.south_america")}</SelectItem>
                            <SelectItem value="africa">{t("fields.region.options.africa")}</SelectItem>
                            <SelectItem value="middle_east">{t("fields.region.options.middle_east")}</SelectItem>
                            <SelectItem value="global">{t("fields.region.options.global")}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="userRole"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("fields.userRole.label")}</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t("fields.userRole.placeholder")} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="executive">{t("fields.userRole.options.executive")}</SelectItem>
                            <SelectItem value="manager">{t("fields.userRole.options.manager")}</SelectItem>
                            <SelectItem value="architect">{t("fields.userRole.options.architect")}</SelectItem>
                            <SelectItem value="developer">{t("fields.userRole.options.developer")}</SelectItem>
                            <SelectItem value="operations">{t("fields.userRole.options.operations")}</SelectItem>
                            <SelectItem value="security">{t("fields.userRole.options.security")}</SelectItem>
                            <SelectItem value="business">{t("fields.userRole.options.business")}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Technology Environment Section */}
            <Card className="mb-6 bg-white shadow-md border-0">
              <CardHeader>
                <CardTitle className="text-lg">{t("sections.technologyEnvironment")}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-6">
                {/* Cloud Providers */}
                <div>
                  <FormField
                    control={form.control}
                    name="cloudProviders"
                    render={() => (
                      <FormItem>
                        <div className="flex justify-between items-center mb-2">
                          <FormLabel>{t("fields.cloudProviders.label")}</FormLabel>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <InfoIcon className="h-4 w-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">{t("fields.cloudProviders.tooltip")}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <FormDescription className="mt-0 mb-3">
                          {t("fields.cloudProviders.description")}
                        </FormDescription>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {CLOUD_PROVIDER_OPTIONS.slice(0, 6).map((option) => (
                            <FormField
                              key={option.id}
                              control={form.control}
                              name="cloudProviders"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={option.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(option.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, option.id])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== option.id
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {tCloudProviders(`options.${option.id}`, option.label)}
                                    </FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        
                        {/* Other Cloud Provider Option */}
                        <div className="mt-3">
                          <FormField
                            control={form.control}
                            name="cloudProviders"
                            render={({ field }) => {
                              const otherOption = CLOUD_PROVIDER_OPTIONS[6]; // 'Other' option
                              return (
                                <FormItem
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(otherOption.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, otherOption.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== otherOption.id
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {tCloudProviders(`options.${otherOption.id}`, otherOption.label)}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Deployment Model */}
                <FormField
                  control={form.control}
                  name="deploymentModel"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-center mb-2">
                        <FormLabel>{t("fields.deploymentModel.label")}</FormLabel>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <InfoIcon className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-sm">
                              <p><strong>{t("fields.deploymentModel.options.public_cloud").split(':')[0]}:</strong> {t("fields.deploymentModel.tooltip.public_cloud").split(':')[1]}</p>
                              <p><strong>{t("fields.deploymentModel.options.private_cloud").split(':')[0]}:</strong> {t("fields.deploymentModel.tooltip.private_cloud").split(':')[1]}</p>
                              <p><strong>{t("fields.deploymentModel.options.hybrid_cloud").split(':')[0]}:</strong> {t("fields.deploymentModel.tooltip.hybrid_cloud").split(':')[1]}</p>
                              <p><strong>{t("fields.deploymentModel.options.multi_cloud").split(':')[0]}:</strong> {t("fields.deploymentModel.tooltip.multi_cloud").split(':')[1]}</p>
                              <p><strong>{t("fields.deploymentModel.options.traditional_on_premise").split(':')[0]}:</strong> {t("fields.deploymentModel.tooltip.traditional_on_premise").split(':')[1]}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      {!editingDeploymentModel && derivedDeploymentModel ? (
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="px-3 py-1 text-sm bg-secondary-50 ring-offset-background border-secondary-100 text-secondary-700">
                            {t("fields.deploymentModel.detectedModel", { model: getDeploymentModelLabel(derivedDeploymentModel, t) })} 
                            {watchCloudProviders.length > 0 && (
                              <span className="text-muted-foreground ml-1">
                                {t("fields.deploymentModel.basedOnProviders")}
                              </span>
                            )}
                          </Badge>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => setEditingDeploymentModel(true)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Select 
                          onValueChange={(value) => {
                            field.onChange(value);
                            // If user manually selects, keep in edit mode
                          }}
                          defaultValue={field.value}
                          onOpenChange={(open) => {
                            // When dropdown closes, if a value is selected, exit edit mode
                            if (!open && field.value) {
                              setTimeout(() => setEditingDeploymentModel(false), 200);
                            }
                          }}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t("fields.deploymentModel.placeholder")} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="public_cloud">{t("fields.deploymentModel.options.public_cloud")}</SelectItem>
                            <SelectItem value="private_cloud">{t("fields.deploymentModel.options.private_cloud")}</SelectItem>
                            <SelectItem value="hybrid_cloud">{t("fields.deploymentModel.options.hybrid_cloud")}</SelectItem>
                            <SelectItem value="multi_cloud">{t("fields.deploymentModel.options.multi_cloud")}</SelectItem>
                            <SelectItem value="traditional_on_premise">{t("fields.deploymentModel.options.traditional_on_premise")}</SelectItem>
                            <SelectItem value="other">{t("fields.deploymentModel.options.other")}</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            
            {/* Business Objectives Section */}
            <Card className="mb-6 bg-white shadow-md border-0">
              <CardHeader>
                <CardTitle className="text-lg">{t("sections.businessObjectives")}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <FormField
                  control={form.control}
                  name="businessObjectives"
                  render={() => (
                    <FormItem>
                      <div className="mb-2">
                        <FormLabel>{t("fields.businessObjectives.label")}</FormLabel>
                        <FormDescription>
                          {t("fields.businessObjectives.description")}
                        </FormDescription>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {BUSINESS_OBJECTIVE_OPTIONS.map((option) => (
                          <FormField
                            key={option.id}
                            control={form.control}
                            name="businessObjectives"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={option.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      disabled={field.value.length >= 3 && !field.value.includes(option.id)}
                                      checked={field.value?.includes(option.id)}
                                      onCheckedChange={(checked) => {
                                        if (checked && field.value.length < 3) {
                                          return field.onChange([...field.value, option.id]);
                                        } else if (checked && field.value.includes(option.id)) {
                                          return; // already selected, do nothing
                                        } else if (!checked) {
                                          return field.onChange(
                                            field.value?.filter(
                                              (value) => value !== option.id
                                            )
                                          );
                                        }
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {tObjectives(`options.${option.id}`, option.label)}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="additionalObjectives"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.additionalObjectives.label")}</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder={t("fields.additionalObjectives.placeholder")} 
                          className="min-h-[80px]" 
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t("fields.additionalObjectives.description")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            
            <div className="flex justify-between pt-4">
              <Button 
                type="button" 
                variant="outline" 
                className="border-[#294364] text-[#294364] hover:bg-gray-100"
                onClick={() => {
                  // Navigate back to the previous step
                  const prevStep = ASSESSMENT_STEPS[currentStepIndex - 1];
                  if (prevStep) {
                    navigate(prevStep.path);
                  }
                }}
              >
                <i className="ri-arrow-left-line mr-2"></i>
                {t("actions.back")}
              </Button>
              <Button 
                type="submit" 
                disabled={isPending || !isFormReady()}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                {isPending ? t("actions.saving") : t("actions.next")} 
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 h-4 w-4"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </AppLayout>
  );
}
