/**
 * 環境変数を直接.envファイルから読み込むためのユーティリティ
 */
import fs from 'fs';
import path from 'path';

export function readEnvFile(filePath: string = '.env'): Record<string, string> {
  try {
    // ファイルの絶対パスを取得
    const envPath = path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath);
    
    // ファイルが存在するか確認
    if (!fs.existsSync(envPath)) {
      return {};
    }
    
    // ファイルを読み込む
    const content = fs.readFileSync(envPath, 'utf8');
    
    // 解析結果を保存するオブジェクト
    const envVars: Record<string, string> = {};
    
    // 行ごとに処理
    const lines = content.split('\n');
    let currentKey = '';
    let currentValue = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // コメントや空行はスキップ
      if (!line || line.startsWith('#')) {
        continue;
      }
      
      // キーと値のペアを検出（key=value形式）
      const match = line.match(/^([^=]+)=(.*)$/);
      
      if (match) {
        // 前の変数が処理中だった場合、保存
        if (currentKey && currentValue) {
          envVars[currentKey] = currentValue;
          currentKey = '';
          currentValue = '';
        }
        
        // 新しいキーと値を取得
        currentKey = match[1].trim();
        currentValue = match[2];
      } else if (currentKey) {
        // 複数行の値の場合、追加
        currentValue += line;
      }
    }
    
    // 最後の変数を保存
    if (currentKey && currentValue) {
      envVars[currentKey] = currentValue;
    }
    
    return envVars;
  } catch (error) {
    return {};
  }
}

/**
 * APIキーを取得
 * 優先順位:
 * 1. プロセス環境変数 (dotenv等によって読み込まれたもの)
 * 2. 直接.envファイルから読み込んだ値
 */
export function getApiKey(name: string): string {
  // 優先的にprocess.envから取得（dotenvによって既に読み込まれている場合）
  const processEnvValue = process.env[name];
  if (processEnvValue) {
    return processEnvValue.replace(/[\s\n\r]+/g, '');
  }
  
  // process.envになければ、直接.envファイルから読み込む
  const envFileVars = readEnvFile();
  const fileValue = envFileVars[name] || '';
  
  // 値があれば、空白文字を削除して返す
  if (fileValue) {
    return fileValue.replace(/[\s\n\r]+/g, '');
  }
  
  return '';
} 