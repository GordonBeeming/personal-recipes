# Switch to pnpm and Fix Dev Server

**Date**: 2025-01-05
**Task**: 12
**Type**: Development Environment Fix
**Status**: Complete

## Issue

Running `pnpm run dev` was failing with esbuild version mismatch error:
```
Cannot start service: Host version "0.25.10" does not match binary version "0.25.1"
```

## Root Cause

- Project uses pnpm as package manager (pnpm-lock.yaml exists)
- Workflow and scripts were using npm
- esbuild binary wasn't built properly during pnpm install
- Version mismatch between esbuild host and binary

## Solution

### 1. ✅ Updated Workflow to Use pnpm
- Changed from `npm ci` to `pnpm install`
- Added pnpm installation step
- Updated cache from 'npm' to 'pnpm'
- All build commands now use pnpm

### 2. ✅ Fixed Package Scripts
- Updated `dev:tina` to use `pnpm run dev` (was `npm run dev`)
- Ensures consistency across all scripts

### 3. ✅ Rebuilt esbuild
- Ran `pnpm rebuild esbuild`
- Fixed binary version mismatch
- Dev server now starts successfully

## Files Changed

### `.github/workflows/deploy.yml`:
```yaml
- name: Setup Node
  uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'pnpm'  # Changed from 'npm'

- name: Install pnpm
  run: npm install -g pnpm  # Added

- name: Install dependencies
  run: pnpm install  # Changed from npm ci

- name: Build Tina
  run: pnpm run build:tina  # Changed from npm

- name: Build site
  run: pnpm run build  # Changed from npm
```

### `package.json`:
```json
"dev:tina": "tinacms dev -c \"pnpm run dev\""
// Changed from "npm run dev"
```

## Testing

### Dev Server:
```bash
pnpm run dev
# ✓ Starts on http://localhost:5000
# ✓ No esbuild errors
# ✓ Hot reload works
```

### Build:
```bash
pnpm run build
# ✓ Compiles successfully
# ✓ Outputs to dist/
```

### Tina Dev:
```bash
pnpm run dev:tina
# ✓ Starts Tina + Vite together
# ✓ Admin accessible
```

## Why pnpm?

Benefits of using pnpm consistently:
- ✅ Faster installs (hard links, not copies)
- ✅ Disk space efficient
- ✅ Strict dependency resolution
- ✅ Better monorepo support
- ✅ pnpm-lock.yaml already in project

## Workflow Impact

GitHub Actions now:
1. Installs pnpm globally
2. Uses pnpm for all package operations
3. Caches pnpm store for faster builds
4. Consistent with local development

## Commands Reference

### Local Development:
```bash
pnpm install          # Install dependencies
pnpm run dev          # Start dev server
pnpm run dev:tina     # Start Tina + dev server
pnpm run build        # Build for production
pnpm run build:tina   # Build Tina schema
pnpm run test         # Run Playwright tests
pnpm run lint         # Run ESLint
```

### Deployment:
- Push to main → GitHub Actions uses pnpm → Builds and deploys

## Future: Copilot Instructions Update

Added note to always use pnpm, not npm, for all package operations.

---

**Status**: Dev server fixed, workflow updated to pnpm
**Impact**: Consistent package manager across dev and CI
**Next**: All development uses pnpm exclusively
