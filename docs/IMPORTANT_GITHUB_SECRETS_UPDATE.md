# 🚨 IMPORTANT: GitHub Secrets Update Required

## Action Required Before Merging

Before merging this PR, you must update your GitHub repository secrets.

### Secret to Rename

- **Old name**: `NEXT_PUBLIC_TINA_CLIENT_ID`
- **New name**: `TINA_CLIENT_ID`
- **Value**: Keep the same value, only change the name

### Steps to Update

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Find the secret named `NEXT_PUBLIC_TINA_CLIENT_ID`
4. Copy the value
5. Create a new secret named `TINA_CLIENT_ID` with the same value
6. Delete the old `NEXT_PUBLIC_TINA_CLIENT_ID` secret

### Why This Change is Necessary

The previous implementation used `NEXT_PUBLIC_TINA_CLIENT_ID` as the environment variable name. However, this caused issues because:

1. The Tina CLI automatically collects all environment variables starting with `NEXT_PUBLIC_`
2. These variables are passed to esbuild's `define` option
3. The Tina CLI has a bug where it formats these values as `new Object({...})` which is invalid for esbuild
4. This causes the build to fail with: `Invalid define value (must be an entity name or valid JSON syntax)`

By renaming to `TINA_CLIENT_ID` (without the `NEXT_PUBLIC_` prefix), the variable is no longer automatically collected, avoiding the esbuild error.

### What Happens If You Don't Update

If you merge without updating the secret name, the GitHub Actions workflow will still fail because:
- The workflow expects a secret named `TINA_CLIENT_ID`
- The Tina config looks for `process.env.TINA_CLIENT_ID`
- Without this secret, Tina cannot authenticate

### Verification

After updating the secret:
1. Merge this PR
2. GitHub Actions will run automatically
3. Check the workflow run at: https://github.com/GordonBeeming/personal-recipes/actions
4. The build should complete successfully

---

**Note**: The `TINA_TOKEN` secret does not need to be changed - it already has the correct name.
