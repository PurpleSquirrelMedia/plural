external-dns:
  provider: {{ .Values.provider }}
  txtOwnerId: {{ .Values.txt_owner }}
  rbac:
    create: true
    serviceAccountName: {{ default "external-dns" .Values.externaldns_service_account }}
    serviceAccountAnnotations:
      eks.amazonaws.com/role-arn: "arn:aws:iam::{{ .Project }}:role/cluster-autoscaler"
  domainFilters:
  - {{ .Values.dns_domain }}
  google:
    project: {{ .Values.gcp_project_id }}
    serviceAccountSecret: externaldns
  aws:
    region: {{ .Region }}

grafana_dns: {{ .Values.grafana_dns }}

ownerEmail: {{ .Values.ownerEmail }}

cluster-autoscaler:
{{ if eq (default "google" .Values.provider) "google" }}
  enabled: false
{{ else }}
  enabled: true
{{ end }}
  awsRegion: {{ .Region }}

  rbac:
    create: true
    serviceAccount:
      # This value should match local.k8s_service_account_name in locals.tf
      name: cluster-autoscaler
      annotations:
        # This value should match the ARN of the role created by module.iam_assumable_role_admin in irsa.tf
        eks.amazonaws.com/role-arn: "arn:aws:iam::{{ .Project }}:role/cluster-autoscaler"

  autoDiscovery:
    clusterName: {{ .Cluster }}
    enabled: true

grafana:
  admin:
    password: {{ dedupe . "bootstrap.grafana.admin.password" (randAlphaNum 14) }}
    user: admin
  ingress:
    tls:
    - hosts:
      - {{ .Values.grafana_dns }}
      secretName: grafana-tls
    hosts:
    - {{ .Values.grafana_dns }}