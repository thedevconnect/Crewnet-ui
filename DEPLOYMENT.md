# Deployment Guide

This guide covers deployment options for the Angular 20 application.

## 🚀 Vercel Deployment (Recommended)

Vercel is the recommended deployment platform for this Angular application.

### Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. Your code pushed to a GitHub repository

### Quick Setup

1. **Connect Repository to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Angular framework

2. **Build Settings (Auto-configured):**
   - Framework: Angular
   - Build Command: `npm run build`
   - Output Directory: `dist/crewnet-ui/browser`
   - Install Command: `npm ci`

3. **Deploy:**
   - Click "Deploy"
   - Vercel will automatically build and deploy
   - Your app will be live at: `https://your-project.vercel.app`

### Configuration

The project includes `vercel.json` with the following configuration:

```json
{
  "framework": "angular",
  "buildCommand": "npm run build",
  "outputDirectory": "dist/crewnet-ui/browser",
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

This configuration:
- Enables Angular framework optimizations
- Routes all requests to `index.html` for client-side routing
- Ensures proper SPA routing support

### Automatic Deployments

- Every push to `main` branch triggers automatic deployment
- Preview deployments are created for pull requests
- Zero-downtime deployments

---

## 📦 GitHub Pages Deployment (Alternative)

If you prefer GitHub Pages, follow these steps:

### Prerequisites

1. Your code must be pushed to a GitHub repository
2. GitHub Pages must be enabled in your repository settings

### Setup Steps

#### 1. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings**
3. Scroll down to **Pages** section
4. Under **Source**, select **GitHub Actions**
5. Save the settings

#### 2. Add GitHub Pages Build Script

Add this script to `package.json`:

```json
"build:github": "ng build --configuration production --base-href /Crewnet-ui/"
```

#### 3. Create GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Angular App to GitHub Pages

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build:github
        env:
          NODE_OPTIONS: '--max_old_space_size=4096'

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: 'dist/crewnet-ui/browser'

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

#### 4. Update Base Href

Update `src/index.html`:

```html
<base href="/Crewnet-ui/">
```

#### 5. Add 404.html for Routing

Create `public/404.html` (copy of `index.html`) to handle Angular routing.

#### 6. Deploy

Push your code to trigger automatic deployment:

```bash
git add .
git commit -m "Setup GitHub Pages deployment"
git push origin main
```

Your app will be available at:
```
https://YOUR-USERNAME.github.io/Crewnet-ui/
```

---

## 🔧 Troubleshooting

### Vercel Deployment Issues

**404 Error on Routes:**
- Ensure `vercel.json` is in the project root
- Verify routes configuration redirects to `/index.html`
- Check that `outputDirectory` matches your build output

**Build Fails:**
- Check Node.js version (should be 20+)
- Ensure all dependencies are installed: `npm ci`
- Check build logs in Vercel dashboard

### GitHub Pages Deployment Issues

**404 Error on Routes:**
- Ensure `404.html` exists in `public/` folder
- Verify base-href matches repository name exactly
- Check that GitHub Actions workflow is running

**Assets Not Loading:**
- Make sure the `base-href` in `package.json` matches your repository name exactly
- Verify assets are in the correct output directory

**Build Fails:**
- Check Node.js version (should be 20+)
- Ensure all dependencies are installed: `npm ci`
- Check the Actions tab for detailed error messages

---

## 📝 Notes

- **Vercel** is recommended for easier setup and better Angular support
- **GitHub Pages** requires additional configuration (base-href, 404.html, workflow)
- Both platforms support automatic deployments
- Vercel provides preview deployments for pull requests
- GitHub Pages is free but requires public repository for free tier

---

## 🌐 Custom Domain

### Vercel
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS as instructed

### GitHub Pages
1. Add a `CNAME` file in the `public` folder with your domain name
2. Configure DNS settings as per GitHub Pages documentation
