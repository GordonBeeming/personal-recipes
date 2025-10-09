# Fix Tina CLI esbuild Define Error

**Date**: 2025-10-09
**Task**: 02
**Type**: Bug Fix
**Status**: Complete

## Problem

GitHub Actions workflow was failing during the Tina CMS build step with the following error:

```
error: Invalid define value (must be an entity name or valid JSON syntax): new Object({})
```

**Failed workflow run**: https://github.com/GordonBeeming/personal-recipes/actions/runs/18367916892/job/52324303575

The issue persisted even after the previous fix (removing job-level env vars). The root cause was a bug in the Tina CLI itself.

## Root Cause

The Tina CLI (versions 1.10.0 - 1.11.0) has a bug where it sets the `process.env` define value for esbuild as:

```javascript
"process.env": `new Object(${JSON.stringify(publicEnv)})`
```

This results in values like `new Object({})` or `new Object({"NEXT_PUBLIC_TINA_CLIENT_ID":"value"})`, which are **invalid** for esbuild's `define` option.

### Why This Failed

1. esbuild's `define` option requires values to be valid JavaScript expressions that can be inlined
2. `new Object({...})` is a constructor call with an object literal argument
3. This syntax is not supported by esbuild's define option (in any version tested: 0.17.19, 0.20.0, 0.24.2, 0.25.10)
4. Even an empty `new Object({})` triggers the error

### Investigation Process

- Tested with multiple esbuild versions (0.17.19, 0.20.0, 0.24.2, 0.25.10) - all failed
- Tried renaming environment variables to avoid `NEXT_PUBLIC_` prefix - still failed with empty object
- Examined Tina CLI source code and found the problematic define value
- Created a patch to fix the Tina CLI bug

## Solution

### 1. Renamed Environment Variables

Changed from `NEXT_PUBLIC_TINA_CLIENT_ID` to `TINA_CLIENT_ID` to avoid Tina CLI's automatic collection of `NEXT_PUBLIC_*` environment variables.

### 2. Created Patch for Tina CLI

Used `patch-package` to fix the bug in `@tinacms/cli`:

**Before**:
```javascript
"process.env": `new Object(${JSON.stringify(publicEnv)})`
```

**After**:
```javascript
"process.env": JSON.stringify(publicEnv)
```

This changes the output from:
- ❌ `new Object({})` → Invalid for esbuild
- ✅ `{}` → Valid JSON for esbuild

### 3. Added Esbuild Override

Pinned esbuild to version 0.17.19 to ensure consistent behavior across all dependencies:

```json
"overrides": {
  "esbuild": "0.17.19"
}
```

### 4. Added postinstall Script

Added `postinstall` script to automatically apply the Tina CLI patch after `npm install`:

```json
"scripts": {
  "postinstall": "patch-package"
}
```

## Changes Made

### Files Modified

1. **`tina/config.ts`**
   - Changed `clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID` 
   - To: `clientId: process.env.TINA_CLIENT_ID`

2. **`.env.example`**
   - Updated variable name from `NEXT_PUBLIC_TINA_CLIENT_ID` to `TINA_CLIENT_ID`

3. **`.github/workflows/deploy.yml`**
   - Updated `.env` file creation to use `TINA_CLIENT_ID` instead of `NEXT_PUBLIC_TINA_CLIENT_ID`
   - Note: GitHub secrets need to be renamed from `NEXT_PUBLIC_TINA_CLIENT_ID` to `TINA_CLIENT_ID`

4. **`package.json`**
   - Added `patch-package` to devDependencies
   - Added `"postinstall": "patch-package"` script
   - Added esbuild override: `"esbuild": "0.17.19"`

### Files Created

1. **`patches/@tinacms+cli+1.11.0.patch`**
   - Patch file that fixes the Tina CLI esbuild define bug
   - Automatically applied during `npm install`

## Testing

### Local Build Test
```bash
npm install
npm run build
```

✅ **Result**: Build successful
- Tina build completes without esbuild errors
- Admin UI generated in `public/admin/`
- Site builds successfully

### What the Patch Does

The patch modifies `node_modules/@tinacms/cli/dist/index.js` to change how the `process.env` define value is set. Instead of using `new Object(...)`, it uses plain JSON stringification, which is valid for esbuild.

## GitHub Secrets Update Required

**Important**: The GitHub repository secrets need to be updated:

1. Go to repository Settings → Secrets and variables → Actions
2. Delete or rename `NEXT_PUBLIC_TINA_CLIENT_ID` to `TINA_CLIENT_ID`
3. The value remains the same, only the name changes

## Follow-up

- [ ] Update GitHub secrets: Rename `NEXT_PUBLIC_TINA_CLIENT_ID` to `TINA_CLIENT_ID`
- [ ] Monitor first GitHub Actions workflow run after merge
- [ ] Consider submitting issue/PR to Tina CLI repository about this bug

## Related Documentation

- Previous fix attempt: `docs/tasks/20251009-01-fix-github-actions-esbuild-error.md`
- Tina Cloud setup: `docs/TINA_CLOUD_SETUP.md`
- Package manager switch: `docs/tasks/20250107-01-npm-and-markdown-recipes.md`

## Notes

- This fix uses `patch-package` to modify third-party code, which is generally avoided but necessary here
- The patch is minimal and surgical - only one line changed
- The patch will be reapplied automatically after every `npm install`
- If Tina CLI releases a fix for this bug, we can remove the patch
- Esbuild version is pinned to ensure compatibility with the patched Tina CLI
