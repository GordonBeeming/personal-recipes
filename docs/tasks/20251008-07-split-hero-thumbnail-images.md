# Split Hero and Thumbnail Images + Lightbox Improvements

**Date**: 2025-10-08  
**Type**: Feature Enhancement

## Objective

Split the single `heroImage` field into separate `heroImage` and `thumbnailImage` fields to allow different image sizes for:
- Full-size hero images on recipe detail pages
- Smaller thumbnail images on recipe cards (home page)

Additionally, improve the lightbox experience with:
- Semi-transparent background (80% opacity) instead of solid black
- Constrained image size (max 1200px width, 85vh height)
- Click outside to close functionality
- Better visual presentation

## Changes Made

### 1. Tina CMS Configuration (`tina/config.ts`)

Added separate image fields with size recommendations:

```typescript
{
  type: "image",
  name: "heroImage",
  label: "Hero Image",
  description: "Full-size image for recipe detail page (recommended: 1200x675px, max 200KB)",
},
{
  type: "image",
  name: "thumbnailImage",
  label: "Thumbnail Image",
  description: "Smaller image for recipe cards on home page (recommended: 600x338px, max 100KB)",
},
{
  type: "image",
  name: "images",
  label: "Gallery Images",
  list: true,
  description: "Additional recipe photos (recommended: 800x800px, max 150KB each)",
},
```

### 2. TypeScript Types (`src/lib/types.ts`)

Added `thumbnailImage` to the `RecipeFrontmatter` interface:

```typescript
export interface RecipeFrontmatter {
  // ... existing fields
  heroImage?: string
  thumbnailImage?: string
  images?: string[]
}
```

### 3. Recipe Card Component (`src/components/RecipeCard.tsx`)

Updated to use `thumbnailImage` with fallback to `heroImage`:

```typescript
{(frontmatter.thumbnailImage || frontmatter.heroImage) ? (
  <img
    src={frontmatter.thumbnailImage || frontmatter.heroImage}
    alt={`${frontmatter.title} - ${frontmatter.category} recipe`}
    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
  />
) : (
  // ... fallback emoji
)}
```

### 4. Recipe Detail Lightbox (`src/components/RecipeDetail.tsx`)

Improved lightbox experience:

**Before**:
- Solid black background (`bg-black/95`)
- Full viewport size (`w-[95vw] h-[95vh]`)
- No click-outside-to-close

**After**:
- Semi-transparent background (`bg-black/80`)
- Constrained size (`w-[90vw] max-w-4xl max-h-[85vh]`)
- Click overlay to close
- Image max height: `80vh` with rounded corners

```typescript
<DialogPrimitive.Overlay 
  className="fixed inset-0 z-50 bg-black/80 ... cursor-pointer"
  onClick={() => setLightboxOpen(false)}
/>
<DialogPrimitive.Content 
  className={cn(
    "fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%]",
    "w-[90vw] h-auto max-w-4xl max-h-[85vh]",
    "focus:outline-none"
  )}
>
  <img
    src={lightboxImage}
    alt={...}
    className="max-w-full max-h-[80vh] object-contain rounded-lg"
  />
</DialogPrimitive.Content>
```

### 5. Content Updates

Updated all existing recipe markdown files to include `thumbnailImage` field (copied from `heroImage`):

- `durban-beef-curry.md`
- `classic-pork-crackling-roast-dinner.md`
- `refreshing-summer-fruit-salad.md`

### 6. README Documentation (`README.md`)

Added comprehensive image guidelines section:

#### Image Size Recommendations Table

| Image Type | Dimensions | Target File Size (WebP) | Legacy (JPEG) | Usage |
|------------|------------|------------------------|---------------|-------|
| **Hero Image** | 1200×675px (16:9) | ~80-120 KB | ~200 KB | Recipe detail page header |
| **Thumbnail Image** | 600×338px (16:9) | ~40-60 KB | ~100 KB | Recipe cards on home page |
| **Gallery Images** | 800×800px (1:1) | ~60-100 KB | ~150 KB | Recipe photo gallery |

#### Documented Features:
- Image optimization tips
- Recommended formats (JPEG vs PNG)
- Compression tools (TinyPNG, Squoosh)
- Aspect ratio guidelines
- File naming conventions
- Lightbox behavior details

## Benefits

### Performance Improvements
- **Smaller home page**: Thumbnails can be 50% smaller than hero images
- **Faster initial load**: 600×338px thumbnails vs 1200×675px full images
- **Better bandwidth usage**: ~100KB thumbnails vs ~200KB hero images
- **Recommended sizes**: Clear guidance reduces oversized image uploads

### User Experience
- **Better lightbox**: Semi-transparent background shows page context
- **Constrained size**: Images don't overwhelm the screen
- **Click to close**: More intuitive - click anywhere outside to close
- **Rounded corners**: More polished, modern appearance
- **Responsive**: Adapts to different screen sizes

### Developer Experience
- **Clear documentation**: Image size requirements in README
- **Type safety**: TypeScript knows about both image fields
- **Backward compatible**: Falls back to `heroImage` if no thumbnail
- **CMS guidance**: Field descriptions guide content creators

## Testing

- [x] Build succeeds without errors
- [x] TypeScript compilation passes
- [x] Recipe cards display correctly (using thumbnail or hero fallback)
- [x] Recipe detail pages show hero images
- [x] Lightbox opens with constrained size
- [x] Lightbox background is semi-transparent
- [x] Click outside lightbox closes it
- [x] All existing recipes updated with thumbnailImage

## Next Steps

- [ ] Create optimized thumbnail versions of existing images
- [ ] **Convert images to WebP format** for better compression
- [ ] Update production images with recommended sizes
- [ ] Compress images using Squoosh or TinyPNG
- [ ] Test page load performance with optimized images

## WebP Conversion Guide

### Why WebP?

WebP provides **25-35% smaller file sizes** than JPEG at the same quality:
- 1.5 MB PNG → ~80-120 KB WebP (Hero image at 1200×675px)
- Better compression with no visible quality loss
- Supported by 97%+ of browsers (all modern browsers)

### How to Convert to WebP

#### Option 1: Squoosh (Recommended - Web-based)
1. Go to [squoosh.app](https://squoosh.app/)
2. Drag and drop your image
3. Select **WebP** in the right panel
4. Set quality to **75-85%** (sweet spot for photos)
5. Compare before/after to ensure quality
6. Download the optimized image

#### Option 2: Online Converters
- [CloudConvert](https://cloudconvert.com/png-to-webp)
- [Convertio](https://convertio.co/png-webp/)

#### Option 3: Batch Processing (Command Line)
```bash
# Install cwebp (macOS with Homebrew)
brew install webp

# Convert single image
cwebp -q 80 input.png -o output.webp

# Batch convert all PNGs in a folder
for file in *.png; do cwebp -q 80 "$file" -o "${file%.png}.webp"; done
```

#### Option 4: ImageOptim (Mac App)
1. Download [ImageOptim](https://imageoptim.com/)
2. Enable WebP in preferences
3. Drag and drop images to convert

### Expected Savings
- **1200×675px Hero**: 1.5 MB PNG → ~100 KB WebP (93% reduction!)
- **600×338px Thumbnail**: 400 KB PNG → ~50 KB WebP (87% reduction!)
- **800×800px Gallery**: 800 KB PNG → ~80 KB WebP (90% reduction!)

## Notes

- **Backward compatible**: Recipe cards will use `heroImage` if `thumbnailImage` is not set
- **No breaking changes**: Existing recipes continue to work
- **Future optimization**: Can create proper thumbnail versions of images to further reduce file sizes
- **Lightbox improvements**: Better UX without changing functionality
