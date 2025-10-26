# Makefile for AdaptivQ DevOps Operations

.PHONY: help build push deploy clean test lint

# Variables
PROJECT_NAME := adaptivq
ENVIRONMENT ?= dev
IMAGE_TAG ?= latest
AWS_REGION ?= us-east-1
NAMESPACE := adaptivq

# Colors for output
GREEN := \033[0;32m
YELLOW := \033[1;33m
RED := \033[0;31m
NC := \033[0m # No Color

# Help target
help:
	@echo "$(GREEN)AdaptivQ DevOps Makefile$(NC)"
	@echo ""
	@echo "Available targets:"
	@echo "  $(YELLOW)Local Development:$(NC)"
	@echo "    dev-up          - Start development environment"
	@echo "    dev-down        - Stop development environment"
	@echo "    dev-logs        - View development logs"
	@echo ""
	@echo "  $(YELLOW)Docker Operations:$(NC)"
	@echo "    build           - Build Docker images"
	@echo "    push            - Push images to ECR"
	@echo "    clean           - Clean Docker resources"
	@echo ""
	@echo "  $(YELLOW)Kubernetes Operations:$(NC)"
	@echo "    k8s-deploy      - Deploy to Kubernetes"
	@echo "    k8s-status      - Check deployment status"
	@echo "    k8s-logs        - View pod logs"
	@echo "    k8s-shell       - Open shell in pod"
	@echo "    k8s-rollback    - Rollback deployment"
	@echo ""
	@echo "  $(YELLOW)Terraform Operations:$(NC)"
	@echo "    tf-init         - Initialize Terraform"
	@echo "    tf-plan         - Plan infrastructure changes"
	@echo "    tf-apply        - Apply infrastructure changes"
	@echo "    tf-destroy      - Destroy infrastructure"
	@echo ""
	@echo "  $(YELLOW)Testing & Quality:$(NC)"
	@echo "    test            - Run all tests"
	@echo "    lint            - Run linting"
	@echo "    security-scan   - Run security scans"
	@echo ""
	@echo "  $(YELLOW)Utilities:$(NC)"
	@echo "    setup           - Setup local environment"
	@echo "    deps            - Install dependencies"
	@echo "    clean-all       - Clean everything"

# =============================================================================
# Local Development
# =============================================================================

dev-up:
	@echo "$(GREEN)Starting development environment...$(NC)"
	docker-compose -f docker-compose.dev.yml up -d
	@echo "$(GREEN)Services started!$(NC)"
	@echo "Frontend: http://localhost:5173"
	@echo "Backend: http://localhost:5000"

dev-down:
	@echo "$(YELLOW)Stopping development environment...$(NC)"
	docker-compose -f docker-compose.dev.yml down

dev-logs:
	docker-compose -f docker-compose.dev.yml logs -f

dev-restart:
	@make dev-down
	@make dev-up

# =============================================================================
# Docker Operations
# =============================================================================

build:
	@echo "$(GREEN)Building Docker images...$(NC)"
	./scripts/build.sh

build-backend:
	@echo "$(GREEN)Building backend image...$(NC)"
	docker build -t $(PROJECT_NAME)-backend:$(IMAGE_TAG) -f Dockerfile.backend .

build-frontend:
	@echo "$(GREEN)Building frontend image...$(NC)"
	docker build -t $(PROJECT_NAME)-frontend:$(IMAGE_TAG) -f Dockerfile.frontend .

push:
	@echo "$(GREEN)Pushing images to ECR...$(NC)"
	@./scripts/push-ecr.sh

ecr-login:
	@echo "$(GREEN)Logging into ECR...$(NC)"
	aws ecr get-login-password --region $(AWS_REGION) | \
		docker login --username AWS --password-stdin \
		$$(aws sts get-caller-identity --query Account --output text).dkr.ecr.$(AWS_REGION).amazonaws.com

clean:
	@echo "$(YELLOW)Cleaning Docker resources...$(NC)"
	docker system prune -f
	docker volume prune -f

# =============================================================================
# Kubernetes Operations
# =============================================================================

k8s-config:
	@echo "$(GREEN)Configuring kubectl for EKS...$(NC)"
	aws eks update-kubeconfig --region $(AWS_REGION) --name $(PROJECT_NAME)-$(ENVIRONMENT)

k8s-deploy:
	@echo "$(GREEN)Deploying to Kubernetes...$(NC)"
	ENVIRONMENT=$(ENVIRONMENT) IMAGE_TAG=$(IMAGE_TAG) ./scripts/deploy.sh

k8s-status:
	@echo "$(GREEN)Checking deployment status...$(NC)"
	kubectl get all -n $(NAMESPACE)

k8s-pods:
	kubectl get pods -n $(NAMESPACE)

k8s-logs:
	kubectl logs -f deployment/backend -n $(NAMESPACE)

k8s-logs-frontend:
	kubectl logs -f deployment/frontend -n $(NAMESPACE)

k8s-shell:
	kubectl exec -it $$(kubectl get pod -n $(NAMESPACE) -l app=backend -o jsonpath='{.items[0].metadata.name}') -n $(NAMESPACE) -- /bin/bash

k8s-rollback:
	@echo "$(YELLOW)Rolling back deployment...$(NC)"
	kubectl rollout undo deployment/backend -n $(NAMESPACE)
	kubectl rollout undo deployment/frontend -n $(NAMESPACE)

k8s-scale-up:
	@echo "$(GREEN)Scaling up deployments...$(NC)"
	kubectl scale deployment backend --replicas=5 -n $(NAMESPACE)
	kubectl scale deployment frontend --replicas=3 -n $(NAMESPACE)

k8s-scale-down:
	@echo "$(YELLOW)Scaling down deployments...$(NC)"
	kubectl scale deployment backend --replicas=2 -n $(NAMESPACE)
	kubectl scale deployment frontend --replicas=1 -n $(NAMESPACE)

# =============================================================================
# Terraform Operations
# =============================================================================

tf-init:
	@echo "$(GREEN)Initializing Terraform...$(NC)"
	cd terraform && terraform init

tf-validate:
	@echo "$(GREEN)Validating Terraform configuration...$(NC)"
	cd terraform && terraform validate

tf-plan:
	@echo "$(GREEN)Planning infrastructure changes...$(NC)"
	cd terraform && terraform plan -var-file=environments/$(ENVIRONMENT)/terraform.tfvars

tf-apply:
	@echo "$(GREEN)Applying infrastructure changes...$(NC)"
	cd terraform && terraform apply -var-file=environments/$(ENVIRONMENT)/terraform.tfvars

tf-destroy:
	@echo "$(RED)Destroying infrastructure...$(NC)"
	cd terraform && terraform destroy -var-file=environments/$(ENVIRONMENT)/terraform.tfvars

tf-output:
	cd terraform && terraform output -json

# =============================================================================
# Testing & Quality
# =============================================================================

test:
	@echo "$(GREEN)Running tests...$(NC)"
	@make test-frontend
	@make test-backend

test-frontend:
	@echo "$(GREEN)Running frontend tests...$(NC)"
	npm run test

test-backend:
	@echo "$(GREEN)Running backend tests...$(NC)"
	cd Backend_Flask && python -m pytest tests/

lint:
	@echo "$(GREEN)Running linters...$(NC)"
	npm run lint
	cd Backend_Flask && pylint *.py

security-scan:
	@echo "$(GREEN)Running security scans...$(NC)"
	npm audit
	cd Backend_Flask && safety check

# =============================================================================
# Ansible Operations
# =============================================================================

ansible-deploy:
	@echo "$(GREEN)Deploying with Ansible...$(NC)"
	cd ansible && ansible-playbook -i inventory/hosts.yml playbooks/deploy.yml \
		-e "environment=$(ENVIRONMENT) image_tag=$(IMAGE_TAG)"

ansible-rollback:
	@echo "$(YELLOW)Rolling back with Ansible...$(NC)"
	cd ansible && ansible-playbook -i inventory/hosts.yml playbooks/rollback.yml \
		-e "environment=$(ENVIRONMENT)"

ansible-monitoring:
	@echo "$(GREEN)Setting up monitoring...$(NC)"
	cd ansible && ansible-playbook -i inventory/hosts.yml playbooks/monitoring-setup.yml

# =============================================================================
# Utilities
# =============================================================================

setup:
	@echo "$(GREEN)Setting up local environment...$(NC)"
	@make deps
	cp .env.example .env
	@echo "$(YELLOW)Please edit .env with your configuration$(NC)"

deps:
	@echo "$(GREEN)Installing dependencies...$(NC)"
	npm install
	cd Backend_Flask && pip install -r requirements.txt

clean-all:
	@echo "$(RED)Cleaning all resources...$(NC)"
	@make clean
	@make dev-down
	docker-compose down -v
	rm -rf node_modules
	rm -rf Backend_Flask/__pycache__

format:
	@echo "$(GREEN)Formatting code...$(NC)"
	npm run format
	cd Backend_Flask && black *.py

version:
	@echo "Project: $(PROJECT_NAME)"
	@echo "Environment: $(ENVIRONMENT)"
	@echo "Image Tag: $(IMAGE_TAG)"
	@echo "AWS Region: $(AWS_REGION)"
	@echo "Namespace: $(NAMESPACE)"

# =============================================================================
# Monitoring
# =============================================================================

grafana-forward:
	@echo "$(GREEN)Port forwarding Grafana...$(NC)"
	kubectl port-forward -n monitoring svc/prometheus-grafana 3000:80

prometheus-forward:
	@echo "$(GREEN)Port forwarding Prometheus...$(NC)"
	kubectl port-forward -n monitoring svc/prometheus-kube-prometheus-prometheus 9090:9090

# =============================================================================
# Database Operations
# =============================================================================

db-backup:
	@echo "$(GREEN)Creating database backup...$(NC)"
	kubectl exec -n $(NAMESPACE) $$(kubectl get pod -n $(NAMESPACE) -l app=postgres -o jsonpath='{.items[0].metadata.name}') \
		-- pg_dump -U adaptivq_user adaptivq > backup-$$(date +%Y%m%d-%H%M%S).sql

db-restore:
	@echo "$(YELLOW)Restoring database...$(NC)"
	@echo "Please specify backup file: make db-restore FILE=backup-20240101-120000.sql"

db-shell:
	kubectl exec -it -n $(NAMESPACE) $$(kubectl get pod -n $(NAMESPACE) -l app=postgres -o jsonpath='{.items[0].metadata.name}') \
		-- psql -U adaptivq_user -d adaptivq
