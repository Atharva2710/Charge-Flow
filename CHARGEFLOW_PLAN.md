# ⚡ ChargeFlow – Smart EV Charging Hub
### Complete Implementation Plan | React End-Term 2029

---

## 🎯 Problem Statement

India is undergoing a rapid EV revolution, but the charging infrastructure is fragmented and unreliable. EV owners face three critical problems:
1. **Blind discovery** — they can't see which nearby chargers are currently occupied.
2. **Compatibility anxiety** — they don't know if the charger supports their car's connector type and wattage.
3. **Zero control** — there is no way to reserve a slot while driving to the station.

**ChargeFlow** solves all three with a real-time, intelligent, community-driven EV charging platform.

---

## 👤 Who Is The User?

| Persona | Need |
| :--- | :--- |
| Urban EV commuter | Find the nearest available, compatible charger fast |
| Highway EV driver | Plan charging stops across a long route |
| EV station owner | Monitor station health and earn from verified listings |
| Delivery fleet manager | Track charging schedules for 10+ vehicles |

---

## 🏗️ Tech Stack

| Layer | Technology | Why |
|:---|:---|:---|
| Frontend | React + Vite | Fast build, HMR, clean setup |
| Styling | Tailwind CSS | Rapid, consistent, responsive |
| Maps | Mapbox GL JS | Industry-standard, free tier, smooth animations |
| Backend | Supabase | Auth + PostgreSQL + Realtime in one platform |
| State | Context API + useState/useReducer | Covers rubric requirements |
| Charts | Recharts | Charging history analytics |
| Routing | React Router v6 | Protected routes, nested pages |
| Animations | Framer Motion | Premium UI feel |
| Deployment | Vercel | One-click deploy from GitHub |

---

## 📁 Folder Structure

```
/src
  /assets
    logo.svg
    ev-icons/
  /components
    /ui              # Button, Badge, Spinner, Modal, Card
    /map             # MapView, StationMarker, RouteOverlay
    /station         # StationCard, StationDetail, SlotBooking
    /auth            # LoginForm, SignupForm, ProtectedRoute
    /dashboard       # StatsCard, ChargingHistory, VehicleProfile
  /context
    AuthContext.jsx        # User session management
    StationContext.jsx     # Real-time station data globally
    VehicleContext.jsx     # User's vehicle specs and preferences
  /hooks
    useAuth.js             # Login, logout, session
    useChargers.js         # Fetch + filter + sort chargers by location
    useRealtime.js         # Supabase Realtime subscription
    useGeolocation.js      # navigator.geolocation wrapper
    useBooking.js          # Slot hold / reservation logic
  /pages
    LandingPage.jsx
    AuthPage.jsx           # Login + Signup tabs
    DashboardPage.jsx      # Main app home
    MapPage.jsx            # Full-screen charger map
    StationDetailPage.jsx  # Individual station info + booking
    ProfilePage.jsx        # Vehicle profile, booking history
    AdminPage.jsx          # Station owner dashboard (protected)
  /services
    supabaseClient.js      # Supabase init
    stationsService.js     # All DB queries for stations
    bookingsService.js     # Slot reservation logic
    profileService.js      # User profile CRUD
  /utils
    distanceCalc.js        # Haversine formula for km calculation
    compatibilityCheck.js  # Match vehicle specs to station type
    formatters.js          # Price, kW, time formatters
  App.jsx
  main.jsx
  index.css
```

---

## 🗄️ Supabase Database Schema

### Table: `stations`
```sql
id          uuid PRIMARY KEY
name        text
latitude    float
longitude   float
city        text
address     text
total_slots int
owner_id    uuid (references auth.users)
is_verified boolean
created_at  timestamp
```

### Table: `slots`
```sql
id             uuid PRIMARY KEY
station_id     uuid (references stations)
connector_type text        -- CCS2, CHAdeMO, Type2, Bharat AC
max_kw         int         -- 7, 22, 50, 120, 150
status         text        -- available, charging, offline, reserved
current_user   uuid        -- who is using it right now
price_per_kwh  float
```

### Table: `bookings`
```sql
id          uuid PRIMARY KEY
user_id     uuid (references auth.users)
slot_id     uuid (references slots)
vehicle_id  uuid
booked_at   timestamp
held_until  timestamp     -- 15-min hold window
status      text          -- held, active, completed, cancelled
```

### Table: `vehicles`
```sql
id             uuid PRIMARY KEY
user_id        uuid
make           text        -- Tata, MG, Hyundai, Ola
model          text        -- Nexon EV, ZS EV, Kona
connector_type text        -- CCS2, Type2, etc.
max_kw         int         -- max charging rate car can accept
battery_kwh    float
license_plate  text
```

### Table: `reviews`
```sql
id          uuid PRIMARY KEY
station_id  uuid
user_id     uuid
rating      int           -- 1-5
comment     text
created_at  timestamp
```

---

## ⚛️ React Concepts Coverage (Rubric Mapped)

### Core (Compulsory)
- ✅ **Functional Components** — Every component is a function
- ✅ **Props & Composition** — `StationCard` accepts `station` props, `MapView` composes `StationMarker`
- ✅ **useState** — Slot filter state, booking form state, modal open/close
- ✅ **useEffect** — Fetch nearby stations on GPS update, subscribe to Realtime on mount
- ✅ **Conditional Rendering** — "Compatible Only" badge, "Slot Available" vs "Full" status banners
- ✅ **Lists & Keys** — Station list, booking history, slot grids

### Intermediate (Must Include)
- ✅ **Lifting State Up** — Filter state (city, connector, kW) lives in `MapPage` and flows down to both `FilterPanel` and `StationList`
- ✅ **Controlled Components** — Booking form, vehicle profile form, review submission
- ✅ **React Router v6** — `/`, `/map`, `/station/:id`, `/profile`, `/admin` routes
- ✅ **Context API** — `AuthContext` (who is logged in), `StationContext` (live station data), `VehicleContext` (my car's specs)

### Advanced (Highly Recommended)
- ✅ **useMemo** — Memoize the sorted + filtered + distance-ranked station list (expensive computation)
- ✅ **useCallback** — Stabilize map event handlers so Mapbox markers don't re-initialize on every render
- ✅ **useRef** — Hold the Mapbox map instance without triggering re-renders
- ✅ **React.lazy + Suspense** — Lazy load `MapPage` and `AdminPage` since they are large bundles
- ✅ **Performance** — Avoid re-renders with memoized selectors in Context

---

## 🔐 Authentication & Protected Routes

```jsx
// In App.jsx
<Route path="/dashboard" element={
  <ProtectedRoute>
    <DashboardPage />
  </ProtectedRoute>
} />
<Route path="/admin" element={
  <ProtectedRoute role="station_owner">
    <AdminPage />
  </ProtectedRoute>
} />
```

- Firebase-style Auth using Supabase Auth
- Persistent session via localStorage
- Role-based access (regular user vs. station owner)

---

## 🗺️ Core Feature 1: The Live Map

The centerpiece of ChargeFlow. Every station on the map is a "Live Pulse":

- 🟢 **Green pulse** = Slots available
- 🔴 **Red** = All slots occupied
- 🟡 **Yellow** = One slot left
- ⚫ **Grey** = Offline

**Smart Filtering Panel (left sidebar):**
- "Only Compatible With My Car" toggle
- Connector Type (CCS2, CHAdeMO, Type2, Bharat AC001)
- Min Power (7kW / 22kW / 50kW / 150kW DC Fast)
- Max Distance (2km / 5km / 10km)
- Price Range slider

---

## ⚡ Core Feature 2: Smart Compatibility Engine

When user signs up, they select their EV.

```js
// In compatibilityCheck.js
export function isCompatible(vehicle, slot) {
  return (
    vehicle.connector_type === slot.connector_type &&
    vehicle.max_kw >= slot.min_kw
  );
}
```

The map then auto-dims incompatible stations. This is the feature that makes ChargeFlow feel like a real product, not a generic map app.

---

## ⏱️ Core Feature 3: Slot Reservation (15-Min Hold)

```js
// In bookingsService.js
async function holdSlot(slotId, userId, vehicleId) {
  const heldUntil = new Date(Date.now() + 15 * 60 * 1000);
  // Insert booking with status: 'held'
  // Update slot status to 'reserved' via Supabase Realtime
  // Every connected client sees the pin go yellow instantly
}
```

A countdown timer in the UI shows "Your slot is held for 12:34." If the user doesn't arrive and the timer runs out, the slot auto-releases (handled by a Supabase Edge Function or a client-side `setTimeout`).

---

## 📊 Core Feature 4: My Dashboard

After login, the user lands on a personal dashboard:

- **My Active Session** — "Charging at 47 kW · 38 min remaining · ₹124 spent"
- **My Booking History** — Table with date, station, kWh charged, cost
- **My Vehicle(s)** — CRUD for vehicles
- **Savings Tracker** — "You've saved ₹12,400 vs petrol this year" (computed from charging history)
- **Nearby Favorites** — Saved stations for quick launch

---

## 🏢 Feature 5: Station Owner Admin Panel (Bonus)

If a user registers as a "Station Owner":
- List their stations
- See real-time occupancy of their own slots
- Update price per kWh
- View revenue and usage analytics
- Mark a slot "Offline" for maintenance

---

## 🎨 UI/UX Design System

```
Primary:     #10B981 (Emerald Green — Energy, EV)
Background:  #0F172A (Slate-900 — Dark mode)
Surface:     #1E293B (Slate-800)
Accent:      #3B82F6 (Blue — Trust, Technology)
Warning:     #F59E0B (Amber — "One slot left")
Danger:      #EF4444 (Red — No slots)
Text:        #F1F5F9

Font:        'Inter' — Clean, modern, readable
```

**Design Philosophy:** The app should feel like a cross between Google Maps and Tesla's in-car touchscreen. Dark, precise, alive.

---

## 📦 Required Features Checklist (Rubric)

- ✅ Authentication (Supabase Auth — Login, Signup, Logout)
- ✅ Dashboard (Personal charging summary)
- ✅ Core Features: Live Map, Compatibility Engine, Slot Reservation
- ✅ CRUD: Vehicles (add/edit/delete), Bookings (create/cancel), Reviews (create/delete)
- ✅ Persistent Storage: Supabase PostgreSQL + Supabase Auth session
- ✅ Routing: 6 routes with protected + role-based access
- ✅ State Management: 3 Contexts + local component state

---

## 📋 Build Phases

### Phase 1: Foundation (Day 1)
- [ ] Init Vite + React project
- [ ] Configure Tailwind CSS
- [ ] Setup Supabase project + tables
- [ ] Create `supabaseClient.js`
- [ ] Build `AuthContext` + Login/Signup page

### Phase 2: Core Map (Day 2–3)
- [ ] Integrate Mapbox GL JS
- [ ] Create `useGeolocation` hook
- [ ] Fetch stations from Supabase
- [ ] Plot colored markers on map
- [ ] Build `StationCard` component

### Phase 3: Smart Features (Day 4–5)
- [ ] Build `useChargers` hook (filter + sort + distance)
- [ ] Implement Compatibility Engine
- [ ] Build Filter Panel with controlled components
- [ ] Build slot reservation flow

### Phase 4: Real-time + Dashboard (Day 6–7)
- [ ] Connect Supabase Realtime for slot status
- [ ] Build personal dashboard with stats
- [ ] Add `useBooking` hook
- [ ] Add vehicle CRUD

### Phase 5: Polish (Day 8–9)
- [ ] Lazy load heavy pages (Map, Admin)
- [ ] Add loading states + error boundaries
- [ ] Mobile responsiveness pass
- [ ] Write README
- [ ] Deploy to Vercel

---

## 📄 README Template

```markdown
# ⚡ ChargeFlow — Smart EV Charging Hub

## Problem Statement
[Written from above]

## Features
- Real-time EV charger availability map
- Smart vehicle compatibility filtering
- 15-minute slot reservation
- Personal charging dashboard + savings tracker
- Station owner management panel

## Tech Stack
React, Vite, Tailwind CSS, Supabase, Mapbox GL JS

## Setup
1. Clone the repo
2. cp .env.example .env (add Supabase + Mapbox keys)
3. npm install
4. npm run dev
```

---

## 🏅 Why ChargeFlow Will Win

| Rubric Criteria | What We're Delivering |
|:---|:---|
| Problem Statement (15) | A crisp, real, urgent problem with 3 defined personas |
| React Fundamentals (20) | 6/6 core concepts demonstrated |
| Advanced React (15) | All 5 advanced concepts with genuine use cases |
| Backend Integration (15) | Auth + 5 tables + Realtime + CRUD |
| UI/UX (10) | Dark map interface, live pulsing markers, mobile-ready |
| Code Quality (10) | Clean folder structure, custom hooks, SOLID separation |
| Functionality (10) | 5 fully working features |
| Demo & Explanation (5) | You can explain every hook and why you used it |

**Target Score: 95–100 / 100**
