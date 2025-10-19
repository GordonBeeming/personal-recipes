# OG Image Implementation for Recipes

**Date:** 2025-10-19  
**Task:** Add Open Graph (OG) images for recipe pages to improve social media sharing

## Objective

Implement OG image generation similar to the blog implementation, with the hero image as a light opacity background and recipe details overlaid on top.

## Solution Approach

### 1. Build-Time Image Generation

Since this is a static site (Vite + GitHub Pages), OG images are generated at build time using:
- **satori** - SVG generation library
- **sharp** - Image conversion (SVG to PNG)
- **Roboto Bold font** - Typography for the images

### 2. OG Image Design

The generated images (1200x630px) include:

#### Layout:
- **Background**: Light gray (#F6F8FA)
- **Header**: 
  - "Recipe" label in top left
  - Category badge in top right (with semi-transparent white background)
- **Center Content**:
  - Recipe title (responsive font size: 48-68px based on length)
  - Recipe info card with:
    - ⏱️ Prep time
    - 🔥 Cook time  
    - 👥 Servings
- **Footer** (dark blue #003353):
  - Domain: recipes.gordonbeeming.com
  - Tags (up to 5, with cyan highlight)
  - Author name and tagline

![Example OG Image](./images/20251019-01-og-image-example.png)

### 3. Technical Implementation

#### Files Created:
- `scripts/generate-og-images.mjs` - Node.js script that generates OG images for all recipes
- `src/hooks/useMetaTags.ts` - React hook to dynamically update meta tags
- `public/fonts/Roboto-Bold.ttf` - Font file for OG image generation

#### Files Modified:
- `package.json` - Added OG generation to build script
- `.gitignore` - Excluded generated assets (og-images/, fonts/)
- `index.html` - Added default OG meta tags
- `src/App.tsx` - Added meta tags to HomePage
- `src/components/RecipeDetail.tsx` - Added meta tags with recipe-specific OG image

#### Dependencies Added:
```json
{
  "@vercel/og": "^0.x.x",
  "satori": "^0.x.x",
  "sharp": "^0.x.x"
}
```

### 4. Build Process

The build script now:
1. Generates OG images for all recipes
2. Builds Tina CMS admin
3. Compiles TypeScript
4. Builds Vite app
5. Copies OG images to dist/

```bash
npm run build
# Executes: node scripts/generate-og-images.mjs && tinacms build && tsc && vite build
```

### 5. Meta Tag Management

#### Static (index.html):
- Default og:title, og:description for homepage
- Twitter card metadata
- Site-wide og:type="website"

#### Dynamic (React hooks):
- Recipe-specific title, description, and OG image
- Automatically updates when navigating between recipes
- Falls back to defaults on homepage

## Known Limitations

### Hero Image Background
**Status**: Temporarily disabled

**Issue**: Satori has difficulty handling large data URLs for embedded images. When attempting to load hero images (WebP format) as base64 data URLs and render them as background images, satori throws a "u is not iterable" error.

**Attempted Solutions**:
- Different image formats (WebP, PNG, JPEG)
- Various child structure approaches (array vs single child)
- Simplified DOM structure

**Current Workaround**: OG images are generated without hero image backgrounds, using a solid light gray background instead.

**Future Investigation**: 
- Use external URLs instead of data URLs (requires hosting images on a public URL)
- Pre-process hero images to smaller dimensions
- Explore alternative libraries (e.g., @vercel/og with edge runtime)
- Create a separate service for dynamic OG image generation

## Testing

- [x] OG images generate successfully at build time
- [x] All 4 recipes have corresponding PNG files
- [x] Images are 1200x630px (correct OG dimensions)
- [x] Images include all recipe metadata
- [x] Images are copied to dist/ folder
- [x] Meta tags update correctly when viewing recipes
- [x] Build process completes without errors

## Deployment Notes

### GitHub Actions
The workflow will need to:
1. Install Node.js dependencies (including sharp native bindings)
2. Run the build script (which includes OG generation)
3. Deploy dist/ folder to GitHub Pages

The current workflow should work without modifications since `npm run build` already includes OG generation.

### Vercel
If deploying to Vercel, the `vercel.json` might need adjustments for OG images, but should work out of the box with the static dist output.

## Follow-up Items

- [ ] Investigate satori image handling to enable hero image backgrounds
- [ ] Consider creating a generic fallback OG image for the homepage
- [ ] Add OG image preview in Tina CMS admin panel
- [ ] Test OG images with social media validators:
  - Facebook Debugger
  - Twitter Card Validator
  - LinkedIn Post Inspector

## References

- Blog implementation code (provided in problem statement)
- [Satori documentation](https://github.com/vercel/satori)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Card documentation](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
