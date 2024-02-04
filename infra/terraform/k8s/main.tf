terraform {
  backend "s3" {
    bucket = "poc-terraform-backend-state"
    profile = "tiago"
    region = "us-east-1"
    key = "code_executor_k8s_cluster"
  }
}

terraform {
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
  }
}

provider "digitalocean" {
  token = var.do_token
}

resource "digitalocean_container_registry" "repository" {
  name                   = "code-executor"
  subscription_tier_slug = "basic"
  region = "NYC3"
}

resource "digitalocean_kubernetes_cluster" "k8s_cluster" {
  name   = "code-executor-k8s"
  region = "nyc3"
  version = "1.27.9-do.0"

  node_pool {
    name       = "worker-pool"
    size       = "s-2vcpu-2gb"
    node_count = 3
  }
}

