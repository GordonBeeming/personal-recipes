# Fix 403 Error - Remove Stale Admin Directory

**Date**: 2025-10-08  
**Issue**: Getting 403 Forbidden error even with `npm run dev:prod`

## Problem

Even when running `npm run dev:prod` (which doesn't start Tina CMS), users were experiencing 403 Forbidden errors. This was confusing because:
- The Vite server starts successfully
- Curl shows HTTP 200 OK responses
- The server logs look normal

## Root Cause

The `public/admin/` directory contained a stale `index.html` file from a previous Tina build that:
1. References assets from `http://localhost:4001` (Tina dev server port)
2. May trigger browser requests to Tina Cloud API
3. Can cause 403 errors when those requests fail

Even though `public/admin/` is in `.gitignore`, the directory can persist locally from previous builds or `npm run dev` sessions.

## Solution

**Remove the `public/admin/` directory when it's not needed:**

```bash
rm -rf public/admin
```

This directory is automatically generated when you run:
- `npm run dev` (starts Tina, generates admin)
- `npm run build` (includes Tina build step)

It's **not** needed for:
- `npm run dev:prod` (Vite only)
- `npm run build:local` (skip Tina build)

## Prevention

Since `public/admin/` is already in `.gitignore`, it won't be committed to git. However, it can accumulate locally.

### When to Remove It

Remove `public/admin/` if:
- You're getting 403 errors with `dev:prod`
- You switched from `npm run dev` to `npm run dev:prod`
- You're not using the Tina CMS admin interface

### When It's Created

The directory is created by:
- `tinacms dev` - Creates development admin files
- `tinacms build` - Creates production admin files

Both commands generate files that reference Tina Cloud and can cause auth errors if credentials aren't configured.

## Quick Fix

If you encounter 403 errors with `npm run dev:prod`:

```bash
# Stop the dev server
# Remove admin directory
rm -rf public/admin

# Start dev server again
npm run dev:prod
```

## Why This Happens

1. **You run `npm run dev`** → Tina generates `public/admin/`
2. **Files reference Tina Cloud** → Require authentication
3. **You switch to `npm run dev:prod`** → But admin files persist
4. **Browser loads page** → Might request admin assets
5. **Tina Cloud rejects** → Returns 403 Forbidden

## Long-term Solution

The `.gitignore` already prevents committing these files:
```
public/admin/
```

But they persist locally. Consider adding a cleanup script:

```json
{
  "scripts": {
    "clean": "rm -rf public/admin tina/__generated__",
    "dev:prod": "npm run clean && vite"
  }
}
```

This would ensure `dev:prod` always starts fresh without admin artifacts.

## Verification

After removing `public/admin/`:

```bash
npm run dev:prod
```

Should work without 403 errors.
