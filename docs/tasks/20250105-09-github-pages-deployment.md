# GitHub Pages Deployment Setup

**Date**: 2025-01-05
**Task**: 09
**Type**: Deployment & Infrastructure
**Status**: Complete - Manual Steps Required

## What's Been Done ✅

### 1. GitHub Actions Workflow Created
- [x] Created `.github/workflows/deploy.yml`
- [x] Automated deployment on push to `main`
- [x] Builds Tina CMS schema
- [x] Builds Vite site
- [x] Deploys to GitHub Pages
- [x] Manual trigger available (workflow_dispatch)

### 2. Vite Configuration Updated
- [x] Added `base: '/'` for GitHub Pages
- [x] Configured for custom domain

### 3. Custom Domain Configuration
- [x] Created `public/CNAME` file with `recipes.gordonbeeming.com`
- [x] CNAME will be included in deployment

## GitHub Repository Setup (Manual Steps)

### Step 1: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** tab
3. Click **Pages** in the left sidebar
4. Under **Build and deployment**:
   - Source: **GitHub Actions**
   - (Don't select "Deploy from a branch")

### Step 2: Add Tina Secrets

1. In your repository, go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add these secrets:

**Secret 1:**
- Name: `TINA_TOKEN`
- Value: `<your-tina-read-only-token>`

**Secret 2:**
- Name: `VITE_TINA_CLIENT_ID`
- Value: `<your-tina-client-id>`

> ⚠️ **Important**: Get these from Tina Cloud at https://app.tina.io

### Step 3: Configure Custom Domain (DNS)

1. Go to your DNS provider (where gordonbeeming.com is hosted)
2. Add a CNAME record:
   - **Type**: CNAME
   - **Name**: recipes (or @recipes)
   - **Value**: `<your-github-username>.github.io`
   - **TTL**: 3600 (or default)

Example:
```
recipes.gordonbeeming.com → gordonbeeming.github.io
```

### Step 4: Enable HTTPS

1. After DNS propagation (can take a few minutes to 24 hours)
2. Go to **Settings** → **Pages**
3. Under **Custom domain**, enter: `recipes.gordonbeeming.com`
4. Click **Save**
5. Wait for DNS check to complete
6. Check **Enforce HTTPS** (will be enabled automatically after DNS verification)

## Workflow Details

### Trigger Events:
- **Automatic**: Every push to `main` branch
- **Manual**: Via "Actions" tab → "Deploy to GitHub Pages" → "Run workflow"

### Build Process:
1. ✅ Checkout code
2. ✅ Setup Node.js 20
3. ✅ Install dependencies (`npm ci`)
4. ✅ Build Tina schema (using `TINA_TOKEN`)
5. ✅ Build Vite site (using `VITE_TINA_CLIENT_ID`)
6. ✅ Upload artifact
7. ✅ Deploy to GitHub Pages

### Environment Variables Used:

**Build Time (Secrets - Not Exposed)**:
- `TINA_TOKEN` - Used only during Tina build, never in browser

**Client Side (Public - Safe to Expose)**:
- `VITE_TINA_CLIENT_ID` - Public identifier, meant to be in browser code

## Security Notes

### ✅ Safe to Expose:
- `VITE_TINA_CLIENT_ID` - This is a public identifier
- Client ID is designed to be visible in browser
- Tina Cloud uses it to identify your project

### 🔒 Never Exposed:
- `TINA_TOKEN` - Only used during build
- Not included in browser bundle
- Kept secure in GitHub Secrets

### Authentication:
- Tina Cloud handles auth separately
- Users log in through Tina Cloud (not your site)
- Your wife will log in at app.tina.io to edit

## Deployment URLs

### After Setup:
- **Production**: https://recipes.gordonbeeming.com
- **Tina Admin**: https://recipes.gordonbeeming.com/admin
- **GitHub Pages**: https://gordonbeeming.github.io/<repo-name>

## Testing Deployment

### After Configuration:

1. **Commit and Push**:
   ```bash
   git push origin main
   ```

2. **Watch Build**:
   - Go to "Actions" tab in GitHub
   - See "Deploy to GitHub Pages" workflow
   - Wait for completion (3-5 minutes)

3. **Verify Site**:
   - Visit https://recipes.gordonbeeming.com
   - Check recipes load correctly
   - Test dark mode toggle
   - Verify search and filters

4. **Test Tina Admin**:
   - Visit https://recipes.gordonbeeming.com/admin
   - Log in with Tina Cloud credentials
   - Try editing a recipe
   - Save changes (commits to GitHub)
   - Deployment auto-triggers
   - Changes go live in 3-5 minutes

## Workflow File Location

`.github/workflows/deploy.yml`

## Files Created/Modified

1. `.github/workflows/deploy.yml` - Deployment workflow
2. `vite.config.ts` - Added base URL
3. `public/CNAME` - Custom domain configuration
4. `docs/tasks/20250105-09-github-pages-deployment.md` - This file

## Troubleshooting

### Build Fails:
- Check "Actions" tab for error details
- Verify secrets are set correctly
- Ensure Tina Cloud is configured

### Domain Not Working:
- Wait 24 hours for DNS propagation
- Verify CNAME record points to `<username>.github.io`
- Check GitHub Pages settings

### HTTPS Not Available:
- Wait for DNS verification
- May take a few minutes after domain is configured
- Check "Enforce HTTPS" option

### Tina Admin Not Loading:
- Verify `VITE_TINA_CLIENT_ID` is set
- Check Tina Cloud project is active
- Ensure admin files are in build (`public/admin`)

## Manual Deployment (If Needed)

If automatic deployment fails, you can deploy manually:

```bash
# Build locally
npm run build:tina
npm run build

# Push to gh-pages branch (if using that method)
# Or use the GitHub Actions workflow manually via "Actions" tab
```

## Next Steps After Deployment

1. **Tina Cloud Webhook** (Optional):
   - Configure webhook in Tina Cloud
   - Trigger builds when content changes
   - Faster updates without code pushes

2. **Custom 404 Page** (Optional):
   - Create `public/404.html`
   - Custom error page for missing recipes

3. **Analytics** (Optional):
   - Add Google Analytics
   - Track recipe views
   - Monitor site usage

## Checklist

- [ ] Enable GitHub Pages (Source: GitHub Actions)
- [ ] Add `TINA_TOKEN` secret
- [ ] Add `VITE_TINA_CLIENT_ID` secret
- [ ] Configure DNS CNAME record
- [ ] Set custom domain in GitHub Pages
- [ ] Wait for DNS propagation
- [ ] Enable HTTPS
- [ ] Push to main branch
- [ ] Verify deployment
- [ ] Test site at recipes.gordonbeeming.com
- [ ] Test admin at recipes.gordonbeeming.com/admin
- [ ] Add wife as collaborator on Tina Cloud

---

**Status**: Workflow created, manual GitHub configuration needed
**Next**: Follow steps above to configure GitHub repo and DNS
**Impact**: MAJOR - Enables automatic deployment and custom domain
