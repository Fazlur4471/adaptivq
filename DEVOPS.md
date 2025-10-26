# DevOps Documentation for AdaptivQ

## 📋 Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Prerequisites](#prerequisites)
4. [Local Development](#local-development)
5. [AWS Infrastructure](#aws-infrastructure)
6. [Kubernetes Deployment](#kubernetes-deployment)
7. [CI/CD Pipeline](#cicd-pipeline)
8. [Monitoring & Logging](#monitoring--logging)
9. [Security](#security)
10. [Troubleshooting](#troubleshooting)

---

## Overview

This document provides comprehensive DevOps documentation for the AdaptivQ project, including infrastructure as code, container orchestration, and CI/CD pipeline configuration.

### Tech Stack
- **Containerization**: Docker
- **Orchestration**: Kubernetes (EKS)
- **Infrastructure**: Terraform
- **Configuration Management**: Ansible
- **CI/CD**: Jenkins
- **Cloud Provider**: AWS

---

## Architecture

### High-Level Architecture
```
┌─────────────────────────────────────────────────────────┐
│                        Users                            │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│              AWS Route 53 (DNS)                         │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│         AWS ALB / Ingress Controller                    │
└────────────────┬────────────────────────────────────────┘
                 │
     ┌───────────┴────────────┐
     │                        │
     ▼                        ▼
┌─────────┐            ┌─────────────┐
│Frontend │            │  Backend    │
│  Pods   │◄──────────►│   Pods      │
│ (React) │            │  (Flask)    │
└─────────┘            └──────┬──────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
              ▼               ▼               ▼
         ┌────────┐     ┌─────────┐    ┌─────────┐
         │  RDS   │     │ Redis   │    │ Celery  │
         │Postgres│     │(Cache)  │    │ Workers │
         └────────┘     └─────────┘    └─────────┘
```

### Component Breakdown

#### Frontend
- **Technology**: React + Vite + TypeScript
- **Container**: Nginx serving static files
- **Replicas**: 2-5 (auto-scaling)
- **Resources**: 64Mi-128Mi RAM, 100m-200m CPU

#### Backend
- **Technology**: Flask + Python 3.11
- **Container**: Gunicorn WSGI server
- **Replicas**: 3-10 (auto-scaling)
- **Resources**: 256Mi-512Mi RAM, 250m-500m CPU

#### Database
- **Type**: Amazon RDS PostgreSQL 15
- **Instance**: db.t3.medium (production: db.r6g.xlarge)
- **Storage**: 100GB (auto-scaling to 200GB)
- **Backup**: 7-day retention, automated snapshots

#### Cache
- **Type**: Amazon ElastiCache Redis 7
- **Node Type**: cache.t3.medium (production: cache.r6g.large)
- **Replication**: Multi-AZ with automatic failover
- **Encryption**: At-rest and in-transit

---

## Prerequisites

### Required Tools
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# Install Terraform
wget -O- https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
sudo apt update && sudo apt install terraform

# Install Ansible
sudo apt install ansible

# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

### AWS Credentials
```bash
# Configure AWS credentials
aws configure
# Enter:
# - AWS Access Key ID
# - AWS Secret Access Key
# - Default region: us-east-1
# - Default output format: json
```

---

## Local Development

### Using Docker Compose

#### Development Environment
```bash
# Start all services
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop services
docker-compose -f docker-compose.dev.yml down
```

#### Production-like Environment
```bash
# Build and start
docker-compose up --build -d

# Check status
docker-compose ps

# Access logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop and remove
docker-compose down -v
```

### Environment Variables
Create a `.env` file in the project root:
```env
# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=1

# Database
POSTGRES_DB=adaptivq
POSTGRES_USER=adaptivq_user
POSTGRES_PASSWORD=changeme

# Redis
REDIS_PASSWORD=changeme

# API Keys
GEMINI_API_KEY=your_gemini_api_key
FIREBASE_CREDENTIALS=your_firebase_credentials_json
```

---

## AWS Infrastructure

### Terraform Setup

#### Initialize Terraform
```bash
cd terraform

# Initialize
terraform init

# Validate configuration
terraform validate

# Plan changes
terraform plan -var-file=environments/prod/terraform.tfvars

# Apply changes
terraform apply -var-file=environments/prod/terraform.tfvars
```

#### Infrastructure Components

##### VPC
- CIDR: 10.0.0.0/16
- Public subnets: 3 (across AZs)
- Private subnets: 3 (across AZs)
- NAT Gateways: 3 (one per AZ)
- Internet Gateway: 1

##### EKS Cluster
- Kubernetes Version: 1.28
- Node Groups: 
  - General: t3.medium (min: 2, max: 10)
- OIDC Provider: Enabled (for IRSA)
- Logging: All control plane logs enabled

##### RDS PostgreSQL
- Engine: PostgreSQL 15.4
- Instance Class: db.t3.medium
- Storage: 100GB gp3 (auto-scaling to 200GB)
- Multi-AZ: Enabled
- Backup: 7-day retention
- Monitoring: Enhanced monitoring enabled

##### ElastiCache Redis
- Engine: Redis 7.0
- Node Type: cache.t3.medium
- Nodes: 2 (Multi-AZ)
- Encryption: At-rest and in-transit
- Auth Token: Enabled

##### S3 Buckets
- Assets bucket: For static files
- Backups bucket: For database backups
- Logs bucket: For application logs

##### ECR Repositories
- adaptivq-frontend
- adaptivq-backend

---

## Kubernetes Deployment

### Manual Deployment

#### Configure kubectl
```bash
# Update kubeconfig
aws eks update-kubeconfig --region us-east-1 --name adaptivq-prod

# Verify connection
kubectl cluster-info
kubectl get nodes
```

#### Deploy Application
```bash
# Create namespace
kubectl create namespace adaptivq

# Apply configurations
kubectl apply -f k8s/base/

# Check deployment status
kubectl get all -n adaptivq

# View logs
kubectl logs -f deployment/backend -n adaptivq
kubectl logs -f deployment/frontend -n adaptivq
```

### Using Ansible

```bash
cd ansible

# Deploy to development
ansible-playbook -i inventory/hosts.yml playbooks/deploy.yml -e "environment=dev"

# Deploy to production
ansible-playbook -i inventory/hosts.yml playbooks/deploy.yml -e "environment=prod image_tag=v1.2.3"

# Rollback deployment
ansible-playbook -i inventory/hosts.yml playbooks/rollback.yml -e "environment=prod"
```

### Scaling

#### Manual Scaling
```bash
# Scale backend deployment
kubectl scale deployment backend --replicas=5 -n adaptivq

# Scale frontend deployment
kubectl scale deployment frontend --replicas=3 -n adaptivq
```

#### Auto-Scaling
Horizontal Pod Autoscaler (HPA) is configured to automatically scale based on CPU/memory usage:
- Backend: 3-10 replicas (70% CPU threshold)
- Frontend: 2-5 replicas (70% CPU threshold)

---

## CI/CD Pipeline

### Jenkins Pipeline

The Jenkins pipeline automatically:
1. Checks out code
2. Runs tests (frontend & backend)
3. Performs security scans
4. Builds Docker images
5. Pushes images to ECR
6. Deploys to Kubernetes
7. Runs smoke tests

### Pipeline Trigger

#### Automatic (Webhook)
- Push to main/develop branches
- Pull request creation/update

#### Manual
```bash
# Via Jenkins UI
1. Go to adaptivq-pipeline
2. Click "Build with Parameters"
3. Select environment and options
4. Click "Build"

# Via Jenkins CLI
java -jar jenkins-cli.jar -s http://jenkins-url/ build adaptivq-pipeline \
  -p ENVIRONMENT=prod \
  -p IMAGE_TAG=v1.2.3
```

### Build Scripts

#### Build Images Locally
```bash
./scripts/build.sh
```

#### Deploy to Kubernetes
```bash
export ENVIRONMENT=dev
export IMAGE_TAG=latest
./scripts/deploy.sh
```

---

## Monitoring & Logging

### Setup Monitoring Stack
```bash
cd ansible
ansible-playbook -i inventory/hosts.yml playbooks/monitoring-setup.yml
```

This installs:
- **Prometheus**: Metrics collection
- **Grafana**: Metrics visualization
- **AlertManager**: Alert management

### Access Grafana
```bash
# Port forward to local machine
kubectl port-forward -n monitoring svc/prometheus-grafana 3000:80

# Open browser: http://localhost:3000
# Default credentials: admin / admin
```

### View Logs

#### Application Logs
```bash
# Backend logs
kubectl logs -f deployment/backend -n adaptivq

# Frontend logs
kubectl logs -f deployment/frontend -n adaptivq

# Celery worker logs
kubectl logs -f deployment/celery-worker -n adaptivq
```

#### Infrastructure Logs
```bash
# EKS control plane logs (via CloudWatch)
aws logs tail /aws/eks/adaptivq-prod/cluster --follow

# RDS logs (via CloudWatch)
aws logs tail /aws/rds/instance/adaptivq-prod/postgresql --follow
```

---

## Security

### Best Practices

1. **Secrets Management**
   - Use AWS Secrets Manager or HashiCorp Vault
   - Never commit secrets to version control
   - Rotate credentials regularly

2. **Network Security**
   - All traffic encrypted in transit (TLS/SSL)
   - VPC security groups restrict access
   - Private subnets for database and cache

3. **Container Security**
   - Images scanned for vulnerabilities
   - Non-root user in containers
   - Read-only root filesystem where possible

4. **Access Control**
   - RBAC enabled in Kubernetes
   - IAM roles for service accounts (IRSA)
   - Least privilege principle

### Security Scanning

```bash
# Scan Docker images
docker scan adaptivq-backend:latest
docker scan adaptivq-frontend:latest

# Scan dependencies
npm audit
pip-audit
```

---

## Troubleshooting

### Common Issues

#### 1. Pod Not Starting
```bash
# Check pod status
kubectl describe pod <pod-name> -n adaptivq

# Check logs
kubectl logs <pod-name> -n adaptivq

# Check events
kubectl get events -n adaptivq --sort-by='.lastTimestamp'
```

#### 2. Database Connection Issues
```bash
# Verify RDS endpoint
aws rds describe-db-instances --db-instance-identifier adaptivq-prod

# Test connection from pod
kubectl exec -it <backend-pod> -n adaptivq -- psql -h <rds-endpoint> -U adaptivq_user -d adaptivq
```

#### 3. Image Pull Errors
```bash
# Check ECR authentication
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <ecr-registry>

# Verify image exists
aws ecr describe-images --repository-name adaptivq-prod-adaptivq-backend
```

#### 4. Deployment Rollback
```bash
# Rollback to previous version
kubectl rollout undo deployment/backend -n adaptivq

# Rollback to specific revision
kubectl rollout undo deployment/backend --to-revision=3 -n adaptivq

# View rollout history
kubectl rollout history deployment/backend -n adaptivq
```

### Useful Commands

```bash
# Check cluster health
kubectl get componentstatuses

# Check node resources
kubectl top nodes

# Check pod resources
kubectl top pods -n adaptivq

# Restart deployment
kubectl rollout restart deployment/backend -n adaptivq

# Scale to zero (maintenance)
kubectl scale deployment backend --replicas=0 -n adaptivq
```

---

## Support & Resources

### Documentation Links
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [Docker Documentation](https://docs.docker.com/)
- [AWS EKS Best Practices](https://aws.github.io/aws-eks-best-practices/)

### Internal Resources
- Runbook: `docs/runbook.md`
- Architecture Diagrams: `docs/architecture/`
- API Documentation: `docs/api/`

---

## License
This DevOps configuration is part of the AdaptivQ project.
