# Switch to npm and Refactor Recipes to Load from Markdown

**Date**: 2025-01-07  
**Task**: Revert from pnpm to npm and refactor recipe loading to read from content/recipes/*.md files

## Problem

1. **Package Manager Issues**: pnpm was causing issues in the development environment
2. **Recipe Loading**: Recipes were hardcoded in `src/lib/recipes.ts` instead of being loaded from the markdown files in `content/recipes/`
3. **Tina CMS Integration**: Need to read recipes from the markdown files that Tina CMS manages

## Solution Approach

### 1. Switch from pnpm to npm

**Changes Made**:
- Removed `pnpm-lock.yaml`
- Added `pnpm-lock.yaml` to `.gitignore`
- Removed `workspaces` section from `package.json`
- Updated all documentation references from pnpm to npm commands
- Created `.npmrc` with `legacy-peer-deps=true` to handle React 19 peer dependency warnings

**Files Updated**:
- `.github/copilot-instructions.md` - Changed all `pnpm` references to `npm`
- `.gitignore` - Added pnpm files
- `package.json` - Removed workspaces, removed pnpm-lock.yaml
- Created `.npmrc`

### 2. Fixed npm Dependency Hoisting Issue

**Problem Identified**:
`@tinacms/cli` was bringing in `vite@4.5.14` and `@vitejs/plugin-react@3.1.0` as nested dependencies. npm was satisfying our `vite@^6.3.5` requirement through the nested version instead of installing it at the root level.

**Solution**:
Added `overrides` section to `package.json` to force specific versions:

```json
"overrides": {
    "vite": "$vite",
    "@vitejs/plugin-react": "$@vitejs/plugin-react"
}
```

This tells npm to use our specified versions from devDependencies everywhere, overriding TinaCMS's older versions.

**Result**: vite 6.3.6 and @vitejs/plugin-react 4.3.4 now install correctly at root level.

### 3. Refactored Recipe Loading

**Old Approach**:
- Hardcoded array of sample recipes in `src/lib/recipes.ts`
- Not connected to actual markdown files

**New Approach**:
- Use Vite's `import.meta.glob()` to dynamically import all `.md` files from `content/recipes/`
- Parse YAML frontmatter to extract recipe metadata
- Parse markdown body to extract ingredients and instructions sections

**Implementation Details**:

```typescript
// Import all recipe markdown files as raw strings
const recipeModules = import.meta.glob('/content/recipes/*.md', { 
  eager: true,
  query: '?raw',
  import: 'default'
})
```

**Parsing Logic**:
1. `parseFrontmatter()` - Extracts YAML frontmatter using regex
2. `parseMarkdown()` - Extracts ingredients and instructions from markdown sections
3. `loadRecipesFromContent()` - Combines parsing and creates Recipe objects

**Frontmatter Structure** (from Tina CMS):
```yaml
---
title: Recipe Title
date: 2025-09-21T00:00:00.000Z
source: Source Name
category: Dinner
tags:
  - Tag1
  - Tag2
prepTime: 25 minutes
cookTime: 2 hours
totalTime: 2 hours 25 minutes
servings: 4-6
heroImage: /images/image.jpeg
images:
  - /images/image1.jpeg
---
```

**Markdown Body Structure**:
```markdown
#### **Ingredients**

**For the Section:**

* Ingredient 1
* Ingredient 2

#### **Instructions**

1. Step 1
   * Sub-point
2. Step 2
```

### 4. Fixed Vite Config

**Change**:
Updated `vite.config.ts` to use `@vitejs/plugin-react` instead of `@vitejs/plugin-react-swc` (which wasn't installing properly).

```typescript
import react from "@vitejs/plugin-react";
```

## Testing

### Build Test
```bash
npm run build:local
```
✅ **Result**: Build successful (with minor CSS warnings that are pre-existing)

### Dev Server Test
```bash
npm run dev:prod
```
✅ **Result**: Server starts successfully on http://localhost:5000/

### Recipe Parsing Test
Created test script to verify:
- ✅ Frontmatter extraction works
- ✅ Ingredients section found
- ✅ Instructions section found
- ✅ No console errors in Vite

## Files Changed

- `.github/copilot-instructions.md` - Updated npm references
- `.gitignore` - Added pnpm exclusions
- `.npmrc` - Created with legacy-peer-deps
- `package.json` - Removed workspaces, added overrides, updated dependencies
- `package-lock.json` - Regenerated for npm
- `src/lib/recipes.ts` - Complete refactor to load from markdown
- `vite.config.ts` - Changed plugin import
- Deleted: `pnpm-lock.yaml`

## Known Issues

- CSS warnings during build (pre-existing, not related to this task)
- Large bundle size warning (pre-existing, not related to this task)

## Next Steps

- [ ] Test with Tina CMS running (`npm run dev`)
- [ ] Add error handling for missing or malformed markdown files
- [ ] Add support for parsing Notes section from recipes
- [ ] Run Playwright tests once installed
- [ ] Consider adding recipe validation

## Commits

1. `refactor: Switch from pnpm to npm and update recipes to read from markdown files`
2. `fix: Resolve npm dependency hoisting issue with vite and vitejs plugins`
