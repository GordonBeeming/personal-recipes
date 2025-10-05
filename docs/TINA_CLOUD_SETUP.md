# Tina Cloud Setup Guide

This guide walks you through setting up Tina CMS with Tina Cloud for your recipe website.

## Prerequisites

- GitHub repository with content in `content/recipes/`
- GitHub Pages already configured
- A Tina Cloud account (free tier available)

## Step 1: Create a Tina Cloud Account

1. Go to https://app.tina.io/
2. Sign up with your GitHub account
3. Authorize Tina to access your repositories

## Step 2: Create a New Project

1. Click "Create Project" in the Tina dashboard
2. Select your GitHub repository from the list
3. Choose "Other" as the framework (we're using Vite + React)
4. Configure the project:
   - **Branch**: `main` (or your default branch)
   - **Build Command**: Leave default or set to `npm run build`
   - **Output Directory**: `dist`

## Step 3: Get Your Credentials

After creating the project, you'll see two important values:

1. **Client ID** - This is public and safe to share
2. **Read-Only Token** - This is secret, keep it private

## Step 4: Configure GitHub Secrets

Add these secrets to your GitHub repository:

1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add:
   - Name: `NEXT_PUBLIC_TINA_CLIENT_ID`
   - Value: Your Client ID from Tina Cloud
4. Click **New repository secret** again and add:
   - Name: `TINA_TOKEN`
   - Value: Your Read-Only Token from Tina Cloud

## Step 5: Configure Local Development (Optional)

For local development with Tina CMS:

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your credentials:
   ```
   NEXT_PUBLIC_TINA_CLIENT_ID=your_client_id_here
   TINA_TOKEN=your_token_here
   ```

3. **IMPORTANT**: Never commit `.env` file (it's already in `.gitignore`)

## Step 6: Test the Setup

### Test Locally (with Tina CMS):

```bash
npm run dev
```

This will:
- Start the Tina dev server
- Start Vite on http://localhost:5173
- Make the admin panel available at http://localhost:5173/admin

### Test Build:

```bash
npm run build
```

This will:
- Build the Tina admin interface
- Compile TypeScript
- Build the Vite app

## Step 7: Deploy

Push your changes to GitHub:

```bash
git add .
git commit -m "Configure Tina Cloud"
git push
```

The GitHub Actions workflow will:
1. Build the Tina admin interface (using your secrets)
2. Build the website
3. Deploy to GitHub Pages

## Accessing the CMS

### On Your Deployed Site:

Visit: `https://your-username.github.io/your-repo/admin`

You'll be able to:
- Edit existing recipes
- Create new recipes
- Upload images
- Manage content visually

### Authentication:

Tina Cloud handles authentication automatically. You'll be prompted to sign in with your GitHub account.

## Content Workflow

1. **Edit Content**: Use the admin interface at `/admin`
2. **Tina Saves**: Changes are committed directly to your GitHub repository
3. **Automatic Deploy**: GitHub Actions rebuilds and deploys your site
4. **Live Updates**: Your changes appear on the live site

## Troubleshooting

### Build Fails with "Client not configured properly"

This means your environment variables are not set correctly:
- Check that GitHub secrets are named exactly: `NEXT_PUBLIC_TINA_CLIENT_ID` and `TINA_TOKEN`
- Verify the values match those from Tina Cloud dashboard

### Admin Page Shows 404

- Make sure `public/admin/` folder exists after build
- Check that the build succeeded without errors
- Verify `tinacms build` ran successfully in the GitHub Actions logs

### "Cannot read properties of undefined" in Admin

This usually means:
- The schema in `tina/config.ts` doesn't match your content structure
- Try editing a recipe in the admin to see which field is causing issues

### Local Development Issues

If `npm run dev` doesn't work:
- Check that your `.env` file has the correct credentials
- Try running without Tina: `npm run dev:prod`
- Check the Tina dev server logs for errors

## Next Steps

- Customize the schema in `tina/config.ts` to add/remove fields
- Add more collections (e.g., blog posts, pages)
- Configure media settings for image uploads
- Set up search indexing in Tina Cloud dashboard

## Resources

- [Tina Cloud Documentation](https://tina.io/docs/)
- [Tina Schema Configuration](https://tina.io/docs/schema/)
- [Tina Cloud Dashboard](https://app.tina.io/)
