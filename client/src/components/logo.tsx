import React from "react";
import { brandingConfig } from "../config/branding";

interface LogoProps {
  variant?: "dark" | "light" | "navy" | "footer";
  className?: string;
}

/**
 * Logo component that uses the branding configuration.
 * 
 * The logo images are configured in /client/src/config/branding.ts
 * To customize, replace the logo files and update the branding config.
 */
export function Logo({ variant = "navy", className = "" }: LogoProps) {
  const { logo } = brandingConfig;
  
  // Determine which logo variant to use
  const isLightVariant = variant === "light";
  const logoSrc = isLightVariant ? logo.light : logo.dark;
  
  // Adjust dimensions based on variant
  const width = isLightVariant ? Math.round(logo.width * 0.85) : logo.width;
  const height = isLightVariant ? Math.round(logo.height * 0.85) : logo.height;
  
    return (
      <div className={`flex items-center ${className}`}>
      {isLightVariant ? (
          <img
          src={logoSrc}
          alt={logo.alt}
          width={width}
          height={height}
          />
        ) : (
        <div className="flex items-center" style={{ height: `${height}px` }}>
            <img
            src={logoSrc}
            alt={logo.alt}
            width={width}
            height={height}
            />
          </div>
        )}
      </div>
    );
}

export default Logo;
