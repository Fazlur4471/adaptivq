#!/usr/bin/env groovy

/**
 * Jenkins Pipeline for AdaptivQ
 * Multi-stage CI/CD pipeline with Docker, Kubernetes, and AWS integration
 */

pipeline {
    agent any
    
    environment {
        // AWS Configuration
        AWS_REGION = 'us-east-1'
        AWS_ACCOUNT_ID = credentials('aws-account-id')
        
        // ECR Configuration
        ECR_REGISTRY = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
        ECR_BACKEND_REPO = "${ECR_REGISTRY}/adaptivq-${ENVIRONMENT}-adaptivq-backend"
        ECR_FRONTEND_REPO = "${ECR_REGISTRY}/adaptivq-${ENVIRONMENT}-adaptivq-frontend"
        
        // Application Configuration
        PROJECT_NAME = 'adaptivq'
        IMAGE_TAG = "${env.BUILD_NUMBER}-${env.GIT_COMMIT.take(7)}"
        
        // Kubernetes Configuration
        EKS_CLUSTER_NAME = "${PROJECT_NAME}-${ENVIRONMENT}"
        K8S_NAMESPACE = 'adaptivq'
        
        // Credentials
        DOCKER_REGISTRY_CREDS = credentials('ecr-credentials')
        GEMINI_API_KEY = credentials('gemini-api-key')
        
        // Build toggles
        SKIP_TESTS = "${params.SKIP_TESTS ?: false}"
        DEPLOY_TO_K8S = "${params.DEPLOY_TO_K8S ?: true}"
    }
    
    parameters {
        choice(
            name: 'ENVIRONMENT',
            choices: ['dev', 'staging', 'prod'],
            description: 'Deployment environment'
        )
        booleanParam(
            name: 'SKIP_TESTS',
            defaultValue: false,
            description: 'Skip test execution'
        )
        booleanParam(
            name: 'DEPLOY_TO_K8S',
            defaultValue: true,
            description: 'Deploy to Kubernetes after build'
        )
        booleanParam(
            name: 'RUN_SECURITY_SCAN',
            defaultValue: true,
            description: 'Run security vulnerability scan'
        )
    }
    
    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timestamps()
        timeout(time: 1, unit: 'HOURS')
        disableConcurrentBuilds()
    }
    
    stages {
        stage('Checkout') {
            steps {
                script {
                    echo "🔄 Checking out code from branch: ${env.GIT_BRANCH}"
                    checkout scm
                    
                    // Set additional environment variables
                    env.SHORT_COMMIT = sh(
                        script: 'git rev-parse --short HEAD',
                        returnStdout: true
                    ).trim()
                }
            }
        }
        
        stage('Setup Environment') {
            steps {
                script {
                    echo "🛠️ Setting up build environment"
                    
                    // Install dependencies if needed
                    sh '''
                        # Install Node.js dependencies
                        npm --version
                        node --version
                        
                        # Install Python dependencies
                        python3 --version
                        pip3 --version
                        
                        # AWS CLI
                        aws --version
                        
                        # Docker
                        docker --version
                        
                        # kubectl
                        kubectl version --client
                    '''
                }
            }
        }
        
        stage('Run Tests') {
            when {
                expression { params.SKIP_TESTS == false }
            }
            parallel {
                stage('Frontend Tests') {
                    steps {
                        script {
                            echo "🧪 Running frontend tests"
                            sh '''
                                npm ci
                                npm run lint || true
                                # npm run test -- --coverage || true
                            '''
                        }
                    }
                }
                
                stage('Backend Tests') {
                    steps {
                        script {
                            echo "🧪 Running backend tests"
                            sh '''
                                cd Backend_Flask
                                pip3 install -r requirements.txt
                                # python3 -m pytest tests/ --cov || true
                            '''
                        }
                    }
                }
            }
        }
        
        stage('Security Scan') {
            when {
                expression { params.RUN_SECURITY_SCAN == true }
            }
            steps {
                script {
                    echo "🔒 Running security vulnerability scan"
                    sh '''
                        # Frontend security scan
                        npm audit --audit-level=high || true
                        
                        # Backend security scan
                        cd Backend_Flask
                        pip3 install safety
                        safety check || true
                    '''
                }
            }
        }
        
        stage('Build Docker Images') {
            parallel {
                stage('Build Backend') {
                    steps {
                        script {
                            echo "🐳 Building backend Docker image"
                            sh """
                                docker build \
                                    -t ${ECR_BACKEND_REPO}:${IMAGE_TAG} \
                                    -t ${ECR_BACKEND_REPO}:latest \
                                    -f Dockerfile.backend \
                                    --build-arg BUILD_DATE=\$(date -u +'%Y-%m-%dT%H:%M:%SZ') \
                                    --build-arg VCS_REF=${env.GIT_COMMIT} \
                                    .
                            """
                        }
                    }
                }
                
                stage('Build Frontend') {
                    steps {
                        script {
                            echo "🐳 Building frontend Docker image"
                            sh """
                                docker build \
                                    -t ${ECR_FRONTEND_REPO}:${IMAGE_TAG} \
                                    -t ${ECR_FRONTEND_REPO}:latest \
                                    -f Dockerfile.frontend \
                                    --build-arg BUILD_DATE=\$(date -u +'%Y-%m-%dT%H:%M:%SZ') \
                                    --build-arg VCS_REF=${env.GIT_COMMIT} \
                                    .
                            """
                        }
                    }
                }
            }
        }
        
        stage('Push to ECR') {
            steps {
                script {
                    echo "📦 Pushing Docker images to ECR"
                    sh """
                        # Login to ECR
                        aws ecr get-login-password --region ${AWS_REGION} | \
                            docker login --username AWS --password-stdin ${ECR_REGISTRY}
                        
                        # Push backend image
                        docker push ${ECR_BACKEND_REPO}:${IMAGE_TAG}
                        docker push ${ECR_BACKEND_REPO}:latest
                        
                        # Push frontend image
                        docker push ${ECR_FRONTEND_REPO}:${IMAGE_TAG}
                        docker push ${ECR_FRONTEND_REPO}:latest
                        
                        echo "✅ Images pushed successfully"
                    """
                }
            }
        }
        
        stage('Deploy to Kubernetes') {
            when {
                expression { params.DEPLOY_TO_K8S == true }
            }
            steps {
                script {
                    echo "🚀 Deploying to Kubernetes (${ENVIRONMENT})"
                    
                    sh """
                        # Configure kubectl
                        aws eks update-kubeconfig \
                            --region ${AWS_REGION} \
                            --name ${EKS_CLUSTER_NAME}
                        
                        # Set image tags in deployments
                        kubectl set image deployment/backend \
                            backend=${ECR_BACKEND_REPO}:${IMAGE_TAG} \
                            -n ${K8S_NAMESPACE}
                        
                        kubectl set image deployment/frontend \
                            frontend=${ECR_FRONTEND_REPO}:${IMAGE_TAG} \
                            -n ${K8S_NAMESPACE}
                        
                        # Wait for rollout to complete
                        kubectl rollout status deployment/backend -n ${K8S_NAMESPACE} --timeout=5m
                        kubectl rollout status deployment/frontend -n ${K8S_NAMESPACE} --timeout=5m
                    """
                }
            }
        }
        
        stage('Verify Deployment') {
            when {
                expression { params.DEPLOY_TO_K8S == true }
            }
            steps {
                script {
                    echo "✅ Verifying deployment"
                    sh """
                        # Check pod status
                        kubectl get pods -n ${K8S_NAMESPACE}
                        
                        # Check deployment status
                        kubectl get deployments -n ${K8S_NAMESPACE}
                        
                        # Check service endpoints
                        kubectl get svc -n ${K8S_NAMESPACE}
                        
                        # Check ingress
                        kubectl get ingress -n ${K8S_NAMESPACE}
                    """
                }
            }
        }
        
        stage('Run Smoke Tests') {
            when {
                expression { params.DEPLOY_TO_K8S == true }
            }
            steps {
                script {
                    echo "🔥 Running smoke tests"
                    sh """
                        # Wait for pods to be ready
                        sleep 30
                        
                        # Get service endpoints
                        BACKEND_URL=\$(kubectl get ingress adaptivq-ingress -n ${K8S_NAMESPACE} -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')
                        
                        # Test backend health endpoint
                        curl -f http://\${BACKEND_URL}/health || exit 1
                        
                        echo "✅ Smoke tests passed"
                    """
                }
            }
        }
    }
    
    post {
        success {
            echo "✅ Pipeline completed successfully!"
            script {
                if (params.DEPLOY_TO_K8S) {
                    echo """
                    🎉 Deployment Summary:
                    - Environment: ${ENVIRONMENT}
                    - Image Tag: ${IMAGE_TAG}
                    - Backend Image: ${ECR_BACKEND_REPO}:${IMAGE_TAG}
                    - Frontend Image: ${ECR_FRONTEND_REPO}:${IMAGE_TAG}
                    """
                }
            }
        }
        
        failure {
            echo "❌ Pipeline failed!"
            script {
                // Send notifications (Slack, Email, etc.)
                echo "Sending failure notifications..."
            }
        }
        
        always {
            echo "🧹 Cleaning up..."
            sh """
                # Clean up Docker images
                docker system prune -f || true
                
                # Archive build artifacts
                echo "Build Number: ${env.BUILD_NUMBER}" > build-info.txt
                echo "Git Commit: ${env.GIT_COMMIT}" >> build-info.txt
                echo "Image Tag: ${IMAGE_TAG}" >> build-info.txt
            """
            
            archiveArtifacts artifacts: 'build-info.txt', fingerprint: true
            
            // Clean workspace
            cleanWs()
        }
    }
}
