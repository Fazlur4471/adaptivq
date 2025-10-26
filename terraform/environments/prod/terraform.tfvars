# Production Environment Variables
environment = "prod"
aws_region  = "us-east-1"

# VPC Configuration
vpc_cidr = "10.0.0.0/16"

# EKS Configuration
eks_cluster_version = "1.28"
eks_node_groups = {
  general = {
    desired_size   = 5
    min_size       = 3
    max_size       = 15
    instance_types = ["t3.large"]
    disk_size      = 100
  }
}

# RDS Configuration
rds_instance_class     = "db.r6g.xlarge"
rds_allocated_storage  = 200
rds_multi_az          = true

# Redis Configuration
redis_node_type   = "cache.r6g.large"
redis_num_nodes   = 3
