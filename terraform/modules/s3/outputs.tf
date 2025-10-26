output "bucket_names" {
  description = "Map of S3 bucket names"
  value = {
    assets  = aws_s3_bucket.assets.id
    backups = aws_s3_bucket.backups.id
    logs    = aws_s3_bucket.logs.id
  }
}

output "bucket_arns" {
  description = "Map of S3 bucket ARNs"
  value = {
    assets  = aws_s3_bucket.assets.arn
    backups = aws_s3_bucket.backups.arn
    logs    = aws_s3_bucket.logs.arn
  }
}
