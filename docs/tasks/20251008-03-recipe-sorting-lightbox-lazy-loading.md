# Recipe Sorting, Image Lightbox, and Lazy Loading

**Date**: 2025-10-08  
**Task Type**: Feature Enhancement

## Problem/Objective

Three improvements were requested for the recipe website:
1. Sort recipes on the home page by date in descending order (newest first)
2. Add a lightbox for gallery images on recipe pages
3. Implement lazy loading for gallery images to improve performance

## Solution Approach

### 1. Recipe Sorting by Date

Modified the `getRecipes()` function in `src/lib/recipes.ts` to sort recipes by date in descending order after loading from content files.

### 2. Image Lightbox

Implemented a full-screen lightbox for gallery images using Radix UI Dialog primitive with:
- Full-screen dark overlay
- Large image display with proper sizing
- Navigation controls (previous/next buttons)
- Keyboard navigation support (arrow keys and Escape)
- Image counter display
- Accessibility features (ARIA labels, keyboard focus management)

### 3. Lazy Loading Gallery Images

Implemented Intersection Observer API to lazy load gallery images:
- Images only load when user scrolls near them (50px threshold)
- Placeholder "Loading..." text shown while images load
- Automatically unobserves loaded images to prevent re-triggering

## Changes Made

### Files Modified

#### `src/lib/recipes.ts`
- Added sorting logic to `getRecipes()` function
- Recipes now sorted by `frontmatter.date` in descending order (newest first)

#### `src/components/RecipeDetail.tsx`
- Added imports for Dialog primitive components and additional icons
- Added state management for:
  - Lightbox open/closed state
  - Current lightbox image and index
  - Visible images tracking for lazy loading
- Added `imageRefs` using `useRef` to track gallery image DOM elements
- Implemented Intersection Observer for lazy loading
- Added keyboard event listener for arrow key navigation in lightbox
- Created `openLightbox()` and `navigateLightbox()` helper functions
- Updated gallery section to:
  - Store refs for each image container
  - Conditionally render images only when visible
  - Add click and keyboard handlers for opening lightbox
- Added full lightbox dialog with:
  - Custom dark overlay background
  - Close button
  - Previous/Next navigation buttons
  - Keyboard support for navigation
  - Image counter display
  - Proper accessibility attributes

## Features Implemented

### Recipe Sorting
- [x] Recipes sorted by date (descending)
- [x] Newest recipes appear first on home page
- [x] Sorting happens once during initial load for performance

### Image Lightbox
- [x] Click gallery images to open lightbox
- [x] Full-screen dark overlay
- [x] Previous/Next navigation buttons
- [x] Keyboard navigation (Left/Right arrows)
- [x] Close with Escape key or close button
- [x] Image counter (e.g., "2 / 5")
- [x] Proper image sizing (maintains aspect ratio)
- [x] Accessibility features (ARIA labels, keyboard support)

### Lazy Loading
- [x] Images load only when scrolled into view
- [x] 50px threshold before viewport
- [x] Loading placeholder text
- [x] Automatic cleanup after loading
- [x] Performance optimization for pages with many images

## Testing Performed

- [x] Build successful with `npm run build:local`
- [x] Dev server starts successfully with `npm run dev:prod`
- [x] TypeScript compilation with no errors
- [x] Verified sorting logic processes dates correctly
- [x] Confirmed lazy loading with Intersection Observer
- [x] Tested lightbox keyboard navigation functionality
- [x] Verified accessibility attributes are present

## Accessibility Considerations

All features implemented with accessibility in mind:
- Gallery images have proper `alt` text
- Lightbox images have descriptive alt attributes
- Navigation buttons include `aria-label` attributes
- Keyboard navigation fully supported (Tab, Enter, Space, Arrows, Escape)
- ARIA live region for image counter updates
- Screen reader announcements for lightbox state
- Focus management when opening/closing lightbox

## Technical Details

### Intersection Observer Configuration
```javascript
{
  rootMargin: '50px' // Start loading 50px before entering viewport
}
```

### Keyboard Shortcuts
- **Left Arrow**: Previous image in lightbox
- **Right Arrow**: Next image in lightbox
- **Escape**: Close lightbox (built into Dialog primitive)

### Performance Benefits
- Lazy loading reduces initial page load time
- Images only downloaded when needed
- Reduces bandwidth for users who don't scroll to gallery
- Improves Core Web Vitals scores

## Dependencies Used

- `@radix-ui/react-dialog` - Dialog primitive for lightbox
- `@phosphor-icons/react` - Icons for navigation (CaretLeft, CaretRight, X)
- Browser Intersection Observer API (no additional dependencies)

## Known Issues / Follow-up Items

None identified. All features working as expected.

## Notes

- Lightbox uses Radix Dialog primitive directly instead of the wrapped Dialog component to have more control over styling
- Keyboard navigation adds event listeners only when lightbox is open for performance
- Intersection Observer automatically cleans up after images load to prevent memory leaks
- Recipe sorting is done once during initial load and cached for performance
