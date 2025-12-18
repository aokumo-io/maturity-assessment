import React, { useState, useEffect, useMemo } from "react";
import { logger } from '@/lib/logger';

import { Link, useLocation, useRoute } from "wouter";
import Logo from "../logo";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { persistenceManager, STORAGE_KEYS } from "@/lib/assessmentUtils";
import { useTranslation } from "react-i18next";

interface SidebarProps {
  className?: string;
}

// Custom hook for sidebar state management
function useSidebarState() {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    // Initialize from localStorage on first render only
    try {
      const savedState = persistenceManager.loadFormData<string | null>(STORAGE_KEYS.SIDEBAR_COLLAPSED, null);
      return savedState === 'true';
    } catch (error) {
      logger.error("Error loading sidebar state:", error);
      return false;
    }
  });

  // Persist to localStorage when state changes
  useEffect(() => {
    try {
      persistenceManager.saveFormData(STORAGE_KEYS.SIDEBAR_COLLAPSED, String(collapsed));
    } catch (error) {
      logger.error("Error saving sidebar state:", error);
    }
  }, [collapsed]);

  return [collapsed, setCollapsed] as const;
}

// Custom hook for route detection and UUID extraction
function useRouteInfo() {
  const [location] = useLocation();
  
  // Single route pattern that captures all result pages
  const [isResultsRoute, params] = useRoute("/results/:id/:page?");
  
  const uuid = params?.id;
  const page = params?.page;
  
  // Determine which page we're on
  const currentPage = useMemo(() => {
    if (!isResultsRoute) {
      if (location === "/assessment-mindmap") return 'mindmap';
      return 'home';
    }
    
    switch (page) {
      case 'maturity-analysis': return 'maturity';
      case 'trail-map': return 'trail-map';
      case 'implementation-plan': return 'implementation';
      case 'assessment-mindmap': return 'mindmap';
      default: return 'dashboard';
    }
  }, [isResultsRoute, page, location]);
  
  return { uuid, currentPage, location };
}

export function Sidebar({ className = "" }: SidebarProps) {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useSidebarState();
  const { uuid, currentPage } = useRouteInfo();

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };
  
  // Create navigation items with cleaner logic
  const navItems = useMemo(() => {
    const baseItems = [
      {
        id: 'results-dashboard',
        label: t("nav.resultsDashboard"),
        icon: "ri-dashboard-3-line",
        page: 'dashboard' as const,
        path: uuid ? `/results/${uuid}` : "/"
      },
      {
        id: 'maturity-analysis',
        label: t("nav.maturityAnalysis"),
        icon: "ri-bar-chart-2-line",
        page: 'maturity' as const,
        path: uuid ? `/results/${uuid}/maturity-analysis` : "/maturity-analysis"
      },
      {
        id: 'trail-map',
        label: t("nav.trailMap"),
        icon: "ri-road-map-line",
        page: 'trail-map' as const,
        path: uuid ? `/results/${uuid}/trail-map` : "/trail-map"
      },
      {
        id: 'implementation-plan',
        label: t("nav.implementationPlan"),
        icon: "ri-route-line",
        page: 'implementation' as const,
        path: uuid ? `/results/${uuid}/implementation-plan` : "/implementation-plan"
      },
      {
        id: 'assessment-mindmap',
        label: t("nav.assessmentMindmap"),
        icon: "ri-mind-map",
        page: 'mindmap' as const,
        path: uuid ? `/results/${uuid}/assessment-mindmap` : "/assessment-mindmap"
      }
    ];

    return baseItems.map(item => ({
      ...item,
      href: item.path,
      active: currentPage === item.page
    }));
  }, [t, uuid, currentPage]);

  return (
    <div className={`flex md:flex-shrink-0 ${className}`}>
      <div 
        className={cn("flex flex-col bg-[#294364] transition-all duration-300 ease-in-out", 
          collapsed ? "w-20" : "w-64"
        )}
      >
        {/* Logo Area */}
        <div className="flex items-center h-16 px-4 bg-[#213650] justify-between">
          {!collapsed && (
            <Link href="/">
              <div className="cursor-pointer hover:opacity-80 transition-opacity" aria-label={t("nav.goToWelcome", "Go to welcome page")}>
                <Logo variant="light" />
              </div>
            </Link>
          )}
          {collapsed && (
            <Link href="/">
              <div className="cursor-pointer hover:opacity-80 transition-opacity" aria-label={t("nav.goToWelcome", "Go to welcome page")}>
                <i className="ri-home-2-line text-white text-xl"></i>
              </div>
            </Link>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-gray-300 hover:text-white hover:bg-[#19283C]"
            onClick={toggleCollapse}
          >
            {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col flex-grow py-4">
          <nav className="flex-1 px-2 space-y-2">
            <TooltipProvider delayDuration={100} key={`tooltip-${collapsed}`}>
              {navItems.map((item) => (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center px-3 py-3 text-sm font-medium rounded-md group transition-all duration-200",
                        item.active
                          ? "text-white bg-[#19283C]"
                          : "text-gray-200 hover:text-white hover:bg-[#213650]",
                        collapsed ? "justify-center" : ""
                      )}
                    >
                      <i className={cn(
                        item.icon,
                        item.active ? "text-[#FF8015]" : "text-gray-300",
                        "text-2xl",
                        collapsed ? "" : "mr-3"
                      )}></i>
                      {!collapsed && <span>{item.label}</span>}
                    </Link>
                  </TooltipTrigger>
                  {collapsed && (
                    <TooltipContent side="right">
                      <p>{item.label}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              ))}
            </TooltipProvider>
          </nav>
        </div>

      </div>
    </div>
  );
}

export default Sidebar;
