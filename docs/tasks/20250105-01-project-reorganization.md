# Project Structure Reorganization and Copilot Instructions

**Date**: 2025-01-05
**Type**: Project Organization
**Status**: Completed

## Objective
Establish clear project organization standards and create Copilot instructions to guide development, especially in preparation for the upcoming Tina CMS migration.

## Changes Made

### 1. Created Copilot Instructions
- **File**: `.github/copilot-instructions.md`
- **Content**: Comprehensive development guidelines including:
  - Project overview and tech stack
  - File organization standards
  - Documentation structure rules
  - Task documentation conventions
  - Code style and patterns
  - Development workflow
  - Migration preparation notes

### 2. Established Folder Structure
Created new directories:
- `/docs` - For all project documentation
- `/docs/tasks` - For task outcome documentation

### 3. File Organization Rules

#### Files That Stay in Root:
- `README.md` - Project overview
- `LICENSE` - License file
- `SECURITY.md` - Security policies
- `CODE_OF_CONDUCT.md` - Community guidelines (if exists)
- `CONTRIBUTING.md` - Contribution guide (if exists)
- `CHANGELOG.md` - Version history (if exists)

#### Files Moved to /docs:
- `PRD.md` → `/docs/PRD.md` - Product Requirements Document

### 4. Task Documentation Standards

#### Naming Convention:
- Format: `YYYYMMDD-topic.md`
- Example: `20250105-project-reorganization.md`
- Date: ISO 8601 format (YYYYMMDD)
- Topic: lowercase-with-hyphens

#### Guidelines:
1. **Minor tasks**: Update existing task files, don't create new ones
2. **Major tasks**: Create new dated task files
3. Include: objective, changes made, testing, follow-up items

### 5. Tina CMS Migration Preparation

Key instruction to keep documentation updated during migration:
- Update `.github/copilot-instructions.md` when major changes occur
- Document new content structures and schemas
- Update development workflows as they change
- Keep both old and new patterns documented during transition

## Files Modified

### Created:
1. `.github/copilot-instructions.md` - Main Copilot instruction file
2. `docs/tasks/20250105-project-reorganization.md` - This file

### Moved:
1. `PRD.md` → `docs/PRD.md`

### Directory Structure:
```
/work
├── .github/
│   └── copilot-instructions.md
├── docs/
│   ├── PRD.md
│   └── tasks/
│       └── 20250105-project-reorganization.md
├── README.md (stays in root)
├── LICENSE (stays in root)
├── SECURITY.md (stays in root)
└── [other project files]
```

## Testing Performed
- Verified all files are in correct locations
- Confirmed standard GitHub files remain in root
- Checked that documentation is properly organized
- Validated folder structure creation

## Follow-up Items
1. Update any references to `PRD.md` location in other files if they exist
2. As Tina CMS migration begins, update `.github/copilot-instructions.md` immediately
3. Create migration-specific task files as major milestones are reached
4. Consider adding a `CONTRIBUTING.md` if the project becomes open source

## Notes
- This establishes the baseline organization structure
- All future documentation should follow these conventions
- The Copilot instructions are living documentation and should be updated regularly
- Task files should be concise but comprehensive enough for future reference

---

**Completed by**: GitHub Copilot
**Next Task**: Begin Tina CMS migration planning and setup
