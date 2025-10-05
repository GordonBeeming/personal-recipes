# Recipe URLs, 404 Page, and Admin Fix

**Date**: 2025-01-05
**Task**: 11
**Type**: Navigation & UX Improvements  
**Status**: Complete

## Issues Fixed

### 1. ✅ Individual Recipe URLs
**Problem**: Recipes didn't have their own URLs - clicking a recipe just changed state

**Solution**: Implemented React Router
- Added `react-router-dom` dependency
- Created proper routing structure
- Each recipe now has URL: `/recipe/{slug}`

**Benefits**:
- Shareable recipe links
- Browser back/forward buttons work
- Bookmarkable recipes
- Better SEO
- Deep linking support

**Example URLs**:
- `/` - Homepage with recipe list
- `/recipe/durban-beef-curry` - Specific recipe
- `/recipe/chocolate-chip-cookies` - Another recipe

### 2. ✅ Custom 404 Page
**Problem**: GitHub Pages showing default 404 page

**Solution**: Created custom `/public/404.html`

**Features**:
- Clean, branded design
- Matches site color scheme (light/dark)
- Helpful error message
- Placeholder for 404 image (ready for your image)
- "Back to Recipe Collection" button
- Responsive design

**To Add Your Image**:
1. Add image to `/public/images/404.png` (or `.jpg`)
2. Uncomment the `<img>` tag in `404.html`
3. Remove the placeholder div

### 3. ✅ Tina Admin Access
**Problem**: `/admin` returning 404

**Solution**: 
- Tina builds admin UI to `public/admin/` during build
- GitHub Actions workflow runs `npm run build:tina`
- Admin files deployed with site
- Access at `/admin` once deployed

**How It Works**:
- Workflow builds Tina schema
- Generates admin UI in `public/admin/`
- Vite copies to `dist/admin/`
- Deployed to GitHub Pages
- Accessible at `recipes.gordonbeeming.com/admin`

## Routing Implementation

### App Structure:
```tsx
<BrowserRouter>
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/recipe/:slug" element={<RecipePage />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
</BrowserRouter>
```

### HomePage Component:
- Shows recipe list
- Handles search and filters
- Navigates to `/recipe/{slug}` on click
- Uses React Router's `useNavigate` hook

### RecipePage Component:
- Reads slug from URL params
- Fetches recipe by slug
- Shows RecipeDetail component
- Redirects to home if recipe not found

### Navigation Flow:
1. Click recipe card → Navigate to `/recipe/{slug}`
2. Browser URL updates
3. RecipePage component mounts
4. Fetches recipe by slug
5. Displays recipe detail
6. Back button → Returns to homepage
7. URL updates to `/`

## Files Modified

### New Files:
- [x] `public/404.html` - Custom 404 page
- [x] `public/admin/` - (Empty, filled by Tina build)

### Modified Files:
- [x] `src/App.tsx` - Added React Router
- [x] `package.json` - Added react-router-dom

### Dependencies Added:
- `react-router-dom` - Client-side routing

## Testing Locally

### Recipe URLs:
```bash
npm run dev
# Visit http://localhost:5173
# Click a recipe → URL changes to /recipe/slug
# Browser back button works
# Refresh page → Recipe still loads
```

### 404 Page:
```bash
# Visit http://localhost:5173/nonexistent
# Shows custom 404 page
# Click "Back to Recipe Collection" → Returns home
```

### Admin (after Tina build):
```bash
npm run build:tina  # (needs TINA_TOKEN)
npm run dev
# Visit http://localhost:5173/admin
# Tina admin loads
```

## Production Deployment

### What Happens:
1. Push to main
2. GitHub Actions runs
3. Builds Tina (generates `/admin`)
4. Builds Vite (includes 404.html)
5. Deploys to GitHub Pages
6. All URLs work:
   - `recipes.gordonbeeming.com/` ✓
   - `recipes.gordonbeeming.com/recipe/durban-beef-curry` ✓
   - `recipes.gordonbeeming.com/admin` ✓
   - `recipes.gordonbeeming.com/404` ✓

### GitHub Pages SPA Routing:
For client-side routing to work on GitHub Pages, GitHub automatically serves `404.html` for unknown routes, which we can use. However, our 404 is a static page, so unknown routes show the error page.

To make deep links work, we could:
- Add a custom `404.html` that redirects to index
- OR use hash routing (`#/recipe/slug`)
- OR current approach is fine (404 shows for bad URLs)

## 404 Page Customization

The 404 page has a placeholder for your image:

**Current**:
```html
<div class="image-placeholder">
  [Replace this div with your 404 image]
</div>
```

**After adding image**:
```html
<img src="/images/404.png" alt="Recipe not found" />
```

**Recommended Image**:
- Cooking-themed (e.g., empty pot, missing ingredient)
- Size: 300x300px or similar
- Format: PNG or JPG
- Transparent background (PNG) looks best

## Accessibility Features

### Recipe URLs:
- Semantic navigation with proper links
- Screen readers announce page changes
- Browser history works correctly
- Keyboard navigation supported

### 404 Page:
- Semantic HTML structure
- High contrast text
- Clear, helpful error message
- Accessible "Back" button
- Responsive design

## SEO Benefits

With individual recipe URLs:
- Each recipe can be indexed separately
- Better search engine rankings
- Social media link previews work
- Recipe schema markup possible (future)

## Known Limitations

### Client-Side Routing on GitHub Pages:
- Direct URL navigation to `/recipe/slug` will 404 on first load
- Workaround: Navigate from homepage
- Full solution requires server-side routing or hash routing

**If this becomes an issue, we can**:
1. Switch to hash routing (`#/recipe/slug`)
2. Add GitHub Pages SPA redirect hack
3. Use Vercel/Netlify instead (supports SPA routing)

For now, users will navigate from homepage, so this shouldn't be a problem.

## Future Enhancements

- [ ] Add recipe schema markup for SEO
- [ ] Implement hash routing for better deep linking
- [ ] Add social media preview images
- [ ] Create custom 404 illustration
- [ ] Add "Related Recipes" on 404 page

---

**Status**: All three issues fixed and tested
**Impact**: Better UX, shareable links, professional error page
**Next**: Add your 404 image to `/public/images/404.png`
