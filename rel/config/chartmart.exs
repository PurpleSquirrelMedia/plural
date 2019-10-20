import Config
import System, only: [get_env: 1]

config :core, Core.Guardian,
  issuer: "piazza",
  secret_key: get_env("JWT_SECRET")

config :api, ApiWeb.Endpoint,
  secret_key_base: get_env("SECRET_KEY_BASE")

config :libcluster,
  topologies: [
    api: [
      strategy: Cluster.Strategy.Kubernetes,
      config: [
        mode: :ip,
        kubernetes_node_basename: "api",
        kubernetes_selector: "app=chartmart-api",
        kubernetes_namespace: get_env("NAMESPACE"),
        polling_interval: 10_000
      ]
    ]
  ]