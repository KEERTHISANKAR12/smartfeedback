# Vercel Deployment Setup Guide

## ✅ Changes Made for Vercel Compatibility

1. **Created `api/index.ts`** - Vercel serverless function handler for Express app
2. **Updated `vercel.json`** - Build configuration for Vercel
3. **Created `.vercelignore`** - Files to exclude from deployment
4. **Updated `vite.config.ts`** - Explicit build output configuration
5. **Updated `server.ts`** - Better error handling for production builds

---

## 📋 Step-by-Step Deployment Instructions

### Step 1: Push Changes to GitHub

```bash
git add .
git commit -m "Add Vercel deployment configuration"
git push origin main
```

### Step 2: Configure Environment Variables in Vercel

1. Go to **Vercel Dashboard** → Your Project
2. Click **Settings** → **Environment Variables**
3. Add these three variables:

| Key | Value | Example |
|-----|-------|---------|
| `MONGODB_URI` | Your MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/feedback_db` |
| `GEMINI_API_KEY` | Your Gemini API Key | `AIzaSyD...` |
| `APP_URL` | Your Vercel domain | `https://your-app.vercel.app` |

**Getting MongoDB Connection String:**
- If using **MongoDB Atlas**:
  1. Go to https://www.mongodb.com/cloud/atlas
  2. Click "Connect" on your cluster
  3. Select "Drivers" 
  4. Copy the connection string
  5. Replace `<password>` with your DB user password

**Getting Gemini API Key:**
- Go to https://ai.google.dev/
- Create a new API key
- Copy and paste here

### Step 3: Redeploy

1. In Vercel Dashboard, click **Deployments**
2. Find the failed deployment
3. Click the **three dots** → **Redeploy**
4. Wait for the build to complete

---

## 🔍 Verify Deployment

Once deployed, test these endpoints:

```bash
# Health Check
curl https://your-app.vercel.app/api/health

# Response should be:
# {"status":"connected","database":"MongoDB","uri":"Configured"}

# Access Frontend
https://your-app.vercel.app
```

---

## 🆘 If Build Still Fails

### Check Build Logs
1. Vercel Dashboard → Deployments → Click failed build
2. Scroll to bottom to see full error

### Common Issues & Fixes

**Issue: `ENOTFOUND mongodb`**
- ❌ Make sure `MONGODB_URI` is set in Vercel Project Settings
- ✅ Use MongoDB Atlas (cloud) instead of localhost

**Issue: `Cannot find module`**
- ❌ Run `npm install` locally to update package-lock.json
- ✅ Push the updated `package-lock.json` to GitHub

**Issue: `Build timeout`**
- ❌ Building takes too long
- ✅ Increase Vercel Pro plan timeout or optimize build

**Issue: `PORT already in use`**
- ❌ Environment issue on Vercel build machine
- ✅ This is usually auto-handled; check logs for details

---

## 📊 Vercel Project Settings Checklist

- [ ] Environment Variables configured (MONGODB_URI, GEMINI_API_KEY)
- [ ] Node.js version: **18.x or higher**
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`
- [ ] Install Command: `npm install`
- [ ] Development Command: `npm run dev`

---

## 📝 File Structure for Vercel

```
college-feedback-system/
├── api/
│   └── index.ts              ← Vercel serverless function
├── backend/
│   ├── config/db.ts
│   ├── models/
│   └── routes/api.ts
├── src/
│   ├── components/
│   └── App.tsx
├── dist/                     ← Built frontend (auto-generated)
├── vercel.json              ← Vercel configuration
├── vite.config.ts           ← Build config
├── server.ts                ← Express server (dev only)
└── package.json
```

---

## 🚀 Production URLs

Once deployed:
- **Frontend:** `https://your-app.vercel.app`
- **API Base:** `https://your-app.vercel.app/api`
- **Health Check:** `https://your-app.vercel.app/api/health`

---

## 💡 Tips

- **Auto-redeploy on push:** Vercel automatically rebuilds when you push to GitHub
- **Preview deployments:** Each pull request gets a preview URL
- **Custom domain:** Add custom domain in Vercel Settings
- **Monitoring:** Use Vercel Analytics to monitor performance

---

## Need Help?

- Check Vercel logs: Dashboard → Deployments → Click failed build
- Verify environment variables are set in Project Settings
- Ensure MongoDB Atlas IP whitelist includes Vercel IPs (or use 0.0.0.0/0)
