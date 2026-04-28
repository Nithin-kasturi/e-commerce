# Installation Guide — LuxeShop E-Commerce

## Prerequisites

- Node.js v18+
- MongoDB (local) or MongoDB Atlas (cloud)
- npm or yarn

---

## 1. Clone & Setup

```bash
git clone <your-repo-url>
cd ecommerce
```

---

## 2. Backend Setup

```bash
cd server
npm install
```

### Configure Environment

Edit `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=30d
STRIPE_SECRET_KEY=sk_test_your_stripe_key
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Seed Products

```bash
npm run seed
```

### Start Backend

```bash
npm run dev       # Development (nodemon)
npm start         # Production
```

Backend runs at: **http://localhost:5000**

---

## 3. Frontend Setup

```bash
cd ../client
npm install
npm run dev
```

Frontend runs at: **http://localhost:5173**

---

## 4. API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/profile | Get profile (protected) |
| PUT | /api/auth/profile | Update profile (protected) |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/products | Get all products |
| GET | /api/products/:id | Get product by ID |
| GET | /api/products/categories | Get categories |
| POST | /api/products | Create product (admin) |
| PUT | /api/products/:id | Update product (admin) |
| DELETE | /api/products/:id | Delete product (admin) |
| POST | /api/products/:id/reviews | Add review (protected) |

### Cart
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/cart | Get user cart (protected) |
| POST | /api/cart | Add item to cart (protected) |
| PUT | /api/cart/:itemId | Update item qty (protected) |
| DELETE | /api/cart/:itemId | Remove item (protected) |
| DELETE | /api/cart | Clear cart (protected) |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/orders | Create order (protected) |
| GET | /api/orders/myorders | Get my orders (protected) |
| GET | /api/orders/:id | Get order by ID (protected) |
| PUT | /api/orders/:id/pay | Mark as paid (protected) |
| GET | /api/orders | Get all orders (admin) |

---

## 5. Build for Production

```bash
# Frontend
cd client
npm run build    # Creates dist/ folder

# Backend
cd server
npm start
```

---

## 6. Deployment

### Frontend → Vercel / Netlify
- Build command: `npm run build`
- Output directory: `dist`
- Set environment variable: `VITE_API_URL=https://your-backend.com`

### Backend → Railway / Render / Heroku
- Set all environment variables from `.env`
- Start command: `npm start`
- Set `MONGO_URI` to MongoDB Atlas connection string

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router v6 |
| State | Context API |
| Backend | Node.js, Express 4 |
| Database | MongoDB, Mongoose 8 |
| Auth | JWT + bcryptjs |
| Payments | Stripe |
| Notifications | react-hot-toast |
| Styling | CSS Custom Properties, Google Fonts |
