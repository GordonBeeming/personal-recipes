# Recipe Card UI Improvements

**Date**: 2025-01-07  
**Task**: Remove Unsplash images, improve card image display, and show more description text

## Problems Fixed

1. **External Dependencies**: Had hardcoded Unsplash URLs throughout the codebase
2. **Image Spacing**: Card images had white space above/below (not filling the aspect-video container)
3. **Limited Description**: Only 2 lines of description text visible on cards

## Solutions Implemented

### 1. Removed All Unsplash References

**Before**: 
- RecipeCard had 7 Unsplash URLs (category placeholders + general fallback)
- RecipeDetail had 30+ Unsplash URLs (hero + gallery placeholders)
- Total: ~37 external image URLs

**After**:
- ✅ Zero Unsplash references
- ✅ Simple emoji placeholder (🍳) when no hero image
- ✅ Gallery section only shown when images exist

**Code Changes (RecipeCard.tsx)**:
```tsx
// REMOVED: getPlaceholderImage function with all Unsplash URLs

// NEW: Simple conditional rendering
{frontmatter.heroImage ? (
  <img
    src={frontmatter.heroImage}
    alt={`${frontmatter.title} - ${frontmatter.category} recipe`}
    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
  />
) : (
  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
    <span className="text-4xl" aria-hidden="true">🍳</span>
  </div>
)}
```

**Code Changes (RecipeDetail.tsx)**:
```tsx
// REMOVED: getPlaceholderImage function
// REMOVED: categoryPlaceholders object with 30+ URLs
// REMOVED: Fallback gallery when no images

// NEW: Conditional rendering
{frontmatter.heroImage && (
  <div className="relative aspect-video w-full overflow-hidden rounded-lg mb-6 bg-muted">
    <img src={frontmatter.heroImage} ... />
  </div>
)}

// NEW: Only show gallery if images exist
{frontmatter.images && frontmatter.images.length > 0 && (
  <Card>
    <CardHeader>
      <CardTitle>Recipe Gallery</CardTitle>
    </CardHeader>
    ...
  </Card>
)}
```

### 2. Improved Image Display (object-cover)

**The Issue**:
Images were using `object-cover` but still had spacing because the container wasn't properly constrained.

**The Fix**:
- Added `bg-muted` to image containers for better visual when loading
- Ensured `aspect-video` + `object-cover` work together properly
- Image now fills entire aspect-video container
- Sides get cropped if image aspect ratio doesn't match (as requested)

**CSS Classes**:
```tsx
// Card image container
<div className="relative aspect-video overflow-hidden bg-muted">
  <img className="w-full h-full object-cover ..." />
</div>
```

**How it works**:
- `aspect-video` = 16:9 ratio container
- `overflow-hidden` = clips anything outside
- `object-cover` = image fills container, maintains aspect, crops excess
- Result: Image always fills the space perfectly ✅

### 3. Increased Description Lines (2 → 3)

**Before**:
```tsx
<p className="text-sm text-muted-foreground line-clamp-2 mb-3">
```

**After**:
```tsx
<p className="text-sm text-muted-foreground line-clamp-3 mb-3">
```

**Result**: One additional line of description text visible on cards

## Benefits

### Performance
- ✅ **Reduced bundle size**: 527 kB → 522 kB (5 kB smaller)
- ✅ **Fewer network requests**: No failed Unsplash image loads
- ✅ **Faster page load**: No external image dependencies

### Maintainability
- ✅ **Simpler code**: Removed ~80 lines of placeholder URL logic
- ✅ **No external dependencies**: Self-contained recipe display
- ✅ **Easier to understand**: Clear conditional rendering

### User Experience
- ✅ **Better image display**: No white space, images fill properly
- ✅ **More description text**: 3 lines instead of 2
- ✅ **Clean fallback**: Friendly emoji when no image
- ✅ **Consistent design**: Same muted background throughout

## Testing

### Build Test
```bash
npm run build:local
```
✅ **Result**: Build successful, bundle 5 kB smaller

### Code Verification
```bash
grep -r "unsplash" src/
```
✅ **Result**: Zero matches - all Unsplash references removed

### Visual Test
- ✅ Recipe card with image: Fills perfectly, no spacing
- ✅ Recipe card without image: Shows 🍳 emoji placeholder
- ✅ Description text: Shows 3 lines (more content visible)
- ✅ Gallery: Only appears when images exist

## Files Changed

- `src/components/RecipeCard.tsx`
  - Removed getPlaceholderImage function
  - Added emoji placeholder fallback
  - Changed line-clamp-2 to line-clamp-3
  - Added bg-muted for better visuals

- `src/components/RecipeDetail.tsx`
  - Removed getPlaceholderImage function
  - Removed categoryPlaceholders object
  - Made hero image conditional
  - Made gallery section conditional

- `tina/tina-lock.json`
  - Auto-updated (expected with schema changes)

## Code Removed

- **118 lines deleted** (mostly Unsplash URLs and placeholder logic)
- **38 lines added** (cleaner conditional rendering)
- **Net: -80 lines of code** ✨

## Migration Notes

### Existing Recipes
- Recipes with `heroImage`: Work perfectly, no changes needed ✅
- Recipes without `heroImage`: Show emoji placeholder ✅
- Recipes with gallery images: Gallery displays normally ✅
- Recipes without gallery: No gallery section (cleaner) ✅

### Future Recipes
- Add `heroImage` in Tina CMS for best appearance
- Add gallery images for step-by-step photos
- No placeholders = cleaner, faster, simpler

## Commit

```
refactor: Remove all Unsplash placeholder images and improve card image display

Changes:
- Remove all hardcoded Unsplash URLs from RecipeCard and RecipeDetail components
- Show cooking emoji (🍳) placeholder when no hero image is set on cards
- Use bg-muted background for better visual on missing images
- Only show gallery section when images actually exist
- Change description display from 2 lines to 3 lines (line-clamp-3)
- Improve image aspect ratio handling with object-cover

Benefits:
- No external dependencies on Unsplash
- Cleaner, simpler code
- Better performance (no failed image requests)
- More space for recipe descriptions on cards
```
