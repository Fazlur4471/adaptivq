# Jenkins Setup for AdaptivQ

## Prerequisites

### 1. Jenkins Installation
- Jenkins 2.400+ with Blue Ocean plugin
- Docker plugin
- Kubernetes plugin
- AWS plugins (EC2, ECR, EKS)
- Pipeline plugin

### 2. Required Credentials

Configure these credentials in Jenkins:

#### AWS Credentials
- **Credential ID**: `aws-credentials`
- **Type**: AWS Credentials
- **Access Key ID**: Your AWS Access Key
- **Secret Access Key**: Your AWS Secret Key

#### AWS Account ID
- **Credential ID**: `aws-account-id`
- **Type**: Secret text
- **Secret**: Your AWS Account ID (12 digits)

#### ECR Credentials
- **Credential ID**: `ecr-credentials`
- **Type**: Username with password
- **Username**: AWS
- **Password**: Generated via `aws ecr get-login-password`

#### Gemini API Key
- **Credential ID**: `gemini-api-key`
- **Type**: Secret text
- **Secret**: Your Gemini API key

#### GitHub Credentials
- **Credential ID**: `github-credentials`
- **Type**: Username with password or SSH key
- **Username/Key**: Your GitHub credentials

### 3. Jenkins Configuration

#### System Configuration
1. Go to `Manage Jenkins` → `Configure System`
2. Configure:
   - AWS Region: `us-east-1`
   - Docker registry: ECR
   - Kubernetes cluster connection

#### Global Tool Configuration
1. Go to `Manage Jenkins` → `Global Tool Configuration`
2. Configure:
   - Node.js: v18.x
   - Python: 3.11+
   - Docker: Latest
   - kubectl: v1.28+

## Pipeline Setup

### 1. Create New Pipeline Job

```groovy
// In Jenkins UI:
1. New Item → Pipeline
2. Name: adaptivq-pipeline
3. Pipeline script from SCM
4. SCM: Git
5. Repository URL: your-repo-url
6. Script Path: Jenkinsfile
```

### 2. Configure Webhooks

#### GitHub Webhook
```bash
# Add webhook in GitHub repository settings:
Payload URL: http://your-jenkins-url/github-webhook/
Content type: application/json
Events: Push, Pull Request
```

### 3. Multi-Branch Pipeline (Recommended)

```groovy
// Create Multi-Branch Pipeline:
1. New Item → Multibranch Pipeline
2. Branch Sources → Add source → Git/GitHub
3. Configure branch discovery strategies
4. Build Configuration → by Jenkinsfile
```

## Pipeline Parameters

The pipeline supports the following parameters:

- **ENVIRONMENT**: Target environment (dev/staging/prod)
- **SKIP_TESTS**: Skip test execution (boolean)
- **DEPLOY_TO_K8S**: Deploy to Kubernetes (boolean)
- **RUN_SECURITY_SCAN**: Run security scans (boolean)

## Usage

### Manual Trigger
```bash
# From Jenkins UI:
1. Select pipeline
2. Click "Build with Parameters"
3. Select options
4. Click "Build"
```

### Automatic Trigger
```bash
# Triggered automatically on:
- Git push to main/develop branches
- Pull request creation/update
- Manual webhook trigger
```

### CLI Trigger
```bash
# Using Jenkins CLI:
java -jar jenkins-cli.jar -s http://jenkins-url/ build adaptivq-pipeline \
  -p ENVIRONMENT=dev \
  -p DEPLOY_TO_K8S=true
```

## Pipeline Stages

1. **Checkout**: Clone repository
2. **Setup Environment**: Install dependencies
3. **Run Tests**: Execute test suites
4. **Security Scan**: Vulnerability scanning
5. **Build Docker Images**: Build containers
6. **Push to ECR**: Upload images
7. **Deploy to Kubernetes**: Deploy to EKS
8. **Verify Deployment**: Health checks
9. **Run Smoke Tests**: Basic functionality tests

## Monitoring

### Build Status
- Check Blue Ocean UI for visual pipeline
- Monitor logs in Console Output
- Review archived artifacts

### Kubernetes Deployment
```bash
# Verify deployment:
kubectl get pods -n adaptivq
kubectl get deployments -n adaptivq
kubectl logs -f deployment/backend -n adaptivq
```

## Rollback

### Automatic Rollback
Pipeline automatically rolls back on failure during deployment verification.

### Manual Rollback
```bash
# Via Jenkins:
1. Go to specific build
2. Click "Rollback"
3. Select previous version

# Via kubectl:
kubectl rollout undo deployment/backend -n adaptivq
kubectl rollout undo deployment/frontend -n adaptivq
```

## Troubleshooting

### Common Issues

#### 1. ECR Authentication Failed
```bash
# Solution: Refresh ECR credentials
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <ecr-registry>
```

#### 2. kubectl Not Configured
```bash
# Solution: Update kubeconfig
aws eks update-kubeconfig --region us-east-1 --name adaptivq-prod
```

#### 3. Docker Build Failed
```bash
# Solution: Check Dockerfile and build context
docker build --no-cache -f Dockerfile.backend .
```

## Best Practices

1. **Use Multi-Branch Pipelines** for automatic branch management
2. **Enable Build Notifications** via Slack/Email
3. **Archive Build Artifacts** for debugging
4. **Use Parameterized Builds** for flexibility
5. **Implement Approval Gates** for production deployments
6. **Monitor Resource Usage** in Jenkins
7. **Regular Credential Rotation** for security
8. **Backup Jenkins Configuration** regularly

## Advanced Configuration

### Parallel Builds
```groovy
// Enable in Jenkinsfile for faster builds
parallel {
    stage('Frontend') { ... }
    stage('Backend') { ... }
}
```

### Conditional Deployment
```groovy
when {
    branch 'main'
    environment name: 'ENVIRONMENT', value: 'prod'
}
```

### Post-Build Actions
```groovy
post {
    success { /* Notify on success */ }
    failure { /* Notify on failure */ }
    always { /* Cleanup */ }
}
```
