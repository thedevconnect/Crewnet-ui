# GitHub Pages Deployment Guide

This guide will help you deploy your Angular app to GitHub Pages.

## Prerequisites

1. Your code must be pushed to a GitHub repository
2. GitHub Pages must be enabled in your repository settings

## Setup Steps

### 1. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings**
3. Scroll down to **Pages** section
4. Under **Source**, select **GitHub Actions**
5. Save the settings

### 2. Update Repository Name (if needed)

If your repository name is different from `Crewnet-ui`, update the base-href in `package.json`:

```json
"build:github": "ng build --configuration production --base-href /YOUR-REPO-NAME/"
```

Replace `YOUR-REPO-NAME` with your actual repository name.

### 3. Update Branch Name (if needed)

If your default branch is `master` instead of `main`, update `.github/workflows/deploy.yml`:

```yaml
branches:
  - master  # Change from 'main' to 'master'
```

### 4. Deploy

1. Push your code to the `main` (or `master`) branch:
   ```bash
   git add .
   git commit -m "Setup GitHub Pages deployment"
   git push origin main
   ```

2. GitHub Actions will automatically:
   - Build your Angular app
   - Deploy it to GitHub Pages

3. Check the deployment status:
   - Go to **Actions** tab in your repository
   - You'll see the deployment workflow running

4. Once deployment is complete, your app will be available at:
   ```
   https://YOUR-USERNAME.github.io/Crewnet-ui/
   ```

## Manual Deployment

If you want to deploy manually:

```bash
npm run build:github
```

Then push the `dist/oblo/browser` folder to the `gh-pages` branch (if using that method).

## Troubleshooting

### 404 Error on Routes

If you're getting 404 errors when navigating to routes, you may need to add a `404.html` file that redirects to `index.html`. GitHub Pages doesn't support Angular routing by default.

### Assets Not Loading

Make sure the `base-href` in `package.json` matches your repository name exactly.

### Build Fails

- Check Node.js version (should be 20+)
- Ensure all dependencies are installed: `npm ci`
- Check the Actions tab for detailed error messages

## Custom Domain (Optional)

If you want to use a custom domain:

1. Add a `CNAME` file in the `public` folder with your domain name
2. Configure DNS settings as per GitHub Pages documentation

