// Load environment variables from .env file
import * as dotenv from 'dotenv';
dotenv.config();

import express, { type Request, Response, NextFunction } from "express";
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { registerRoutes } from "./routes";
import { setupVite, serveStatic } from "./vite";
import { logger } from "./utils/logger";
import { handleApiError } from "./utils/errorHandler";
import path from "path";
import { fileURLToPath } from 'url'; 

// Get ESM equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define paths using absolute references for consistency
const ROOT_DIR = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const LOCALES_DIR = path.join(PUBLIC_DIR, 'locales');

const app = express();

// Security hardening - remove x-powered-by header
app.disable('x-powered-by');

// Helmet for security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // Vite dev needs unsafe-eval
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'", "data:", "https:", "https://fonts.gstatic.com"],
      connectSrc: ["'self'", "https:"],
      mediaSrc: ["'self'"],
      objectSrc: ["'none'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false, // Disable to avoid issues with external resources
}));

app.use(express.json({ limit: '10mb' })); // Add size limit
app.use(express.urlencoded({ extended: false, limit: '10mb' }));
app.use(cookieParser());

// Improved CORS middleware with environment-based configuration
app.use((req, res, next) => {
  const allowedOrigins = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:5001', 'https://assessment.aokumo.io'];
  
  const origin = req.headers.origin;
  
  // Allow requests with no origin (mobile apps, curl, etc.)
  if (!origin || allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin || '*');
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-CSRF-Token');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Helper function to set static asset headers
function setStaticAssetHeaders(allowedOrigins: string[]) {
  return (res: Response) => {
    // For OG images and favicons, we need to allow cross-origin access
    // Social media platforms (Facebook, Twitter, LinkedIn, etc.) need to fetch these resources
    // Setting Access-Control-Allow-Origin to '*' is required for OG images to work properly
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin'); // Allow cross-origin embedding
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
    
    // Add security headers for static assets
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  };
}

// Express middleware for handling static assets
// Use the path constants we defined for consistency
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5001', 'https://assessment.aokumo.io'];

// Log the configured origins for debugging
logger.info(`CORS configured for origins: ${allowedOrigins.join(', ')}`);

app.use('/locales', express.static(LOCALES_DIR));
// Favicon and images need special CORS headers for OG meta tags and social media sharing
app.use('/favicon', express.static(path.join(PUBLIC_DIR, 'favicon'), {
  setHeaders: setStaticAssetHeaders(allowedOrigins)
}));
app.use('/images', express.static(path.join(PUBLIC_DIR, 'images'), {
  setHeaders: setStaticAssetHeaders(allowedOrigins)
}));
app.use('/assets', express.static(path.join(PUBLIC_DIR, 'assets')));

// Custom logging middleware with request sanitization
app.use((req, res, next) => {
  if (req.url && !req.url.includes('/health') && !req.url.endsWith('.js')) {
    // Sanitize request data for logging
    const sanitizedBody = sanitizeLogData(req.body);
    logger.debug(`${req.method} ${req.url}${sanitizedBody ? ` - Body: ${sanitizedBody}` : ''}`);
  }
  next();
});

// Request sanitization helper function
function sanitizeLogData(data: any): string {
  if (!data || Object.keys(data).length === 0) return '';
  
  const sensitiveFields = [
    'password', 'token', 'secret', 'key', 'auth', 'credential', 
    'sessionId', 'csrf', 'email', 'phone', 'contactEmail'
  ];
  
  try {
    const sanitized = JSON.stringify(data, (key, value) => {
      const lowercaseKey = key.toLowerCase();
      return sensitiveFields.some(field => lowercaseKey.includes(field)) 
        ? '[REDACTED]' : value;
    });
    return sanitized.length > 500 ? sanitized.substring(0, 500) + '...[TRUNCATED]' : sanitized;
  } catch (error) {
    return '[UNPARSEABLE_DATA]';
  }
}

// Global routes
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

(async () => {
  try {
    // Register API routes - MUST come before static file handling
    const server = await registerRoutes(app);

    // Global error handler middleware
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      logger.error("Unhandled error in request:", err);
      handleApiError(res, err);
    });

    // Setup environment-specific middleware
    if (app.get("env") === "development") {
      // In development mode, use Vite's middleware for HMR
      await setupVite(app, server);
      logger.info("Development mode: Vite middleware enabled for HMR");
      
      // Remove any duplicate locales middleware here
      // The single source of truth is already set up above
    } else {
      // In production mode, serve static files and add SPA fallback
      logger.info("Production mode: Registering SPA fallback route after API routes");
      serveStatic(app);
    }

    // Server configuration
    const port = process.env.PORT || 5001;
    // Read HOST from environment variable, default to '0.0.0.0' for production
    const host = process.env.HOST || '0.0.0.0';
    
    const listenOptions: any = {
      port,
      host,
    };
    
    // reusePort is only supported on Linux/Docker (not macOS), enable in production
    if (process.env.NODE_ENV === 'production' && process.platform !== 'darwin') {
      listenOptions.reusePort = true;
    }
    
    server.listen(listenOptions, () => {
      logger.info(`Server started and listening on ${host}:${port}`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
})();