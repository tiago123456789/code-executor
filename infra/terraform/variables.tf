
variable "environment" {
  type = string
  default = "dev"

  validation {
    condition     = can(index(["dev", "stage", "prod"], var.environment))
    error_message = "Invalid environment. Allowed values are dev, stage, or prod."
  }
}