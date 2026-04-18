// MapPage.jsx — Phase 2 will build the full Mapbox integration
// This is a placeholder so routing works in Phase 1

import { useNavigate } from 'react-router-dom'

export default function MapPage() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-primary text-white flex flex-col items-center justify-center gap-6">
      <div className="text-6xl">🗺️</div>
      <h1 className="text-2xl font-bold">Live Charger Map</h1>
      <p className="text-muted text-sm">
        Coming in Phase 2 — Mapbox integration with real-time slot status.
      </p>
      <button
        onClick={() => navigate('/dashboard')}
        className="px-5 py-2.5 rounded-xl gradient-brand text-white text-sm font-medium hover:opacity-90 transition"
      >
        ← Back to Dashboard
      </button>
    </div>
  )
}
