# Tina Admin Routing Fix

**Date**: 2025-01-05
**Task**: 13
**Type**: Admin Access Fix
**Status**: Complete

## Issue

`/admin` and `/admin/` redirecting to homepage instead of loading Tina CMS admin.

**Root Cause**: React Router wildcard route (`*`) was catching `/admin` requests and redirecting to home.

## Solution

### Development (Local):
Added Vite proxy configuration to route `/admin` requests to Tina dev server (port 4001).

**Two ways to access admin locally**:

1. **Use dev:tina** (recommended):
   ```bash
   pnpm run dev:tina
   # Starts Tina dev server (4001) + Vite dev server (5000)
   # Visit http://localhost:5000/admin
   ```

2. **Use regular dev** (admin won't work):
   ```bash
   pnpm run dev
   # Only Vite dev server
   # /admin will show proxy error (expected)
   ```

### Production:
- Workflow builds Tina admin to `/public/admin/` 
- Gets deployed with site to `/admin`
- Accessible at `recipes.gordonbeeming.com/admin`

## Files Changed

### `vite.config.ts`:
```typescript
server: {
  port: 5000,
  proxy: {
    '/admin': {
      target: 'http://localhost:4001',  // Tina dev server
      changeOrigin: true,
      configure: (proxy, options) => {
        proxy.on('error', (err, req, res) => {
          console.log('Tina admin not running. Start with: pnpm run dev:tina')
        })
      }
    }
  }
}
```

## How It Works

### Development Flow:
1. Run `pnpm run dev:tina`
2. Tina starts on port 4001
3. Vite starts on port 5000  
4. Vite proxies `/admin` → `http://localhost:4001/admin`
5. Tina admin loads at `http://localhost:5000/admin`

### Production Flow:
1. GitHub Actions builds Tina: `pnpm run build:tina`
2. Admin UI generated in `/public/admin/`
3. Site builds: `pnpm run build`
4. Vite copies `/public/admin/` to `/dist/admin/`
5. Deployed to GitHub Pages
6. Admin accessible at `/admin`

## Commands

### Development:
```bash
# With Tina admin (recommended)
pnpm run dev:tina

# Without Tina admin (just recipe site)
pnpm run dev
```

### Production Build:
```bash
pnpm run build:tina  # Build admin
pnpm run build       # Build site
```

## Testing

### Local:
- [x] `pnpm run dev:tina` → Admin loads at `/admin` ✓
- [x] Tina visual editing works ✓
- [x] Can browse/edit recipes ✓

### Production:
- [x] Workflow builds admin ✓
- [x] Admin deploys to GitHub Pages ✓
- [x] Accessible at `/admin` ✓

## Why This Approach?

**Alternatives considered**:
1. ❌ Exclude `/admin` from React Router → Breaks SPA navigation
2. ❌ Hash routing (`#/admin`) → Non-standard URL
3. ✅ Vite proxy in dev + static files in prod → Clean URLs, works everywhere

## Environment Variables

Required for Tina Cloud:
- `VITE_TINA_CLIENT_ID` → Client ID (public, in .env)
- `TINA_TOKEN` → API token (secret, GitHub only)

## Admin Access

### Development:
```
http://localhost:5000/admin
```

### Production:
```
https://recipes.gordonbeeming.com/admin
```

## Notes

- Tina dev server runs on port 4001
- Vite dev server runs on port 5000
- Admin requests proxied in dev
- Admin served as static files in prod
- React Router doesn't handle `/admin` in either case

---

**Status**: Admin routing fixed for dev and production
**Impact**: Tina CMS admin accessible at `/admin`
**Next**: Use `pnpm run dev:tina` for development with admin
