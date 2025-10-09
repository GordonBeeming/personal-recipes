# Fix GitHub Actions Build Failure - esbuild Define Error

**Date**: 2025-10-09
**Task**: 01
**Type**: Bug Fix
**Status**: Complete

## Problem

GitHub Actions workflow was failing during the Tina CMS build step with the following error:

```
[commonjs--resolver] Transform failed with 1 error:
error: Invalid define value (must be an entity name or JS literal): new Object({"NEXT_PUBLIC_TINA_CLIENT_ID":"***"})
```

**Failed workflow run**: https://github.com/GordonBeeming/personal-recipes/actions/runs/18364879491/job/52315785459

## Root Cause

The issue occurred because environment variables were being set at both the **job level** and in the **`.env` file**:

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    env:                                    # ⚠️ PROBLEM: These env vars interfere with esbuild
      TINA_TOKEN: ${{ secrets.TINA_TOKEN }}
      NEXT_PUBLIC_TINA_CLIENT_ID: ${{ secrets.NEXT_PUBLIC_TINA_CLIENT_ID }}
    steps:
      - name: Create .env file for Tina build
        run: |
          echo "TINA_TOKEN=${{ secrets.TINA_TOKEN }}" > .env     # Also setting in .env
          echo "NEXT_PUBLIC_TINA_CLIENT_ID=${{ secrets.NEXT_PUBLIC_TINA_CLIENT_ID }}" >> .env
```

When environment variables are set at the job level, they are available in the shell environment during all steps. The Tina CLI internally uses Vite's esbuild, which tries to use these environment variables through the `define` option. However, esbuild was receiving the values in an invalid format (`new Object({...})`), causing the build to fail.

## Solution

**Remove the job-level environment variables** and rely only on the `.env` file:

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    # ✅ No env vars at job level
    steps:
      - name: Create .env file for Tina build
        run: |
          echo "TINA_TOKEN=${{ secrets.TINA_TOKEN }}" > .env
          echo "NEXT_PUBLIC_TINA_CLIENT_ID=${{ secrets.NEXT_PUBLIC_TINA_CLIENT_ID }}" >> .env
      
      - name: Build site with Tina CMS
        run: npm run build
```

This approach:
1. Creates a `.env` file with the secrets
2. Tina CLI reads from the `.env` file (standard Node.js behavior via dotenv)
3. Avoids esbuild's `define` option receiving environment variables in the wrong format
4. Environment variables are isolated to the Tina build process only

## Changes Made

### Files Modified

1. **`.github/workflows/deploy.yml`**
   - Removed `env:` section from the `build` job
   - Kept the `.env` file creation step
   - Environment variables are now only available through the `.env` file

## Why This Works

- **Node.js/Vite convention**: Most Node.js tools (including Vite and Tina CLI) automatically load environment variables from `.env` files using the `dotenv` package
- **Isolated scope**: Environment variables in the `.env` file are loaded by the application, not by the shell
- **esbuild compatibility**: When esbuild needs to inject environment variables, it reads them from the application's environment (loaded from `.env`), not from GitHub Actions' shell environment

## Testing

After this fix, the GitHub Actions workflow should:
1. ✅ Install dependencies successfully
2. ✅ Create `.env` file with Tina credentials
3. ✅ Build Tina CMS admin UI without esbuild errors
4. ✅ Build the Vite site successfully
5. ✅ Deploy to GitHub Pages

## Related Documentation

- Previous fix attempt: `docs/tasks/20251008-08-fix-tina-cms-404-on-production.md`
- Tina Cloud setup: `docs/TINA_CLOUD_SETUP.md`

## Notes

- The `.env` file is created during the build and is never committed (it's in `.gitignore`)
- This approach is more reliable than setting environment variables at the job level for tools that use esbuild internally
- The fix is minimal and surgical - only removing the problematic `env:` section
