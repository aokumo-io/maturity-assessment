#!/usr/bin/env node

/**
 * URL Status Checker Script
 * 
 * ファイル内のURLをチェックして、ステータスコードを報告するスクリプト
 * 
 * Usage: node scripts/check-urls.js <file-path>
 * Example: node scripts/check-urls.js server/knowledge/container_infrastructure.ts
 */

const fs = require('fs');
const https = require('https');
const http = require('http');
const { URL } = require('url');

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bright: '\x1b[1m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  header: (msg) => console.log(`\n${colors.cyan}${colors.bright}${msg}${colors.reset}`)
};

/**
 * ファイルからURLを抽出する関数
 * @param {string} content - ファイルの内容
 * @returns {string[]} - 見つかったURLの配列
 */
function extractUrls(content) {
  // More comprehensive URL regex that handles various formats
  const urlRegex = /https?:\/\/[^\s"'`)\],}]+/g;
  const urls = content.match(urlRegex) || [];
  
  // Clean URLs (remove trailing punctuation, quotes, etc.)
  return [...new Set(urls.map(url => {
    return url
      .replace(/[.,;:!?"'`)\]}]+$/, '') // Remove trailing punctuation
      .replace(/\/+$/, ''); // Remove trailing slashes
  }))];
}

/**
 * URLのステータスをチェックする関数
 * @param {string} url - チェックするURL
 * @returns {Promise<{url: string, status: number, ok: boolean, error?: string}>}
 */
function checkUrl(url) {
  return new Promise((resolve) => {
    try {
      const urlObj = new URL(url);
      const client = urlObj.protocol === 'https:' ? https : http;
      
      const options = {
        hostname: urlObj.hostname,
        port: urlObj.port,
        path: urlObj.pathname + urlObj.search,
        method: 'HEAD',
        timeout: 20000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        }
      };

      const req = client.request(options, (res) => {
        resolve({
          url,
          status: res.statusCode,
          ok: res.statusCode >= 200 && res.statusCode < 400
        });
      });

      req.on('error', (error) => {
        resolve({
          url,
          status: 0,
          ok: false,
          error: error.message
        });
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({
          url,
          status: 0,
          ok: false,
          error: 'Request timeout'
        });
      });

      req.end();
    } catch (error) {
      resolve({
        url,
        status: 0,
        ok: false,
        error: error.message
      });
    }
  });
}

/**
 * メイン関数
 */
async function main() {
  const filePath = process.argv[2];
  
  if (!filePath) {
    log.error('Usage: node scripts/check-urls.js <file-path>');
    log.info('Example: node scripts/check-urls.js server/knowledge/container_infrastructure.ts');
    process.exit(1);
  }

  if (!fs.existsSync(filePath)) {
    log.error(`File not found: ${filePath}`);
    process.exit(1);
  }

  log.header(`🔍 Checking URLs in: ${filePath}`);

  try {
    // Read file content
    const content = fs.readFileSync(filePath, 'utf8');
    const urls = extractUrls(content);

    if (urls.length === 0) {
      log.warning('No URLs found in the file');
      return;
    }

    log.info(`Found ${urls.length} URLs to check...`);
    console.log('');

    // Check URLs
    const results = [];
    let checked = 0;

    for (const url of urls) {
      process.stdout.write(`\rChecking... ${++checked}/${urls.length}`);
      const result = await checkUrl(url);
      results.push(result);
    }

    console.log('\n');

    // Sort results: broken URLs first
    results.sort((a, b) => {
      if (a.ok && !b.ok) return 1;
      if (!a.ok && b.ok) return -1;
      return a.url.localeCompare(b.url);
    });

    // Display results
    let brokenCount = 0;
    let workingCount = 0;

    log.header('📊 URL Status Results:');

    results.forEach(({ url, status, ok, error }) => {
      if (ok) {
        log.success(`${status} - ${url}`);
        workingCount++;
      } else {
        if (error) {
          log.error(`ERROR (${error}) - ${url}`);
        } else {
          log.error(`${status} - ${url}`);
        }
        brokenCount++;
      }
    });

    // Summary
    console.log('');
    log.header('📈 Summary:');
    log.success(`Working URLs: ${workingCount}`);
    log.error(`Broken URLs: ${brokenCount}`);
    
    if (brokenCount > 0) {
      console.log(`\n${colors.yellow}${colors.bright}⚠ Found ${brokenCount} broken URLs that need attention${colors.reset}`);
      process.exit(1);
    } else {
      console.log(`\n${colors.green}${colors.bright}🎉 All URLs are working!${colors.reset}`);
    }

  } catch (error) {
    log.error(`Error reading file: ${error.message}`);
    process.exit(1);
  }
}

// Run the script
main().catch(error => {
  log.error(`Unexpected error: ${error.message}`);
  process.exit(1);
}); 