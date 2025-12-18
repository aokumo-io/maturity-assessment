/**
 * ブラウザ検出と互換性チェックのユーティリティ
 * Browser detection and compatibility check utilities
 */

/**
 * サポートされているブラウザかどうかを確認する
 * Check if the current browser is supported
 * 
 * @returns {boolean} ブラウザがサポートされているかどうか
 */
export function isBrowserSupported(): boolean {
  const ua = navigator.userAgent;
  
  // Check for major modern browsers (latest 2 versions are supported)
  const isChrome = /Chrome\/(?!OPR|Edge)([\d.]+)/.test(ua);
  const isFirefox = /Firefox\/([\d.]+)/.test(ua);
  const isSafari = /Safari\/([\d.]+)/.test(ua) && !/Chrome/.test(ua);
  const isEdge = /Edg\/([\d.]+)/.test(ua);
  
  // Internet Explorer is explicitly not supported
  const isIE = /MSIE|Trident/.test(ua);
  if (isIE) return false;
  
  // Legacy Edge (EdgeHTML) has limited support
  const isLegacyEdge = /Edge\//.test(ua);
  if (isLegacyEdge) return false;
  
  // Check if at least one modern browser is detected
  const hasModernBrowser = isChrome || isFirefox || isSafari || isEdge;
  
  // Check for required features
  const hasRequiredFeatures = 
    // LocalStorage for saving progress
    typeof window.localStorage !== 'undefined' &&
    // Fetch API for network requests
    typeof window.fetch !== 'undefined' &&
    // Flexbox support
    CSS.supports('display', 'flex') &&
    // Grid support
    CSS.supports('display', 'grid');
  
  return hasModernBrowser && hasRequiredFeatures;
}

/**
 * 現在のブラウザ情報を取得する
 * Get the current browser information
 * 
 * @returns {string} ブラウザ名とバージョン
 */
export function getBrowserInfo(): string {
  const ua = navigator.userAgent;
  let browserName = "Unknown";
  let version = "Unknown";
  
  if (/Chrome\/(?!OPR|Edge)([\d.]+)/.test(ua)) {
    browserName = "Chrome";
    version = ua.match(/Chrome\/([\d.]+)/)?.[1] || "Unknown";
  } else if (/Firefox\/([\d.]+)/.test(ua)) {
    browserName = "Firefox";
    version = ua.match(/Firefox\/([\d.]+)/)?.[1] || "Unknown";
  } else if (/Safari\/([\d.]+)/.test(ua) && !/Chrome/.test(ua)) {
    browserName = "Safari";
    version = ua.match(/Safari\/([\d.]+)/)?.[1] || "Unknown";
  } else if (/Edg\/([\d.]+)/.test(ua)) {
    browserName = "Edge";
    version = ua.match(/Edg\/([\d.]+)/)?.[1] || "Unknown";
  } else if (/MSIE|Trident/.test(ua)) {
    browserName = "Internet Explorer";
    version = ua.match(/(?:MSIE |rv:)([\d.]+)/)?.[1] || "Unknown";
  }
  
  return `${browserName} ${version}`;
}

/**
 * サポートされていないブラウザに警告を表示する
 * Show a warning for unsupported browsers
 */
export function showBrowserWarning(): void {
  // Only show warning if the browser is not supported
  if (isBrowserSupported()) return;
  
  // Create a warning container
  const warningDiv = document.createElement('div');
  warningDiv.style.position = 'fixed';
  warningDiv.style.top = '0';
  warningDiv.style.left = '0';
  warningDiv.style.right = '0';
  warningDiv.style.padding = '12px 20px';
  warningDiv.style.backgroundColor = '#FFF3CD';
  warningDiv.style.color = '#856404';
  warningDiv.style.borderBottom = '1px solid #FFEEBA';
  warningDiv.style.zIndex = '9999';
  warningDiv.style.textAlign = 'center';
  warningDiv.style.fontSize = '14px';
  
  const browserInfo = getBrowserInfo();
  
  // Set warning message in both English and Japanese
  const lang = document.documentElement.lang || navigator.language || 'en';
  const isJapanese = lang.toLowerCase().startsWith('ja');
  
  if (isJapanese) {
    warningDiv.innerHTML = `
      <strong>互換性に関する警告:</strong> お使いのブラウザ (${browserInfo}) は完全にサポートされていません。
      最適な体験のために、最新バージョンの <a href="https://www.google.com/chrome/" style="color: #0056b3;">Chrome</a>、
      <a href="https://www.mozilla.org/firefox/" style="color: #0056b3;">Firefox</a>、
      <a href="https://www.apple.com/safari/" style="color: #0056b3;">Safari</a> または
      <a href="https://www.microsoft.com/edge/" style="color: #0056b3;">Edge</a> を使用することをお勧めします。
    `;
  } else {
    warningDiv.innerHTML = `
      <strong>Compatibility Warning:</strong> Your browser (${browserInfo}) is not fully supported.
      For the best experience, we recommend using the latest version of 
      <a href="https://www.google.com/chrome/" style="color: #0056b3;">Chrome</a>, 
      <a href="https://www.mozilla.org/firefox/" style="color: #0056b3;">Firefox</a>, 
      <a href="https://www.apple.com/safari/" style="color: #0056b3;">Safari</a> or 
      <a href="https://www.microsoft.com/edge/" style="color: #0056b3;">Edge</a>.
    `;
  }
  
  // Add close button
  const closeButton = document.createElement('button');
  closeButton.innerHTML = '×';
  closeButton.style.marginLeft = '10px';
  closeButton.style.backgroundColor = 'transparent';
  closeButton.style.border = 'none';
  closeButton.style.color = '#856404';
  closeButton.style.fontSize = '18px';
  closeButton.style.cursor = 'pointer';
  closeButton.style.verticalAlign = 'middle';
  closeButton.title = isJapanese ? '閉じる' : 'Close';
  
  closeButton.addEventListener('click', () => {
    document.body.removeChild(warningDiv);
    // Save preference to local storage if available
    try {
      localStorage.setItem('browser-warning-dismissed', 'true');
    } catch (e) {
      // Local storage not available, just remove the warning
    }
  });
  
  warningDiv.appendChild(closeButton);
  
  // Add the warning to the page
  if (document.body) {
    // Check if the warning was previously dismissed
    let warningDismissed = false;
    try {
      warningDismissed = localStorage.getItem('browser-warning-dismissed') === 'true';
    } catch (e) {
      // Local storage not available, proceed with showing warning
    }
    
    if (!warningDismissed) {
      document.body.appendChild(warningDiv);
    }
  } else {
    // If body is not yet available, wait for it
    window.addEventListener('DOMContentLoaded', () => {
      let warningDismissed = false;
      try {
        warningDismissed = localStorage.getItem('browser-warning-dismissed') === 'true';
      } catch (e) {
        // Local storage not available, proceed with showing warning
      }
      
      if (!warningDismissed) {
        document.body.appendChild(warningDiv);
      }
    });
  }
} 