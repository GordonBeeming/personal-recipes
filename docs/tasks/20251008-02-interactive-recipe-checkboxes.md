# Add Interactive Recipe Progress Tracking

**Date**: 2025-10-08  
**Feature**: Replace bullet lists with interactive checkboxes that track cooking progress

## Problem

When following a recipe, users need to:
- Track which ingredients they've gathered
- Mark which steps they've completed
- Resume progress if they need to leave and come back
- Clear progress when starting the recipe again

Traditional bullet lists don't provide this interactivity.

## Solution

Implemented interactive checkbox-based progress tracking with localStorage persistence:

1. **All bullet lists become checkboxes** - Both ingredients and instruction steps
2. **Progress is saved automatically** - Uses browser localStorage
3. **Per-recipe tracking** - Each recipe has independent progress
4. **Clear Progress button** - Appears when any items are checked
5. **Visual feedback** - Checked items show strikethrough

## Features Implemented

### ✅ Interactive Checkboxes

- Every list item (`<ul>` and `<ol>`) is replaced with a checkbox
- Click the checkbox OR the label text to toggle
- Checked state is immediately visible with strikethrough text
- Unchecked items remain normal

### ✅ Progress Persistence

- Progress saved to browser localStorage
- Key format: `recipe-progress-{slug}`
- Survives page refreshes and browser restarts
- Each recipe tracked independently

### ✅ Clear Progress Button

- Fixed position (bottom-right corner)
- Only appears when at least one item is checked
- Destructive variant (red) to indicate clearing action
- Includes "Eraser" icon for clarity
- Removes all checkmarks for the current recipe

### ✅ Accessibility

- Proper ARIA labels on checkboxes
- Label text describes the item being checked
- Keyboard accessible (Tab to navigate, Space to toggle)
- Screen reader friendly
- Works with keyboard-only navigation

### ✅ Styling

- Smooth transitions on checkbox interactions
- Strikethrough text for completed items
- Muted text color for completed items
- Maintains consistency with site theme
- Works in both light and dark modes

## Files Created

### `/src/hooks/useLocalStorage.ts`

A reusable React hook for localStorage state management:

```typescript
useLocalStorage<T>(key: string, initialValue: T)
```

**Features**:
- Type-safe with generics
- Handles JSON serialization/deserialization
- Error handling for localStorage access issues
- SSR-safe (checks for window object)
- Works like useState but persists to localStorage

## Files Modified

### `/src/components/RecipeDetail.tsx`

**New imports**:
- `Eraser` icon from Phosphor Icons
- `Checkbox` component from ui
- `useLocalStorage` hook
- `useState`, `useEffect` from React
- `Components` type from react-markdown

**State management**:
```typescript
const [checkedItems, setCheckedItems] = useLocalStorage<Record<string, boolean>>(
  `recipe-progress-${recipe.slug}`,
  {}
)
const [hasCheckedItems, setHasCheckedItems] = useState(false)
```

**Custom markdown components**:
- `li` - Renders list items with checkboxes
- `ul` - Removes default bullet styling
- `ol` - Removes default numbering

**New handlers**:
- `handleCheckboxChange(index, checked)` - Updates checkbox state
- `handleClearProgress()` - Clears all progress

**New UI element**:
- Fixed "Clear Progress" button (bottom-right)
- Conditional rendering based on `hasCheckedItems`

## How It Works

### Checkbox Identification

Each list item is identified by its first 50 characters:
```typescript
const itemText = String(children)
const itemIndex = itemText.slice(0, 50)
```

This creates a stable identifier that:
- Persists across sessions
- Doesn't require modifying markdown
- Handles dynamic content
- Works with any list structure

### State Storage

Progress is stored as a key-value object:
```json
{
  "Add 2 cups of flour to the bowl": true,
  "Mix until combined": false,
  "Bake for 30 minutes at 350°F": true
}
```

Stored in localStorage as:
```
recipe-progress-durban-beef-curry: {...}
recipe-progress-chocolate-cake: {...}
```

### Clear Progress Flow

1. User clicks "Clear Progress" button
2. `setCheckedItems({})` updates state to empty object
3. `useLocalStorage` hook saves empty object to localStorage
4. All checkboxes become unchecked
5. Button disappears (no items checked anymore)

## User Experience

### Starting a Recipe

1. Open a recipe
2. See all ingredients and steps as checkboxes (unchecked)
3. Progress indicator button is hidden

### During Cooking

1. Check off ingredients as you gather them
2. Check off steps as you complete them
3. "Clear Progress" button appears (bottom-right)
4. Leave the page and come back - progress is saved

### Completing a Recipe

1. All items checked off (or some remaining)
2. Click "Clear Progress" to reset for next time
3. All checkboxes reset to unchecked
4. Button disappears

### Multiple Recipes

- Each recipe tracks progress independently
- Can have progress in multiple recipes simultaneously
- Clearing one recipe doesn't affect others

## Technical Details

### localStorage Key Format

```
recipe-progress-{slug}
```

Examples:
- `recipe-progress-durban-beef-curry`
- `recipe-progress-chocolate-chip-cookies`
- `recipe-progress-banana-bread`

### Data Structure

```typescript
Record<string, boolean>
```

Each key is the item identifier (first 50 chars), value is checked state.

### Performance

- Minimal re-renders (only affected checkboxes update)
- localStorage operations are synchronous but fast
- No network requests required
- Scales well with any recipe size

## Accessibility Features

- ✅ Keyboard navigation (Tab, Space, Enter)
- ✅ ARIA labels on all interactive elements
- ✅ Screen reader announces checkbox state
- ✅ Visual focus indicators
- ✅ Label click toggles checkbox (larger click target)
- ✅ Semantic HTML structure

## Browser Compatibility

Requires:
- localStorage support (all modern browsers)
- React 19 features
- ES6+ JavaScript

Works in:
- ✅ Chrome/Edge
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers

## Future Enhancements (Optional)

Possible improvements:
- Add progress percentage indicator
- Export/import progress
- Sync progress across devices (cloud storage)
- Time tracking per recipe
- Recipe completion history
- Print without checkboxes (print stylesheet)

## Testing Checklist

- [x] Checkboxes appear on all list items
- [x] Clicking checkbox toggles state
- [x] Clicking label text toggles state
- [x] Checked items show strikethrough
- [x] Progress saves to localStorage
- [x] Progress persists after refresh
- [x] Clear Progress button appears when needed
- [x] Clear Progress resets all checkboxes
- [x] Each recipe has independent progress
- [x] Works in light mode
- [x] Works in dark mode
- [x] Keyboard accessible
- [x] Screen reader compatible

## Notes

- Progress is stored client-side only (not synced)
- Clearing browser data will clear progress
- Each browser/device has separate progress
- No user account required
- Privacy-friendly (no server tracking)
