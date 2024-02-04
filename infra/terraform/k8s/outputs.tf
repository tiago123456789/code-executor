output "contaner_registry_endpoint" {
  description = "Container registry endpoint"
  value = "${digitalocean_container_registry.repository.endpoint}"
}


output "cluster_k8s_ipv4_address" {
  description = "Ipv4 of cluster k8s"
  value = "${digitalocean_kubernetes_cluster.k8s_cluster.ipv4_address}"
}

output "cluster_k8s_endpoint" {
  description = "Endpoint of cluster k8s"
  value = "${digitalocean_kubernetes_cluster.k8s_cluster.endpoint}"
}


output "cluster_k8s_id" {
  description = "Id of cluster k8s"
  value = "${digitalocean_kubernetes_cluster.k8s_cluster.id}"
}
