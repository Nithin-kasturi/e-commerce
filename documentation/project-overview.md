# Project Overview — LuxeShop E-Commerce Platform

## About

LuxeShop is a full-stack e-commerce web application built with the MERN stack (MongoDB, Express, React, Node.js). It features a dark luxury aesthetic and covers the complete shopping lifecycle from browsing to checkout.

---

## Architecture

```
client/                     → React SPA (Vite)
  └── src/
      ├── components/       → Reusable UI components
      ├── pages/            → Route-level page components
      ├── context/          → Global state (Auth + Cart)
      └── services/         → Axios API wrappers

server/                     → REST API (Express)
  ├── models/               → Mongoose schemas
  ├── controllers/          → Route logic
  ├── routes/               → Express routers
  ├── middleware/           → Auth + error handling
  └── seed/                 → Sample data seeder

database/                   → Schema docs + sample data
```

---

## Key Features

### User-Facing
- 🏠 Landing page with hero section and featured products
- 🔍 Product search, category filtering, and sorting
- 📦 Product detail pages with image gallery and reviews
- 🛒 Persistent cart (saved to MongoDB per user)
- 💳 Multi-step checkout flow
- ✅ Order confirmation with status tracking
- ⭐ Product review and rating system

### Technical
- JWT-based authentication with protected routes
- Role-based access (user / admin)
- Responsive design for mobile, tablet, desktop
- Skeleton loaders for perceived performance
- Toast notifications for user feedback
- Dark luxury theme with CSS custom properties

### Admin
- Product CRUD via API
- Order management via API
- User management via API

---

## Design Philosophy

The UI follows a **dark luxury** aesthetic:
- Color palette: Near-black backgrounds, warm gold accent (#c8a96e)
- Typography: Fraunces (serif display) + DM Sans (body)
- Animations: Subtle hover transforms, smooth transitions
- Mobile-first responsive with CSS grid and flexbox
