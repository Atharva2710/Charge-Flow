# ⚡ ChargeFlow - Smart EV Charging Hub

Welcome to ChargeFlow! This is a modern, responsive React application built for finding, filtering, and reserving Electric Vehicle charging slots in real-time.

## 🌟 Key Features
- **Authentication**: Secure login/signup powered by Supabase Auth.
- **Interactive Map**: High-performance, full-screen map built with Mapbox GL JS featuring live pulsing EV stations.
- **Smart Filtering**: Filter stations by connector type (CCS2, CHAdeMO, Type 2), power output (kW), and real-time availability.
- **Booking Engine**: A robust 3-step state machine allowing users to reserve slots, calculate live pricing, and track active sessions.
- **Dashboard & Profiles**: View active bookings, total energy consumed (kWh), total money spent, and vehicle histories.
- **Hybrid Data Approach**: Designed for demo resilience. Uses Supabase for data persistence but falls back gracefully to `localStorage` if the database is unreachable or offline.

## 🛠 Tech Stack
- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS v4, Framer Motion (glassmorphism UI)
- **Mapping**: Mapbox GL JS
- **Backend / Auth**: Supabase (PostgreSQL)
- **Deployment**: Configured for Vercel (SPA routing via `vercel.json`)

## 🚀 How to Run Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory and add your API keys:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_MAPBOX_TOKEN=your_mapbox_token
```

### 3. Run the Development Server
```bash
npm run dev
```

### 4. Database Setup (Optional but Recommended)
To fully utilize the Supabase database instead of the `localStorage` fallback:
1. Open your Supabase Dashboard.
2. Go to the **SQL Editor**.
3. Paste and run the contents of `database.sql` (found in the root of this repository).

## 🌐 Deployment to Vercel
This app is pre-configured for Vercel deployment. 
Simply push your repository to GitHub, link it on Vercel, and ensure you add the Environment Variables in the Vercel Dashboard before hitting "Deploy". 

---
*Built for the React End-Term Submission.*
