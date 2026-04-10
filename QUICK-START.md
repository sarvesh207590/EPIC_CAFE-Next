# ⚡ Quick Start Guide

## 🚀 Get Running in 5 Minutes

### Step 1: Install Dependencies (1 min)
```bash
npm install
```

### Step 2: Configure Environment (1 min)

Create `.env.local` file in the root directory:

```env
MONGODB_URI=mongodb+srv://sarveshdb_global:Sarsar%40098@sarveshcluster.zaf6xtu.mongodb.net/epic-cafe?retryWrites=true&w=majority
JWT_SECRET=your-secret-key-here-change-this-in-production
NODE_ENV=development
```

⚠️ **Important:** Notice the `%40` in the password - this is the URL-encoded version of `@`

### Step 3: Setup Admin User (1 min)
```bash
npm run setup-admin
```

You should see:
```
✅ Admin user created successfully!
📧 Email: admin@gmail.com
🔑 Password: admin123
```

### Step 4: Start Development Server (1 min)
```bash
npm run dev
```

### Step 5: Login as Admin (1 min)

1. Open browser: `http://localhost:3000/admin`
2. Login with:
   - **Email:** `admin@gmail.com`
   - **Password:** `admin123`
3. You're in! 🎉

---

## 📋 Quick Commands

```bash
# Start development server
npm run dev

# Setup/reset admin user
npm run setup-admin

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

---

## 🎯 What to Do Next

### 1. Seed Menu Data
- Login as admin
- Go to **Menu** tab
- Click **"Seed Default Data"**
- This loads 22 default menu items

### 2. Test User Flow
- Go to home page: `http://localhost:3000`
- Click **Sign Up** and create a user account
- Browse menu categories (Snacks, Beverages, Meals)
- Place a test order

### 3. Test Admin Dashboard
- View orders in Kanban board
- Move orders through stages (Pending → Confirmed → Preparing → Ready → Completed)
- Check order history
- Manage menu items

---

## 🔐 Default Credentials

### Admin
- **Email:** `admin@gmail.com`
- **Password:** `admin123`
- **URL:** `http://localhost:3000/admin`

⚠️ **Change password immediately after first login!**

---

## 🐛 Common Issues

### "ENOTFOUND" Error
**Problem:** MongoDB connection fails

**Solution:** Check that your `.env.local` has `%40` instead of `@` in the password:
```
✅ Correct: Sarsar%40098
❌ Wrong: Sarsar@098
```

### "Port 3000 already in use"
**Solution:**
```bash
# Kill the process
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port
PORT=3001 npm run dev
```

### Admin login fails
**Solution:**
```bash
# Reset admin user
npm run setup-admin

# Then try logging in again
```

### Environment variables not loading
**Solution:**
```bash
# Restart the dev server
# Press Ctrl+C to stop
npm run dev
```

---

## 📚 Documentation

- **Full README:** `README.md`
- **Deployment Guide:** `DEPLOYMENT.md`
- **Admin Credentials:** `ADMIN-CREDENTIALS.md`
- **Troubleshooting:** `TROUBLESHOOTING.md`

---

## 🎓 Project Structure

```
epic-cafe/
├── src/
│   ├── app/              # Next.js pages and API routes
│   │   ├── admin/        # Admin dashboard
│   │   ├── api/          # API endpoints
│   │   ├── login/        # Login page
│   │   ├── signup/       # Signup page
│   │   └── ...
│   ├── lib/              # Utilities (MongoDB connection)
│   ├── middleware/       # Auth middleware
│   └── models/           # Database models
├── public/
│   └── img/              # Menu item images
├── .env.local            # Environment variables (create this!)
└── package.json          # Dependencies
```

---

## ✅ Checklist

Before deploying to production:

- [ ] Admin user created (`npm run setup-admin`)
- [ ] Admin login works
- [ ] Admin password changed from default
- [ ] Menu data seeded
- [ ] User signup/login tested
- [ ] Order placement tested
- [ ] Payment flow tested
- [ ] Admin dashboard tested
- [ ] All images loading correctly
- [ ] Environment variables secured

---

## 🚀 Deploy to Vercel

When ready to deploy:

1. Push to GitHub:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables (see `DEPLOYMENT.md`)
5. Deploy!

---

## 💡 Tips

- Use **Ctrl+C** to stop the dev server
- Changes auto-reload in development
- Check terminal for error messages
- Use browser DevTools console for client errors
- MongoDB Atlas dashboard shows database activity

---

## 🆘 Need Help?

1. Check `TROUBLESHOOTING.md` for common issues
2. Review error messages in terminal
3. Check browser console for client errors
4. Contact team (see `README.md`)

---

**Happy Coding! 🍽️**

© 2025 Epic Cafe · Pillai College of Engineering
