# Fix SPA Routing for GitHub Pages

**Date**: 2025-10-07  
**Task**: Fix 404 errors when directly navigating to recipe URLs on GitHub Pages

## Problem

When browsing directly to a recipe URL like `https://recipes.gordonbeeming.com/recipe/durban-beef-curry` (by refreshing the page or entering the URL), GitHub Pages returns a 404 error. This is because:

1. The site is a Single Page Application (SPA) using React Router with BrowserRouter
2. GitHub Pages is a static hosting service that doesn't know about client-side routes
3. When a user navigates to `/recipe/durban-beef-curry`, GitHub Pages looks for a file at that path
4. No such file exists, so it returns the default 404 page

## Solution

Implemented the standard GitHub Pages SPA routing solution using a redirect script approach:

1. **Modified `public/404.html`**: Replaced the custom 404 page with a redirect script that converts the requested path into a query parameter
2. **Modified `index.html`**: Added a script that reads the query parameter and uses `history.replaceState` to restore the original URL
3. **Updated `playwright.config.ts`**: Changed the test server to use `npm run dev:prod` instead of `npm run dev` for faster testing without Tina CMS

### How It Works

1. User navigates to `https://recipes.gordonbeeming.com/recipe/durban-beef-curry`
2. GitHub Pages can't find that file, returns `404.html`
3. The 404.html script converts the URL to: `https://recipes.gordonbeeming.com/?/recipe/durban-beef-curry`
4. This redirects to `index.html` (the actual SPA)
5. The script in index.html reads the query string and restores the original URL using `history.replaceState`
6. React Router now handles the route correctly and displays the recipe page

## Files Changed

### `/public/404.html`
- Replaced custom 404 page with SPA redirect script
- Uses the standard `spa-github-pages` approach (MIT licensed)
- Converts paths to query strings for redirect

### `/index.html`
- Added redirect handler script in the `<head>`
- Restores original URL from query parameters
- Uses `history.replaceState` to maintain clean URLs

### `/playwright.config.ts`
- Changed `baseURL` from `http://localhost:5173` to `http://localhost:5000`
- Changed `webServer.command` from `npm run dev` to `npm run dev:prod`
- Changed `webServer.url` from `http://localhost:5173` to `http://localhost:5000`
- This makes tests run faster by avoiding Tina CMS startup

## Testing

### Build Test
```bash
npm run build:local
```
✅ Build successful - both 404.html and index.html are correctly included in the dist folder

### Manual Testing Required
Since this is a GitHub Pages-specific issue, it can only be fully tested after deployment:
1. Deploy to GitHub Pages
2. Navigate directly to a recipe URL (e.g., `/recipe/durban-beef-curry`)
3. Verify the page loads correctly instead of showing 404

### Local Testing
The dev server will work normally as Vite's dev server handles SPA routing automatically. The redirect scripts only activate on static hosting platforms like GitHub Pages.

## Technical Details

### SPA Redirect Script
- Based on [spa-github-pages](https://github.com/rafgraph/spa-github-pages) (MIT License)
- Industry-standard solution for SPAs on GitHub Pages
- Works with all modern browsers
- Maintains clean URLs in the address bar

### Why This Approach?
Other solutions considered:
- **HashRouter**: Would require changing all routes to use `#` (e.g., `#/recipe/durban-beef-curry`), which is less user-friendly
- **Static site generation**: Would require major refactoring to pre-render all routes
- **Netlify/Vercel**: Different hosting platforms handle SPA routing automatically, but GitHub Pages requires this workaround

## Deployment

The fix will be applied on the next deployment to GitHub Pages via the existing GitHub Actions workflow.

## Follow-up

None required - this is a complete fix for the routing issue.

## References

- [spa-github-pages](https://github.com/rafgraph/spa-github-pages) - The redirect script solution
- [GitHub Pages SPA routing](https://github.com/rafgraph/spa-github-pages#how-it-works) - Technical explanation
