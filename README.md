# 🍔 Swiggy MERN Stack Clone

A full-featured, responsive **Swiggy clone** built using the **MERN Stack (MongoDB, Express.js, React, Node.js)** + **Tailwind CSS** & **Lucide Icons**.

---

## ✨ Features

- **🏠 Home & Restaurant Discovery**:
  - "What's on your mind?" category carousel (Biryani, Pizza, North Indian, Burgers, Momos, Rolls, Cakes, etc.).
  - Instant search across restaurants, cuisines, and dishes.
  - Smart filters: Ratings 4.0+, Pure Veg, Fast Delivery, Active Offers, and Sort by Price/Rating.
  - Restaurant cards with authentic discount badges, rating pills, and delivery times.

- **🍽️ Restaurant & Menu Page**:
  - Restaurant banner with delivery time, ratings, and active promotional codes (`SWIGGY50`, `WELCOME100`).
  - Dish search and "Veg Only" toggle switch.
  - Categorized accordion menus (Recommended, Starters, Main Course, Desserts).
  - Swiggy item card with veg/non-veg indicator, bestseller tags, and quantity steppers.
  - Sticky bottom floating cart bar.

- **🛒 Smart Cart & Checkout**:
  - Single restaurant validation (modal prompt if adding dishes from multiple restaurants).
  - Delivery address selection and new address creation form.
  - Delivery instructions ("Avoid calling", "Leave at door", "Don't ring bell").
  - Promo coupon redemption with instant discount recalculation.
  - Full bill breakdown: Item total, Delivery fee, Platform fee, GST & Restaurant charges.
  - Payment options: Cash on Delivery or Instant Online Simulation.

- **📍 Live Simulated Order Tracking**:
  - 4-milestone visual stepper: `Order Placed` ➔ `Kitchen Preparing` ➔ `Rider On The Way` ➔ `Delivered`.
  - Delivery partner details with direct call button.
  - Live order simulation controls.

- **🛡️ Partner & Admin Dashboard**:
  - View all incoming customer orders in real-time.
  - Update status of any order (Preparing, On The Way, Delivered).
  - Add new restaurants and onboard new menu items.

---

## 🔑 Demo Credentials (1-Click Login Ready)

| Role | Email | Password |
|---|---|---|
| **Customer** | `user@swiggy.com` | `password123` |
| **Admin / Partner** | `admin@swiggy.com` | `password123` |

*(You can also use the 1-click Demo Login buttons inside the Sign In modal!)*

---

## 🚀 Quick Start

### 1. Start Backend Server:
```bash
cd server
npm run dev
```
*Backend runs on: `http://localhost:5000`*

### 2. Start Frontend App:
```bash
cd client
npm run dev
```
*Frontend runs on: `http://localhost:3000`*

---

## 🗄️ Database Setup (Optional)
The backend automatically connects to MongoDB if available via `MONGODB_URI` in `server/.env`.
If MongoDB is not installed locally, the server smoothly runs with its pre-seeded in-memory store so that the app works instantly without setup friction!
To connect your own MongoDB Atlas database, simply update `server/.env`:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/swiggy_db?retryWrites=true&w=majority
```

