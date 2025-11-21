# Quick Start Guide

> Get started with Dokploy GitHub Actions in 5 minutes

## 🚀 Prerequisites

Before you begin, ensure you have:

- ✅ A Dokploy instance running and accessible
- ✅ A GitHub repository with your application
- ✅ Docker image registry access (GitHub Container Registry recommended)
- ✅ Basic knowledge of GitHub Actions

## 📝 Step 1: Generate Dokploy API Key

1. Log in to your Dokploy dashboard
2. Navigate to **Settings** → **API Keys**
3. Click **Generate New API Key**
4. Copy the API key (you won't see it again!)

## 🔐 Step 2: Configure GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add the following secrets:

```
Name: DOKPLOY_URL
Value: https://your-dokploy-instance.com

Name: DOKPLOY_API_KEY
Value: dkp_your_api_key_here
```

## 📦 Step 3: Create Your First Workflow

Create `.github/workflows/deploy.yml` in your repository:

```yaml
name: Deploy to Dokploy

on:
  push:
    branches:
      - main

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  deploy:
    name: Build and Deploy
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:latest

      - name: Deploy to Dokploy
        run: |
          curl -X POST "${{ secrets.DOKPLOY_URL }}/api/application.deploy" \
            -H "x-api-key: ${{ secrets.DOKPLOY_API_KEY }}" \
            -H "Content-Type: application/json" \
            -d "{
              \"applicationId\": \"YOUR_APPLICATION_ID\",
              \"dockerImage\": \"${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:latest\"
            }"
```

## 🎯 Step 4: Get Your Application ID

You need your Dokploy application ID. Get it by:

**Option 1: From Dokploy Dashboard**
- Go to your application in Dokploy
- Copy the application ID from the URL or settings

**Option 2: Using API**
```bash
curl -X GET "https://your-dokploy-instance.com/api/application.all" \
  -H "x-api-key: YOUR_API_KEY"
```

## 🔧 Step 5: Update Workflow

Replace `YOUR_APPLICATION_ID` in the workflow with your actual application ID:

```yaml
"applicationId": "app_abc123xyz"
```

## 🚢 Step 6: Deploy!

1. Commit and push your workflow file:
```bash
git add .github/workflows/deploy.yml
git commit -m "Add Dokploy deployment workflow"
git push origin main
```

2. Go to **Actions** tab in your GitHub repository
3. Watch your deployment in action! 🎉

## ✅ Step 7: Verify Deployment

Check if your application is running:

```bash
# Check application status
curl -X GET "https://your-dokploy-instance.com/api/application.one?applicationId=YOUR_APP_ID" \
  -H "x-api-key: YOUR_API_KEY"

# Check application health (if you have a health endpoint)
curl https://your-app-domain.com/health
```

## 🎓 Next Steps

Now that you have a basic deployment working, explore advanced features:

### 1. Add Health Checks

```yaml
- name: Health Check
  run: |
    MAX_RETRIES=10
    for i in $(seq 1 $MAX_RETRIES); do
      HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
        "https://your-app.com/health" || echo "000")
      
      if [ "$HTTP_CODE" = "200" ]; then
        echo "✅ Application is healthy"
        exit 0
      fi
      
      echo "Retry $i/$MAX_RETRIES..."
      sleep 6
    done
    
    echo "❌ Health check failed"
    exit 1
```

### 2. Use Reusable Workflows

Instead of writing everything from scratch, use our pre-built workflows:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    uses: ./.github/workflows/production-deploy.yml
    with:
      environment: production
      health-check-enabled: true
      cleanup-old-containers: true
    secrets:
      DOKPLOY_URL: ${{ secrets.DOKPLOY_URL }}
      DOKPLOY_API_KEY: ${{ secrets.DOKPLOY_API_KEY }}
```

### 3. Add Multiple Environments

```yaml
jobs:
  deploy-staging:
    if: github.ref == 'refs/heads/develop'
    uses: ./.github/workflows/production-deploy.yml
    with:
      environment: staging
    secrets: inherit

  deploy-production:
    if: github.ref == 'refs/heads/main'
    uses: ./.github/workflows/production-deploy.yml
    with:
      environment: production
    secrets: inherit
```

## 📚 Learn More

- [Complete Documentation](README.md)
- [Workflow Examples](examples/)
- [API Reference](docs/API_REFERENCE.md)
- [Security Best Practices](docs/SECURITY.md)
- [Troubleshooting Guide](docs/TROUBLESHOOTING.md)

## 🆘 Need Help?

- [GitHub Issues](https://github.com/yourusername/dokployaction/issues)
- [Dokploy Documentation](https://docs.dokploy.com)
- [Dokploy Discord](https://discord.gg/dokploy)

## 🎉 Success!

You've successfully set up automated deployments with Dokploy and GitHub Actions!

---

**Time to complete**: ~5 minutes  
**Difficulty**: Beginner  
**Next**: Explore [advanced workflows](examples/advanced/)

