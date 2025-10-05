# GitHub Copilot Instructions

## Project Overview
This is a personal recipe website built with React, Vite, TypeScript, and Tailwind CSS. The project is currently in transition and will be migrated to **Tina CMS** for content management.

## Technology Stack
- **Frontend**: React 19, TypeScript, Tailwind CSS 4
- **Build Tool**: Vite 6
- **UI Components**: Radix UI, shadcn/ui patterns
- **State Management**: TanStack Query
- **Markdown**: Marked, React Markdown
- **Future CMS**: Tina CMS (migration in progress)

## Project File Structure Rules

### ⚠️ CRITICAL: All Files Must Be in Project Directory
**NEVER write files outside the project root.** All files, directories, and artifacts must be within the project folder.

#### Allowed Locations:
- Project root: `/work` or current working directory
- Any subdirectories under project root
- Temporary files: Use `tmp/` folder within project (add to .gitignore)

#### Forbidden:
- Writing to home directory (`~/`)
- Writing to system directories (`/tmp`, `/var`, etc.)
- Writing outside project boundaries

#### If You Need Temporary Storage:
1. Create `tmp/` folder in project root
2. Add `tmp/` to `.gitignore`
3. Use it for temporary files
4. Clean up when done

## File Organization Standards

### Documentation Structure
**All documentation files must be organized in the `/docs` folder**, except for standard GitHub files.

#### Standard GitHub Files (keep in root):
- `README.md` - Project overview and getting started guide
- `LICENSE` - Project license
- `SECURITY.md` - Security policies and vulnerability reporting
- `CODE_OF_CONDUCT.md` - Community guidelines (if exists)
- `CONTRIBUTING.md` - Contribution guidelines (if exists)
- `CHANGELOG.md` - Version history (if exists)

#### Documentation Files (must be in `/docs`):
- Product requirements documents
- Architecture documentation
- Design specifications
- API documentation
- User guides
- Development guides
- Any other project documentation

### Task Documentation
All task outcomes from Copilot jobs and development tasks must be documented in `/docs/tasks/`.

#### Task File Naming Convention:
- **Format**: `YYYYMMDD-XX-topic.md` (XX is a two-digit order number)
- **Example**: `20250105-01-recipe-search-implementation.md`, `20250105-02-color-update.md`
- **Date Format**: Use ISO 8601 date format (YYYYMMDD)
- **Order**: Two-digit sequence number (01, 02, 03...) to track order of tasks on same day
- **Topic**: Use lowercase with hyphens for multi-word topics

#### Task Screenshots:
- **Location**: `/docs/tasks/images/`
- **For UI Changes**: Take before/after screenshots manually
- **Naming**: `YYYYMMDD-XX-{description}.png` (matches task file)
- **Examples**: 
  - `20250105-02-before-colors.png`
  - `20250105-02-after-colors.png`
  - `20250105-04-search-location.png`
- **In Task Docs**: Reference images with relative paths: `![Description](./images/20250105-02-before-colors.png)`

#### Task Documentation Guidelines:
1. **Minor Tasks**: Update existing task files instead of creating new ones
   - If a task is a continuation or update to previous work, append to the existing file
   - Add a new section with updated date header within the file
   
2. **Major Tasks**: Create new task files for significant features or changes
   - New features or components
   - Major refactoring efforts
   - Significant bug fixes
   - Architecture changes

3. **Task File Content Should Include**:
   - Date and brief description at the top
   - Problem/objective statement
   - Solution approach
   - Changes made (file changes, new dependencies, etc.)
   - Testing performed
   - Any follow-up items or known issues
   - **Use standard markdown checkboxes**: `- [ ]` for unchecked, `- [x]` for checked
   - Avoid using emojis (✅, ✓, ❌) for checkboxes - use proper markdown syntax

## Migration to Tina CMS

### ⚠️ Important: Keep Instructions Updated
**As the Tina CMS migration progresses, these instructions MUST be updated to reflect:**
- New content structure and schema
- Tina CMS specific patterns and best practices
- Changes to markdown file locations (if Tina manages them differently)
- New build processes or development workflows
- Updated component patterns for Tina integration

### During Migration:
1. Update this file immediately when major CMS-related changes are made
2. Document any breaking changes in a migration task file
3. Keep both old and new patterns documented until migration is complete
4. Add Tina-specific development guidelines as they are established

## Code Style and Patterns

### Accessibility First 🌟

**Accessibility is a CORE requirement, not an afterthought.**

Every component, feature, and change MUST be built with accessibility in mind:

#### Required Accessibility Practices:
1. **Semantic HTML**
   - Use appropriate HTML elements (`<button>`, `<nav>`, `<main>`, `<article>`, etc.)
   - Never use `<div>` or `<span>` when a semantic element exists
   - Ensure proper heading hierarchy (h1 → h2 → h3, no skipping levels)

2. **ARIA Attributes**
   - Add `aria-label` to icon-only buttons and interactive elements
   - Use `aria-hidden="true"` for decorative icons and images
   - Implement `aria-live` regions for dynamic content updates
   - Add `aria-describedby` for additional context when needed
   - Use proper `role` attributes (e.g., `role="list"`, `role="status"`)

3. **Keyboard Navigation**
   - All interactive elements must be keyboard accessible
   - Implement visible focus states (never `outline: none` without replacement)
   - Support standard keyboard patterns (Tab, Enter, Space, Escape, Arrow keys)
   - Ensure logical tab order follows visual flow

4. **Form Accessibility**
   - Always associate labels with form inputs using `htmlFor` and `id`
   - Include helpful placeholder text and error messages
   - Use `type="search"` for search inputs
   - Provide clear validation feedback

5. **Visual Accessibility**
   - Maintain WCAG AA contrast ratios minimum (4.5:1 for normal text, 3:1 for large text)
   - Don't rely on color alone to convey information
   - Ensure touch targets are at least 44×44 pixels
   - Support text resize up to 200% without breaking layout

6. **Images and Media**
   - Provide meaningful `alt` text for all images (describe content, not "image of...")
   - Use `aria-hidden="true"` for decorative images with empty alt (`alt=""`)
   - Ensure video/audio content has captions and transcripts

7. **Screen Reader Support**
   - Test with screen readers (VoiceOver, NVDA, JAWS)
   - Use skip links for navigation
   - Announce dynamic content changes with `aria-live`
   - Provide descriptive link text (avoid "click here")

#### Accessibility Checklist for Every Change:
- [ ] Can this be used with keyboard only?
- [ ] Does this work with a screen reader?
- [ ] Are color contrasts sufficient?
- [ ] Are all interactive elements properly labeled?
- [ ] Is focus management handled correctly?
- [ ] Are error states clearly communicated?
- [ ] Does this work at 200% zoom?

### TypeScript
- Use TypeScript for all new files
- Prefer type inference where possible
- Use interfaces for object shapes, types for unions/intersections
- Avoid `any` - use `unknown` if type is truly unknown

### React Patterns
- Use functional components with hooks
- Prefer composition over inheritance
- Use custom hooks for reusable logic
- Keep components small and focused (single responsibility)

### Naming Conventions
- **Components**: PascalCase (e.g., `RecipeCard.tsx`)
- **Utilities/Hooks**: camelCase (e.g., `useRecipeSearch.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_RECIPES`)
- **CSS Classes**: Use Tailwind utility classes, custom classes in kebab-case

### File Organization
```
src/
  ├── components/     # Reusable UI components
  ├── pages/          # Page components
  ├── hooks/          # Custom React hooks
  ├── utils/          # Utility functions
  ├── types/          # TypeScript type definitions
  ├── lib/            # Third-party library configurations
  └── assets/         # Static assets
```

## Development Workflow

### Before Making Changes
1. Check existing patterns in the codebase
2. Review PRD.md (in /docs after reorganization) for feature requirements
3. **Review accessibility requirements** - ensure changes maintain or improve accessibility
4. Ensure changes align with the "elegant, accessible, delightful" experience qualities

### Making Changes
1. Make minimal, surgical changes - change only what's necessary
2. Follow existing code patterns and conventions
3. **Implement accessibility best practices** - semantic HTML, ARIA, keyboard support
4. Update relevant documentation if making structural changes
5. Test changes locally before committing

### After Making Changes
1. Run linters: `npm run lint`
2. Build the project: `npm run build`
3. Test in dev mode: `npm run dev`
4. **Run Playwright tests**: `npm run test` (verifies functionality)
5. **For UI changes**: Take before/after screenshots manually, save to `docs/tasks/images/`
6. Document significant changes in `/docs/tasks/` following naming conventions
7. **Include screenshots in task docs** with relative image paths

## Testing and Quality

### Automated Testing with Playwright
**Always run Playwright tests before committing changes** to ensure the site works correctly.

#### Test Commands:
- `npm run test` - Run all tests
- `npm run test:ui` - Run tests in UI mode for debugging
- `npm run test:headed` - Run tests with browser visible

#### What Tests Cover:
- Homepage loading and recipe display
- Dark mode toggle functionality
- Search and filter operations
- Keyboard accessibility (Tab, Enter, Space navigation)
- Responsive design (mobile, tablet, desktop)
- Recipe detail page functionality

#### Screenshots for Task Documentation:
**Important**: Playwright tests verify functionality but DON'T auto-generate task screenshots.

**For UI changes, manually capture screenshots**:
1. Run the dev server: `npm run dev`
2. Take "before" screenshot of current state
3. Make your changes
4. Take "after" screenshot
5. Save both to `docs/tasks/images/` with task-numbered names
6. Reference in task documentation with relative paths

**Example**:
```markdown
## Visual Changes

Before:
![Before color update](./images/20250105-02-before-colors.png)

After:
![After color update](./images/20250105-02-after-colors.png)
```

### Before Committing
- **Run Playwright tests**: `npm run test` - Ensure all functionality works
- Ensure no TypeScript errors: `npm run build`
- Run ESLint: `npm run lint`
- Test affected functionality manually
- **For UI changes**: Capture before/after screenshots in `docs/tasks/images/`
- **Test keyboard navigation** - ensure all interactive elements are accessible
- **Test with screen reader** - verify announcements are correct
- Verify responsive design if UI changes were made
- **Check color contrast** - ensure WCAG AA compliance

### Edge Cases to Consider
- Missing or failed image loads
- Empty states (no recipes, no search results)
- Long text content (titles, descriptions)
- Various screen sizes and devices
- Slow network conditions
- **Keyboard-only navigation**
- **Screen reader usage**
- **High contrast mode**
- **Reduced motion preferences**

## Important Reminders

### ⚠️ Critical Guidelines
1. **All files in project directory** - Never write outside project root
2. **Keep these instructions updated** - Especially during Tina CMS migration
3. **All docs in `/docs`** - Except standard GitHub files
4. **Task files use date prefix** - `YYYYMMDD-XX-topic.md` format (XX = order number)
5. **Task screenshots in `/docs/tasks/images/`** - Manual before/after for UI changes
6. **Minor tasks update existing files** - Don't create duplicate task files
7. **Document major changes** - Create task files for significant work
8. **Accessibility is mandatory** - Every change must be accessible
9. **Test before committing** - Run Playwright tests to verify functionality

### When to Update These Instructions
- Adding new tools or dependencies
- Changing project structure
- Migrating to Tina CMS (major milestone)
- Establishing new coding patterns
- Adding new development workflows
- Changing documentation structure

---

**Last Updated**: 2025-01-05
**Version**: 1.4.0
**Status**: Pre-Tina CMS Migration
**Accessibility Standard**: WCAG 2.1 AA
**Testing**: Playwright for functionality verification
**Screenshots**: Manual capture in docs/tasks/images/
