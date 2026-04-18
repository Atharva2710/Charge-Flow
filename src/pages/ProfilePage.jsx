// ProfilePage.jsx — Phase 4 will build the full vehicle CRUD
// This is a placeholder so routing works in Phase 1

import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const name = user?.user_metadata?.full_name || user?.email || 'Driver'

  return (
    <div className="min-h-screen bg-primary text-white flex flex-col items-center justify-center gap-6">
      <div className="text-6xl">🚗</div>
      <h1 className="text-2xl font-bold">Your Profile</h1>
      <p className="text-muted text-sm">Signed in as <span className="text-brand">{name}</span></p>
      <p className="text-muted text-sm">
        Vehicle management coming in Phase 4.
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
