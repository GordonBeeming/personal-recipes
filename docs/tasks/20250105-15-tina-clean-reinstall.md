# Tina CMS Clean Reinstall for Tina Cloud

**Date**: 2025-01-05  
**Task**: Clean reinstall of Tina CMS with proper Tina Cloud configuration

## Problem

The Tina CMS setup had become overcomplicated with:
- Conflicting environment variable names
- Unclear local vs. cloud configuration
- Missing proper documentation for Tina Cloud setup
- Build scripts that didn't properly support both modes

## Solution

Stripped out the entire Tina CMS setup and reinstalled it cleanly with proper Tina Cloud support.

## Changes Made

### 1. Removed Old Tina Setup

- [x] Deleted `tina/` folder completely
- [x] Deleted `public/admin/` folder
- [x] Uninstalled `tinacms` and `@tinacms/cli` packages
- [x] Removed Tina-related scripts from package.json

### 2. Reinstalled Tina CMS

- [x] Installed `tinacms` and `@tinacms/cli` packages fresh
- [x] Created new `tina/config.ts` with clean configuration
- [x] Added proper schema matching existing recipe content structure

### 3. Updated Configuration Files

**package.json**:
- [x] Added `dev` script: `tinacms dev -c "vite"` - runs Tina + Vite together
- [x] Added `dev:prod` script: `vite` - runs Vite without Tina (faster for code changes)
- [x] Added `build` script: `tinacms build && tsc -b --noCheck && vite build` - full production build
- [x] Added `build:tina` script: `tinacms build` - build Tina admin only
- [x] Added `build:local` script: `tsc -b --noCheck && vite build` - build without Tina Cloud

**.env.example**:
- [x] Updated to use `NEXT_PUBLIC_TINA_CLIENT_ID` (Tina's standard naming)
- [x] Updated to use `TINA_TOKEN` for read-only token
- [x] Removed non-standard variable names

**.gitignore**:
- [x] Added `tina/__generated__/` to ignore auto-generated files
- [x] Kept `public/admin/` in gitignore (build artifact)

**.github/workflows/deploy.yml**:
- [x] Updated environment variable names to match Tina standards
- [x] Changed to use `build:local` for site build (after Tina admin is built separately)
- [x] Proper error handling if Tina Cloud credentials aren't configured

### 4. Documentation

- [x] Created comprehensive setup guide: `docs/TINA_CLOUD_SETUP.md`
- [x] Documented step-by-step Tina Cloud configuration
- [x] Added troubleshooting section
- [x] Included local development setup instructions

## File Structure

```
tina/
  ├── config.ts               # Tina schema and configuration
  └── __generated__/          # Auto-generated (gitignored)
      ├── _graphql.json
      ├── _lookup.json
      ├── _schema.json
      ├── client.ts
      └── config.prebuild.jsx

public/
  └── admin/                  # Generated admin UI (gitignored)

.env.example                  # Template with correct variable names
.gitignore                    # Excludes generated files
docs/
  └── TINA_CLOUD_SETUP.md    # Complete setup documentation
```

## How to Use

### For Local Development with CMS:

```bash
# 1. Setup environment variables (one time)
cp .env.example .env
# Edit .env with your Tina Cloud credentials

# 2. Start dev server
npm run dev

# 3. Access admin at http://localhost:5173/admin
```

### For Local Development without CMS (faster):

```bash
npm run dev:prod
```

### For Building:

```bash
# Full build with Tina Cloud (requires credentials)
npm run build

# Build without Tina Cloud (uses local schema)
npm run build:local
```

## Next Steps for User

1. **Create Tina Cloud Account**:
   - Go to https://app.tina.io/
   - Sign up with GitHub account
   - Create a new project for the repository

2. **Get Credentials**:
   - Client ID (public)
   - Read-Only Token (secret)

3. **Configure GitHub Secrets**:
   - Add `NEXT_PUBLIC_TINA_CLIENT_ID` secret
   - Add `TINA_TOKEN` secret

4. **Test Build**:
   - Push changes to GitHub
   - Verify GitHub Actions builds successfully
   - Check that `/admin` is accessible on deployed site

5. **Configure Local Environment** (optional):
   - Copy `.env.example` to `.env`
   - Add credentials from Tina Cloud
   - Run `npm run dev` to test locally

## Testing Performed

- [x] Verified Tina schema generation creates `__generated__` folder
- [x] Confirmed package.json has all necessary scripts
- [x] Verified `.gitignore` excludes generated files
- [x] Confirmed environment variable names match Tina standards
- [x] Created comprehensive documentation

## Benefits

1. **Simpler Setup**: Clear separation between local and cloud modes
2. **Standard Naming**: Uses Tina's standard environment variable names
3. **Better Documentation**: Step-by-step guide for Tina Cloud setup
4. **Flexible Development**: Can develop with or without CMS running
5. **Production Ready**: Proper build pipeline for GitHub Actions

## Known Issues / Follow-up

- Build will fail without Tina Cloud credentials (expected behavior)
- User needs to set up Tina Cloud account and configure secrets
- Local development requires `.env` file for CMS access

## References

- [Tina Cloud Setup Guide](docs/TINA_CLOUD_SETUP.md)
- [Tina Documentation](https://tina.io/docs/)
- [Tina Cloud Dashboard](https://app.tina.io/)
