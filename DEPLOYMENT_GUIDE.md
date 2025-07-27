# PromptMaster Deployment Guide

## Overview
This guide covers deployment strategies for the PromptMaster application, from MVP static hosting to production-ready infrastructure.

## Table of Contents
1. [MVP Deployment (Static Hosting)](#mvp-deployment-static-hosting)
2. [Production Deployment](#production-deployment)
3. [CI/CD Pipeline](#cicd-pipeline)
4. [Environment Configuration](#environment-configuration)
5. [Monitoring and Maintenance](#monitoring-and-maintenance)

## MVP Deployment (Static Hosting)

### Option 1: Vercel Deployment

#### Prerequisites
- Vercel account
- GitHub repository
- Environment variables ready

#### Steps

1. **Prepare the Project**
```bash
# Build the project locally first to test
npm run build

# Test the production build
npm run preview
```

2. **Connect to Vercel**
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

3. **Configure Environment Variables**
In Vercel Dashboard:
- Go to Project Settings → Environment Variables
- Add:
  - `VITE_GEMINI_API_KEY`
  - `VITE_APP_ENV` (set to 'production')

4. **Custom Domain Setup**
```
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed
```

### Option 2: Netlify Deployment

#### Steps

1. **Build Configuration**
Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

2. **Deploy via CLI**
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

3. **Environment Variables**
- Set in Netlify Dashboard → Site Settings → Environment Variables

### Option 3: AWS S3 + CloudFront

#### Infrastructure Setup

1. **Create S3 Bucket**
```bash
# Create bucket
aws s3 mb s3://promptmaster-frontend-prod

# Enable static website hosting
aws s3 website s3://promptmaster-frontend-prod \
  --index-document index.html \
  --error-document index.html
```

2. **Bucket Policy**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::promptmaster-frontend-prod/*"
    }
  ]
}
```

3. **CloudFront Distribution**
```bash
# Create distribution with S3 origin
aws cloudfront create-distribution \
  --distribution-config file://cloudfront-config.json
```

4. **Deployment Script**
```bash
#!/bin/bash
# deploy.sh

# Build the project
npm run build

# Sync to S3
aws s3 sync dist/ s3://promptmaster-frontend-prod \
  --delete \
  --cache-control "public, max-age=31536000" \
  --exclude "index.html" \
  --exclude "*.json"

# Upload index.html with no-cache
aws s3 cp dist/index.html s3://promptmaster-frontend-prod/ \
  --cache-control "no-cache, no-store, must-revalidate"

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

## Production Deployment

### Architecture Overview

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   CloudFront    │────▶│   ALB           │────▶│   ECS Fargate   │
│   (CDN)         │     │   (Load Bal)    │     │   (Containers)  │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                          │
                              ┌───────────────────────────┴────────┐
                              │                                    │
                        ┌─────▼─────┐                    ┌────────▼────────┐
                        │   RDS     │                    │   ElastiCache   │
                        │ PostgreSQL│                    │    (Redis)      │
                        └───────────┘                    └─────────────────┘
```

### Docker Configuration

1. **Frontend Dockerfile**
```dockerfile
# Dockerfile.frontend
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

2. **Nginx Configuration**
```nginx
# nginx.conf
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Don't cache index.html
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

### AWS ECS Deployment

1. **Task Definition**
```json
{
  "family": "promptmaster-frontend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "containerDefinitions": [
    {
      "name": "frontend",
      "image": "YOUR_ECR_REPO/promptmaster-frontend:latest",
      "portMappings": [
        {
          "containerPort": 80,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "VITE_APP_ENV",
          "value": "production"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/promptmaster-frontend",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

2. **Service Configuration**
```yaml
# ecs-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: promptmaster-frontend
spec:
  launchType: FARGATE
  taskDefinition: promptmaster-frontend
  desiredCount: 2
  deploymentConfiguration:
    maximumPercent: 200
    minimumHealthyPercent: 100
  networkConfiguration:
    awsvpcConfiguration:
      subnets:
        - subnet-xxx
        - subnet-yyy
      securityGroups:
        - sg-frontend
      assignPublicIp: ENABLED
  loadBalancers:
    - targetGroupArn: arn:aws:elasticloadbalancing:...
      containerName: frontend
      containerPort: 80
```

## CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  AWS_REGION: us-east-1
  ECR_REPOSITORY: promptmaster-frontend

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Run linter
        run: npm run lint
      
      - name: Build application
        run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}
      
      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v1
      
      - name: Build and push Docker image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG -f Dockerfile.frontend .
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
          docker tag $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG $ECR_REGISTRY/$ECR_REPOSITORY:latest
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:latest
      
      - name: Update ECS service
        run: |
          aws ecs update-service \
            --cluster promptmaster-cluster \
            --service promptmaster-frontend \
            --force-new-deployment
```

### GitLab CI/CD

```yaml
# .gitlab-ci.yml
stages:
  - test
  - build
  - deploy

variables:
  DOCKER_DRIVER: overlay2
  DOCKER_TLS_CERTDIR: ""

test:
  stage: test
  image: node:18-alpine
  script:
    - npm ci
    - npm run lint
    - npm test
  cache:
    paths:
      - node_modules/

build:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker build -t promptmaster-frontend .
    - docker tag promptmaster-frontend $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
  only:
    - main

deploy:
  stage: deploy
  image: alpine:latest
  script:
    - apk add --no-cache curl
    - curl -X POST $DEPLOY_WEBHOOK_URL
  only:
    - main
```

## Environment Configuration

### Environment Variables Management

1. **Development (.env.local)**
```env
VITE_GEMINI_API_KEY=your_dev_api_key
VITE_APP_ENV=development
VITE_API_URL=http://localhost:3001
VITE_ENABLE_ANALYTICS=false
```

2. **Staging (.env.staging)**
```env
VITE_GEMINI_API_KEY=your_staging_api_key
VITE_APP_ENV=staging
VITE_API_URL=https://api-staging.promptmaster.com
VITE_ENABLE_ANALYTICS=true
```

3. **Production (.env.production)**
```env
VITE_GEMINI_API_KEY=your_prod_api_key
VITE_APP_ENV=production
VITE_API_URL=https://api.promptmaster.com
VITE_ENABLE_ANALYTICS=true
```

### Secrets Management

1. **AWS Secrets Manager**
```javascript
// utils/secrets.js
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

const client = new SecretsManagerClient({ region: "us-east-1" });

export async function getSecret(secretName) {
  try {
    const response = await client.send(
      new GetSecretValueCommand({ SecretId: secretName })
    );
    return JSON.parse(response.SecretString);
  } catch (error) {
    console.error("Error retrieving secret:", error);
    throw error;
  }
}
```

2. **HashiCorp Vault Integration**
```javascript
// config/vault.js
const vault = require('node-vault')({
  endpoint: process.env.VAULT_ADDR,
  token: process.env.VAULT_TOKEN
});

export async function getVaultSecret(path) {
  const { data } = await vault.read(path);
  return data;
}
```

## Monitoring and Maintenance

### Application Monitoring

1. **Frontend Error Tracking (Sentry)**
```javascript
// main.jsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.VITE_APP_ENV,
  tracesSampleRate: 1.0,
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay()
  ]
});
```

2. **Performance Monitoring**
```javascript
// utils/performance.js
export function trackWebVitals() {
  if ('web-vital' in window) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(sendToAnalytics);
      getFID(sendToAnalytics);
      getFCP(sendToAnalytics);
      getLCP(sendToAnalytics);
      getTTFB(sendToAnalytics);
    });
  }
}

function sendToAnalytics(metric) {
  // Send to your analytics endpoint
  fetch('/api/analytics', {
    method: 'POST',
    body: JSON.stringify(metric),
    headers: { 'Content-Type': 'application/json' }
  });
}
```

### Health Checks

1. **Application Health Endpoint**
```javascript
// For future backend
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.APP_VERSION,
    checks: {
      database: checkDatabase(),
      cache: checkRedis(),
      gemini: checkGeminiAPI()
    }
  });
});
```

2. **CloudWatch Alarms**
```yaml
# cloudformation/alarms.yaml
HighErrorRate:
  Type: AWS::CloudWatch::Alarm
  Properties:
    AlarmName: PromptMaster-HighErrorRate
    MetricName: 4XXError
    Namespace: AWS/ApplicationELB
    Statistic: Sum
    Period: 300
    EvaluationPeriods: 2
    Threshold: 10
    ComparisonOperator: GreaterThanThreshold
    AlarmActions:
      - !Ref SNSTopic
```

### Backup and Disaster Recovery

1. **Database Backups**
```bash
# Automated RDS backups
aws rds modify-db-instance \
  --db-instance-identifier promptmaster-prod \
  --backup-retention-period 30 \
  --preferred-backup-window "03:00-04:00"
```

2. **Application State Backup**
```javascript
// Periodic localStorage backup
function backupUserProgress() {
  const progress = localStorage.getItem('promptmaster_progress');
  if (progress) {
    fetch('/api/backup/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: progress
    });
  }
}
```

## Rollback Procedures

### Quick Rollback Strategy

1. **Vercel/Netlify**
   - Use deployment history in dashboard
   - One-click rollback to previous version

2. **AWS ECS**
```bash
# Rollback to previous task definition
aws ecs update-service \
  --cluster promptmaster-cluster \
  --service promptmaster-frontend \
  --task-definition promptmaster-frontend:PREVIOUS_VERSION
```

3. **Emergency Response**
```bash
# Quick revert script
#!/bin/bash
PREVIOUS_VERSION=$1
aws ecs update-service \
  --cluster promptmaster-cluster \
  --service promptmaster-frontend \
  --task-definition promptmaster-frontend:$PREVIOUS_VERSION \
  --force-new-deployment

# Invalidate CDN
aws cloudfront create-invalidation \
  --distribution-id $DISTRIBUTION_ID \
  --paths "/*"
```

## Cost Optimization

### MVP Cost Estimates
- **Vercel/Netlify Free Tier**: $0/month
- **AWS S3 + CloudFront**: ~$5-10/month

### Production Cost Estimates
- **AWS ECS Fargate**: ~$20-50/month
- **RDS PostgreSQL**: ~$15-30/month
- **CloudFront CDN**: ~$10-20/month
- **Total**: ~$45-100/month

### Cost Optimization Tips
1. Use CloudFront caching aggressively
2. Enable S3 lifecycle policies
3. Use Fargate Spot for non-critical environments
4. Implement request throttling
5. Monitor and optimize Gemini API usage

This deployment guide provides comprehensive instructions for deploying PromptMaster from MVP to production scale.