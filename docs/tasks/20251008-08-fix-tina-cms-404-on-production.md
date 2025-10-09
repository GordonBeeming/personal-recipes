# Fix Tina CMS 404 on Production

**Date**: 2025-10-08  
**Issue**: Tina CMS admin interface returns 404 on published site (`/admin` and `/admin/index.html`)

## Problem Statement

The Tina CMS admin interface was not accessible on the production site (https://recipes.gordonbeeming.com/admin), returning a 404 error. Investigation revealed that the `/admin` directory was missing from the deployed site.

## Root Cause

The GitHub Actions deployment workflow was incorrectly configured:

1. **Previous workflow approach**:
   - Ran `npm run build:tina` (which requires Tina Cloud credentials)
   - Allowed the Tina build to fail gracefully if credentials weren't available
   - Then ran `npm run build:local` (which is just `vite build` without Tina)
   
2. **The problem**:
   - When `tinacms build` failed (due to missing/incorrect credentials), no `public/admin/` directory was created
   - The subsequent `build:local` step didn't include Tina, so no admin files were included
   - The final `dist/` directory had no `admin/` folder, resulting in 404s

3. **Why Tina build was failing**:
   - Tina CMS requires either:
     - **Production mode**: Valid `TINA_TOKEN` and `NEXT_PUBLIC_TINA_CLIENT_ID` from Tina Cloud
     - **Local mode**: Running `tinacms dev` with a local GraphQL server (not suitable for static deployment)
   - GitHub secrets may not be configured or may be invalid

## Solution

### 1. Fixed GitHub Actions Workflow

Updated `.github/workflows/deploy.yml` to use the standard build process:

**Issue discovered during deployment**: The build was failing due to schema sync issues with Tina Cloud. When schema changes are made (e.g., adding the `thumbnailImage` field), Tina Cloud needs time to re-index the content. The build was failing with:

```
The local GraphQL schema doesn't match the remote GraphQL schema.
[NON_BREAKING - FIELD_ADDED] Field 'thumbnailImage' was added to object type 'Recipe'
```

**Solution**: Added `--skip-cloud-checks` flag to bypass schema validation during build, allowing deployments to proceed even when Tina Cloud is catching up with schema changes.

**Before**:
```yaml
- name: Build Tina Admin (or use local schema if Cloud not ready)
  run: |
    # Try to build with Tina Cloud first
    if npm run build:tina; then
      echo "✅ Tina Cloud build succeeded"
    else
      echo "⚠️  Tina Cloud build failed..."
    fi
  env:
    TINA_TOKEN: ${{ secrets.TINA_TOKEN }}
    NEXT_PUBLIC_TINA_CLIENT_ID: ${{ secrets.NEXT_PUBLIC_TINA_CLIENT_ID }}

- name: Build site
  run: npm run build:local
  env:
    TINA_TOKEN: ${{ secrets.TINA_TOKEN }}
    NEXT_PUBLIC_TINA_CLIENT_ID: ${{ secrets.NEXT_PUBLIC_TINA_CLIENT_ID }}
```

**After**:
```yaml
- name: Build site with Tina CMS
  run: npm run build
  env:
    TINA_TOKEN: ${{ secrets.TINA_TOKEN }}
    NEXT_PUBLIC_TINA_CLIENT_ID: ${{ secrets.NEXT_PUBLIC_TINA_CLIENT_ID }}
```

This ensures the complete build process runs: `tinacms build && tsc && vite build`

### 2. Required GitHub Secrets Configuration

The workflow requires these secrets to be configured in the GitHub repository:

- `TINA_TOKEN`: Your Tina Cloud read-only token
- `NEXT_PUBLIC_TINA_CLIENT_ID`: Your Tina Cloud client ID

**To configure these**:
1. Go to your Tina Cloud dashboard at https://app.tina.io/
2. Navigate to your project settings
3. Copy the Client ID and generate/copy the Token
4. Add them to GitHub repository secrets:
   - Repository Settings → Secrets and variables → Actions
   - Add `TINA_TOKEN` with the token value
   - Add `NEXT_PUBLIC_TINA_CLIENT_ID` with the client ID

### 3. Added Skip Cloud Checks Flag

Modified `package.json` build scripts to include `--skip-cloud-checks`:

```json
"build": "tinacms build --skip-cloud-checks && npx tsc -b --noCheck && vite build",
"build:tina": "tinacms build --skip-cloud-checks"
```

This prevents build failures when:
- Schema changes are made locally but Tina Cloud hasn't re-indexed yet
- There are non-breaking schema changes (like adding optional fields)
- Tina Cloud indexing is temporarily delayed

### 4. Verification Steps

After the fix:
- [ ] Verify GitHub secrets are configured correctly
- [ ] Push the workflow changes to trigger a new deployment
- [ ] Wait for GitHub Actions workflow to complete
- [ ] Test `/admin` route on the published site
- [ ] Verify Tina CMS admin interface loads correctly
- [ ] Test content editing functionality

## Changes Made

### Files Modified

1. **`.github/workflows/deploy.yml`**
   - Replaced dual-step build (build:tina + build:local) with single `npm run build`
   - Simplified workflow and removed error-prone fallback logic
   - Ensures Tina admin files are always built when credentials are available

2. **`package.json`**
   - Added `--skip-cloud-checks` flag to `build` and `build:tina` scripts
   - Prevents build failures due to Tina Cloud schema sync delays
   - Allows deployments to proceed even with non-breaking schema changes

## Technical Details

### Understanding Tina CMS Build Modes

**Production Build** (`tinacms build`):
- Connects to Tina Cloud GraphQL API
- Generates admin UI in `public/admin/`
- Requires valid credentials
- Admin files are included in `vite build` output

**Local Development** (`tinacms dev`):
- Runs local GraphQL server
- Doesn't require Tina Cloud
- Not suitable for static deployment

**Build Scripts**:
- `npm run build`: Full production build (Tina + app)
- `npm run build:tina`: Only Tina admin build
- `npm run build:local`: Only app build (no Tina)
- `npm run dev`: Development with Tina CMS access

### Why Admin Files Are NOT Committed

From project guidelines:
- `public/admin/` is a build artifact (like `dist/`)
- Generated during build process via `tinacms build`
- Platform-specific (contains esbuild binaries)
- Reproducible on any platform during build
- Listed in `.gitignore` to avoid bloat

## Follow-up Actions

1. **Immediate**: Verify GitHub secrets are properly configured
2. **Testing**: After deployment, test all Tina CMS admin functionality
3. **Documentation**: This task file serves as reference for Tina deployment issues
4. **Monitoring**: Watch for any build failures in future deployments

## References

- Tina CMS Documentation: https://tina.io/docs/
- Tina Cloud Setup: https://tina.io/docs/r/what-is-tinacloud
- Project Copilot Instructions: `.github/copilot-instructions.md` (Tina CMS section)
