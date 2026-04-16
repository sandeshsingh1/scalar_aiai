# Flipkart Clone Fullstack Assignment

A Flipkart-inspired e-commerce application built for the Scaler SDE Intern fullstack assignment. It covers the required flows for product browsing, product detail, cart management, checkout, order placement, and order confirmation, and also includes the requested bonus features: responsive design, login/signup, wishlist, order history, and email notification support.

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database design: PostgreSQL schema included in [server/sql/schema.sql](server/sql/schema.sql)
- Demo runtime: In-memory data store so the app works immediately without extra local setup
- Email: Nodemailer with SMTP support or JSON preview fallback

## Features Completed

- Product listing page with Flipkart-style cards
- Search by name or brand
- Category filtering
- Product detail page with image carousel
- Price, stock, specification, and description sections
- Add to cart and buy now flow
- Cart quantity update, remove item, and price summary
- Checkout form with shipping details
- Order placement and order confirmation page with order ID
- Responsive layout for mobile, tablet, and desktop
- Login and signup flow
- Wishlist functionality
- Order history page
- Email notification trigger on order placement

## Project Structure

```text
client/   React frontend
server/   Express API, seed script, schema, sample data
```

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Copy env files if you want custom config:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

3. Start both apps:

```bash
npm run dev
```

4. Open:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000`

## Deployment

### Backend on Render

Use the included [render.yaml](render.yaml) or create a Web Service manually.

- Root directory: project root
- Build command: `npm install`
- Start command: `npm run start --workspace server`

Set these environment variables in Render:

- `CLIENT_URL=https://your-vercel-app.vercel.app`
- `JWT_SECRET=your-secret-value`
- `MAIL_FROM=orders@yourdomain.com` or keep the default
- Optional SMTP settings if you want real emails
- Optional `DATABASE_URL` if you later connect a hosted PostgreSQL database

After deploy, your backend URL will look like:

- `https://your-render-service.onrender.com`

### Frontend on Vercel

Import the same GitHub repo into Vercel and configure:

- Framework preset: `Vite`
- Root directory: `client`
- Build command: `npm run build`
- Output directory: `dist`

Set this environment variable in Vercel:

- `VITE_API_BASE=https://your-render-service.onrender.com`

The included [vercel.json](vercel.json) keeps client-side routing working on refresh.

### Important Cross-Origin Setting

Once Vercel gives you the final frontend URL, update Render:

- `CLIENT_URL=https://your-vercel-app.vercel.app`

If you use multiple frontend URLs, you can separate them with commas:

- `CLIENT_URL=https://your-vercel-app.vercel.app,http://localhost:5173`

## Demo Login

- Email: `demo@flipkartclone.dev`
- Password: `password123`

## PostgreSQL Setup

The app runs out of the box with an in-memory demo store, but a PostgreSQL schema and seed script are included because the assignment explicitly asks for database design.

1. Set `DATABASE_URL` in `server/.env`
2. Run:

```bash
npm run seed
```

This creates the tables defined in [server/sql/schema.sql](server/sql/schema.sql) and seeds sample categories, products, images, and the demo user.

## Email Notification

To send real emails, configure these values in `server/.env`:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `MAIL_FROM`

Without SMTP config, Nodemailer falls back to a JSON transport so the order notification flow still executes during demo/testing.

## Assumptions

- A default demo user is available even without login because the PDF notes that login is not required for the main flow.
- Bonus authentication is included without blocking the main e-commerce flow.
- Sample data is seeded from local fixtures to keep the assignment self-contained.
- The in-memory runtime path is used for local demo speed, while PostgreSQL schema design is provided for evaluation.
- If deployed without a real database, demo data is not persistent across server restarts because the current runtime store is in memory.
