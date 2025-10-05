# Quick Start: Setting Up Tina Cloud

This is a condensed checklist for setting up Tina Cloud. For detailed instructions, see [TINA_CLOUD_SETUP.md](TINA_CLOUD_SETUP.md).

## ✅ Setup Checklist

### 1. Create Tina Cloud Account
- [ ] Go to https://app.tina.io/
- [ ] Sign up with GitHub account
- [ ] Authorize repository access

### 2. Create Project
- [ ] Click "Create Project"
- [ ] Select your repository
- [ ] Choose "Other" as framework
- [ ] Set branch to `main`
- [ ] Note your **Client ID** and **Read-Only Token**

### 3. Configure GitHub Secrets
- [ ] Go to repository Settings → Secrets and variables → Actions
- [ ] Add secret: `NEXT_PUBLIC_TINA_CLIENT_ID` = your Client ID
- [ ] Add secret: `TINA_TOKEN` = your Read-Only Token

### 4. Test Deployment
- [ ] Push changes to GitHub
- [ ] Check GitHub Actions build succeeds
- [ ] Visit your site's `/admin` page
- [ ] Sign in and verify you can edit content

### 5. Local Development (Optional)
- [ ] Copy `.env.example` to `.env`
- [ ] Add your credentials to `.env`
- [ ] Run `npm run dev`
- [ ] Access admin at `http://localhost:5173/admin`

## 🎯 What You Get

✅ Visual content editor at `/admin`  
✅ Changes committed directly to GitHub  
✅ Automatic deployment on content updates  
✅ Media upload and management  
✅ Local development support  

## 🔗 Resources

- **Detailed Guide**: [TINA_CLOUD_SETUP.md](TINA_CLOUD_SETUP.md)
- **Tina Dashboard**: https://app.tina.io/
- **Documentation**: https://tina.io/docs/

## ❓ Common Issues

**Build fails with "Client not configured properly"**
→ Check that GitHub secrets are named exactly as shown above

**Admin shows 404**
→ Verify the build succeeded and `public/admin/` exists

**Can't edit content**
→ Make sure you're signed in with the GitHub account that has write access

---

Need help? Check the [full setup guide](TINA_CLOUD_SETUP.md) or [troubleshooting section](TINA_CLOUD_SETUP.md#troubleshooting).
