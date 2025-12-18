# AK-PRD Assessment Tools - AWS ECS Deployment Guide

## Overview

This repository contains the source code for a Cloud Native Maturity Assessment Tool. This document explains the steps to run the application on AWS Elastic Container Service (ECS).

## Project Structure

- **Server-side**: Node.js + Express.js
- **Client-side**: React + TypeScript
- **Database**: PostgreSQL
- **AI Features**: OpenAI API and Anthropic API

## Docker Containerization

To run the application on AWS ECS, we've created the following files:

### 1. Dockerfile

```dockerfile
FROM node:20-alpine AS base

# Create a working directory for the application
WORKDIR /app

# Environment variables for installing dependencies
ENV NODE_ENV=production
ENV PORT=5001

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Command to run when container starts
CMD ["npm", "start"]

# Health check configuration
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 CMD wget --quiet --tries=1 --spider http://localhost:5001/api/health || exit 1

# Expose port
EXPOSE 5001
```

### 2. .dockerignore

Excludes unnecessary files from the build context to improve build speed and optimize image size.

### 3. Health Check Endpoint

Health check endpoint to add to the `server/routes.ts` file:

```typescript
// Health check endpoint for AWS ECS
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: app.get('env') || 'production'
  });
});
```

## Deployment Steps

For detailed deployment instructions, refer to the `aws-deployment-guide.md` file. The main steps are:

1. Create an ECR repository
2. Build and push Docker image
3. Create an ECS cluster
4. Create a task definition
5. Create an ECS service
6. Configure Systems Manager Parameters

## Environment Variables

The application requires the following environment variables:

- `DATABASE_URL`: PostgreSQL database connection string
- `OPENAI_API_KEY`: OpenAI API key (for AI features)
- `ANTHROPIC_API_KEY`: Anthropic API key (for AI features)
- `ALLOWED_ORIGINS`: Comma-separated list of allowed origins for CORS (e.g., `https://assessment.aokumo.io,https://app.aokumo.io`)

For production environments, it's recommended to store these variables securely in AWS Systems Manager Parameter Store.

### Security Configuration

The `ALLOWED_ORIGINS` environment variable is crucial for security:
- **Production**: Set to your production domain(s) like `https://assessment.aokumo.io`
- **Development**: Can include `http://localhost:5001,http://localhost:3000`
- **Default**: If not set, defaults to `http://localhost:5001` and `https://assessment.aokumo.io`

## Scaling

The ECS service is configured to scale automatically based on CPU utilization. For configuration details, see the `aws-deployment-guide.md` file.

# Cloud Native Maturity Assessment Tool

A comprehensive assessment tool for evaluating an organization's cloud native adoption maturity.

## Features

- Multiple assessment types (Quick, Standard, Comprehensive)
- Multi-language support (English, Japanese)
- Interactive questionnaires
- Detailed score breakdown by category
- Personalized recommendations based on assessment results
- Results persistence through S3

## Browser Support

The Cloud Native Maturity Assessment tool is designed to work on modern browsers. We recommend using the latest versions of:

- Chrome
- Firefox
- Safari
- Edge

The application requires JavaScript to be enabled and uses modern web features including:

- CSS Grid and Flexbox
- Local Storage for saving progress
- Fetch API for network requests

### Known Limitations

- Internet Explorer is not supported
- Legacy browsers may experience reduced functionality
- The application is responsive but optimized for desktop experience

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- AWS account (for S3 storage)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   ```
   cp .env.example .env
   ```
   Edit the `.env` file with your AWS credentials and other configuration.

4. Start the development server:
   ```
   npm run dev
   ```

## Deployment

1. Build the application:
   ```
   npm run build
   ```

2. Start the production server:
   ```
   npm start
   ```

## License

This project is licensed under the MIT License - see the LICENSE file for details.