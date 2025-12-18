/**
 * Branding Configuration
 * 
 * This file centralizes all branding-related settings for the application.
 * Customize these values to white-label the assessment tool for your organization.
 * 
 * To customize:
 * 1. Replace logo files in /client/public/images/
 * 2. Update the values below to match your brand
 * 3. Optionally update CSS variables in index.css for colors
 */

export interface BrandingConfig {
  // Organization name
  name: string;
  
  // Logo configuration
  logo: {
    // Path to light variant logo (for dark backgrounds)
    light: string;
    // Path to dark/navy variant logo (for light backgrounds)
    dark: string;
    // Alt text for accessibility
    alt: string;
    // Logo dimensions
    width: number;
    height: number;
  };
  
  // Copyright text (use {year} placeholder for current year)
  copyright: string;
  
  // Support/contact email
  supportEmail: string;
  
  // Website URL (optional)
  website?: string;
  
  // Social media handles (optional)
  social?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
  
  // Colors (these override CSS variables)
  colors: {
    // Primary brand color (used for buttons, accents)
    primary: string;
    // Primary hover state
    primaryHover: string;
    // Secondary brand color
    secondary: string;
    // Secondary hover state
    secondaryHover: string;
    // Call-to-action color
    cta: string;
    // CTA hover state
    ctaHover: string;
  };
}

/**
 * Default branding configuration
 * 
 * To customize for your organization:
 * 1. Create a new config object with your branding
 * 2. Export it as `brandingConfig`
 * 
 * Example for custom branding:
 * ```
 * export const brandingConfig: BrandingConfig = {
 *   name: "Your Company",
 *   logo: {
 *     light: "/images/your-logo-light.svg",
 *     dark: "/images/your-logo-dark.svg",
 *     alt: "Your Company Logo",
 *     width: 150,
 *     height: 40,
 *   },
 *   copyright: "© {year} Your Company. All rights reserved.",
 *   supportEmail: "support@yourcompany.com",
 *   colors: {
 *     primary: "#your-primary-color",
 *     primaryHover: "#your-primary-hover",
 *     secondary: "#your-secondary-color",
 *     secondaryHover: "#your-secondary-hover",
 *     cta: "#your-cta-color",
 *     ctaHover: "#your-cta-hover",
 *   },
 * };
 * ```
 */
export const brandingConfig: BrandingConfig = {
  name: "Aokumo",
  
  logo: {
    light: "/images/aokumo-logo-light.svg",
    dark: "/images/aokumo-logo-navy.svg",
    alt: "Aokumo Logo",
    width: 200,
    height: 60,
  },
  
  copyright: "© {year} Aokumo Inc. All rights reserved.",
  
  supportEmail: "opensource@aokumo.io",
  
  website: "https://aokumo.io",
  
  social: {
    github: "aokumo",
  },
  
  colors: {
    primary: "#294364",      // Navy Blue
    primaryHover: "#213650", // Darker Navy
    secondary: "#22A3F1",    // Blue
    secondaryHover: "#0D89D7", // Darker Blue
    cta: "#FF8015",          // Orange
    ctaHover: "#E66700",     // Darker Orange
  },
};

/**
 * Get the copyright text with the current year
 */
export function getCopyrightText(): string {
  const year = new Date().getFullYear();
  return brandingConfig.copyright.replace("{year}", year.toString());
}

/**
 * Get the organization name
 */
export function getOrganizationName(): string {
  return brandingConfig.name;
}

/**
 * Apply branding colors to CSS variables
 * Call this in your app initialization
 */
export function applyBrandingColors(): void {
  const root = document.documentElement;
  const { colors } = brandingConfig;
  
  root.style.setProperty("--brand-primary", colors.primary);
  root.style.setProperty("--brand-primary-hover", colors.primaryHover);
  root.style.setProperty("--brand-secondary", colors.secondary);
  root.style.setProperty("--brand-secondary-hover", colors.secondaryHover);
  root.style.setProperty("--brand-cta", colors.cta);
  root.style.setProperty("--brand-cta-hover", colors.ctaHover);
}

export default brandingConfig;

