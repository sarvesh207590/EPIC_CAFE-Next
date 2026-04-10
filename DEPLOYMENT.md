# 🚀 Epic Cafe - Deployment Guide

## Quick Setup

### 1. Setup Admin User

Before deploying, create the admin user in your MongoDB database:

```bash
npm run setup-admin
```

This will create an admin account with:
- **Email:** `admin@gmail.com`
- **Password:** `admin123`

⚠️ **Security:** Change this password immediately after first login!

---

## Local Development

### Environment Variables (.env.local)

```env
MONGODB_URI=mongodb+srv://sarveshdb_global:Sarsar%40098@sarveshcluster.zaf6xtu.mongodb.net/epic-cafe?retryWrites=true&w=majority
JWT_SECRET=your-secret-key-here-change-this-in-production
NODE_ENV=development
```

### Run Locally

```bash
npm install
npm run setup-admin
npm run dev
```

Visit: `http://localhost:3000`

---

## Vercel Deployment

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click **"Add New Project"**
4. Import your repository
5. Vercel will auto-detect Next.js settings

### Step 3: Configure Environment Variables

In Vercel project settings → Environment Variables, add:

| Variable | Value |
|----------|-------|
| `MONGODB_URI` | `mongodb+srv://sarveshdb_global:Sarsar%40098@sarveshcluster.zaf6xtu.mongodb.net/epic-cafe?retryWrites=true&w=majority` |
| `JWT_SECRET` | Generate a strong secret (see below) |
| `NODE_ENV` | `production` |

**Generate Strong JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 4: Configure MongoDB Atlas

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Navigate to **Network Access**
3. Click **"Add IP Address"**
4. Select **"Allow Access from Anywhere"** (0.0.0.0/0)
   - This allows Vercel's dynamic IPs to connect
5. Click **"Confirm"**

### Step 5: Setup Admin User (Production)

After deployment, you need to create the admin user in production:

**Option A: Run locally against production DB**
```bash
# Temporarily update .env.local with production MONGODB_URI
npm run setup-admin
```

**Option B: Use MongoDB Atlas UI**
1. Go to MongoDB Atlas → Browse Collections
2. Select `epic-cafe` database → `users` collection
3. Insert document:
```json
{
  "username": "admin",
  "email": "admin@gmail.com",
  "password": "$2a$10$YourHashedPasswordHere",
  "createdAt": { "$date": "2025-01-01T00:00:00.000Z" }
}
```

Note: For Option B, you'll need to hash the password using bcrypt first.

### Step 6: Deploy

Click **"Deploy"** in Vercel. Your app will be live at:
```
https://your-project-name.vercel.app
```

---

## Post-Deployment Checklist

- [ ] Admin login works (`admin@gmail.com` / `admin123`)
- [ ] Change admin password immediately
- [ ] Seed menu data (Admin → Menu → Seed Default Data)
- [ ] Test user registration and login
- [ ] Test order placement flow
- [ ] Test payment submission
- [ ] Verify admin dashboard shows orders
- [ ] Test order status updates
- [ ] Check image uploads work

---

## Troubleshooting

### Build Fails
- Check Vercel build logs
- Ensure all dependencies are in `package.json`
- Verify Next.js version compatibility

### Database Connection Fails
- Verify `MONGODB_URI` is correct in Vercel
- Check MongoDB Atlas Network Access allows 0.0.0.0/0
- Test connection string locally first

### Admin Login Fails
- Ensure admin user exists in database
- Run `npm run setup-admin` to create/update admin
- Check `JWT_SECRET` is set in Vercel

### Images Not Loading
- Ensure images are in `public/img/` directory
- Check image paths don't have leading `/public`
- Verify image upload API route works

---

## Security Recommendations

### Production Security

1. **Change Default Admin Password**
   - Login as admin immediately after deployment
   - Change password from default `admin123`

2. **Use Strong JWT Secret**
   - Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
   - Never commit to Git
   - Store only in Vercel environment variables

3. **MongoDB Security**
   - Use strong database password
   - Enable MongoDB Atlas IP whitelist (if not using Vercel)
   - Enable database audit logs

4. **Environment Variables**
   - Never commit `.env.local` to Git
   - Use different secrets for dev/staging/production
   - Rotate secrets periodically

---

## Automatic Deployments

Vercel automatically deploys:
- **Production:** Every push to `main` branch
- **Preview:** Every pull request gets a unique preview URL

To disable auto-deploy:
1. Go to Vercel project settings
2. Navigate to Git
3. Disable "Production Branch" auto-deploy

---

## Custom Domain (Optional)

1. Go to Vercel project → Settings → Domains
2. Add your custom domain (e.g., `epiccafe.com`)
3. Update DNS records as instructed by Vercel:
   - Add A record or CNAME record
   - Wait for DNS propagation (5-30 minutes)
4. Vercel automatically provisions SSL certificate

---

## Monitoring

### Vercel Analytics
- Enable in project settings → Analytics
- Track page views, performance, and errors

### MongoDB Atlas Monitoring
- View database metrics in Atlas dashboard
- Set up alerts for connection issues
- Monitor query performance

---

## Support

For issues or questions:
- Check Vercel deployment logs
- Review MongoDB Atlas logs
- Contact team members (see README.md)

---

© 2025 Epic Cafe · Pillai College of Engineering
