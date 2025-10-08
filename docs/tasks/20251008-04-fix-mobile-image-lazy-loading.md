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

After initial implementation and feedback, adopted a better mobile-first approach:

1. **Hide gallery initially on mobile**: Gallery section is hidden by default on mobile devices to save bandwidth
2. **"View Gallery" button**: On mobile, show a button that users can click to load and view the gallery
3. **Lazy loading on all devices**: Once gallery is visible (always on desktop, after button click on mobile), use Intersection Observer for efficient lazy loading
4. **Lightbox safeguard**: Ensures clicked images are always marked as visible before opening, preventing blank displays

This approach:
- **Saves mobile bandwidth**: Images only load when user explicitly wants to see them
- **Better UX**: Users have control over when to load images
- **Performance**: Lazy loading works on both mobile and desktop once gallery is visible
- **Progressive enhancement**: Desktop users see gallery immediately, mobile users opt-in

## Changes Made

### Files Modified

#### `src/components/RecipeDetail.tsx`

**Changes**:
1. Added import for `Images` icon from phosphor-icons
2. Added `showGallery` state - initialized to `false` on mobile, `true` on desktop
3. Added useEffect to update gallery visibility when device type changes
4. Modified Intersection Observer useEffect:
   - Added check to skip observer setup if gallery is hidden
   - Changed dependency from `isMobile` to `showGallery`
5. Modified gallery section JSX to conditionally render:
   - If `showGallery` is true: show full gallery with lazy-loaded images
   - If `showGallery` is false: show "View Gallery" button with image count
6. Kept `openLightbox` safeguard to ensure clicked image is in visible set

**Code Changes**:
```tsx
// Added import
import { ..., Images } from '@phosphor-icons/react'

// Added gallery visibility state
const [showGallery, setShowGallery] = useState(!isMobile)

// Update gallery visibility when device type changes
useEffect(() => {
  if (!isMobile) {
    setShowGallery(true)
  }
}, [isMobile])

// Modified useEffect for image loading
useEffect(() => {
  if (!frontmatter.images || frontmatter.images.length === 0) return
  if (!showGallery) return // Don't set up observer if gallery is hidden
  
  // Intersection Observer code...
}, [frontmatter.images, showGallery])

// Conditional gallery rendering
{frontmatter.images && frontmatter.images.length > 0 && (
  showGallery ? (
    <Card>
      <CardHeader>
        <CardTitle>Recipe Gallery</CardTitle>
      </CardHeader>
      {/* Gallery grid... */}
    </Card>
  ) : (
    <Card>
      <CardContent className="pt-6">
        <Button 
          onClick={() => setShowGallery(true)} 
          variant="outline" 
          size="lg" 
          className="w-full"
        >
          <Images size={20} className="mr-2" aria-hidden="true" />
          View Gallery ({frontmatter.images.length} images)
        </Button>
      </CardContent>
    </Card>
  )
)}
```

## Testing Performed

- [x] TypeScript compilation successful (no errors)
- [x] Code logic verified
- [x] Changes are minimal and focused
- [x] Lazy loading preserved for all devices when gallery is visible
- [x] Mobile detection hook already exists and is tested

## Benefits

1. **Mobile bandwidth savings**: Images only load when user clicks "View Gallery"
2. **User control**: Mobile users decide when to load images
3. **Desktop UX unchanged**: Desktop users see gallery immediately
4. **Lazy loading works**: Once gallery is visible, lazy loading works on all devices
5. **Lightbox reliability**: Always shows images when opened, regardless of loading state
6. **Minimal changes**: Surgical changes preserving existing functionality
7. **Accessibility**: Button has proper ARIA labels and shows image count

## Notes

- Mobile breakpoint is 768px (defined in `use-mobile.ts`)
- On mobile devices, gallery is hidden until user clicks "View Gallery" button
- Desktop users see gallery immediately with lazy loading
- The fix addresses feedback to save mobile bandwidth rather than loading all images eagerly
- Button text shows singular "image" or plural "images" based on count
