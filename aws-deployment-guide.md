# AWS ECS Deployment Guide

This guide provides instructions for deploying a Docker container to AWS Elastic Container Service (ECS).

## Prerequisites

- An AWS account
- AWS CLI installed and properly configured
- Docker installed

## Scaling

The ECS service is configured to scale automatically based on CPU utilization. For configuration details, see the `aws-deployment-guide.md` file.

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

### Environment Variables

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

### 1. Create an ECR Repository

```bash
# Create ECR repository
aws ecr create-repository --repository-name ak-prd-assessment-tools --region ap-northeast-1
```

### 2. Build and Push the Image

```bash
# Set AWS account ID as an environment variable
export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

# Login to ECR
aws ecr get-login-password --region ap-northeast-1 | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.ap-northeast-1.amazonaws.com

# Build Docker image
docker build -t ak-prd-assessment-tools .

# Tag image for ECR repository
docker tag ak-prd-assessment-tools:latest ${AWS_ACCOUNT_ID}.dkr.ecr.ap-northeast-1.amazonaws.com/ak-prd-assessment-tools:latest

# Push image to ECR
docker push ${AWS_ACCOUNT_ID}.dkr.ecr.ap-northeast-1.amazonaws.com/ak-prd-assessment-tools:latest
```

### 3. Create an ECS Cluster

Create an ECS cluster using the AWS console or CLI.

```bash
aws ecs create-cluster --cluster-name ak-assessment-cluster
```

### 4. Create a Task Definition

Create a `task-definition.json` file:

```json
{
  "family": "ak-assessment-task",
  "networkMode": "awsvpc",
  "executionRoleArn": "arn:aws:iam::<AWS_ACCOUNT_ID>:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "ak-assessment-container",
      "image": "<AWS_ACCOUNT_ID>.dkr.ecr.ap-northeast-1.amazonaws.com/ak-prd-assessment-tools:latest",
      "essential": true,
      "portMappings": [
        {
          "containerPort": 5001,
          "hostPort": 5001,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ],
      "secrets": [
        {
          "name": "DATABASE_URL",
          "valueFrom": "arn:aws:ssm:ap-northeast-1:<AWS_ACCOUNT_ID>:parameter/ak-assessment/database-url"
        },
        {
          "name": "OPENAI_API_KEY",
          "valueFrom": "arn:aws:ssm:ap-northeast-1:<AWS_ACCOUNT_ID>:parameter/ak-assessment/openai-api-key"
        },
        {
          "name": "ANTHROPIC_API_KEY",
          "valueFrom": "arn:aws:ssm:ap-northeast-1:<AWS_ACCOUNT_ID>:parameter/ak-assessment/anthropic-api-key"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/ak-assessment-task",
          "awslogs-region": "ap-northeast-1",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "healthCheck": {
        "command": ["CMD-SHELL", "wget --quiet --tries=1 --spider http://localhost:5001/api/health || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3,
        "startPeriod": 30
      }
    }
  ],
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "1024",
  "memory": "2048"
}
```

Register the task definition:

```bash
aws ecs register-task-definition --cli-input-json file://task-definition.json
```

### 5. Create an ECS Service

```bash
aws ecs create-service \
  --cluster ak-assessment-cluster \
  --service-name ak-assessment-service \
  --task-definition ak-assessment-task \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxxxxxxx,subnet-yyyyyyyy],securityGroups=[sg-xxxxxxxx],assignPublicIp=ENABLED}" \
  --load-balancer "targetGroupArn=arn:aws:elasticloadbalancing:ap-northeast-1:<AWS_ACCOUNT_ID>:targetgroup/ak-assessment-target/xxxxxxxx,containerName=ak-assessment-container,containerPort=5001"
```

### 6. Create Systems Manager Parameters

Store secrets safely in AWS Systems Manager Parameter Store:

```bash
# Database URL
aws ssm put-parameter \
  --name "/ak-assessment/database-url" \
  --value "postgres://username:password@hostname:port/database" \
  --type SecureString \
  --key-id "alias/aws/ssm"

# OpenAI API Key
aws ssm put-parameter \
  --name "/ak-assessment/openai-api-key" \
  --value "sk-xxxxxxxx" \
  --type SecureString \
  --key-id "alias/aws/ssm"

# Anthropic API Key
aws ssm put-parameter \
  --name "/ak-assessment/anthropic-api-key" \
  --value "sk-ant-xxxxxxxx" \
  --type SecureString \
  --key-id "alias/aws/ssm"
```

## Operations

### Scaling Configuration

```bash
aws application-autoscaling register-scalable-target \
  --service-namespace ecs \
  --scalable-dimension ecs:service:DesiredCount \
  --resource-id service/ak-assessment-cluster/ak-assessment-service \
  --min-capacity 2 \
  --max-capacity 10

aws application-autoscaling put-scaling-policy \
  --service-namespace ecs \
  --scalable-dimension ecs:service:DesiredCount \
  --resource-id service/ak-assessment-cluster/ak-assessment-service \
  --policy-name cpu-tracking-scaling-policy \
  --policy-type TargetTrackingScaling \
  --target-tracking-scaling-policy-configuration file://scaling-policy.json
```

`scaling-policy.json`:

```json
{
  "TargetValue": 70.0,
  "PredefinedMetricSpecification": {
    "PredefinedMetricType": "ECSServiceAverageCPUUtilization"
  },
  "ScaleOutCooldown": 60,
  "ScaleInCooldown": 60
}
```

### Updating the Service

When deploying a new image:

```bash
# Build and push a new image
docker build -t ak-prd-assessment-tools .
docker tag ak-prd-assessment-tools:latest ${AWS_ACCOUNT_ID}.dkr.ecr.ap-northeast-1.amazonaws.com/ak-prd-assessment-tools:latest
docker push ${AWS_ACCOUNT_ID}.dkr.ecr.ap-northeast-1.amazonaws.com/ak-prd-assessment-tools:latest

# Update the service to deploy new tasks
aws ecs update-service --cluster ak-assessment-cluster --service ak-assessment-service --force-new-deployment
```
