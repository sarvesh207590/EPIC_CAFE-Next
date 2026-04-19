# 🍽️ Epic Cafe — Online Food Ordering System

> A full-stack web application for **Epic Cafe, Panvel** that streamlines food ordering for students and staff at Pillai College of Engineering. Built with **Next.js 14, React 18, MongoDB, and JWT authentication**.

## 🌐 Live Demo

**🚀 [https://epic-canteen.vercel.app/](https://epic-canteen.vercel.app/)**


---

## 📌 Abstract

Epic Cafe's online ordering system allows users to browse the menu, place orders, and track real-time status updates. The platform eliminates manual processes by offering faster order placement, accurate order summaries, UPI-based payments, and an efficient admin dashboard for cafe staff.

---

## 🎯 Aim

To provide a modern digital solution that boosts **customer convenience** and **cafe operational efficiency** by enabling:

- Online food ordering with UPI payment
- Real-time order status tracking (Pending → Confirmed → Preparing → Ready → Completed)
- Dynamic menu management by admin
- Secure authentication for users and admin

---

## 🛠️ Tech Stack

| Technology     | Purpose                              |
|----------------|--------------------------------------|
| Next.js 14     | Full-stack React framework           |
| React 18       | Frontend UI                          |
| MongoDB        | NoSQL database                       |
| Mongoose       | MongoDB ODM                          |
| JWT + bcryptjs | Authentication & password hashing    |
| CSS Modules    | Component-scoped styling             |
| Node.js        | Runtime environment                  |

---

## ⚙️ Core Features

### 👤 User
- Sign up / Login with JWT session
- Browse menu by category (Snacks, Beverages, Meals)
- Place orders with quantity and customer details
- Pay via UPI QR code and submit Transaction ID (UTR)
- Download/print receipt after payment
- Track order status in real-time via **My Orders**

### 🔐 Admin
- Separate admin login (protected route)
- **Kanban board** — manage live orders across 4 stages (Pending / Confirmed / Preparing / Ready)
- One-click status advancement per order
- Transaction ID (UTR) visible on each order card for payment verification
- Order history table for completed/cancelled orders
- **Menu Manager** — add, edit, hide/show, or delete menu items per category
- Image upload for menu items (saved to `public/img/`)
- Seed default menu data with one click
- Auto-refresh every 30 seconds, optimistic UI updates

---

## 🗂️ Project Structure

```
src/
├── app/
│   ├── page.js              # Home / Dashboard
│   ├── login/               # User + Admin login
│   ├── signup/              # User registration
│   ├── snacks/              # Snacks menu (dynamic)
│   ├── beverages/           # Beverages menu (dynamic)
│   ├── meal/                # Meals menu (dynamic)
│   ├── order/               # Order form
│   ├── payment/             # UPI payment + UTR entry
│   ├── receipt/             # Order receipt
│   ├── my-orders/           # Order tracking by contact number
│   ├── contact/             # Contact page + team
│   ├── admin/               # Admin dashboard (kanban + menu manager)
│   └── api/                 # Next.js API routes
│       ├── auth/            # login, signup, me, logout
│       ├── admin/           # admin auth, orders, estimate
│       ├── orders/          # place & fetch orders
│       ├── transactions/    # record & fetch payments
│       ├── menu/            # CRUD menu items + seed
│       ├── upload/          # image upload
│       ├── contact/         # contact form
│       └── user/orders/     # order tracking by contact
├── lib/
│   └── mongodb.js           # DB connection
├── middleware/
│   └── auth.js              # JWT helpers
└── models/
    ├── User.js
    ├── Order.js
    ├── Transaction.js
    ├── MenuItem.js
    └── Contact.js
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB 6+ (local or Atlas)

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Create environment file
# .env.local
MONGODB_URI=mongodb+srv://sarveshdb_global:Sarsar%40098@sarveshcluster.zaf6xtu.mongodb.net/epic-cafe?retryWrites=true&w=majority
JWT_SECRET=your-secret-key-here
NODE_ENV=development

# 3. Setup admin user
npm run setup-admin

# 4. Run development server
npm run dev
```

### Admin Credentials

After running `npm run setup-admin`, use these credentials to login:

- **Email:** `admin@gmail.com`
- **Password:** `admin123`


---

## 📈 Future Scope

- 📱 Dedicated mobile app (React Native)
- 🎁 Loyalty rewards and discount system
- 🔐 Campus SSO / payment gateway integration
- 📣 Real-time push notifications for order status
- 🤖 AI-based menu suggestions based on order history
- 🌱 Eco-friendly packaging tracking
- 🚚 Delivery and event catering services

---

## 👥 Team

| Name              | Contact    |
|-------------------|------------|
| Sarvesh Mokal     | 9370061529 |
| Yash Patil        | 9096221703 |
| Harsh Peke        | 9665476943 |
| Prathamesh Nahar  | 7420974888 |

**Institution:** Pillai College of Engineering, Sector-16, New Panvel — 410206

---

© 2025 Epic Cafe · Pillai College of Engineering · All rights reserved


---

## 🌐 Deployment on Vercel

### Step 1: Prepare Your Repository
1. Make sure all changes are committed to Git
2. Push your code to GitHub/GitLab/Bitbucket

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with your GitHub account
2. Click **"Add New Project"**
3. Import your repository
4. Configure your project:
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `./` (leave as default)
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `.next` (auto-detected)

### Step 3: Add Environment Variables

In the Vercel project settings, add these environment variables:

```
MONGODB_URI=mongodb+srv://sarveshdb_global:Sarsar%40098@sarveshcluster.zaf6xtu.mongodb.net/epic-cafe?retryWrites=true&w=majority
JWT_SECRET=your-strong-random-secret-key-here
NODE_ENV=production
```

**Important:** Generate a strong JWT secret for production. You can use:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait for the build to complete (2-3 minutes)
3. Your app will be live at `https://your-project-name.vercel.app`

### Step 5: Configure Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Navigate to **Domains**
3. Add your custom domain and follow DNS configuration instructions

### MongoDB Atlas Network Access

Make sure to allow Vercel's IP addresses in MongoDB Atlas:

1. Go to MongoDB Atlas → Network Access
2. Click **"Add IP Address"**
3. Select **"Allow Access from Anywhere"** (0.0.0.0/0) for Vercel deployments
   - Or add specific Vercel IP ranges if you prefer tighter security

### Troubleshooting

- **Build fails:** Check the build logs in Vercel dashboard
- **Database connection fails:** Verify MONGODB_URI is correct and MongoDB Atlas allows connections
- **Authentication issues:** Ensure JWT_SECRET is set in Vercel environment variables
- **Images not loading:** Make sure images are in `public/img/` directory

### Automatic Deployments

Vercel automatically deploys:
- **Production:** Every push to `main` branch
- **Preview:** Every pull request gets a unique preview URL

---

## 🔧 Local Development with MongoDB Atlas

To test with MongoDB Atlas locally:

1. Update `.env.local`:
```
MONGODB_URI=mongodb+srv://sarveshdb_global:Sarsar%40098@sarveshcluster.zaf6xtu.mongodb.net/epic-cafe?retryWrites=true&w=majority
```

2. Restart your development server:
```bash
npm run dev
```

3. Your local app will now connect to MongoDB Atlas instead of local MongoDB
