# Restaurant Portfolio & Table Ordering System

A full-stack MERN application for table-wise ordering and real-time order management with optional WhatsApp notifications.

## Features

- **Customer**: Table selection → Browse menu (categories, search) → Cart → Place order (optional WhatsApp number)
- **Admin**: JWT login, menu CRUD with image upload (Cloudinary), table management, order list with status updates, analytics dashboard (orders, revenue, popular items)
- **Backend**: REST API, JWT auth, MongoDB/Mongoose, rate limiting, Helmet, file upload (Multer), WhatsApp via Twilio

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- (Optional) Cloudinary account for menu images
- (Optional) Twilio account for WhatsApp

## Setup

1. **Clone and install**

   ```bash
   cd "Restaurant Portfolio & Table Ordering System"
   npm run install:all
   ```

2. **Environment**

   Copy the project's `.env.example` to `server/.env` and set:

   - `MONGODB_URI` – MongoDB connection string
   - `JWT_SECRET` – Secret for JWT (use a strong value in production)
   - `CLIENT_URL` – Frontend URL (e.g. `http://localhost:3000`)
   - Optionally: Cloudinary (`CLOUDINARY_*`) and Twilio (`TWILIO_*`) for images and WhatsApp

3. **Seed database (admin + sample tables & menu)**

   ```bash
   cd server && node src/scripts/seed.js
   ```

   Default admin: **admin@restaurant.com** / **admin123**

4. **Run**

   - From project root:
     - `npm run server` – API on http://localhost:5000
     - `npm run client` – React app on http://localhost:3000
   - Or both: `npm run dev` (requires `concurrently` from root `npm install`)

## Project structure

```
├── client/                 # React (Vite) frontend
│   ├── src/
│   │   ├── api/            # Axios instance
│   │   ├── components/     # Layout, MenuCard, etc.
│   │   ├── context/       # Cart, Table
│   │   ├── pages/         # TableSelect, Menu, Cart, OrderConfirm
│   │   └── pages/admin/   # Admin layout, login, dashboard, menu, orders, tables
│   └── vite.config.js     # Proxy /api -> backend
├── server/                 # Express backend
│   └── src/
│       ├── config/        # DB connection
│       ├── controllers/
│       ├── middleware/    # auth, upload, errorHandler
│       ├── models/        # Admin, MenuItem, Order, Table
│       ├── routes/
│       ├── scripts/       # seed.js
│       └── utils/         # cloudinary, whatsapp
├── .env.example
└── README.md
```

## API overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/admin/login` | Admin login (returns JWT) |
| GET | `/api/menu` | List menu (query: category, search) |
| GET | `/api/tables` | List tables |
| POST | `/api/orders` | Create order (body: tableId, items, customerPhone?, notes?) |
| GET | `/api/orders/table/:tableId` | Orders for table |
| GET | `/api/admin/me` | Current admin (Bearer token) |
| GET/POST/PUT/DELETE | `/api/menu/*` | Menu CRUD (POST/PUT/DELETE require auth) |
| GET/POST/PUT/DELETE | `/api/tables/*` | Table CRUD (POST/PUT/DELETE require auth) |
| GET | `/api/orders/admin/all` | All orders (auth) |
| PATCH | `/api/orders/admin/:id/status` | Update order status (auth) |
| GET | `/api/orders/admin/analytics` | Analytics (auth, query: from, to) |

## Security & practices

- JWT for admin routes; token in `Authorization: Bearer <token>`
- Rate limiting on `/api`
- Helmet for secure headers
- CORS restricted to `CLIENT_URL`
- File upload: type and size validation (images only, 5MB)
- Passwords hashed with bcrypt

## License

MIT.
