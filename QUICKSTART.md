# 🚀 Quick Start Guide - AdaptivQ DevOps

This guide will help you get started with the AdaptivQ DevOps infrastructure in minutes.

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- [Docker](https://docs.docker.com/get-docker/) (v20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (v2.0+)
- [AWS CLI](https://aws.amazon.com/cli/) (v2.0+)
- [kubectl](https://kubernetes.io/docs/tasks/tools/) (v1.28+)
- [Terraform](https://www.terraform.io/downloads.html) (v1.5+)
- [Ansible](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html) (v2.14+)

---

## 🏃 Quick Start Options

### Option 1: Local Development (Docker Compose)

Perfect for local development and testing.

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd adaptivq

# 2. Create environment file
cp .env.example .env
# Edit .env with your configuration

# 3. Start development environment
docker-compose -f docker-compose.dev.yml up -d

# 4. Access the application
# Frontend: http://localhost:5173
# Backend: http://localhost:5000
# PostgreSQL: localhost:5432
# Redis: localhost:6379

# 5. View logs
docker-compose -f docker-compose.dev.yml logs -f

# 6. Stop services
docker-compose -f docker-compose.dev.yml down
```

---

### Option 2: Production-Like Local (Docker Compose)

For testing production configurations locally.

```bash
# 1. Build and start production containers
docker-compose up --build -d

# 2. Access the application
# Frontend: http://localhost
# Backend API: http://localhost/api

# 3. Check status
docker-compose ps

# 4. View logs
docker-compose logs -f

# 5. Stop and cleanup
docker-compose down -v
```

---

### Option 3: AWS Deployment (Full Production)

Deploy to AWS with EKS, RDS, and ElastiCache.

#### Step 1: Configure AWS Credentials
```bash
# Configure AWS CLI
aws configure
# Enter your AWS credentials, region (us-east-1), and output format (json)
```

#### Step 2: Deploy Infrastructure with Terraform
```bash
# Navigate to terraform directory
cd terraform

# Initialize Terraform
terraform init

# Review the plan
terraform plan -var-file=environments/prod/terraform.tfvars

# Apply infrastructure (creates VPC, EKS, RDS, Redis, etc.)
terraform apply -var-file=environments/prod/terraform.tfvars
# Type 'yes' when prompted

# Save outputs
terraform output -json > terraform-outputs.json
```

**⏱️ This step takes approximately 15-20 minutes**

#### Step 3: Configure kubectl
```bash
# Update kubeconfig for EKS
aws eks update-kubeconfig --region us-east-1 --name adaptivq-prod

# Verify connection
kubectl cluster-info
kubectl get nodes
```

#### Step 4: Build and Push Docker Images
```bash
# Navigate back to project root
cd ..

# Login to ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin \
  $(aws sts get-caller-identity --query Account --output text).dkr.ecr.us-east-1.amazonaws.com

# Build images
./scripts/build.sh

# Tag and push images
export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
export ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com"

docker tag adaptivq-backend:latest ${ECR_REGISTRY}/adaptivq-prod-adaptivq-backend:latest
docker tag adaptivq-frontend:latest ${ECR_REGISTRY}/adaptivq-prod-adaptivq-frontend:latest

docker push ${ECR_REGISTRY}/adaptivq-prod-adaptivq-backend:latest
docker push ${ECR_REGISTRY}/adaptivq-prod-adaptivq-frontend:latest
```

#### Step 5: Deploy to Kubernetes
```bash
# Using deployment script
export ENVIRONMENT=prod
export IMAGE_TAG=latest
./scripts/deploy.sh

# OR using Ansible
cd ansible
ansible-playbook -i inventory/hosts.yml playbooks/deploy.yml \
  -e "environment=prod image_tag=latest"
```

#### Step 6: Verify Deployment
```bash
# Check pod status
kubectl get pods -n adaptivq

# Check services
kubectl get svc -n adaptivq

# Check ingress
kubectl get ingress -n adaptivq

# Get application URL
kubectl get ingress adaptivq-ingress -n adaptivq \
  -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'
```

---

## 🔧 Jenkins CI/CD Setup

### Step 1: Install Jenkins
```bash
# Using Docker
docker run -d \
  --name jenkins \
  -p 8080:8080 \
  -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  jenkins/jenkins:lts

# Get initial admin password
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

### Step 2: Configure Jenkins
1. Open http://localhost:8080
2. Enter the initial admin password
3. Install recommended plugins
4. Create admin user

### Step 3: Add Required Plugins
- Go to `Manage Jenkins` → `Manage Plugins`
- Install:
  - Docker Pipeline
  - Kubernetes
  - AWS Steps
  - Blue Ocean

### Step 4: Configure Credentials
Add the following credentials in Jenkins:
- AWS credentials (`aws-credentials`)
- ECR credentials (`ecr-credentials`)
- Gemini API key (`gemini-api-key`)

### Step 5: Create Pipeline
1. New Item → Pipeline
2. Name: `adaptivq-pipeline`
3. Pipeline script from SCM
4. Repository URL: `<your-repo-url>`
5. Script Path: `Jenkinsfile`
6. Save

### Step 6: Run Pipeline
Click "Build with Parameters" and select options.

---

## 📊 Monitoring Setup

### Install Prometheus & Grafana
```bash
cd ansible
ansible-playbook -i inventory/hosts.yml playbooks/monitoring-setup.yml
```

### Access Grafana
```bash
# Port forward
kubectl port-forward -n monitoring svc/prometheus-grafana 3000:80

# Open browser: http://localhost:3000
# Default credentials: admin / admin
```

---

## 🛠️ Common Operations

### View Logs
```bash
# Backend logs
kubectl logs -f deployment/backend -n adaptivq

# Frontend logs
kubectl logs -f deployment/frontend -n adaptivq

# All pods in namespace
kubectl logs -f -l app.kubernetes.io/name=adaptivq -n adaptivq
```

### Scale Application
```bash
# Scale backend
kubectl scale deployment backend --replicas=5 -n adaptivq

# Scale frontend
kubectl scale deployment frontend --replicas=3 -n adaptivq
```

### Update Application
```bash
# Build new version
./scripts/build.sh

# Push to ECR
docker push ${ECR_REGISTRY}/adaptivq-prod-adaptivq-backend:latest

# Update deployment
kubectl set image deployment/backend \
  backend=${ECR_REGISTRY}/adaptivq-prod-adaptivq-backend:latest \
  -n adaptivq

# Check rollout status
kubectl rollout status deployment/backend -n adaptivq
```

### Rollback Deployment
```bash
# Rollback to previous version
kubectl rollout undo deployment/backend -n adaptivq

# View rollout history
kubectl rollout history deployment/backend -n adaptivq
```

---

## 🔍 Troubleshooting

### Check Pod Status
```bash
kubectl get pods -n adaptivq
kubectl describe pod <pod-name> -n adaptivq
```

### Check Logs
```bash
kubectl logs <pod-name> -n adaptivq
kubectl logs <pod-name> -n adaptivq --previous  # Previous container logs
```

### Execute Commands in Pod
```bash
kubectl exec -it <pod-name> -n adaptivq -- /bin/bash
```

### Check Resource Usage
```bash
kubectl top nodes
kubectl top pods -n adaptivq
```

---

## 📚 Next Steps

1. **Configure DNS**: Point your domain to the load balancer
2. **Setup SSL**: Install cert-manager for automatic SSL certificates
3. **Configure Backups**: Setup automated database backups
4. **Setup Alerts**: Configure Prometheus alerting rules
5. **Review Security**: Run security audit and implement recommendations

---

## 🆘 Need Help?

- **Documentation**: See [DEVOPS.md](./DEVOPS.md) for detailed information
- **Issues**: Check the troubleshooting section in DEVOPS.md
- **Support**: Contact the DevOps team

---

## 📝 Environment Variables

Create a `.env` file with these variables:

```env
# Flask
FLASK_ENV=production
FLASK_DEBUG=0

# Database
POSTGRES_DB=adaptivq
POSTGRES_USER=adaptivq_user
POSTGRES_PASSWORD=<strong-password>
DATABASE_HOST=<rds-endpoint>
DATABASE_PORT=5432

# Redis
REDIS_HOST=<elasticache-endpoint>
REDIS_PORT=6379
REDIS_PASSWORD=<strong-password>

# API Keys
GEMINI_API_KEY=<your-gemini-api-key>
FIREBASE_CREDENTIALS=<your-firebase-credentials>

# AWS
AWS_REGION=us-east-1
AWS_ACCOUNT_ID=<your-account-id>
```

---

Happy deploying! 🚀
