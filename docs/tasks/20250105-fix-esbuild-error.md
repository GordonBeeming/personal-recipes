# Fix: esbuild Version Mismatch Error

**Date**: 2025-01-05
**Issue**: `Cannot start service: Host version "0.25.1" does not match binary version "0.24.2"`
**Status**: Fix Available

## Problem

After the color palette update, running `pnpm run dev` fails with an esbuild version mismatch error. This happens when:
1. Dependencies were installed with npm in one environment
2. Then pnpm tries to use the npm-installed packages
3. The esbuild binary versions don't match

## Quick Fix

Run these commands in your terminal:

```bash
# Remove all dependency artifacts
rm -rf node_modules pnpm-lock.yaml

# Reinstall with pnpm
pnpm install

# Start the dev server
pnpm run dev
```

## Alternative Fix (If the above doesn't work)

```bash
# Clear pnpm cache
pnpm store prune

# Remove dependencies
rm -rf node_modules pnpm-lock.yaml

# Reinstall
pnpm install --force

# Start dev server
pnpm run dev
```

## What Happened

During the color palette implementation in the development environment:
- Dependencies were installed/modified using npm
- This created version conflicts with esbuild binaries
- Your local pnpm setup detected the mismatch

## Prevention

Going forward:
- Stick to one package manager (pnpm recommended for this project)
- Don't mix npm and pnpm installations
- If someone else modified dependencies with npm, always run `pnpm install` to resync

## Files to Commit After Fix

Once the dev server runs successfully, you may need to commit:
- `pnpm-lock.yaml` (if it was regenerated with different versions)

## Verification

After applying the fix, verify everything works:

```bash
# Should start without errors
pnpm run dev

# Should build without errors  
pnpm run build
```

The color changes and dark mode functionality will work once dependencies are properly installed!

## Why This Happened

The development environment used npm to try to fix missing dependencies during the color palette implementation. This created a mismatch with your local pnpm setup. The actual code changes are correct - it's purely a dependency installation issue.

---

**If this fix doesn't resolve the issue**, please check:
1. Node.js version (should be compatible with the packages)
2. pnpm version (`pnpm --version`)
3. Try clearing global npm/pnpm caches
