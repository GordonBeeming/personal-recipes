# Fix React Hooks Order Violation in RecipeDetail

**Date**: October 13, 2025  
**Type**: Bug Fix

## Problem

RecipeDetail component had a React Hooks order violation error:
```
React has detected a change in the order of Hooks called by RecipeDetail.
Previous render: useState
Next render: useMemo
```

The issue was caused by conditionally calling the `useTina` hook:
```tsx
const tinaData = data && query && variables ? useTina({ data, query, variables }) : null
```

This violated the Rules of Hooks which require hooks to always be called in the same order.

## Root Cause

The component was designed to optionally use Tina CMS (for visual editing) or fall back to static recipe data. This meant `useTina` was only called when Tina data was available, causing the hook order to change between renders.

## Solution

Made RecipeDetail always use Tina CMS unconditionally:

### Changes Made:

1. **RecipeDetail.tsx**:
   - Removed optional Tina props - now always requires `data`, `query`, and `variables`
   - Removed `Recipe` type dependency - gets all data from Tina
   - Always calls `useTina` hook unconditionally
   - Removed ReactMarkdown code path - only uses TinaMarkdown
   - Removed unused imports (Recipe type, ReactMarkdown, Components type)

2. **App.tsx**:
   - Added loading and error states for Tina data fetch
   - Always waits for Tina data before rendering RecipeDetail
   - Shows loading spinner while fetching
   - Shows error message if Tina data fails to load
   - Removed optional Tina data passing - always required now

### Key Technical Changes:

**Before** (conditional hook):
```tsx
const tinaData = data && query && variables ? useTina({ data, query, variables }) : null
```

**After** (always called):
```tsx
const { data: tinaData } = useTina({ data, query, variables })
```

**Rendering** (simplified):
```tsx
// Before: dual rendering paths
{isUsingTina && typeof content === 'object' ? (
  <TinaMarkdown content={content} components={tinaComponents} />
) : (
  <ReactMarkdown components={components}>{String(content)}</ReactMarkdown>
)}

// After: always Tina
<TinaMarkdown content={content} components={tinaComponents} />
```

## Benefits

1. **Fixes Hooks violation** - `useTina` always called in same order
2. **Simpler code** - removed dual rendering paths and conditionals
3. **Better live editing** - always uses Tina's live editing capabilities
4. **Type safety** - required props ensure data is always available

## Testing

- [x] Hooks order is consistent
- [x] No conditional hook calls
- [x] Loading state shows while fetching
- [x] Error handling for failed Tina queries
- [x] Checkbox functionality maintained
- [x] Live editing works in visual editor

## Follow-up

None required - RecipeDetail now fully committed to Tina CMS architecture.
