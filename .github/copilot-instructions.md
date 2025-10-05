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
- **Format**: `YYYYMMDD-topic.md`
- **Example**: `20250105-recipe-search-implementation.md`
- **Date Format**: Use ISO 8601 date format (YYYYMMDD)
- **Topic**: Use lowercase with hyphens for multi-word topics

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
3. Ensure changes align with the "elegant, accessible, delightful" experience qualities

### Making Changes
1. Make minimal, surgical changes - change only what's necessary
2. Follow existing code patterns and conventions
3. Update relevant documentation if making structural changes
4. Test changes locally before committing

### After Making Changes
1. Run linters: `npm run lint`
2. Build the project: `npm run build`
3. Test in dev mode: `npm run dev`
4. Document significant changes in `/docs/tasks/` following naming conventions

## Testing and Quality

### Before Committing
- Ensure no TypeScript errors: `npm run build`
- Run ESLint: `npm run lint`
- Test affected functionality manually
- Verify responsive design if UI changes were made

### Edge Cases to Consider
- Missing or failed image loads
- Empty states (no recipes, no search results)
- Long text content (titles, descriptions)
- Various screen sizes and devices
- Slow network conditions

## Important Reminders

### ⚠️ Critical Guidelines
1. **Keep these instructions updated** - Especially during Tina CMS migration
2. **All docs in `/docs`** - Except standard GitHub files
3. **Task files use date prefix** - `YYYYMMDD-topic.md` format
4. **Minor tasks update existing files** - Don't create duplicate task files
5. **Document major changes** - Create task files for significant work

### When to Update These Instructions
- Adding new tools or dependencies
- Changing project structure
- Migrating to Tina CMS (major milestone)
- Establishing new coding patterns
- Adding new development workflows
- Changing documentation structure

---

**Last Updated**: 2025-01-05
**Version**: 1.0.0
**Status**: Pre-Tina CMS Migration
