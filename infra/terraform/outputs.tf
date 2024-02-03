output "log_name" {
  description = "Cloudwatch log name"
  value = "${aws_cloudwatch_log_group.code_executor_log_group.name}_${var.environment}"
}

output "log_stream_name" {
  description = "Cloudwatch log stream name"
  value = "${aws_cloudwatch_log_stream.log_stream.name}_${var.environment}"
}