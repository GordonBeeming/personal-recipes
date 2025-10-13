# Remove GitHub Spark Resources

**Date**: October 13, 2025  
**Type**: Cleanup / Refactoring

## Problem

The project was originally scaffolded from a GitHub Spark template, which included Spark-specific resources, plugins, and configurations that are no longer needed for this standalone recipe website.

## Solution

Removed all GitHub Spark related resources, dependencies, and references to make the project fully standalone.

## Changes Made

### Deleted Files:
- `spark.meta.json` - Spark metadata configuration
- `.spark-initial-sha` - Spark initialization marker

### Modified Files:

#### `package.json`:
- Changed project name from `spark-template` to `recipes-app`
- Removed `@github/spark` dependency
- Updated scripts to use `npx vite` instead of direct vite command (temporary workaround)

#### `vite.config.ts`:
- Removed `@github/spark/spark-vite-plugin` import
- Removed `@github/spark/vitePhosphorIconProxyPlugin` import
- Removed `sparkPlugin()` from plugins array
- Removed `createIconImportProxy()` from plugins array
- Kept only essential plugins: react, tailwindcss, adminRoutePlugin

#### `src/main.tsx`:
- Removed `import "@github/spark/spark"` - no longer needed

#### `src/ErrorFallback.tsx`:
- Changed error message from "This spark has encountered a runtime error" to "Application Error"
- Removed Spark-specific error messaging

### Dependencies Removed:
- `@github/spark@^0.39.0` and all its sub-dependencies (44 packages total)

## Technical Notes

### Vite Installation Issue
There's currently an environmental issue where vite@6.3.6 is not installing properly despite being in package.json devDependencies. This appears to be a node_modules resolution issue in the current environment.

**Workaround applied**: Updated npm scripts to use `npx vite` which will download and cache vite when needed.

**Proper fix needed**: In a clean environment, run:
```bash
rm -rf node_modules package-lock.json
npm install
```

This should properly install vite@6.3.6 from devDependencies.

## Testing

- [x] Removed all Spark references from code
- [x] Removed Spark dependencies
- [x] Updated error messages
- [x] Vite config cleaned up
- [ ] Dev server test (blocked by vite installation issue)
- [ ] Build test (blocked by vite installation issue)

## Follow-up

- Fix vite installation in clean environment
- Remove `npx` workaround from scripts once vite installs properly
- Consider removing patch-package if Tina patches are no longer needed
