# 🍽️ Epic Cafe — Online Food Ordering System

> A full-stack web application for **Epic Cafe, Panvel** that streamlines food ordering for students and staff at Pillai College of Engineering. Built with **Next.js 14, React 18, MongoDB, and JWT authentication**.

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

> **Migrated from:** HTML5 · CSS3 · JavaScript · PHP · MySQL · Bootstrap · XAMPP

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
MONGODB_URI=mongodb://localhost:27017/epic-cafe
JWT_SECRET=your-secret-key-here
NODE_ENV=development

# 3. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Default Credentials

| Role  | Email                  | Password   |
|-------|------------------------|------------|
| Admin | admin@epiccafe.com     | admin123   |
| User  | student@college.edu    | student123 |

> Run `node mongodb-setup.js` once to seed these accounts (if not already done).

### Seed Menu Data

After logging in as admin, go to **Admin → 🍴 Menu → Seed Default Data** to populate all 22 default menu items.

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
