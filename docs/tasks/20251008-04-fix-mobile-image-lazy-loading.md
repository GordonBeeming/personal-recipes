# Fix Mobile Image Lazy Loading

**Date**: 2025-10-08  
**Issue**: On mobile, when scrolling down, gallery images didn't load automatically, and when opening the lightbox, images didn't show.

## Problem/Objective

Users reported that on mobile devices:
1. Gallery images don't load when scrolling down the page
2. Clicking on image placeholders in the gallery opens an empty lightbox

## Root Cause Analysis

The issue was in the Intersection Observer implementation in `RecipeDetail.tsx`:

1. **Intersection Observer limitations**: The observer was set up with only `frontmatter.images` as a dependency, but it runs before the DOM refs are fully populated
2. **Mobile scrolling behavior**: On mobile devices, the Intersection Observer can be unreliable due to touch scrolling patterns and viewport changes
3. **Lightbox issue**: When clicking on an image that wasn't in the `visibleImages` set, the lightbox would open but display nothing since the image was never loaded

## Solution Approach

Implemented a mobile-specific solution that:
1. **Detects mobile devices** using the existing `useIsMobile` hook (breakpoint: 768px)
2. **Eager loading on mobile**: Loads all gallery images immediately on mobile devices
3. **Lazy loading on desktop**: Keeps the Intersection Observer lazy loading for desktop performance
4. **Lightbox safeguard**: Ensures clicked images are marked as visible when opening lightbox

## Changes Made

### Files Modified

#### `src/components/RecipeDetail.tsx`

**Changes**:
1. Added import for `useIsMobile` hook
2. Added `isMobile` constant using the hook
3. Modified Intersection Observer useEffect:
   - Added mobile detection check
   - On mobile: immediately mark all images as visible
   - On desktop: use existing lazy loading behavior
   - Added `isMobile` to dependency array
4. Modified `openLightbox` function to ensure clicked image is in visible set

**Code Changes**:
```tsx
// Added import
import { useIsMobile } from '../hooks/use-mobile'

// Added mobile detection
const isMobile = useIsMobile()

// Modified useEffect for image loading
useEffect(() => {
  if (!frontmatter.images || frontmatter.images.length === 0) return
  
  // On mobile, load all images immediately
  if (isMobile) {
    const allIndices = Array.from({ length: frontmatter.images.length }, (_, i) => i)
    setVisibleImages(new Set(allIndices))
    return
  }
  
  // On desktop, use lazy loading with Intersection Observer
  // ... existing observer code
}, [frontmatter.images, isMobile])

// Modified openLightbox to ensure image is visible
const openLightbox = (image: string, index: number) => {
  // Ensure the clicked image is marked as visible (in case it wasn't loaded yet)
  setVisibleImages(prev => new Set([...prev, index]))
  setLightboxImage(image)
  setLightboxIndex(index)
  setLightboxOpen(true)
}
```

## Testing Performed

- [x] TypeScript compilation successful (no errors)
- [x] Code builds without errors
- [x] Changes are minimal and focused
- [x] Existing lazy loading logic preserved for desktop
- [x] Mobile detection hook already exists and is tested

## Benefits

1. **Mobile UX improvement**: All images load immediately on mobile, no scroll issues
2. **Desktop performance**: Keeps lazy loading for better performance on desktop
3. **Lightbox reliability**: Always shows images when opened, regardless of loading state
4. **Minimal changes**: Only ~20 lines changed, preserving existing functionality
5. **No breaking changes**: Desktop behavior remains unchanged

## Notes

- Mobile breakpoint is 768px (defined in `use-mobile.ts`)
- On mobile devices, all gallery images load when component mounts
- Desktop users still benefit from lazy loading performance optimization
- The fix is defensive - even if lazy loading fails, clicking an image will ensure it loads
