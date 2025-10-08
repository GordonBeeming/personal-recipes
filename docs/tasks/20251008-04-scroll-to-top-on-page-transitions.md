# Scroll to Top on Page Transitions

**Date**: 2025-01-08  
**Task**: Fix scroll position issue on mobile - page should scroll to top when navigating between pages

## Problem

On mobile devices, when opening a recipe page, the page would stay scrolled down at the previous scroll position instead of scrolling to the top. This caused a poor user experience where users would see the middle of a recipe page instead of the beginning.

## Solution

Implemented a `ScrollToTop` component using React Router's `useLocation` hook that automatically scrolls the window to the top whenever the route changes.

### How It Works

1. The `ScrollToTop` component listens to route changes using `useLocation().pathname`
2. When the pathname changes (indicating a route transition), it calls `window.scrollTo(0, 0)`
3. The component is placed inside the `BrowserRouter` so it can access the router context
4. It returns `null` as it doesn't render any UI elements

This is the standard React Router pattern for handling scroll restoration in SPAs.

## Files Changed

### New File: `/src/components/ScrollToTop.tsx`
- Created a new component that scrolls to top on route changes
- Uses `useLocation` hook to detect pathname changes
- Calls `window.scrollTo(0, 0)` in a `useEffect` hook
- Well-documented with JSDoc comments

### Modified File: `/src/App.tsx`
- Added import for `ScrollToTop` component
- Added `<ScrollToTop />` component inside `BrowserRouter` before `Routes`

## Testing

Manually tested the following scenarios:

1. **Home to Recipe**: 
   - Scrolled down on homepage
   - Clicked on a recipe
   - Verified page scrolled to top on recipe page ✓

2. **Recipe to Home**:
   - Scrolled down on recipe page
   - Clicked "Back to Recipes" button
   - Verified page scrolled to top on homepage ✓

3. **Recipe to Recipe**:
   - Navigation between different recipes also scrolls to top ✓

All scroll positions were verified to be 0 (top of page) after each navigation.

## User Experience Impact

- **Mobile users** now see the top of the page when navigating to a recipe
- **Desktop users** also benefit from consistent scroll behavior
- **Accessibility** improved - users don't miss important content at the top of pages
- **Natural behavior** - matches user expectations from traditional websites

## Technical Details

### Why This Approach?

- **Standard pattern**: This is the recommended React Router approach for scroll restoration
- **Minimal code**: Only requires a small component with a useEffect hook
- **No dependencies**: Uses built-in browser API (`window.scrollTo`)
- **Performant**: Runs only on route changes, not on every render
- **Accessible**: Works with keyboard navigation and screen readers

### Alternative Approaches Considered

- **ScrollRestoration API**: Browser's native scroll restoration, but not consistently supported across all browsers for SPAs
- **Manual scroll in each component**: Would require changes to multiple components and be harder to maintain
- **React Router's ScrollRestoration component**: Not available in current version being used

## Browser Compatibility

The `window.scrollTo(0, 0)` API is supported in all modern browsers including:
- Chrome/Edge (all versions)
- Firefox (all versions)
- Safari (all versions)
- Mobile browsers (iOS Safari, Chrome Mobile, etc.)

## Follow-up

None required - this is a complete fix for the scroll position issue.
