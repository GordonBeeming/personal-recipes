# Personal Recipe Website

A beautifully crafted personal recipe collection that transforms markdown recipe files into an elegant, searchable digital cookbook experience.

**Experience Qualities**: 
1. **Elegant** - Clean, sophisticated interface that makes recipes feel like treasured family heirlooms
2. **Accessible** - Intuitive navigation and search that helps users find exactly what they're looking for
3. **Delightful** - Smooth interactions and thoughtful details that make cooking preparation enjoyable

**Complexity Level**: Light Application (multiple features with basic state)
- Provides recipe browsing, searching, filtering, and detailed view functionality with persistent user preferences

## Essential Features

**Recipe Gallery**
- Functionality: Display all recipes in a responsive grid layout with hero images and key metadata
- Purpose: Allow users to browse their entire recipe collection at a glance
- Trigger: Homepage load
- Progression: Load recipes → Display grid → Filter/search options → Click to view details
- Success criteria: All recipes load quickly, images display properly, responsive layout works on all devices

**Recipe Search & Filtering**
- Functionality: Real-time search by title, category filtering, and tag-based filtering
- Purpose: Help users quickly find specific recipes or explore by type
- Trigger: Typing in search box or selecting filter options
- Progression: Input search term → Filter results → Update display → Clear filters if needed
- Success criteria: Search is responsive (<300ms), filters combine logically, clear visual feedback

**Recipe Detail View**
- Functionality: Full recipe display with ingredients checklist, step-by-step instructions, and image gallery
- Purpose: Provide complete cooking information in an organized, easy-to-follow format
- Trigger: Clicking on recipe card
- Progression: Click recipe → Load detail view → Check off ingredients → Follow instructions → Return to gallery
- Success criteria: All content renders correctly, checkboxes work for ingredients, images display in gallery

**Statistics Dashboard**
- Functionality: Display total recipe count and category breakdown
- Purpose: Give users a sense of their collection scope and help with discovery
- Trigger: Homepage load
- Progression: Calculate statistics → Display prominently → Update when recipes change
- Success criteria: Numbers are accurate, visually prominent, update dynamically

## Edge Case Handling
- **Missing Images**: Display elegant placeholder with recipe type icon when hero image fails to load
- **Empty Search Results**: Show encouraging message with suggestion to try different terms or clear filters  
- **Long Recipe Titles**: Gracefully truncate with ellipsis while maintaining readability
- **No Recipe Content**: Display beautiful empty state encouraging users to add their first recipe
- **Large Ingredient Lists**: Implement scrollable sections with clear visual boundaries

## Design Direction
The design should feel warm and inviting like a cherished family cookbook, with clean modern aesthetics that don't compete with food photography. Minimal interface that lets recipes shine while providing sophisticated organizational tools.

## Color Selection
Custom palette - A warm, sophisticated palette that evokes trust and appetite appeal while maintaining excellent readability.

- **Primary Color**: Warm Sage Green (oklch(0.45 0.08 140)) - Communicates freshness, natural ingredients, and calm cooking environment
- **Secondary Colors**: Cream White (oklch(0.97 0.01 85)) for cards and backgrounds, Rich Charcoal (oklch(0.25 0.01 200)) for text depth
- **Accent Color**: Burnt Orange (oklch(0.65 0.15 45)) - Warm, appetizing highlight for CTAs and active states
- **Foreground/Background Pairings**: 
  - Background (Warm Cream #FDFDFB): Rich Charcoal (#3F4041) - Ratio 12.1:1 ✓
  - Card (Pure White #FFFFFF): Rich Charcoal (#3F4041) - Ratio 13.2:1 ✓  
  - Primary (Sage Green #5B8B5A): White (#FFFFFF) - Ratio 5.2:1 ✓
  - Accent (Burnt Orange #C8754A): White (#FFFFFF) - Ratio 4.6:1 ✓

## Font Selection
Typography should convey warmth and reliability while maintaining excellent readability across all content types from ingredient lists to lengthy instructions.

- **Typographic Hierarchy**: 
  - H1 (Recipe Titles): Inter Bold/32px/tight letter spacing for strong presence
  - H2 (Section Headers): Inter Semibold/24px/normal spacing for clear content organization  
  - Body (Instructions/Content): Inter Regular/16px/relaxed line height for comfortable reading
  - Small (Metadata): Inter Medium/14px/normal for recipe details and timing

## Animations
Subtle, purposeful animations that enhance the cooking workflow without creating distraction during recipe following.

- **Purposeful Meaning**: Gentle transitions communicate state changes and guide attention to important recipe elements
- **Hierarchy of Movement**: Ingredient checkbox animations get priority, followed by navigation transitions, with decorative elements using minimal motion

## Component Selection
- **Components**: Card for recipe display, Button for actions, Input for search, Select for category filtering, Badge for tags, Checkbox for ingredients, Separator for content sections
- **Customizations**: Custom RecipeCard component with overlay text on hero images, IngredientList with interactive checkboxes, ImageGallery for multiple recipe photos
- **States**: Hover effects on recipe cards with subtle lift, active states for filters with color changes, loading states with skeleton placeholders
- **Icon Selection**: Chef hat for recipes, search glass for search, filter funnel for filtering, checkmark for completed ingredients, share arrow for sharing
- **Spacing**: Base 4px grid with generous 24px padding on cards, 16px gaps in grids, 8px margins for tight groupings
- **Mobile**: Single column recipe grid on mobile, collapsible filter drawer, simplified navigation with hamburger menu, touch-friendly button sizing