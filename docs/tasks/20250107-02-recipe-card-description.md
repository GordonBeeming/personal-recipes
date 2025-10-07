# Recipe Card Improvements - Description Field and Tag Display

**Date**: 2025-01-07  
**Task**: Fix markdown display on recipe cards and improve tag display

## Problem

1. **Markdown on Cards**: Recipe cards were showing raw markdown syntax instead of clean text
2. **Limited Tags**: Only first 3 tags were shown with a "+X" indicator
3. **No Description Field**: No dedicated field for a short, clean description for cards

## Solution

### 1. Added Description Field to Tina CMS

Added a new optional `description` field to the recipe schema for concise card descriptions.

**Tina Config (`tina/config.ts`)**:
```typescript
{
  type: "string",
  name: "description",
  label: "Short Description",
  description: "A brief description for recipe cards (1-2 sentences)",
  ui: {
    component: "textarea",
  },
}
```

**Position**: Added right after the title field, before date

### 2. Updated TypeScript Types

**Updated `RecipeFrontmatter` interface**:
```typescript
export interface RecipeFrontmatter {
  // ... other fields
  description?: string  // New field
  heroImage?: string
  images?: string[]
}
```

### 3. Updated Recipe Parsing Logic

**Changes in `src/lib/recipes.ts`**:
- Added `description` to frontmatter parsing
- Use description in `intro` field with fallback
- Clean markdown symbols from fallback text

```typescript
intro: frontmatter.description || intro || body.substring(0, 200).replace(/[#*_\[\]]/g, '') + '...'
```

**Cleaning**: Removes `#`, `*`, `_`, `[`, `]` characters from markdown

### 4. Updated Recipe Card Component

**Changes in `RecipeCard.tsx`**:

#### Before (Tags):
```tsx
<div className="flex flex-wrap gap-1 mt-3">
  {frontmatter.tags.slice(0, 3).map((tag) => (
    <Badge key={tag} variant="outline" className="text-xs">
      {tag}
    </Badge>
  ))}
  {frontmatter.tags.length > 3 && (
    <Badge variant="outline" className="text-xs">
      +{frontmatter.tags.length - 3}
    </Badge>
  )}
</div>
```

#### After (Tags):
```tsx
<div className="flex flex-wrap gap-1.5" aria-label="Recipe tags">
  {frontmatter.tags.map((tag) => (
    <Badge key={tag} variant="outline" className="text-xs">
      {tag}
    </Badge>
  ))}
</div>
```

**Changes**:
- Show ALL tags instead of limiting to 3
- Increased gap from `1` to `1.5` for better spacing
- Removed margin-top, adjusted spacing in parent elements
- Tags now wrap naturally with `flex-wrap`

#### Description Display:
```tsx
<p className="text-sm text-muted-foreground line-clamp-2 mb-3">
  {frontmatter.description || intro}
</p>
```

**Priority**: Uses `description` if available, falls back to `intro`

### 5. Updated Recipe Content

**Durban Beef Curry (`content/recipes/durban-beef-curry.md`)**:

Added description field:
```yaml
description: A rich and aromatic South African curry with tender beef, slow-cooked with fragrant spices and potatoes. This family recipe brings authentic Durban flavors to your kitchen.
```

## Visual Improvements

### Recipe Card Layout (Updated):
```
┌─────────────────────────┐
│    [Hero Image]         │
│    [Category Badge]     │
├─────────────────────────┤
│ Title                   │
│ Description (2 lines)   │ ← Clean text, no markdown
│ ⏱️ Time    👥 Servings  │
│ [Tag1] [Tag2] [Tag3]   │ ← ALL tags now show
│ [Tag4]                  │ ← Wraps naturally
└─────────────────────────┘
```

## Testing

### Build Test
```bash
npm run build:local
```
✅ **Result**: Build successful

### Dev Server Test
```bash
npm run dev:prod
```
✅ **Result**: No errors, description displays correctly

### Visual Test
- ✅ Description field shows clean text
- ✅ No markdown symbols visible
- ✅ All tags display and wrap properly
- ✅ Card spacing looks good with wrapped tags

## Files Changed

- `tina/config.ts` - Added description field to schema
- `src/lib/types.ts` - Added description to RecipeFrontmatter interface
- `src/lib/recipes.ts` - Updated parsing to use description, clean fallback text
- `src/components/RecipeCard.tsx` - Show all tags, use description field
- `content/recipes/durban-beef-curry.md` - Added description

## Benefits

1. **Better UX**: Cards show clean, readable descriptions instead of markdown
2. **More Info**: All tags visible at a glance (helpful for filtering/discovery)
3. **Flexibility**: Description field optional - falls back gracefully
4. **Content Control**: Recipe authors can craft perfect card descriptions
5. **Accessibility**: Clean text is better for screen readers

## Future Enhancements

- [ ] Add description validation (max length warning in Tina)
- [ ] Add character counter in Tina CMS for description field
- [ ] Consider truncating very long tag lists (10+ tags)
- [ ] Add description to all existing recipes through Tina CMS

## Commit

```
feat: Add description field to recipes and improve tag display

- Add 'description' field to Tina CMS schema for short recipe descriptions
- Update RecipeFrontmatter type to include optional description field
- Update recipe parsing to use description for card display (fallback to cleaned intro)
- Show all tags on recipe cards with wrapping instead of limiting to 3
- Add description to Durban Beef Curry recipe
- Clean markdown symbols from fallback intro text
```
