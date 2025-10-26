# Main Terraform configuration for AdaptivQ on AWS
terraform {
  required_version = ">= 1.5.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.23"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.11"
    }
  }

  backend "s3" {
    bucket         = "adaptivq-terraform-state"
    key            = "adaptivq/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "adaptivq-terraform-locks"
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "AdaptivQ"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}

# Data sources
data "aws_caller_identity" "current" {}
data "aws_availability_zones" "available" {
  state = "available"
}

# VPC Module
module "vpc" {
  source = "./modules/vpc"

  environment         = var.environment
  vpc_cidr           = var.vpc_cidr
  availability_zones = data.aws_availability_zones.available.names
  project_name       = var.project_name
}

# EKS Cluster Module
module "eks" {
  source = "./modules/eks"

  environment    = var.environment
  project_name   = var.project_name
  vpc_id         = module.vpc.vpc_id
  subnet_ids     = module.vpc.private_subnet_ids
  cluster_version = var.eks_cluster_version
  
  node_groups = var.eks_node_groups
}

# RDS PostgreSQL Module
module "rds" {
  source = "./modules/rds"

  environment          = var.environment
  project_name         = var.project_name
  vpc_id              = module.vpc.vpc_id
  subnet_ids          = module.vpc.private_subnet_ids
  database_name       = var.database_name
  master_username     = var.database_username
  master_password     = var.database_password
  instance_class      = var.rds_instance_class
  allocated_storage   = var.rds_allocated_storage
  multi_az            = var.rds_multi_az
}

# ElastiCache Redis Module
module "elasticache" {
  source = "./modules/elasticache"

  environment       = var.environment
  project_name      = var.project_name
  vpc_id           = module.vpc.vpc_id
  subnet_ids       = module.vpc.private_subnet_ids
  node_type        = var.redis_node_type
  num_cache_nodes  = var.redis_num_nodes
}

# S3 Buckets Module
module "s3" {
  source = "./modules/s3"

  environment  = var.environment
  project_name = var.project_name
}

# ECR Repositories Module
module "ecr" {
  source = "./modules/ecr"

  environment  = var.environment
  project_name = var.project_name
  
  repositories = [
    "adaptivq-frontend",
    "adaptivq-backend"
  ]
}
