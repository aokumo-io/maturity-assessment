import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { addCsrfTokenToHeaders, extractAndSaveCsrfToken } from "./csrf-service";
import { logger } from "./logger";

// Simple circuit breaker to prevent infinite API request loops
let networkErrorCount = 0;
let lastErrorTime = 0;
const MAX_CONSECUTIVE_ERRORS = 5;
const ERROR_COOLDOWN_MS = 5000; // 5 seconds between retries after hitting max errors

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}: ${await res.text()}`);
  }
}

export async function apiRequest(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  data?: unknown | undefined,
  customHeaders?: Record<string, string>
): Promise<Response> {
  // If we've hit too many consecutive errors, block requests temporarily
  if (networkErrorCount >= MAX_CONSECUTIVE_ERRORS) {
    const now = Date.now();
    const timeSinceLastError = now - lastErrorTime;
    
    // Only allow new requests after the cooldown period
    if (timeSinceLastError < ERROR_COOLDOWN_MS) {
      logger.warn('Request blocked by circuit breaker - too many failures');
      throw new Error('サーバーに接続できません。時間をおいてもう一度お試しください。');
    }
    
    // Reset counter after cooldown
    networkErrorCount = 0;
  }

  // Prepare headers
  const headers: Record<string, string> = {
    ...customHeaders // Add custom headers first so they can be overridden
  };
  
  if (data) {
    headers["Content-Type"] = "application/json";
  }
  
  // Add CSRF token for mutating requests
  addCsrfTokenToHeaders(method, headers);

  try {
    const res = await fetch(url, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include", // Always include credentials
    });
  
    // Success - reset error counter
    networkErrorCount = 0;

    // Extract CSRF token from all requests that might contain one
    // This includes GET requests with csrfTokenGenerator middleware
    extractAndSaveCsrfToken(res.headers);
  
    await throwIfResNotOk(res);
    return res;
  } catch (error) {
    // Network error (fetch failed, likely server down)
    if (error instanceof TypeError && error.message.includes('fetch')) {
      networkErrorCount++;
      lastErrorTime = Date.now();
      
      logger.error(`Network error (${networkErrorCount}/${MAX_CONSECUTIVE_ERRORS}):`, 
        error.message || 'Server unreachable');
      
      // If we've reached the maximum errors, log a warning
      if (networkErrorCount >= MAX_CONSECUTIVE_ERRORS) {
        logger.warn(`Too many consecutive network errors. Pausing requests for ${ERROR_COOLDOWN_MS/1000}s`);
      }
    }
    
    throw error;
  }
}

export const getQueryFn: <T>(options: {
  on401: "returnNull" | "throwError";
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    try {
      // If we've hit too many consecutive errors, block requests temporarily
      if (networkErrorCount >= MAX_CONSECUTIVE_ERRORS) {
        const now = Date.now();
        const timeSinceLastError = now - lastErrorTime;
        
        // Only allow new requests after the cooldown period
        if (timeSinceLastError < ERROR_COOLDOWN_MS) {
          logger.warn('Query blocked by circuit breaker - too many failures');
          throw new Error('サーバーに接続できません。時間をおいてもう一度お試しください。');
        }
        
        // Reset counter after cooldown
        networkErrorCount = 0;
      }
    
      // Prepare headers for GET request
      const headers: Record<string, string> = {};
      
      const res = await fetch(queryKey[0] as string, {
        headers,
        credentials: "include", // Always include credentials
      });
      
      // Success - reset error counter
      networkErrorCount = 0;
  
      // Extract CSRF token from GET responses that include csrfTokenGenerator middleware
      // This is critical for endpoints like /api/assessment/current and /api/assessment/organization
      extractAndSaveCsrfToken(res.headers);
      
      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        logger.debug(`API request ${queryKey[0]} returned 401, returning null as configured`);
        return null;
      }
  
      await throwIfResNotOk(res);
      return res.json();
    } catch (error) {
      // Network error (fetch failed, likely server down)
      if (error instanceof TypeError && error.message.includes('fetch')) {
        networkErrorCount++;
        lastErrorTime = Date.now();
        
        logger.error(`Network error (${networkErrorCount}/${MAX_CONSECUTIVE_ERRORS}):`, 
          error.message || 'Server unreachable');
        
        // If we've reached the maximum errors, log a warning
        if (networkErrorCount >= MAX_CONSECUTIVE_ERRORS) {
          logger.warn(`Too many consecutive network errors. Pausing requests for ${ERROR_COOLDOWN_MS/1000}s`);
        }
      }
      
      throw error;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      queryFn: getQueryFn({ on401: "throwError" }),
      retry: (failureCount, error) => {
        // Don't retry if we've hit circuit breaker threshold
        if (networkErrorCount >= MAX_CONSECUTIVE_ERRORS) {
          return false;
        }
        
        // Only retry network errors up to 2 times
        if (error instanceof TypeError && error.message.includes('fetch')) {
          return failureCount < 2;
        }
        
        // Don't retry auth errors
        if (error instanceof Error && error.message.includes('401')) {
          return false;
        }
        
        // Default
        return failureCount < 1;
      },
    },
  },
});
