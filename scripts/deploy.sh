#!/bin/bash

###############################################################################
# Deployment Script for AdaptivQ
# Deploys application to Kubernetes cluster
###############################################################################

set -e
set -u
set -o pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
PROJECT_NAME="adaptivq"
ENVIRONMENT="${ENVIRONMENT:-dev}"
IMAGE_TAG="${IMAGE_TAG:-latest}"
AWS_REGION="${AWS_REGION:-us-east-1}"
NAMESPACE="adaptivq"
EKS_CLUSTER_NAME="${PROJECT_NAME}-${ENVIRONMENT}"

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

check_dependencies() {
    log_info "Checking dependencies..."
    
    command -v kubectl >/dev/null 2>&1 || { log_error "kubectl is not installed"; exit 1; }
    command -v aws >/dev/null 2>&1 || { log_error "AWS CLI is not installed"; exit 1; }
    
    log_info "All dependencies are installed"
}

configure_kubectl() {
    log_step "Configuring kubectl for EKS cluster..."
    
    aws eks update-kubeconfig \
        --region "${AWS_REGION}" \
        --name "${EKS_CLUSTER_NAME}"
    
    # Verify connection
    kubectl cluster-info || {
        log_error "Failed to connect to Kubernetes cluster"
        exit 1
    }
    
    log_info "kubectl configured successfully"
}

create_namespace() {
    log_step "Creating namespace if not exists..."
    
    kubectl create namespace ${NAMESPACE} --dry-run=client -o yaml | kubectl apply -f -
    
    log_info "Namespace ${NAMESPACE} is ready"
}

apply_configurations() {
    log_step "Applying Kubernetes configurations..."
    
    kubectl apply -f k8s/base/configmap.yaml -n ${NAMESPACE}
    kubectl apply -f k8s/base/secrets.yaml -n ${NAMESPACE}
    kubectl apply -f k8s/base/postgres-statefulset.yaml -n ${NAMESPACE}
    kubectl apply -f k8s/base/redis-statefulset.yaml -n ${NAMESPACE}
    
    log_info "Base configurations applied"
}

deploy_application() {
    log_step "Deploying application..."
    
    # Get ECR repository URLs
    AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
    
    BACKEND_IMAGE="${ECR_REGISTRY}/${PROJECT_NAME}-${ENVIRONMENT}-adaptivq-backend:${IMAGE_TAG}"
    FRONTEND_IMAGE="${ECR_REGISTRY}/${PROJECT_NAME}-${ENVIRONMENT}-adaptivq-frontend:${IMAGE_TAG}"
    
    # Update deployment images
    kubectl set image deployment/backend \
        backend=${BACKEND_IMAGE} \
        -n ${NAMESPACE} || {
        log_warn "Backend deployment not found, creating new deployment"
        kubectl apply -f k8s/base/backend-deployment.yaml -n ${NAMESPACE}
    }
    
    kubectl set image deployment/frontend \
        frontend=${FRONTEND_IMAGE} \
        -n ${NAMESPACE} || {
        log_warn "Frontend deployment not found, creating new deployment"
        kubectl apply -f k8s/base/frontend-deployment.yaml -n ${NAMESPACE}
    }
    
    # Apply other resources
    kubectl apply -f k8s/base/celery-deployment.yaml -n ${NAMESPACE}
    kubectl apply -f k8s/base/ingress.yaml -n ${NAMESPACE}
    kubectl apply -f k8s/base/hpa.yaml -n ${NAMESPACE}
    
    log_info "Application deployed"
}

wait_for_rollout() {
    log_step "Waiting for deployment rollout..."
    
    kubectl rollout status deployment/backend -n ${NAMESPACE} --timeout=5m
    kubectl rollout status deployment/frontend -n ${NAMESPACE} --timeout=5m
    
    log_info "Rollout completed successfully"
}

verify_deployment() {
    log_step "Verifying deployment..."
    
    echo ""
    echo "Pods:"
    kubectl get pods -n ${NAMESPACE}
    
    echo ""
    echo "Deployments:"
    kubectl get deployments -n ${NAMESPACE}
    
    echo ""
    echo "Services:"
    kubectl get svc -n ${NAMESPACE}
    
    echo ""
    echo "Ingress:"
    kubectl get ingress -n ${NAMESPACE}
    
    # Check pod health
    BACKEND_READY=$(kubectl get deployment backend -n ${NAMESPACE} -o jsonpath='{.status.readyReplicas}')
    FRONTEND_READY=$(kubectl get deployment frontend -n ${NAMESPACE} -o jsonpath='{.status.readyReplicas}')
    
    if [ "${BACKEND_READY:-0}" -gt 0 ] && [ "${FRONTEND_READY:-0}" -gt 0 ]; then
        log_info "Deployment verification passed"
    else
        log_error "Deployment verification failed"
        exit 1
    fi
}

show_access_info() {
    log_info "Deployment Summary:"
    echo "  Environment: ${ENVIRONMENT}"
    echo "  Namespace: ${NAMESPACE}"
    echo "  Image Tag: ${IMAGE_TAG}"
    echo ""
    
    INGRESS_URL=$(kubectl get ingress adaptivq-ingress -n ${NAMESPACE} -o jsonpath='{.status.loadBalancer.ingress[0].hostname}' 2>/dev/null || echo "Pending...")
    
    echo "Access URLs:"
    echo "  Frontend: http://${INGRESS_URL}"
    echo "  Backend API: http://${INGRESS_URL}/api"
    echo ""
    
    log_info "To view logs, run:"
    echo "  kubectl logs -f deployment/backend -n ${NAMESPACE}"
    echo "  kubectl logs -f deployment/frontend -n ${NAMESPACE}"
}

main() {
    log_info "Starting deployment process..."
    
    check_dependencies
    configure_kubectl
    create_namespace
    apply_configurations
    deploy_application
    wait_for_rollout
    verify_deployment
    show_access_info
    
    log_info "Deployment completed successfully! 🚀"
}

# Run main function
main "$@"
