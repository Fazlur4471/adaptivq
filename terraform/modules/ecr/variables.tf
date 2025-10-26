variable "environment" {
  description = "Environment name"
  type        = string
}

variable "project_name" {
  description = "Project name"
  type        = string
}

variable "repositories" {
  description = "List of ECR repository names"
  type        = list(string)
}
