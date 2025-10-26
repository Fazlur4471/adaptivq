#!/bin/bash

###############################################################################
# Build Script for AdaptivQ
# Builds Docker images for frontend and backend
###############################################################################

set -e  # Exit on error
set -u  # Exit on undefined variable
set -o pipefail  # Exit on pipe failure

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="adaptivq"
ENVIRONMENT="${ENVIRONMENT:-dev}"
IMAGE_TAG="${IMAGE_TAG:-latest}"
AWS_REGION="${AWS_REGION:-us-east-1}"
BUILD_DATE=$(date -u +'%Y-%m-%dT%H:%M:%SZ')
VCS_REF=$(git rev-parse --short HEAD)

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

check_dependencies() {
    log_info "Checking dependencies..."
    
    command -v docker >/dev/null 2>&1 || { log_error "Docker is not installed"; exit 1; }
    command -v git >/dev/null 2>&1 || { log_error "Git is not installed"; exit 1; }
    
    log_info "All dependencies are installed"
}

build_backend() {
    log_info "Building backend Docker image..."
    
    docker build \
        -t ${PROJECT_NAME}-backend:${IMAGE_TAG} \
        -t ${PROJECT_NAME}-backend:latest \
        -f Dockerfile.backend \
        --build-arg BUILD_DATE="${BUILD_DATE}" \
        --build-arg VCS_REF="${VCS_REF}" \
        --build-arg ENVIRONMENT="${ENVIRONMENT}" \
        .
    
    log_info "Backend image built successfully"
}

build_frontend() {
    log_info "Building frontend Docker image..."
    
    docker build \
        -t ${PROJECT_NAME}-frontend:${IMAGE_TAG} \
        -t ${PROJECT_NAME}-frontend:latest \
        -f Dockerfile.frontend \
        --build-arg BUILD_DATE="${BUILD_DATE}" \
        --build-arg VCS_REF="${VCS_REF}" \
        --build-arg ENVIRONMENT="${ENVIRONMENT}" \
        .
    
    log_info "Frontend image built successfully"
}

test_images() {
    log_info "Testing Docker images..."
    
    # Test backend image
    docker run --rm ${PROJECT_NAME}-backend:${IMAGE_TAG} python --version || {
        log_error "Backend image test failed"
        exit 1
    }
    
    # Test frontend image (check if nginx is present)
    docker run --rm ${PROJECT_NAME}-frontend:${IMAGE_TAG} nginx -v || {
        log_error "Frontend image test failed"
        exit 1
    }
    
    log_info "All image tests passed"
}

show_summary() {
    log_info "Build Summary:"
    echo "  Project: ${PROJECT_NAME}"
    echo "  Environment: ${ENVIRONMENT}"
    echo "  Image Tag: ${IMAGE_TAG}"
    echo "  Build Date: ${BUILD_DATE}"
    echo "  Git Commit: ${VCS_REF}"
    echo ""
    echo "Built Images:"
    echo "  - ${PROJECT_NAME}-backend:${IMAGE_TAG}"
    echo "  - ${PROJECT_NAME}-frontend:${IMAGE_TAG}"
}

main() {
    log_info "Starting build process..."
    
    check_dependencies
    build_backend
    build_frontend
    test_images
    show_summary
    
    log_info "Build completed successfully! 🎉"
}

# Run main function
main "$@"
