import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import { fileURLToPath } from 'url';
import path from "path";
import fs from 'fs/promises';

/**
 * Get the directory name equivalent to __dirname in ESM
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Logger helper to maintain consistent logging style
 */
const logger = {
  info: (message: string) => console.log(`[vite] 📝 ${message}`),
  success: (message: string) => console.log(`[vite] ✅ ${message}`),
  warn: (message: string) => console.warn(`[vite] ⚠️ ${message}`),
  error: (message: string, error?: unknown) => console.error(`[vite] ❌ ${message}`, error || '')
};

/**
 * Create a static asset copy plugin
 */
function createAssetCopyPlugin() {
  return {
    name: 'vite-plugin-asset-copy',
    apply: 'build' as const, // Only apply during build
    enforce: 'post' as const, // Run after bundle generation
    
    async writeBundle() {
      logger.info('Copying static assets to build output...');
      
      const outDir = path.resolve(__dirname, 'dist/public');
      const publicDir = path.resolve(__dirname, 'client/public');
      
      /**
       * Helper function to copy a directory recursively
       */
      async function copyDir(src: string, dest: string): Promise<void> {
        await fs.mkdir(dest, { recursive: true });
        
        try {
          const entries = await fs.readdir(src, { withFileTypes: true });
          
          for (const entry of entries) {
            const srcPath = path.join(src, entry.name);
            const destPath = path.join(dest, entry.name);
            
            if (entry.isDirectory()) {
              await copyDir(srcPath, destPath);
            } else {
              await fs.copyFile(srcPath, destPath);
            }
          }
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          logger.warn(`Failed to read or copy ${src}: ${errorMessage}`);
        }
      }
      
      // Define asset directories to copy
      const assetDirectories = [
        { src: 'favicon', dest: 'favicon' },
        { src: 'images', dest: 'images' },
        // Add more directories as needed
      ];
      
      // Process each asset directory
      for (const { src, dest } of assetDirectories) {
        const srcPath = path.join(publicDir, src);
        const destPath = path.join(outDir, dest);
        
        try {
          await copyDir(srcPath, destPath);
          logger.success(`Copied ${src} → ${dest}`);
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          logger.error(`Failed to copy ${src}: ${errorMessage}`);
        }
      }
      
      // Verify the copied files
      try {
        const files = await fs.readdir(outDir, { recursive: true });
        logger.info(`Build assets ready (${files.length} files processed)`);
      } catch (error) {
        logger.warn('Could not verify output directory contents');
      }
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // Core plugins
    react(),
    themePlugin(),
    
    // Asset handling
    createAssetCopyPlugin()
  ],
  
  // Path aliases for cleaner imports
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  
  // Server configuration
  server: {
    port: 3000,
    strictPort: true,
    host: true,
    open: false,
  },
  
  // Source directories
  root: path.resolve(__dirname, "client"),
  publicDir: path.resolve(__dirname, "client/public"),
  
  // Build options
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
    sourcemap: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  },
  
  // Optimization options
  optimizeDeps: {
    exclude: ['@replit/vite-plugin-shadcn-theme-json']
  }
});
