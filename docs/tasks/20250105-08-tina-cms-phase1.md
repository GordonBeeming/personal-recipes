# Tina CMS Integration - Phase 1 Complete

**Date**: 2025-01-05
**Task**: 08
**Type**: Major Feature - Tina CMS Migration
**Status**: Phase 1 Complete - Tina Cloud Setup Needed

## What's Been Done ✅

### 1. Tina CMS Installation
- [x] Installed `tinacms` and `@tinacms/cli` packages
- [x] Added 1,255 new packages for Tina functionality

### 2. Content Migration
- [x] Created `content/recipes/` directory structure
- [x] Exported all 3 recipes to markdown files:
  - `durban-beef-curry.md`
  - `chocolate-chip-cookies.md`
  - `mediterranean-quinoa-salad.md`
- [x] Proper frontmatter with all recipe metadata
- [x] Markdown body with Ingredients, Instructions, Notes sections

### 3. Tina Configuration
- [x] Created `tina/config.ts` with complete schema
- [x] Configured for Tina Cloud (clientId, token)
- [x] Schema includes all recipe fields
- [x] Media management configured for `/public/images`
- [x] Admin panel output set to `/public/admin`

### 4. Environment Setup
- [x] Created `.env` for local development
- [x] Created `.env.example` with Tina Cloud placeholders
- [x] Added `.env` to `.gitignore`
- [x] Set `VITE_TINA_PUBLIC_IS_LOCAL=true` for now

## Tina Cloud Setup Required 🔑

To complete the migration, you need to:

### Step 1: Create Tina Cloud Project
1. Go to [https://app.tina.io](https://app.tina.io)
2. Sign up / Log in with GitHub
3. Click "New Project"
4. Connect to your GitHub repository
5. Configure:
   - **Branch**: `main`
   - **Root Directory**: `/`
   - **Config Path**: `tina/config.ts`

### Step 2: Get Your Credentials
After project creation, Tina will provide:
- **Client ID** - Copy this value
- **Read-Only Token** - Copy this value  
- **Search Token** - Copy this value (if using search)

### Step 3: Update Environment Variables
Replace placeholders in `.env`:
```env
VITE_TINA_PUBLIC_IS_LOCAL=false
VITE_TINA_CLIENT_ID=your_actual_client_id
TINA_TOKEN=your_actual_token
TINA_SEARCH_TOKEN=your_actual_search_token
```

### Step 4: Build Tina Schema
```bash
npx tinacms build
```

This generates:
- `tina/__generated__/client.ts` - Tina GraphQL client
- `tina/__generated__/types.ts` - TypeScript types
- `tina/__generated__/schema.gql` - GraphQL schema
- `public/admin/` - Admin UI files

### Step 5: Update Recipe Data Fetching
Once Tina is built, update `src/lib/recipes.ts` to use:
```typescript
import client from '../../tina/__generated__/client'

export async function getRecipes() {
  const { data } = await client.queries.recipeConnection()
  return data.recipeConnection.edges.map(edge => ({
    slug: edge.node._sys.filename,
    frontmatter: {
      title: edge.node.title,
      date: edge.node.date,
      // ... map other fields
    },
    content: edge.node.body,
    // ... parse body for ingredients, instructions
  }))
}
```

### Step 6: Add Tina Provider
Wrap your app in `main.tsx` or `App.tsx`:
```typescript
import { TinaProvider } from 'tinacms/dist/react'
import { client } from '../tina/__generated__/client'

<TinaProvider client={client}>
  <App />
</TinaProvider>
```

### Step 7: Add Visual Editing
Update `RecipeDetail.tsx` for inline editing:
```typescript
import { useTina } from 'tinacms/dist/react'

export function RecipeDetail({ data, query, variables }) {
  const { data: tinaData } = useTina({ data, query, variables })
  
  // Use tinaData instead of data
  // Content is now visually editable
}
```

## Current State

### ✅ Working (Local Mode):
- Recipe markdown files created
- Tina config defined
- Environment variables set for local
- Project structure ready

### ⏳ Pending (Tina Cloud):
- Tina Cloud project creation
- Credentials configuration
- Schema build (generates client)
- Recipe fetching update
- Visual editing integration

## Folder Structure

```
/work
├── content/
│   └── recipes/
│       ├── durban-beef-curry.md ✅
│       ├── chocolate-chip-cookies.md ✅
│       └── mediterranean-quinoa-salad.md ✅
├── tina/
│   ├── config.ts ✅
│   └── __generated__/    (created after build)
│       ├── client.ts
│       ├── types.ts
│       └── schema.gql
├── public/
│   ├── admin/             (created after build)
│   └── images/
├── .env ✅
├── .env.example ✅
└── src/
    └── lib/
        └── recipes.ts     (needs update after Tina build)
```

## Schema Overview

Recipe schema in `tina/config.ts`:

**Frontmatter Fields**:
- title (string, required, title field)
- date (datetime, required)
- source (string, required)
- category (string, dropdown: Breakfast/Lunch/Dinner/Dessert/Appetizer/Snack)
- tags (string list, required)
- prepTime, cookTime, totalTime (strings, required)
- servings (string, required)
- heroImage (image)
- images (image list)

**Body**:
- Rich text editor
- Supports markdown formatting
- Custom templates available for structured content

## Testing After Tina Cloud Setup

Once configured:

1. **Start Tina Dev Server**:
   ```bash
   npx tinacms dev -c "npm run dev"
   ```

2. **Access Admin Panel**:
   - Visit: `http://localhost:5173/admin`
   - Log in with Tina Cloud credentials
   - Edit recipes visually

3. **Test Visual Editing**:
   - Navigate to a recipe
   - Click "Edit" (Tina toolbar appears)
   - Make changes inline
   - See live preview
   - Save changes (commits to Git)

## Benefits Once Complete

### For You:
- ✨ Visual recipe editing with live preview
- 📝 No more editing TypeScript files
- 🖼️ Easy image uploads
- 💾 All changes saved to Git automatically
- 🔄 Full version history

### For Your Wife:
- 🎨 User-friendly visual editor (no code!)
- 📱 Works on any device
- ✅ Simple forms for recipe fields
- 👀 See exactly how it will look

## Next Steps Checklist

- [ ] Create Tina Cloud project at app.tina.io
- [ ] Get Client ID, Token, Search Token
- [ ] Update `.env` with real credentials
- [ ] Run `npx tinacms build`
- [ ] Update `src/lib/recipes.ts` to use Tina client
- [ ] Add TinaProvider to app
- [ ] Update RecipeDetail for visual editing
- [ ] Test admin panel access
- [ ] Test visual editing workflow
- [ ] Document for your wife how to add/edit recipes

## Rollback Plan

If Tina doesn't work out:
1. Keep using hardcoded recipes in `src/lib/recipes.ts`
2. Markdown files in `content/` can be ignored
3. Remove Tina packages: `npm uninstall tinacms @tinacms/cli`
4. Delete `tina/` directory
5. Site continues working as before

## Resources

- [Tina Cloud Setup Guide](https://tina.io/docs/setup-overview/)
- [Tina + Vite](https://tina.io/docs/frameworks/vite/)
- [Visual Editing Docs](https://tina.io/docs/contextual-editing/overview/)
- [Schema Reference](https://tina.io/docs/schema/)

## Important Notes

- **Media Files**: Images will be stored in `/public/images/` and managed by Tina
- **Git Workflow**: Tina commits changes directly to your repo
- **Authentication**: Tina Cloud handles auth automatically
- **Collaboration**: You can invite your wife via Tina Cloud dashboard

---

**Status**: Infrastructure ready, awaiting Tina Cloud setup
**Next**: Set up Tina Cloud project and get credentials
**Impact**: MAJOR - Enables visual editing for recipes
