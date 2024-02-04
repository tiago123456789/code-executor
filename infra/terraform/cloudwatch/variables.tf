
variable "environment" {
  type = string
  default = "dev"

  validation {
    condition     = can(index(["dev", "stage", "prod"], var.environment))
    error_message = "Invalid environment. Allowed values are dev, stage, or prod."
  }
}

variable "aws_profile" {
  type = string
}

variable "aws_region" {
  type = string
  default = "us-east-1"
}