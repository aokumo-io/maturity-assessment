import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Welcome from "@/pages/welcome";
import Instructions from "@/pages/instructions";
import OrganizationInfo from "@/pages/organization-info";
import Assessment from "@/pages/assessment";
import Processing from "@/pages/processing";
import ResultsDashboard from "@/pages/results-dashboard";
import MaturityAnalysis from "@/pages/maturity-analysis";
import TrailMap from "@/pages/trail-map";
import ImplementationPlan from "@/pages/implementation-plan";
import AssessmentMindMap from "@/pages/assessment-mindmap";
import ReviewResponses from "@/pages/review-responses";
import AITest from "@/pages/ai-test";
import { LanguageProvider } from "./hooks/FormLanguage";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import api, { setNavigate } from "./lib/axios-config";
import { SessionProvider } from "./hooks/use-session";
import { loadSessionFromCookie } from "./lib/session-service";
import { useTranslation } from "react-i18next";
import { logger } from "./lib/logger";

// Define public routes that don't require session initialization
const PUBLIC_ROUTES = ['/', '/welcome', '/instructions'];

// Ensure translations are loaded before rendering components
function TranslationLoader({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();
  const [namespaceLoaded, setNamespaceLoaded] = useState(false);
  
  useEffect(() => {
    // Define all essential namespaces that should be loaded before rendering
    const essentialNamespaces = [
      "common", 
      "assessment", 
      "results", 
      "categories",
      "questions", 
      "organization", 
      "instructions"
    ];
    
    // Load all essential namespaces in parallel
    const loadAllNamespaces = async () => {
      try {
        await i18n.loadNamespaces(essentialNamespaces);
        logger.debug("All essential namespaces loaded successfully");
        setNamespaceLoaded(true);
      } catch (error) {
        logger.error("Error loading i18n namespaces:", error);
        // Even if there's an error, we should continue with the app
        setNamespaceLoaded(true);
      }
    };
    
    loadAllNamespaces();
  }, [i18n]);
  
  // Show a minimal loading state while essential namespaces are loading
  if (!namespaceLoaded) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
          <div className="mt-4 text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
}

// Redirect component for routes that should go to another path
function RedirectTo({ to }: { to: string }) {
  const [, navigate] = useLocation();
  
  useEffect(() => {
    navigate(to);
  }, [navigate, to]);
  
  return null;
}

function Router() {
  const [location, navigate] = useLocation();
  
  // Set up global navigation for the axios interceptor
  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);
  
  // Initialize session cookie check only when not on public routes
  useEffect(() => {
    // Skip session loading for public routes to improve performance
    if (PUBLIC_ROUTES.includes(location)) {
      logger.debug(`Skipping session initialization for public route: ${location}`);
      return;
    }
    
    // Only load session for protected routes
    const sessionId = loadSessionFromCookie();
    logger.debug(`Session initialization on page load: ${sessionId ? 'Session found' : 'No session'}`);
    
    // No additional session validation here - that will be handled by API middleware
  }, [location]);
  
  return (
    <LanguageProvider>
      <Switch>
        <Route path="/" component={Welcome} />
        <Route path="/welcome" component={Welcome} />
        <Route path="/instructions" component={Instructions} />
        <Route path="/organization-info" component={OrganizationInfo} />
        <Route path="/assessment/:categoryId" component={Assessment} />
        <Route path="/processing/:id?" component={Processing} />
        
        {/* Redirect /results without ID to welcome page */}
        <Route path="/results">{() => <RedirectTo to="/" />}</Route>
        
        <Route path="/results/:id" component={ResultsDashboard} />
        <Route path="/results-dashboard/:id" component={ResultsDashboard} />
        
        {/* New nested routes with UUID */}
        <Route path="/results/:id/maturity-analysis" component={MaturityAnalysis} />
        <Route path="/results/:id/trail-map" component={TrailMap} />
        <Route path="/results/:id/implementation-plan" component={ImplementationPlan} />
        <Route path="/results/:id/assessment-mindmap" component={AssessmentMindMap} />
        <Route path="/results/:id/review-responses" component={ReviewResponses} />
        
        <Route path="/assessment-mindmap" component={AssessmentMindMap} />
        <Route path="/ai-test" component={AITest} />
        <Route component={NotFound} />
      </Switch>
    </LanguageProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <TranslationLoader>
          <Router />
          <Toaster />
        </TranslationLoader>
      </SessionProvider>
    </QueryClientProvider>
  );
}

export default App;
