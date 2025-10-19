# Fix: Uninitialized Variable Error When Opening Recipes

**Date**: 2025-10-19  
**Type**: Bug Fix  
**Priority**: High  
**Status**: Completed

## Problem Statement

When opening a recipe, users encountered an error:

```
Application Error
Something unexpected happened while running the application. The error details are shown below.
Error Details:

Cannot access uninitialized variable.
```

This prevented users from viewing recipe details, breaking a core functionality of the application.

## Root Cause Analysis

The issue was located in `src/components/RecipeDetail.tsx` (line numbers refer to the original code before the fix):

1. The `slug` variable was declared on line 129:
   ```typescript
   const slug = variables.relativePath.replace(/\.md$/, '')
   ```

2. However, it was being used earlier on lines 123-124 in the `useMetaTags` hook:
   ```typescript
   useMetaTags({
     title: `${frontmatter.title} | Gordon's Recipe Collection`,
     description: frontmatter.description,
     image: `/og-images/${slug}.png`,  // slug used before declaration
     url: `${window.location.origin}/recipe/${slug}`
   })
   ```

This violated JavaScript's temporal dead zone rules for `const` variables, causing TypeScript errors:
- `TS2448: Block-scoped variable 'slug' used before its declaration`
- `TS2454: Variable 'slug' is used before being assigned`

## Solution

Moved the `slug` declaration to before the `useMetaTags` hook (line 121):

```typescript
// Extract slug from variables.relativePath (e.g., "recipe-name.md" -> "recipe-name")
// Used for localStorage key and meta tags
const slug = variables.relativePath.replace(/\.md$/, '')

// Set meta tags for OG image and SEO
useMetaTags({
  title: `${frontmatter.title} | Gordon's Recipe Collection`,
  description: frontmatter.description,
  image: `/og-images/${slug}.png`,
  url: `${window.location.origin}/recipe/${slug}`
})
```

## Changes Made

### Files Modified
- `src/components/RecipeDetail.tsx`
  - Moved `slug` declaration from line 129 to line 121
  - Updated comment to clarify the variable is used for both localStorage and meta tags
  - No other changes to logic or functionality

### Testing Performed
- [x] TypeScript type checking - No more TS2448 or TS2454 errors
- [x] Verified the slug variable is now accessible where needed
- [x] Confirmed no regression in other parts of the file

## Impact

### Before Fix
- Users could not open recipe detail pages
- Application showed error boundary with "Cannot access uninitialized variable"
- Complete loss of recipe viewing functionality

### After Fix
- Recipe detail pages load without errors
- All recipe metadata (OG images, SEO tags) work correctly
- Checkbox progress tracking continues to work as expected

## Lessons Learned

1. **Variable Declaration Order**: Always declare variables before they are used, especially in hooks that run during component initialization
2. **TypeScript Strictness**: Enable strict TypeScript checking during development to catch these issues early
3. **Error Messages**: The runtime error message "Cannot access uninitialized variable" was clear and helped identify the issue quickly

## Related Files
- `src/components/RecipeDetail.tsx` - Fixed file
- `src/hooks/useMetaTags.ts` - Consuming hook (no changes needed)

## Follow-up Items
None - fix is complete and tested.
