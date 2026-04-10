# 🚀 Vercel Environment Variables Setup

## ✅ Step-by-Step Guide

### 1. Remove vercel.json Environment Variables

The `vercel.json` file has been updated to remove the secret references. Environment variables should be set in the Vercel dashboard instead.

### 2. Set Environment Variables in Vercel Dashboard

1. **Go to your Vercel project:**
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Select your Epic Cafe project

2. **Navigate to Settings:**
   - Click on **Settings** tab
   - Click on **Environment Variables** in the left sidebar

3. **Add the following environment variables:**

#### Variable 1: MONGODB_URI
- **Name:** `MONGODB_URI`
- **Value:** 
  ```
  mongodb+srv://sarveshdb_global:Sarsar%40098@sarveshcluster.zaf6xtu.mongodb.net/epic-cafe?retryWrites=true&w=majority
  ```
- **Environment:** Select all (Production, Preview, Development)
- Click **Save**

#### Variable 2: JWT_SECRET
- **Name:** `JWT_SECRET`
- **Value:** Generate a strong secret using this command:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
  Copy the output and paste it here
- **Environment:** Select all (Production, Preview, Development)
- Click **Save**

#### Variable 3: NODE_ENV
- **Name:** `NODE_ENV`
- **Value:** `production`
- **Environment:** Production only
- Click **Save**

### 3. Redeploy Your Project

After adding the environment variables:

1. Go to **Deployments** tab
2. Click on the three dots (...) next to your latest deployment
3. Click **Redeploy**
4. Or push a new commit to trigger automatic deployment

### 4. Verify Deployment

Once deployed:
1. Visit your Vercel URL
2. Try to sign up/login
3. Test admin login at `/admin`

---

## 🔍 Troubleshooting

### Error: "MONGODB_URI is not defined"
- Make sure you added the variable in Vercel dashboard
- Check that you selected the correct environments
- Redeploy after adding variables

### Error: "Connection timeout"
- Verify MongoDB Atlas Network Access allows 0.0.0.0/0
- Check the connection string is correct
- Ensure password is URL-encoded (`%40` for `@`)

### Error: "Invalid credentials"
- Run `npm run setup-admin` locally with production MONGODB_URI
- Or create admin user directly in MongoDB Atlas

---

## 📋 Quick Checklist

- [ ] Removed secret references from `vercel.json`
- [ ] Added `MONGODB_URI` in Vercel dashboard
- [ ] Added `JWT_SECRET` in Vercel dashboard
- [ ] Added `NODE_ENV` in Vercel dashboard
- [ ] Selected correct environments for each variable
- [ ] Redeployed the project
- [ ] Tested signup/login
- [ ] Tested admin login
- [ ] Created admin user in production database

---

## 🎯 Important Notes

1. **Never commit secrets to Git**
   - `.env.local` is in `.gitignore`
   - Environment variables are only in Vercel dashboard

2. **URL-encode special characters**
   - `@` becomes `%40`
   - Your password `Sarsar@098` becomes `Sarsar%40098`

3. **Different secrets for production**
   - Use a different `JWT_SECRET` for production
   - Never use the same secrets across environments

4. **MongoDB Atlas Network Access**
   - Must allow Vercel IPs (use 0.0.0.0/0)
   - Go to MongoDB Atlas → Network Access → Add IP Address

---

## 📸 Visual Guide

### Adding Environment Variable in Vercel:

1. **Settings → Environment Variables**
2. Click **Add New**
3. Enter Name: `MONGODB_URI`
4. Enter Value: `mongodb+srv://...`
5. Select Environments: ✓ Production ✓ Preview ✓ Development
6. Click **Save**

Repeat for `JWT_SECRET` and `NODE_ENV`.

---

## ✅ Success Indicators

Your deployment is successful when:
- ✅ Build completes without errors
- ✅ No environment variable errors in logs
- ✅ Homepage loads correctly
- ✅ User signup/login works
- ✅ Admin login works
- ✅ Orders can be placed

---

© 2025 Epic Cafe · Pillai College of Engineering
