# ⚡ ChargeFlow - Smart EV Charging Hub (v2)

Welcome to **ChargeFlow v2**! This is an elite, full-stack React application designed to solve EV station anxiety in India. It combines a highly responsive framer-motion UI with live Mapbox mapping, a real-time bookings engine, and a connected Supabase backend.

## 🌟 V2 Advanced Features

- **High-Speed Trip Planner**: Integrates the `Mapbox Geocoding API` and `Directions API`. Type your Origin and Destination (e.g., "Mumbai" to "Pune") and dynamically trace a glowing purple highway on the map, auto-framing the camera to reveal all charging stations along your route.
- **My Garage Database**: A secure `vehicles` table via Supabase RLS. Register your EVs (Make, Model, kW, Connector) in your profile. When you book a station, the system automatically fetches your virtual garage data to prepopulate your booking!
- **Crowdsourced Peer Reviews**: A community-driven rating system (`reviews` table). Leave a 1-5 star review after finishing a charge. The system actively mathematically aggregates ratings on the Mapbox UI so high-quality stations stand out immediately.
- **Smart Directions**: Click the "🗺️" button on any station to instantly path-find from your live GPS location to the charger with a visually stunning fly-to animation.

## 🌟 Core Features (v1)
- **Supabase Authentication**: Secure login/signup and session management.
- **Live Filtering Engine**: Sort the map by Connector Type (CCS2, Type 2, etc.), fast-charging kW limits, and real-time station availability.
- **Virtual Dashboard**: Track total energy consumed (kWh), total money spent (₹), and your historical session statuses.

## 🛠 Tech Stack
- **Frontend**: React 18, Vite, React Router DOM
- **Styling**: Tailwind CSS v4, Framer Motion (Glassmorphism & Micro-animations)
- **Mapping & Geo**: Mapbox GL JS, Mapbox Directions API, Mapbox Geocoding API (`@mapbox`)
- **Backend / Auth**: Supabase (PostgreSQL Auth & Database with Row-Level Security)
- **Deployment**: Vercel (SPA auto-routing configured via `vercel.json`)

## 🚀 How to Run Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory and add your secret API keys:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_MAPBOX_TOKEN=your_mapbox_token
```

### 3. Run the Development Server
```bash
npm run dev
```

### 4. Database Setup (Supabase)
To fully utilize the "My Garage", "Bookings", and "Peer Reviews" features:
1. Open your Supabase Dashboard and go to the **SQL Editor**.
2. Run the `database.sql` script (sets up Users and generic relations).
3. Run the `database_v2.sql` script (upgrades the database with `vehicles` and `reviews` tables + RLS policies).

## 🌐 Deployment
This app is structurally prepared for Vercel. Push your repository to GitHub, link it on Vercel, inject your `.env` variables into the Vercel Dashboard, and deploy!

---
*Built for end-term evaluation.*
