import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Import browser detection utility
import { showBrowserWarning } from "./utils/browser-detection";

// Import i18n config (must come before the app import)
import "./lib/i18n";

// Import Google Analytics
import { initializeAnalytics } from "./lib/analytics";

// Import Remix Icon for consistent icons used in the design
import "remixicon/fonts/remixicon.css";

// Import fonts - using only Japanese subset for Noto Sans JP to reduce HTTP requests
import "@fontsource/inter/400.css"; // Regular weight for Latin text
import "@fontsource/inter/700.css"; // Bold weight for Latin text
import "@fontsource/noto-sans-jp/japanese-400.css"; // Japanese subset only - regular weight
import "@fontsource/noto-sans-jp/japanese-700.css"; // Japanese subset only - bold weight

// Initialize Google Analytics if tracking ID is provided
const googleAnalyticsId = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;
if (googleAnalyticsId) {
  initializeAnalytics(googleAnalyticsId, {
    debug: import.meta.env.DEV,
    testMode: import.meta.env.DEV
  });
}

// Show a warning if the browser isn't fully supported
showBrowserWarning();

createRoot(document.getElementById("root")!).render(<App />);
