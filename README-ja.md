# AK-PRD アセスメントツール - AWS ECS デプロイメントガイド

## 概要

このリポジトリには、クラウドネイティブ成熟度評価ツールのソースコードが含まれています。このドキュメントでは、アプリケーションをAWS Elastic Container Service (ECS)上で実行するための手順を説明します。

## プロジェクト構成

- **サーバーサイド**: Node.js + Express.js
- **クライアントサイド**: React + TypeScript
- **データベース**: PostgreSQL
- **AI機能**: OpenAI API および Anthropic API

## Dockerコンテナ化

アプリケーションをAWS ECS上で実行するために、以下のファイルを作成しました：

### 1. Dockerfile

```dockerfile
FROM node:20-alpine AS base

# アプリケーション用の作業ディレクトリを作成
WORKDIR /app

# 依存関係をインストールするための環境変数
ENV NODE_ENV=production
ENV PORT=5001

# パッケージファイルをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm ci --only=production

# ソースコードをコピー
COPY . .

# アプリケーションをビルド
RUN npm run build

# コンテナ起動時に実行するコマンド
CMD ["npm", "start"]

# ヘルスチェック設定
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 CMD wget --quiet --tries=1 --spider http://localhost:5001/api/health || exit 1

# ポートの公開
EXPOSE 5001
```

### 2. .dockerignore

ビルドコンテキストから不要なファイルを除外し、ビルド速度を向上させ、イメージサイズを最適化します。

### 3. ヘルスチェックエンドポイント

`server/routes.ts`ファイルに追加するヘルスチェックエンドポイント：

```typescript
// AWS ECS用のヘルスチェックエンドポイント
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: app.get('env') || 'production'
  });
});
```

## デプロイ手順

詳細なデプロイ手順については、`aws-deployment-guide.md`ファイルを参照してください。主な手順は以下の通りです：

1. ECRリポジトリの作成
2. Dockerイメージのビルドとプッシュ
3. ECSクラスタの作成
4. タスク定義の作成
5. ECSサービスの作成
6. Systems Manager Parameterの設定

## 環境変数

アプリケーションには以下の環境変数が必要です：

- `DATABASE_URL`: PostgreSQLデータベース接続文字列
- `OPENAI_API_KEY`: OpenAI APIキー（AI機能を使用する場合）
- `ANTHROPIC_API_KEY`: Anthropic APIキー（AI機能を使用する場合）

本番環境では、これらの変数をAWS Systems Manager Parameter Storeに安全に保存することをお勧めします。

## スケーリング

ECSサービスは、CPU使用率に基づいて自動的にスケールするように設定されています。設定の詳細については、`aws-deployment-guide.md`ファイルを参照してください。 