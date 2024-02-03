provider "aws" {
  region = "us-east-1"
  profile = "tiago"
}

resource "aws_cloudwatch_log_group" "code_executor_log_group" {
  name              = "/log/code_executor_log_group" # Replace this with your desired log group name
  retention_in_days = 7 # Modify retention period as needed
}

resource "aws_cloudwatch_log_stream" "log_stream" {
  name           = "code_executor_log_stream" # Replace this with your desired log stream name
  log_group_name = aws_cloudwatch_log_group.code_executor_log_group.name
}
