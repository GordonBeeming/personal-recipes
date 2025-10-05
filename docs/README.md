# Documentation

This folder contains all project documentation except for standard GitHub files (README, LICENSE, SECURITY, etc.).

## Structure

### `/docs` (this folder)
- **PRD.md** - Product Requirements Document
- Other architectural and design documents
- User guides and development documentation

### `/docs/tasks`
Task outcomes and development logs documenting significant changes and feature implementations.

**Naming Convention**: `YYYYMMDD-topic.md`
- Use ISO 8601 date format (YYYYMMDD)
- Use lowercase with hyphens for topics
- Example: `20250105-recipe-search-implementation.md`

**Guidelines**:
- **Minor tasks**: Update existing task files instead of creating new ones
- **Major tasks**: Create new dated task files for significant features or changes
- Include: objective, changes made, testing, and follow-up items

## Tina CMS Migration

This project will be migrated to Tina CMS for content management. As the migration progresses:
- This documentation structure may evolve
- New CMS-specific documentation will be added
- Update the main Copilot instructions (`.github/copilot-instructions.md`) with any major changes

## Contributing

When adding documentation:
1. Follow the established naming conventions
2. Keep documentation clear and concise
3. Update this README if adding new documentation categories
4. For development tasks, always use the `/docs/tasks` folder with date-prefixed filenames
