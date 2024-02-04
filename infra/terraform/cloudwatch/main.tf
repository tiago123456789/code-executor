terraform {
  backend "s3" {
    bucket = "poc-terraform-backend-state"
    profile = "tiago"
    region = "us-east-1"
    key = "code_executor_cloudwatch"
  }
}

provider "aws" {
  region = "${var.aws_region}"
  profile = "${var.aws_profile}"
}


resource "aws_cloudwatch_log_group" "code_executor_log_group" {
  name              = "/log/code_executor_log_group_${var.environment}" 
  retention_in_days = 7 
}

resource "aws_cloudwatch_log_stream" "log_stream" {
  name           = "code_executor_log_stream_${var.environment}" 
  log_group_name = aws_cloudwatch_log_group.code_executor_log_group.name
}
