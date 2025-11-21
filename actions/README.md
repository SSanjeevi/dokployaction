# Dokploy Composite Actions

> Modular, reusable GitHub Actions for Dokploy deployments

## 📦 Available Actions

### 1. Deploy (`actions/deploy`)
Deploy a Docker image to Dokploy application.

**Inputs:**
- `dokploy-url` (required): Dokploy instance URL
- `api-key` (required): Dokploy API key
- `application-id` (required): Application ID
- `docker-image` (required): Docker image to deploy
- `wait-for-completion` (optional, default: `true`): Wait for deployment
- `timeout` (optional, default: `300`): Timeout in seconds

**Outputs:**
- `deployment-id`: Deployment ID
- `deployment-status`: Deployment status

**Example:**
```yaml
- uses: your-org/dokployaction/actions/deploy@v1
  with:
    dokploy-url: ${{ secrets.DOKPLOY_URL }}
    api-key: ${{ secrets.DOKPLOY_API_KEY }}
    application-id: 'app_123'
    docker-image: 'ghcr.io/user/app:latest'
```

---

### 2. Health Check (`actions/health-check`)
Perform health check with automatic retries.

**Inputs:**
- `health-check-url` (required): Health check URL
- `max-retries` (optional, default: `10`): Maximum retries
- `retry-interval` (optional, default: `6`): Interval between retries (seconds)
- `expected-status` (optional, default: `200`): Expected HTTP status
- `timeout` (optional, default: `10`): Request timeout (seconds)

**Outputs:**
- `health-status`: Health status (`healthy`/`unhealthy`)
- `http-code`: HTTP status code received

**Example:**
```yaml
- uses: your-org/dokployaction/actions/health-check@v1
  with:
    health-check-url: 'https://app.com/health'
    max-retries: 10
    retry-interval: 6
```

---

### 3. Cleanup Containers (`actions/cleanup-containers`)
Remove old containers with prefix filtering.

**Inputs:**
- `dokploy-url` (required): Dokploy instance URL
- `api-key` (required): Dokploy API key
- `application-id` (required): Application ID
- `container-prefix` (optional): Container name prefix filter
- `keep-count` (optional, default: `1`): Number of containers to keep
- `dry-run` (optional, default: `false`): Dry run mode

**Outputs:**
- `removed-count`: Number of containers removed
- `kept-count`: Number of containers kept

**Example:**
```yaml
- uses: your-org/dokployaction/actions/cleanup-containers@v1
  with:
    dokploy-url: ${{ secrets.DOKPLOY_URL }}
    api-key: ${{ secrets.DOKPLOY_API_KEY }}
    application-id: 'app_123'
    container-prefix: 'myapp-prod'
    keep-count: 2
```

---

### 4. Setup SSL (`actions/setup-ssl`)
Configure SSL/TLS certificates.

**Inputs:**
- `dokploy-url` (required): Dokploy instance URL
- `api-key` (required): Dokploy API key
- `application-id` (required): Application ID
- `domain-id` (required): Domain ID
- `certificate-type` (optional, default: `letsencrypt`): Certificate type
- `email` (optional): Email for Let's Encrypt
- `certificate` (optional): Custom SSL certificate (PEM)
- `private-key` (optional): Custom SSL private key (PEM)

**Outputs:**
- `ssl-status`: SSL configuration status
- `certificate-type`: Type of certificate configured

**Example (Let's Encrypt):**
```yaml
- uses: your-org/dokployaction/actions/setup-ssl@v1
  with:
    dokploy-url: ${{ secrets.DOKPLOY_URL }}
    api-key: ${{ secrets.DOKPLOY_API_KEY }}
    application-id: 'app_123'
    domain-id: 'domain_456'
    certificate-type: 'letsencrypt'
    email: 'admin@example.com'
```

---

### 5. Configure Domain (`actions/configure-domain`)
Set up custom domain for application.

**Inputs:**
- `dokploy-url` (required): Dokploy instance URL
- `api-key` (required): Dokploy API key
- `application-id` (required): Application ID
- `domain-host` (required): Domain host
- `port` (optional, default: `80`): Application port
- `https` (optional, default: `true`): Enable HTTPS
- `path` (optional, default: `/`): Path prefix

**Outputs:**
- `domain-id`: Created domain ID
- `domain-url`: Full domain URL

**Example:**
```yaml
- uses: your-org/dokployaction/actions/configure-domain@v1
  with:
    dokploy-url: ${{ secrets.DOKPLOY_URL }}
    api-key: ${{ secrets.DOKPLOY_API_KEY }}
    application-id: 'app_123'
    domain-host: 'api.example.com'
    https: true
```

---

### 6. Rollback (`actions/rollback`)
Rollback to previous version.

**Inputs:**
- `dokploy-url` (required): Dokploy instance URL
- `api-key` (required): Dokploy API key
- `application-id` (required): Application ID
- `wait-for-completion` (optional, default: `true`): Wait for rollback
- `timeout` (optional, default: `300`): Timeout in seconds

**Outputs:**
- `rollback-status`: Rollback status

**Example:**
```yaml
- uses: your-org/dokployaction/actions/rollback@v1
  with:
    dokploy-url: ${{ secrets.DOKPLOY_URL }}
    api-key: ${{ secrets.DOKPLOY_API_KEY }}
    application-id: 'app_123'
```

---

## 🔗 Chaining Actions

You can chain actions together to create custom workflows:

```yaml
- name: Deploy
  id: deploy
  uses: ./actions/deploy
  with:
    dokploy-url: ${{ secrets.DOKPLOY_URL }}
    api-key: ${{ secrets.DOKPLOY_API_KEY }}
    application-id: 'app_123'
    docker-image: 'ghcr.io/user/app:latest'

- name: Health Check
  id: health
  uses: ./actions/health-check
  with:
    health-check-url: 'https://app.com/health'
  continue-on-error: true

- name: Cleanup
  if: steps.health.outputs.health-status == 'healthy'
  uses: ./actions/cleanup-containers
  with:
    dokploy-url: ${{ secrets.DOKPLOY_URL }}
    api-key: ${{ secrets.DOKPLOY_API_KEY }}
    application-id: 'app_123'

- name: Rollback
  if: steps.health.outputs.health-status != 'healthy'
  uses: ./actions/rollback
  with:
    dokploy-url: ${{ secrets.DOKPLOY_URL }}
    api-key: ${{ secrets.DOKPLOY_API_KEY }}
    application-id: 'app_123'
```

---

## 📚 More Information

- [Reusable Actions Guide](../REUSABLE_ACTIONS_GUIDE.md)
- [Examples](../examples/reusable/)
- [Main Documentation](../README.md)

