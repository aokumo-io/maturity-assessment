import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AssessmentCategory } from "@shared/schema";
import { ASSESSMENT_MODULES } from "@/lib/constants";
import { type AssessmentType, getCategoriesForAssessmentType } from "@/lib/assessmentFlowService";
import { logger } from "@/lib/logger";
import { useTranslation } from "react-i18next";
import { useAssessmentTracking } from "@/hooks/useAnalytics";

interface KnowledgeResourcesModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryId?: string;
  assessmentType?: AssessmentType;
  categories: {
    id: string;
    name?: string;
    title?: string;
    description?: string;
  }[];
}

// Resource URL mapping based on language
const getResourceUrls = (language: string) => {
  const isJapanese = language === 'ja';
  
  return {
    foundations_culture: {
      cloudNative101: {
        url: isJapanese ? "https://kubernetes.io/ja/docs/concepts/overview/" : "https://landscape.cncf.io/",
        source: isJapanese ? "Kubernetes" : "CNCF"
      },
      effectiveTeams: {
        url: isJapanese ? "https://cloud.google.com/blog/ja/topics/developers-practitioners/devops-state-reports" : "https://www.cncf.io/reports/cncf-annual-survey-2023/",
        source: isJapanese ? "Google Cloud" : "CNCF Survey"
      },
      transformationPlaybook: {
        url: isJapanese ? "https://www.nri.com/jp/knowledge/blog/lst/2023/fis/0131_1" : "https://maturitymodel.cncf.io/",
        source: isJapanese ? "野村総合研究所" : "CNCF Maturity Model"
      },
      devopsCulture: {
        url: isJapanese ? "https://www.youtube.com/watch?v=QcyKGZJuJnE" : "https://www.youtube.com/watch?v=kpMb-Xrf_8g",
        source: "YouTube"
      }
    },
    container_infrastructure: {
      orchestrationBasics: {
        url: isJapanese ? "https://kubernetes.io/ja/docs/concepts/" : "https://kubernetes.io/docs/concepts/",
        source: "Kubernetes"
      },
      containerPatterns: {
        url: isJapanese ? "https://12factor.net/" : "https://12factor.net/",
        source: "Twelve-Factor App"
      },
      infrastructureDeepDive: {
        url: isJapanese ? "https://zenn.dev/topics/kubernetes" : "https://github.com/kelseyhightower/kubernetes-the-hard-way",
        source: isJapanese ? "Zenn" : "GitHub"
      },
      containerEssentials: {
        url: isJapanese ? "https://www.youtube.com/watch?v=zJ6WbK9zFpI" : "https://www.youtube.com/watch?v=zJ6WbK9zFpI",
        source: "YouTube"
      }
    },
    application_architecture: {
      twelveFactor: {
        url: isJapanese ? "https://12factor.net/" : "https://12factor.net/",
        source: "Twelve-Factor App"
      },
      microservices: {
        url: isJapanese ? "https://microservices.io/" : "https://microservices.io/",
        source: "Microservices.io"
      },
      serviceOriented: {
        url: isJapanese ? "https://microservices.io/" : "https://www.oreilly.com/library/view/building-microservices/9781491950340/",
        source: isJapanese ? "Microservices.io" : "O'Reilly"
      }
    },
    cicd_practices: {
      bestPractices: {
        url: isJapanese ? "https://cloud.google.com/docs/ci-cd?hl=ja" : "https://docs.github.com/en/actions/guides/about-continuous-integration",
        source: isJapanese ? "Google Cloud" : "GitHub Docs"
      },
      devopsCulture: {
        url: isJapanese ? "https://www.atlassian.com/ja/devops" : "https://www.atlassian.com/devops",
        source: "Atlassian"
      },
      continuousDelivery: {
        url: isJapanese ? "https://www.oreilly.co.jp/books/9784873117614/" : "https://continuousdelivery.com/",
        source: "O'Reilly"
      }
    },
    dora_metrics: {
      fundamentals: {
        url: isJapanese ? "https://cloud.google.com/blog/ja/products/devops-sre/announcing-dora-2023-accelerate-state-of-devops-report" : "https://dora.dev/",
        source: isJapanese ? "Google Cloud" : "DORA"
      },
      transformation: {
        url: isJapanese ? "https://www.atlassian.com/ja/devops/frameworks/dora-metrics" : "https://www.atlassian.com/devops/frameworks/dora-metrics",
        source: "Atlassian"
      },
      phoenixProject: {
        url: isJapanese ? "https://www.oreilly.co.jp/books/9784873117911/" : "https://itrevolution.com/the-phoenix-project/",
        source: isJapanese ? "O'Reilly Japan" : "IT Revolution"
      }
    },
    observability: {
      engineering: {
        url: isJapanese ? "https://opentelemetry.io/docs/" : "https://opentelemetry.io/docs/",
        source: isJapanese ? "OpenTelemetry" : "OpenTelemetry"
      },
      distributedSystems: {
        url: isJapanese ? "https://kubernetes.io/ja/docs/concepts/cluster-administration/logging/" : "https://microservices.io/patterns/observability/distributed-tracing.html",
        source: isJapanese ? "Kubernetes" : "Microservices.io"
      },
      scalability: {
        url: isJapanese ? "https://sre.google/sre-book/monitoring-distributed-systems/" : "https://sre.google/sre-book/monitoring-distributed-systems/",
        source: isJapanese ? "Google SRE" : "Google SRE"
      }
    },
    security_compliance: {
      bestPractices: {
        url: isJapanese ? "https://cloud.google.com/security/best-practices?hl=ja" : "https://www.cisecurity.org/cis-benchmarks",
        source: isJapanese ? "Google Cloud" : "OWASP"
      },
      complianceAutomation: {
        url: isJapanese ? "https://www.redhat.com/ja/topics/automation" : "https://www.redhat.com/en/topics/automation",
        source: "Red Hat"
      },
      securityOperations: {
        url: isJapanese ? "https://cloud.google.com/security/products/security-operations?hl=ja" : "https://cloud.google.com/security/products/security-operations",
        source: "Google Cloud"
      }
    },
    app_migration_modernization: {
      fundamentals: {
        url: isJapanese ? "https://aws.amazon.com/jp/cloud-migration/" : "https://aws.amazon.com/cloud-migration/",
        source: "AWS"
      },
      patterns: {
        url: isJapanese ? "https://aws.amazon.com/jp/blogs/news/tag/application-modernization/" : "https://aws.amazon.com/blogs/architecture/category/application-modernization/",
        source: "AWS"
      }
    },
    business_value_strategy: {
      roiBasics: {
        url: isJapanese ? "https://www.mckinsey.com/jp/our-insights" : "https://www.mckinsey.com/capabilities/mckinsey-digital/our-insights/clouds-trillion-dollar-prize-is-up-for-grabs",
        source: "McKinsey"
      },
      strategyPlaybook: {
        url: isJapanese ? "https://www.thoughtworks.com/insights" : "https://www.thoughtworks.com/insights",
        source: "ThoughtWorks"
      }
    },
    finops_cost_management: {
      fundamentals: {
        url: isJapanese ? "https://www.finops.org/introduction/" : "https://www.finops.org/introduction/",
        source: "FinOps Foundation"
      },
      optimization: {
        url: isJapanese ? "https://aws.amazon.com/jp/aws-cost-management/" : "https://aws.amazon.com/aws-cost-management/",
        source: "AWS"
      }
    },
    infrastructure_platform: {
      infrastructureAsCode: {
        url: isJapanese ? "https://developer.hashicorp.com/terraform/tutorials?ajs_aid=c6d3c893-95a7-4fb7-a8c7-efb0ab60b42a&product_intent=terraform" : "https://www.terraform.io/intro",
        source: "Terraform"
      },
      platformEngineering: {
        url: isJapanese ? "https://platformengineering.org/blog/what-is-platform-engineering" : "https://platformengineering.org/blog/what-is-platform-engineering",
        source: "Platform Engineering"
      }
    },
    data_management: {
      storageOptions: {
        url: isJapanese ? "https://aws.amazon.com/jp/products/storage/" : "https://aws.amazon.com/products/storage/",
        source: "AWS"
      },
      architecturePatterns: {
        url: isJapanese ? "https://learn.microsoft.com/ja-jp/azure/architecture/data-guide/" : "https://learn.microsoft.com/en-us/azure/architecture/data-guide/",
        source: "Microsoft"
      }
    },
    operations_resilience: {
      sre: {
        url: isJapanese ? "https://sre.google/sre-book/introduction/" : "https://sre.google/sre-book/introduction/",
        source: "Google SRE"
      },
      chaosEngineering: {
        url: isJapanese ? "https://principlesofchaos.org/" : "https://principlesofchaos.org/",
        source: "Principles of Chaos"
      }
    },
    multicloud_hybrid_governance: {
      strategy: {
        url: isJapanese ? "https://www.hashicorp.com/resources/unlocking-the-cloud-operating-model-governance" : "https://www.hashicorp.com/resources/unlocking-the-cloud-operating-model-governance",
        source: "HashiCorp"
      },
      governance: {
        url: isJapanese ? "https://learn.microsoft.com/ja-jp/azure/cloud-adoption-framework/govern/" : "https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/govern/",
        source: "Microsoft CAF"
      }
    },
    ai_ml_integration: {
      mlops: {
        url: isJapanese ? "https://cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning?hl=ja" : "https://cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning",
        source: "Google Cloud"
      },
      platformEngineering: {
        url: isJapanese ? "https://www.kubeflow.org/docs/started/introduction/" : "https://www.kubeflow.org/docs/started/introduction/",
        source: "Kubeflow"
      }
    }
  };
};

export function KnowledgeResourcesModal({
  isOpen,
  onClose,
  categoryId = "foundations_culture", // Default to foundations if not specified
  assessmentType = "comprehensive", // Default to comprehensive if not specified
  categories
}: KnowledgeResourcesModalProps) {
  const { t, i18n } = useTranslation("common");
  
  // Get resource URLs based on current language
  const resourceUrls = useMemo(() => getResourceUrls(i18n.language), [i18n.language]);
  
  // Debug log to see what's being passed in
  logger.debug("KnowledgeResourcesModal props", { 
    categoryId, 
    assessmentType, 
    categoriesCount: categories.length,
    categories: categories.map(c => c.id)
  });
  
  // Set the initial active tab to the current category ID
  const [activeTab, setActiveTab] = useState<string>(categoryId);
  
  // Filter categories based on assessment type
  const filteredCategories = useMemo(() => {
    // Get the relevant module IDs for the current assessment type using the proper service
    const moduleIds = getCategoriesForAssessmentType(assessmentType);
    
    logger.debug("KnowledgeResourcesModal moduleIds from service", { 
      assessmentType,
      moduleIds
    });
    
    // Only show categories that are included in the current assessment type
    const filtered = categories.filter(category => 
      moduleIds.includes(category.id)
    );
    
    // Debug log the filtered categories
    logger.debug("KnowledgeResourcesModal filteredCategories", { 
      filteredCount: filtered.length,
      filteredIds: filtered.map(c => c.id)
    });
    
    return filtered;
  }, [categories, assessmentType]);
  
  // Make sure the active tab is among the filtered categories
  const effectiveActiveTab = useMemo(() => {
    // Check if the active tab is in the filtered categories
    const isActiveTabValid = filteredCategories.some(cat => cat.id === activeTab);
    
    // If active tab is valid, use it; otherwise, use the first category or default to foundations
    const effective = isActiveTabValid 
      ? activeTab 
      : (filteredCategories[0]?.id || "foundations_culture");
      
    // Debug log the effective active tab
    logger.debug("KnowledgeResourcesModal effectiveActiveTab", { 
      activeTab, 
      isActiveTabValid, 
      effectiveActiveTab: effective,
      categoriesFound: filteredCategories.length
    });
    
    return effective;
  }, [activeTab, filteredCategories]);
  
  // If no categories are found, show a message
  if (filteredCategories.length === 0) {
    logger.error("No filtered categories found for assessment type", { assessmentType });
  }
  

  // Ref for the TabsList container
  const tabsListRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll TabsList to keep active tab in view
  useEffect(() => {
    if (!tabsListRef.current) return;
    const activeTab = tabsListRef.current.querySelector<HTMLElement>(
      '[data-state="active"]'
    );
    if (activeTab && tabsListRef.current) {
      const container = tabsListRef.current;
      const tabRect = activeTab.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      const tabWidth = tabRect.width;
      if (tabRect.left < containerRect.left) {
        // Scroll left if tab is out of view on the left, plus one more tab width (1 tab extra)
        container.scrollBy({ left: tabRect.left - containerRect.left - 2 * tabWidth - 16, behavior: "smooth" });
      } else if (tabRect.right > containerRect.right) {
        // Scroll right if tab is out of view on the right, plus one more tab width (1 tab extra)
        container.scrollBy({ left: tabRect.right - containerRect.right + 2 * tabWidth + 16, behavior: "smooth" });
      }
    }
  }, [effectiveActiveTab, filteredCategories]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl">{t("knowledgeResources.modal.title")}</DialogTitle>
          <DialogDescription>
            {t("knowledgeResources.modal.description")}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue={effectiveActiveTab} className="mt-4 max-w-[61rem]" onValueChange={setActiveTab}>
          <TabsList
            ref={tabsListRef}
            className="flex flex-nowrap justify-start gap-1 pb-2 overflow-x-auto h-auto"
          >
            {filteredCategories.map((category) => (
              <TabsTrigger key={category.id} value={category.id} >
                {t(`results:categories.${category.id}`, { defaultValue: category.title || category.name })}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {/* Foundations & Culture Content */}
          <TabsContent value="foundations_culture" className="space-y-4 mt-4">
            <h3 className="text-lg font-medium">{t("knowledgeResources.categories.foundations_culture.title")}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Beginner Resource */}
              <ResourceCard
                title={t("knowledgeResources.categories.foundations_culture.resources.cloudNative101.title")}
                description={t("knowledgeResources.categories.foundations_culture.resources.cloudNative101.description")}
                skillLevel="beginner"
                estimatedTime={`20 ${t("knowledgeResources.timeUnit")}`}
                url={resourceUrls["foundations_culture"]["cloudNative101"].url}
                source={resourceUrls["foundations_culture"]["cloudNative101"].source}
              />
              
              {/* Intermediate Resource */}
              <ResourceCard
                title={t("knowledgeResources.categories.foundations_culture.resources.effectiveTeams.title")}
                description={t("knowledgeResources.categories.foundations_culture.resources.effectiveTeams.description")}
                skillLevel="intermediate"
                estimatedTime={`45 ${t("knowledgeResources.timeUnit")}`}
                url={resourceUrls["foundations_culture"]["effectiveTeams"].url}
                source={resourceUrls["foundations_culture"]["effectiveTeams"].source}
              />
              
              {/* Advanced Resource */}
              <ResourceCard
                title={t("knowledgeResources.categories.foundations_culture.resources.transformationPlaybook.title")}
                description={t("knowledgeResources.categories.foundations_culture.resources.transformationPlaybook.description")}
                skillLevel="advanced"
                estimatedTime={`60 ${t("knowledgeResources.timeUnit")}`}
                url={resourceUrls["foundations_culture"]["transformationPlaybook"].url}
                source={resourceUrls["foundations_culture"]["transformationPlaybook"].source}
              />
              
              {/* Video Course */}
              <ResourceCard
                title={t("knowledgeResources.categories.foundations_culture.resources.devopsCulture.title")}
                description={t("knowledgeResources.categories.foundations_culture.resources.devopsCulture.description")}
                skillLevel="beginner"
                estimatedTime={`45 ${t("knowledgeResources.timeUnit")}`}
                url={resourceUrls["foundations_culture"]["devopsCulture"].url}
                source={resourceUrls["foundations_culture"]["devopsCulture"].source}
                isVideo={true}
              />
            </div>
          </TabsContent>
          
          {/* Container Infrastructure Content */}
          <TabsContent value="container_infrastructure" className="space-y-4 mt-4">
            <h3 className="text-lg font-medium">{t("knowledgeResources.categories.container_infrastructure.title")}</h3>
            <p className="text-sm text-gray-600 mb-4">
              {t("knowledgeResources.categories.container_infrastructure.description")}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Beginner Resource */}
              <ResourceCard 
                title={t("knowledgeResources.categories.container_infrastructure.resources.orchestrationBasics.title")}
                description={t("knowledgeResources.categories.container_infrastructure.resources.orchestrationBasics.description")}
                skillLevel="beginner"
                estimatedTime={`45 ${t("knowledgeResources.timeUnit")}`}
                url={resourceUrls["container_infrastructure"]["orchestrationBasics"].url}
                source={resourceUrls["container_infrastructure"]["orchestrationBasics"].source}
              />
              
              {/* Intermediate Resource */}
              <ResourceCard 
                title={t("knowledgeResources.categories.container_infrastructure.resources.containerPatterns.title")}
                description={t("knowledgeResources.categories.container_infrastructure.resources.containerPatterns.description")}
                skillLevel="intermediate"
                estimatedTime={`60 ${t("knowledgeResources.timeUnit")}`}
                url={resourceUrls["container_infrastructure"]["containerPatterns"].url}
                source={resourceUrls["container_infrastructure"]["containerPatterns"].source}
              />
              
              {/* Advanced Resource */}
              <ResourceCard 
                title={t("knowledgeResources.categories.container_infrastructure.resources.infrastructureDeepDive.title")}
                description={t("knowledgeResources.categories.container_infrastructure.resources.infrastructureDeepDive.description")}
                skillLevel="advanced"
                estimatedTime={`90 ${t("knowledgeResources.timeUnit")}`}
                url={resourceUrls["container_infrastructure"]["infrastructureDeepDive"].url}
                source={resourceUrls["container_infrastructure"]["infrastructureDeepDive"].source}
              />
              
              {/* Video Resource */}
              <ResourceCard 
                title={t("knowledgeResources.categories.container_infrastructure.resources.containerEssentials.title")}
                description={t("knowledgeResources.categories.container_infrastructure.resources.containerEssentials.description")}
                skillLevel="beginner"
                estimatedTime={`120 ${t("knowledgeResources.timeUnit")}`}
                url={resourceUrls["container_infrastructure"]["containerEssentials"].url}
                source={resourceUrls["container_infrastructure"]["containerEssentials"].source}
                isVideo={true}
              />
            </div>
          </TabsContent>
          
          {/* Application Architecture Content */}
          <TabsContent value="application_architecture" className="space-y-4 mt-4">
            <h3 className="text-lg font-medium">{t("knowledgeResources.categories.application_architecture.title")}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Beginner Resource */}
              <ResourceCard
                title={t("knowledgeResources.categories.application_architecture.resources.twelveFactor.title")}
                description={t("knowledgeResources.categories.application_architecture.resources.twelveFactor.description")}
                skillLevel="beginner"
                estimatedTime={`30 ${t("knowledgeResources.timeUnit")}`}
                url={resourceUrls["application_architecture"]["twelveFactor"].url}
                source={resourceUrls["application_architecture"]["twelveFactor"].source}
              />
              
              {/* Intermediate Resource */}
              <ResourceCard
                title={t("knowledgeResources.categories.application_architecture.resources.microservices.title")}
                description={t("knowledgeResources.categories.application_architecture.resources.microservices.description")}
                skillLevel="intermediate"
                estimatedTime={`45 ${t("knowledgeResources.timeUnit")}`}
                url={resourceUrls["application_architecture"]["microservices"].url}
                source={resourceUrls["application_architecture"]["microservices"].source}
              />
              
              {/* Advanced Resource */}
              <ResourceCard
                title={t("knowledgeResources.categories.application_architecture.resources.serviceOriented.title")}
                description={t("knowledgeResources.categories.application_architecture.resources.serviceOriented.description")}
                skillLevel="advanced"
                estimatedTime={`60 ${t("knowledgeResources.timeUnit")}`}
                url={resourceUrls["application_architecture"]["serviceOriented"].url}
                source={resourceUrls["application_architecture"]["serviceOriented"].source}
              />
            </div>
          </TabsContent>
          
          {/* CI/CD Practices Content */}
          <TabsContent value="cicd_practices" className="space-y-4 mt-4">
            <h3 className="text-lg font-medium">{t("knowledgeResources.categories.cicd_practices.title")}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Beginner Resource */}
              <ResourceCard
                title={t("knowledgeResources.categories.cicd_practices.resources.bestPractices.title")}
                description={t("knowledgeResources.categories.cicd_practices.resources.bestPractices.description")}
                skillLevel="beginner"
                estimatedTime={`30 ${t("knowledgeResources.timeUnit")}`}
                url={resourceUrls["cicd_practices"]["bestPractices"].url}
                source={resourceUrls["cicd_practices"]["bestPractices"].source}
              />
              
              {/* Intermediate Resource */}
              <ResourceCard
                title={t("knowledgeResources.categories.cicd_practices.resources.devopsCulture.title")}
                description={t("knowledgeResources.categories.cicd_practices.resources.devopsCulture.description")}
                skillLevel="intermediate"
                estimatedTime={`45 ${t("knowledgeResources.timeUnit")}`}
                url={resourceUrls["cicd_practices"]["devopsCulture"].url}
                source={resourceUrls["cicd_practices"]["devopsCulture"].source}
              />
              
              {/* Advanced Resource */}
              <ResourceCard
                title={t("knowledgeResources.categories.cicd_practices.resources.continuousDelivery.title")}
                description={t("knowledgeResources.categories.cicd_practices.resources.continuousDelivery.description")}
                skillLevel="advanced"
                estimatedTime={`60 ${t("knowledgeResources.timeUnit")}`}
                url={resourceUrls["cicd_practices"]["continuousDelivery"].url}
                source={resourceUrls["cicd_practices"]["continuousDelivery"].source}
              />
            </div>
          </TabsContent>
          
          {/* DORA Metrics Content */}
          <TabsContent value="dora_metrics" className="space-y-4 mt-4">
            <h3 className="text-lg font-medium">{t("knowledgeResources.categories.dora_metrics.title")}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Beginner Resource */}
              <ResourceCard
                title={t("knowledgeResources.categories.dora_metrics.resources.fundamentals.title")}
                description={t("knowledgeResources.categories.dora_metrics.resources.fundamentals.description")}
                skillLevel="beginner"
                estimatedTime={`30 ${t("knowledgeResources.timeUnit")}`}
                url={resourceUrls["dora_metrics"]["fundamentals"].url}
                source={resourceUrls["dora_metrics"]["fundamentals"].source}
              />
              
              {/* Intermediate Resource */}
              <ResourceCard
                title={t("knowledgeResources.categories.dora_metrics.resources.transformation.title")}
                description={t("knowledgeResources.categories.dora_metrics.resources.transformation.description")}
                skillLevel="intermediate"
                estimatedTime={`45 ${t("knowledgeResources.timeUnit")}`}
                url={resourceUrls["dora_metrics"]["transformation"].url}
                source={resourceUrls["dora_metrics"]["transformation"].source}
              />
              
              {/* Advanced Resource */}
              <ResourceCard
                title={t("knowledgeResources.categories.dora_metrics.resources.phoenixProject.title")}
                description={t("knowledgeResources.categories.dora_metrics.resources.phoenixProject.description")}
                skillLevel="advanced"
                estimatedTime={`60 ${t("knowledgeResources.timeUnit")}`}
                url={resourceUrls["dora_metrics"]["phoenixProject"].url}
                source={resourceUrls["dora_metrics"]["phoenixProject"].source}
              />
            </div>
          </TabsContent>
          
          {/* Observability Content */}
          <TabsContent value="observability" className="space-y-4 mt-4">
            <h3 className="text-lg font-medium">{t("knowledgeResources.categories.observability.title")}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Beginner Resource */}
              <ResourceCard
                title={t("knowledgeResources.categories.observability.resources.engineering.title")}
                description={t("knowledgeResources.categories.observability.resources.engineering.description")}
                skillLevel="beginner"
                estimatedTime={`30 ${t("knowledgeResources.timeUnit")}`}
                url={resourceUrls["observability"]["engineering"].url}
                source={resourceUrls["observability"]["engineering"].source}
              />
              
              {/* Intermediate Resource */}
              <ResourceCard
                title={t("knowledgeResources.categories.observability.resources.distributedSystems.title")}
                description={t("knowledgeResources.categories.observability.resources.distributedSystems.description")}
                skillLevel="intermediate"
                estimatedTime={`45 ${t("knowledgeResources.timeUnit")}`}
                url={resourceUrls["observability"]["distributedSystems"].url}
                source={resourceUrls["observability"]["distributedSystems"].source}
              />
              
              {/* Advanced Resource */}
              <ResourceCard
                title={t("knowledgeResources.categories.observability.resources.scalability.title")}
                description={t("knowledgeResources.categories.observability.resources.scalability.description")}
                skillLevel="advanced"
                estimatedTime={`60 ${t("knowledgeResources.timeUnit")}`}
                url={resourceUrls["observability"]["scalability"].url}
                source={resourceUrls["observability"]["scalability"].source}
              />
            </div>
          </TabsContent>
          
          {/* Security & Compliance Content */}
          <TabsContent value="security_compliance" className="space-y-4 mt-4">
            <h3 className="text-lg font-medium">{t("knowledgeResources.categories.security_compliance.title")}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Beginner Resource */}
              <ResourceCard
                title={t("knowledgeResources.categories.security_compliance.resources.bestPractices.title")}
                description={t("knowledgeResources.categories.security_compliance.resources.bestPractices.description")}
                skillLevel="beginner"
                estimatedTime={`30 ${t("knowledgeResources.timeUnit")}`}
                url={resourceUrls["security_compliance"]["bestPractices"].url}
                source={resourceUrls["security_compliance"]["bestPractices"].source}
              />
              
              {/* Intermediate Resource */}
              <ResourceCard
                title={t("knowledgeResources.categories.security_compliance.resources.complianceAutomation.title")}
                description={t("knowledgeResources.categories.security_compliance.resources.complianceAutomation.description")}
                skillLevel="intermediate"
                estimatedTime={`45 ${t("knowledgeResources.timeUnit")}`}
                url={resourceUrls["security_compliance"]["complianceAutomation"].url}
                source={resourceUrls["security_compliance"]["complianceAutomation"].source}
              />
              
              {/* Advanced Resource */}
              <ResourceCard
                title={t("knowledgeResources.categories.security_compliance.resources.securityOperations.title")}
                description={t("knowledgeResources.categories.security_compliance.resources.securityOperations.description")}
                skillLevel="advanced"
                estimatedTime={`60 ${t("knowledgeResources.timeUnit")}`}
                url={resourceUrls["security_compliance"]["securityOperations"].url}
                source={resourceUrls["security_compliance"]["securityOperations"].source}
              />
            </div>
          </TabsContent>
          
          {/* App Migration & Modernization Content */}
          <TabsContent value="app_migration_modernization" className="space-y-4 mt-4">
            <h3 className="text-lg font-medium">{t("knowledgeResources.categories.app_migration_modernization.title")}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Beginner Resource */}
              <ResourceCard
                title={t("knowledgeResources.categories.app_migration_modernization.resources.fundamentals.title")}
                description={t("knowledgeResources.categories.app_migration_modernization.resources.fundamentals.description")}
                skillLevel="beginner"
                estimatedTime={`30 ${t("knowledgeResources.timeUnit")}`}
                url={resourceUrls["app_migration_modernization"]["fundamentals"].url}
                source={resourceUrls["app_migration_modernization"]["fundamentals"].source}
              />
              
              {/* Intermediate Resource */}
              <ResourceCard
                title={t("knowledgeResources.categories.app_migration_modernization.resources.patterns.title")}
                description={t("knowledgeResources.categories.app_migration_modernization.resources.patterns.description")}
                skillLevel="intermediate" 
                estimatedTime={`45 ${t("knowledgeResources.timeUnit")}`}
                url={resourceUrls["app_migration_modernization"]["patterns"].url}
                source={resourceUrls["app_migration_modernization"]["patterns"].source}
              />
            </div>
          </TabsContent>
          
          {/* Business Value & Strategy Content */}
          <TabsContent value="business_value_strategy" className="space-y-4 mt-4">
            <h3 className="text-lg font-medium">{t("knowledgeResources.categories.business_value_strategy.title")}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Beginner Resource */}
              <ResourceCard
                title={t("knowledgeResources.categories.business_value_strategy.resources.roiBasics.title")}
                description={t("knowledgeResources.categories.business_value_strategy.resources.roiBasics.description")}
                skillLevel="beginner"
                estimatedTime={`30 ${t("knowledgeResources.timeUnit")}`}
                url={resourceUrls["business_value_strategy"]["roiBasics"].url}
                source={resourceUrls["business_value_strategy"]["roiBasics"].source}
              />
              
              {/* Intermediate Resource */}
              <ResourceCard
                title={t("knowledgeResources.categories.business_value_strategy.resources.strategyPlaybook.title")}
                description={t("knowledgeResources.categories.business_value_strategy.resources.strategyPlaybook.description")}
                skillLevel="intermediate"
                estimatedTime={`45 ${t("knowledgeResources.timeUnit")}`}
                url={resourceUrls["business_value_strategy"]["strategyPlaybook"].url}
                source={resourceUrls["business_value_strategy"]["strategyPlaybook"].source}
              />
            </div>
          </TabsContent>
          
          {/* FinOps & Cost Management Content */}
          <TabsContent value="finops_cost_management" className="space-y-4 mt-4">
            <h3 className="text-lg font-medium">{t("knowledgeResources.categories.finops_cost_management.title")}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ResourceCard
                title={t("knowledgeResources.categories.finops_cost_management.resources.fundamentals.title")}
                description={t("knowledgeResources.categories.finops_cost_management.resources.fundamentals.description")}
                skillLevel="beginner"
                estimatedTime={`30 ${t("knowledgeResources.timeUnit")}`}
                url={resourceUrls["finops_cost_management"]["fundamentals"].url}
                source={resourceUrls["finops_cost_management"]["fundamentals"].source}
              />
              
              <ResourceCard
                title={t("knowledgeResources.categories.finops_cost_management.resources.optimization.title")}
                description={t("knowledgeResources.categories.finops_cost_management.resources.optimization.description")}
                skillLevel="intermediate"
                estimatedTime={`45 ${t("knowledgeResources.timeUnit")}`}
                url={resourceUrls["finops_cost_management"]["optimization"].url}
                source={resourceUrls["finops_cost_management"]["optimization"].source}
              />
            </div>
          </TabsContent>
          
          {/* Infrastructure & Platform Content */}
          <TabsContent value="infrastructure_platform" className="space-y-4 mt-4">
            <h3 className="text-lg font-medium">{t("knowledgeResources.categories.infrastructure_platform.title")}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ResourceCard
                title={t("knowledgeResources.categories.infrastructure_platform.resources.infrastructureAsCode.title")}
                description={t("knowledgeResources.categories.infrastructure_platform.resources.infrastructureAsCode.description")}
                skillLevel="beginner"
                estimatedTime={`30 ${t("knowledgeResources.timeUnit")}`}
                url={resourceUrls["infrastructure_platform"]["infrastructureAsCode"].url}
                source={resourceUrls["infrastructure_platform"]["infrastructureAsCode"].source}
              />
              
              <ResourceCard
                title={t("knowledgeResources.categories.infrastructure_platform.resources.platformEngineering.title")}
                description={t("knowledgeResources.categories.infrastructure_platform.resources.platformEngineering.description")}
                skillLevel="intermediate"
                estimatedTime={`45 ${t("knowledgeResources.timeUnit")}`}
                url={resourceUrls["infrastructure_platform"]["platformEngineering"].url}
                source={resourceUrls["infrastructure_platform"]["platformEngineering"].source}
              />
            </div>
          </TabsContent>
          
          {/* Data Management Content */}
          <TabsContent value="data_management" className="space-y-4 mt-4">
            <h3 className="text-lg font-medium">{t("knowledgeResources.categories.data_management.title")}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ResourceCard
                title={t("knowledgeResources.categories.data_management.resources.storageOptions.title")}
                description={t("knowledgeResources.categories.data_management.resources.storageOptions.description")}
                skillLevel="beginner"
                estimatedTime={`30 ${t("knowledgeResources.timeUnit")}`}
                url={resourceUrls["data_management"]["storageOptions"].url}
                source={resourceUrls["data_management"]["storageOptions"].source}
              />
              
              <ResourceCard
                title={t("knowledgeResources.categories.data_management.resources.architecturePatterns.title")}
                description={t("knowledgeResources.categories.data_management.resources.architecturePatterns.description")}
                skillLevel="intermediate"
                estimatedTime={`45 ${t("knowledgeResources.timeUnit")}`}
                url={resourceUrls["data_management"]["architecturePatterns"].url}
                source={resourceUrls["data_management"]["architecturePatterns"].source}
              />
            </div>
          </TabsContent>
          
          {/* Operations & Resilience Content */}
          <TabsContent value="operations_resilience" className="space-y-4 mt-4">
            <h3 className="text-lg font-medium">{t("knowledgeResources.categories.operations_resilience.title")}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ResourceCard
                title={t("knowledgeResources.categories.operations_resilience.resources.sre.title")}
                description={t("knowledgeResources.categories.operations_resilience.resources.sre.description")}
                skillLevel="beginner"
                estimatedTime={`30 ${t("knowledgeResources.timeUnit")}`}
                url={resourceUrls["operations_resilience"]["sre"].url}
                source={resourceUrls["operations_resilience"]["sre"].source}
              />
              
              <ResourceCard
                title={t("knowledgeResources.categories.operations_resilience.resources.chaosEngineering.title")}
                description={t("knowledgeResources.categories.operations_resilience.resources.chaosEngineering.description")}
                skillLevel="intermediate"
                estimatedTime={`45 ${t("knowledgeResources.timeUnit")}`}
                url={resourceUrls["operations_resilience"]["chaosEngineering"].url}
                source={resourceUrls["operations_resilience"]["chaosEngineering"].source}
              />
            </div>
          </TabsContent>
          
          {/* Multicloud & Hybrid Governance Content */}
          <TabsContent value="multicloud_hybrid_governance" className="space-y-4 mt-4">
            <h3 className="text-lg font-medium">{t("knowledgeResources.categories.multicloud_hybrid_governance.title")}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ResourceCard
                title={t("knowledgeResources.categories.multicloud_hybrid_governance.resources.strategy.title")}
                description={t("knowledgeResources.categories.multicloud_hybrid_governance.resources.strategy.description")}
                skillLevel="beginner"
                estimatedTime={`30 ${t("knowledgeResources.timeUnit")}`}
                url={resourceUrls["multicloud_hybrid_governance"]["strategy"].url}
                source={resourceUrls["multicloud_hybrid_governance"]["strategy"].source}
              />
              
              <ResourceCard
                title={t("knowledgeResources.categories.multicloud_hybrid_governance.resources.governance.title")}
                description={t("knowledgeResources.categories.multicloud_hybrid_governance.resources.governance.description")}
                skillLevel="intermediate"
                estimatedTime={`45 ${t("knowledgeResources.timeUnit")}`}
                url={resourceUrls["multicloud_hybrid_governance"]["governance"].url}
                source={resourceUrls["multicloud_hybrid_governance"]["governance"].source}
              />
            </div>
          </TabsContent>
          
          {/* AI & ML Integration Content */}
          <TabsContent value="ai_ml_integration" className="space-y-4 mt-4">
            <h3 className="text-lg font-medium">{t("knowledgeResources.categories.ai_ml_integration.title")}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ResourceCard
                title={t("knowledgeResources.categories.ai_ml_integration.resources.mlops.title")}
                description={t("knowledgeResources.categories.ai_ml_integration.resources.mlops.description")}
                skillLevel="beginner"
                estimatedTime={`30 ${t("knowledgeResources.timeUnit")}`}
                url={resourceUrls["ai_ml_integration"]["mlops"].url}
                source={resourceUrls["ai_ml_integration"]["mlops"].source}
              />
              
              <ResourceCard
                title={t("knowledgeResources.categories.ai_ml_integration.resources.platformEngineering.title")}
                description={t("knowledgeResources.categories.ai_ml_integration.resources.platformEngineering.description")}
                skillLevel="intermediate"
                estimatedTime={`45 ${t("knowledgeResources.timeUnit")}`}
                url={resourceUrls["ai_ml_integration"]["platformEngineering"].url}
                source={resourceUrls["ai_ml_integration"]["platformEngineering"].source}
              />
            </div>
          </TabsContent>
          
          {/* Generic content for any remaining categories */}
          {filteredCategories.map(category => {
            const predefinedCategories = [
              "foundations_culture",
              "container_infrastructure",
              "application_architecture",
              "cicd_practices",
              "dora_metrics",
              "observability",
              "security_compliance",
              "app_migration_modernization",
              "business_value_strategy",
              "finops_cost_management",
              "infrastructure_platform",
              "data_management",
              "operations_resilience",
              "multicloud_hybrid_governance",
              "ai_ml_integration"
            ];
            
            if (!predefinedCategories.includes(category.id)) {
              return (
                <TabsContent key={category.id} value={category.id} className="space-y-4 mt-4">
                  <h3 className="text-lg font-medium">{category.title || category.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Learning resources for {category.title || category.name} will be available soon.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ResourceCard
                      title={`${category.title || category.name} Fundamentals`}
                      description={`Introduction to ${category.title || category.name} concepts and best practices`}
                      skillLevel="beginner"
                      estimatedTime="30 min"
                      url="https://www.cncf.io/"
                      source="CNCF"
                    />
                    
                    <ResourceCard
                      title={`Advanced ${category.title || category.name}`}
                      description={`Deep dive into ${category.title || category.name} implementation strategies`}
                      skillLevel="intermediate"
                      estimatedTime="45 min"
                      url="https://www.cncf.io/"
                      source="CNCF"
                    />
                  </div>
                </TabsContent>
              );
            }
            return null;
          })}
        </Tabs>
        
        <div className="flex justify-end mt-6">
          <Button onClick={onClose}>{t("knowledgeResources.buttons.continueAssessment")}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Helper component for resource cards
interface ResourceCardProps {
  title: string;
  description: string;
  skillLevel: "beginner" | "intermediate" | "advanced";
  estimatedTime: string;
  url: string;
  source: string;
  isVideo?: boolean;
}

function ResourceCard({
  title,
  description,
  skillLevel,
  estimatedTime,
  url,
  source,
  isVideo = false
}: ResourceCardProps) {
  const { t } = useTranslation("common");
  const { trackKnowledgeResourceView } = useAssessmentTracking();
  
  const handleResourceClick = () => {
    // Track the knowledge resource view event
    trackKnowledgeResourceView(url);
    // Open the resource in a new tab
    window.open(url, '_blank');
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base">{title}</CardTitle>
          <div className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            skillLevel === 'beginner' ? 'bg-green-100 text-green-700 border border-green-200' :
            skillLevel === 'intermediate' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
            'bg-purple-100 text-purple-700 border border-purple-200'
          }`}>
            {t(`knowledgeResources.skillLevels.${skillLevel}`)}
          </div>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-gray-500">
        <div className="flex items-center">
          <i className="ri-time-line mr-1"></i>
          <span>{estimatedTime}</span>
          <span className="mx-2">•</span>
          <span>{t("knowledgeResources.labels.source")}: {source}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          size="sm"
          className="w-full flex items-center justify-center"
          onClick={handleResourceClick}
        >
          {isVideo ? (
            <i className="ri-video-line mr-1.5"></i>
          ) : (
            <i className="ri-book-open-line mr-1.5"></i>
          )}
          {isVideo ? t("knowledgeResources.buttons.watchVideo") : t("knowledgeResources.buttons.viewResource")}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default KnowledgeResourcesModal;