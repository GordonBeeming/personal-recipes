# Tina CMS Migration Plan

**Date**: 2025-01-05
**Task**: 07
**Type**: Major Migration - Multi-Phase
**Status**: Planning

## Overview

This document outlines the complete migration from hardcoded recipes to Tina CMS for visual editing and content management.

## Why Tina CMS?

- **Visual Editing**: Edit content with live preview
- **Inline Editing**: Edit directly in the page context
- **Git-Based**: Content stored as markdown in your repo
- **Type-Safe**: Full TypeScript support
- **Media Management**: Upload and manage images
- **No Backend Required**: Works with static sites

## Migration Phases

### Phase 1: Content Migration ✅ (Started)
- [x] Install Tina CMS dependencies
- [x] Create `content/recipes/` directory structure
- [x] Export existing recipes to markdown files
- [x] Create Tina configuration (`tina/config.ts`)
- [ ] Export all remaining recipes from `recipes.ts`
- [ ] Verify markdown format matches schema

### Phase 2: Data Layer Refactoring
- [ ] Create Tina client utility
- [ ] Update `recipes.ts` to read from markdown files
- [ ] Implement TinaCMS GraphQL queries
- [ ] Add pagination support
- [ ] Update recipe types to match Tina schema
- [ ] Test data fetching

### Phase 3: Admin Setup
- [ ] Configure Tina admin panel
- [ ] Set up authentication (local dev)
- [ ] Create admin route (`/admin`)
- [ ] Test content editing in admin
- [ ] Configure media uploads
- [ ] Set up preview URLs

### Phase 4: Visual Editing
- [ ] Add TinaProvider to app
- [ ] Create editable recipe components
- [ ] Implement inline editing on RecipeDetail
- [ ] Add visual editor toolbar
- [ ] Test edit/preview workflow
- [ ] Add auto-save functionality

### Phase 5: Production Setup
- [ ] Configure Tina Cloud (optional)
- [ ] Set up authentication for production
- [ ] Configure deployment webhooks
- [ ] Test full workflow on production
- [ ] Migration documentation

## Current Progress

### Completed:
1. **Tina CMS Installed** ✅
   - `tinacms` and `@tinacms/cli` packages added
   - Dependencies: 1371 new packages

2. **Content Structure Created** ✅
   - Created `/work/content/recipes/` directory
   - Exported 2 sample recipes to markdown:
     - `durban-beef-curry.md`
     - `chocolate-chip-cookies.md`

3. **Tina Configuration** ✅
   - Created `/work/tina/config.ts`
   - Schema defined for recipe collection
   - Fields: title, date, source, category, tags, times, servings, images
   - Rich text editor for recipe body
   - Custom templates for Ingredients and Instructions

### Schema Overview:

```typescript
{
  name: "recipe",
  collections: [
    // Frontmatter fields
    title, date, source, category, tags,
    prepTime, cookTime, totalTime, servings,
    heroImage, images[],
    
    // Rich text body with templates
    body: {
      templates: ["Ingredients", "Instructions"]
    }
  ]
}
```

## Next Steps (Immediate)

### 1. Export Remaining Recipes
The `src/lib/recipes.ts` file has more hardcoded recipes that need to be exported to markdown files in `content/recipes/`.

### 2. Update Data Fetching
Replace the hardcoded `sampleRecipes` array with code that:
- Reads markdown files from `content/recipes/`
- Uses Tina's GraphQL API
- Parses frontmatter and content
- Returns Recipe objects

### 3. Test Without Breaking Current Site
- Keep current code working
- Add Tina as optional/parallel system
- Gradual migration without downtime

## Technical Considerations

### Markdown Format
Recipes use this structure:
```markdown
---
title: Recipe Title
date: 2023-10-26
category: Dinner
tags: [Beef, Curry]
prepTime: 25 minutes
---

Introduction paragraph here.

### Ingredients
- Item 1
- Item 2

### Instructions
1. Step 1
2. Step 2

### Notes
Additional notes here.
```

### Data Fetching Pattern
```typescript
// Old (hardcoded)
export const sampleRecipes: Recipe[] = [...]

// New (Tina CMS)
import { client } from '../tina/__generated__/client'

export async function getRecipes(): Promise<Recipe[]> {
  const { data } = await client.queries.recipeConnection()
  return data.recipeConnection.edges.map(edge => edge.node)
}
```

### Inline Editing Pattern
```tsx
import { useTina } from 'tinacms/dist/react'

export function RecipeDetail({ recipe, query, variables }) {
  const { data } = useTina({ query, variables, data: recipe })
  
  return (
    <article>
      <h1>{data.recipe.title}</h1>
      {/* Content is editable inline */}
    </article>
  )
}
```

## Breaking Changes to Expect

1. **Data Structure**
   - Move from TypeScript objects to markdown files
   - Frontmatter becomes YAML
   - Content body uses MDX/rich-text

2. **Component Props**
   - Components will need Tina query/variables
   - Add TinaProvider context
   - Update type definitions

3. **Build Process**
   - Tina generates GraphQL schema
   - Must run `tinacms dev` alongside `vite dev`
   - Additional build step for production

4. **Routing**
   - Add `/admin` route for Tina admin
   - Add `/api/tina/*` endpoints (if using Tina Cloud)

## Dependencies Added

```json
{
  "tinacms": "^2.x",
  "@tinacms/cli": "^1.x",
  // + 1371 peer dependencies
}
```

## File Structure After Migration

```
/work
├── content/
│   └── recipes/
│       ├── durban-beef-curry.md
│       ├── chocolate-chip-cookies.md
│       └── [more recipes].md
├── tina/
│   ├── config.ts
│   └── __generated__/
│       ├── client.ts
│       ├── types.ts
│       └── schema.gql
├── public/
│   ├── admin/           # Tina admin UI
│   └── images/          # Recipe images
└── src/
    ├── lib/
    │   ├── recipes.ts   # Updated to use Tina
    │   └── tina.ts      # Tina client utils
    └── components/
        └── [updated for inline editing]
```

## Environment Variables Needed

```env
# Local Development
TINA_PUBLIC_IS_LOCAL=true

# Production (optional Tina Cloud)
NEXT_PUBLIC_TINA_CLIENT_ID=your_client_id
TINA_TOKEN=your_token
TINA_SEARCH_TOKEN=your_search_token
```

## Testing Plan

### Local Development:
1. Run `npx tinacms dev` (starts Tina dev server)
2. Run `npm run dev` (starts Vite)
3. Visit `http://localhost:5173/admin` (Tina admin)
4. Edit a recipe in admin
5. See changes reflected on site
6. Test inline editing on recipe detail page

### Production:
1. Build with Tina: `npx tinacms build`
2. Build site: `npm run build`
3. Deploy
4. Test admin access with authentication
5. Verify edits save to Git

## Rollback Plan

If migration fails:
1. Keep `src/lib/recipes.ts` with hardcoded data
2. Tina files in `content/` and `tina/` can be ignored
3. Remove Tina packages
4. Site continues to work as before

## Resources

- [Tina CMS Docs](https://tina.io/docs/)
- [Vite + Tina](https://tina.io/docs/frameworks/vite/)
- [Visual Editing](https://tina.io/docs/contextual-editing/overview/)
- [Schema Reference](https://tina.io/docs/schema/)

## Decision Points

### Before Proceeding:
- [ ] Do you want Tina Cloud (hosted) or self-hosted?
- [ ] Authentication: Local only or production too?
- [ ] Who will be editing: Just you or multiple people?
- [ ] Image hosting: Local or cloud (Cloudinary, etc.)?

## Recommendation

**This is a MAJOR migration. Suggest breaking it into smaller, tested increments:**

1. **Week 1**: Complete content migration (export all recipes)
2. **Week 2**: Update data layer, test locally
3. **Week 3**: Add admin panel, test editing
4. **Week 4**: Implement visual/inline editing
5. **Week 5**: Production deployment

**OR** 

**Pause migration** and continue with current hardcoded system until you're ready for a dedicated migration effort.

---

**Status**: Migration infrastructure created, awaiting decision on phased approach
**Next Task**: Export remaining recipes OR pause for planning
**Impact**: MAJOR - Complete rewrite of content management
