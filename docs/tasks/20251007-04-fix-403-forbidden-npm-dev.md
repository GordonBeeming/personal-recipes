# Fix 403 Forbidden Error with npm run dev

**Date**: 2025-10-07  
**Issue**: Getting 403 Forbidden error when running `npm run dev`

## Problem

When running `npm run dev`, the browser shows:
```
Status: 403 Forbidden
URL: http://localhost:5000/
Source: Network
```

Even though the Vite dev server appears to start successfully.

## Root Cause

The `npm run dev` command runs `tinacms dev -c "vite"`, which:
1. Starts Tina CMS admin interface
2. Attempts to connect to Tina Cloud for authentication
3. Fails with 403 because Tina Cloud credentials are not configured or invalid
4. The 403 error from Tina Cloud propagates to the main app

### Why This Happens

The `.env` file has placeholder values:
```env
VITE_TINA_CLIENT_ID=your_client_id_here
TINA_TOKEN=your_token_here
```

When Tina tries to authenticate with these invalid credentials, Tina Cloud returns 403 Forbidden.

## Solution

**Use `npm run dev:prod` for local development instead of `npm run dev`.**

### Why This Works

- `npm run dev:prod` runs just `vite` (no Tina CMS)
- Starts the regular Vite dev server on port 5000
- No authentication required
- Faster startup time
- Perfect for developing recipes and UI

### Commands Comparison

| Command | What It Does | Use Case |
|---------|-------------|----------|
| `npm run dev` | Vite + Tina CMS admin | When you need to use `/admin` interface |
| `npm run dev:prod` | Vite only | Regular development (recommended) |

## When You Need Tina CMS Admin

If you actually need to access the Tina CMS admin interface at `/admin`, you'll need to:

1. **Set up Tina Cloud** (if not already done):
   - Go to https://app.tina.io/
   - Create/sign in to your account
   - Create a new project or connect existing repo
   - Get your Client ID and Token

2. **Update `.env` file** with real credentials:
   ```env
   NEXT_PUBLIC_TINA_CLIENT_ID=your_actual_client_id
   TINA_TOKEN=your_actual_token
   ```

3. **Then run** `npm run dev`
   - Admin will be available at http://localhost:5000/admin
   - Main app at http://localhost:5000/

## Recommendation

**For this project, always use `npm run dev:prod`** because:
- ✅ You edit recipes directly in markdown files (not through admin)
- ✅ Faster startup (no Tina overhead)
- ✅ No authentication needed
- ✅ Simpler development workflow
- ✅ No 403 errors

The Tina admin is only needed if you want to edit content through a web interface, which isn't necessary for this workflow.

## Updated Documentation

The `.github/copilot-instructions.md` already recommends:
- Use `npm run dev` for CMS access
- Use `npm run dev:prod` for regular development (faster, recommended)

## Quick Fix

Just use this command for development:
```bash
npm run dev:prod
```

That's it! No 403 errors, no configuration needed. ✅
