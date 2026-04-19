import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { getAllBookings } from '../hooks/useBooking'

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()

  const displayName = user?.user_metadata?.full_name
    || user?.email?.split('@')[0]
    || 'Driver'

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    : 'Recently'

  // Stats from booking history
  const bookings = getAllBookings()
  const profileStats = useMemo(() => ({
    total: bookings.length,
    totalKwh: bookings.reduce((s, b) => s + (b.estimatedKwh || 0), 0).toFixed(1),
    totalSpent: bookings.reduce((s, b) => s + (b.estimatedCost || 0), 0).toFixed(0),
    uniqueStations: new Set(bookings.map(b => b.stationId)).size,
  }), [bookings])

  // Unique vehicles from booking history
  const vehicles = [...new Set(bookings.map(b => b.vehicleName).filter(Boolean))]

  async function handleLogout() {
    await signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-[#0F172A]">
      {/* Navbar */}
      <nav className="h-14 flex items-center justify-between px-4 md:px-6 bg-[#0F172A]/90 backdrop-blur border-b border-[#1E293B] sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="text-[#94A3B8] hover:text-white transition text-sm">
            ←
          </button>
          <span className="font-bold text-white">Profile</span>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 md:px-6 py-6">

        {/* Avatar + name card */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1E293B] rounded-2xl border border-[#334155] p-6 mb-4 flex items-center gap-5"
        >
          {/* Avatar circle */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#10B981] to-[#3B82F6] flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
            {displayName[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-white truncate">{displayName}</h1>
            <p className="text-[#64748B] text-sm truncate">{user?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-[#10B981] bg-[#065F46]/30 px-2 py-0.5 rounded-full">
                Verified Account
              </span>
              <span className="text-xs text-[#64748B]">Since {memberSince}</span>
            </div>
          </div>
        </motion.div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          {[
            { label: 'Bookings', value: profileStats.total },
            { label: 'kWh', value: profileStats.totalKwh },
            { label: 'Spent', value: `₹${profileStats.totalSpent}` },
            { label: 'Stations', value: profileStats.uniqueStations },
          ].map(stat => (
            <div key={stat.label} className="bg-[#1E293B] rounded-xl border border-[#334155] p-3 text-center">
              <p className="text-white font-bold text-lg">{stat.value}</p>
              <p className="text-[#64748B] text-xs">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Account Details */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#1E293B] rounded-2xl border border-[#334155] mb-4 overflow-hidden"
        >
          <div className="px-5 py-3 border-b border-[#334155]">
            <p className="text-xs font-medium text-[#94A3B8] uppercase tracking-wider">Account Details</p>
          </div>
          {[
            { label: 'Email', value: user?.email, icon: '📧' },
            { label: 'User ID', value: user?.id?.slice(0, 16) + '...', icon: '🔑' },
            { label: 'Provider', value: 'Email / Password', icon: '🔒' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-3 px-5 py-3.5 border-b border-[#334155] last:border-0">
              <span className="text-base flex-shrink-0">{item.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[#64748B] text-xs">{item.label}</p>
                <p className="text-white text-sm truncate">{item.value}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* My Vehicles */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#1E293B] rounded-2xl border border-[#334155] mb-4 overflow-hidden"
        >
          <div className="px-5 py-3 border-b border-[#334155]">
            <p className="text-xs font-medium text-[#94A3B8] uppercase tracking-wider">My Vehicles</p>
          </div>
          {vehicles.length === 0 ? (
            <div className="px-5 py-5 text-center">
              <p className="text-[#64748B] text-sm">No vehicles yet</p>
              <p className="text-[#475569] text-xs mt-1">They'll appear here after your first booking</p>
            </div>
          ) : (
            vehicles.map(v => (
              <div key={v} className="flex items-center gap-3 px-5 py-3.5 border-b border-[#334155] last:border-0">
                <span className="text-base">🚗</span>
                <p className="text-white text-sm">{v}</p>
              </div>
            ))
          )}
        </motion.div>

        {/* Navigation shortcuts */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-[#1E293B] rounded-2xl border border-[#334155] mb-4 overflow-hidden"
        >
          {[
            { label: 'Find a Charger', icon: '🗺', path: '/map' },
            { label: 'My Bookings', icon: '📋', path: '/bookings' },
            { label: 'Dashboard', icon: '📊', path: '/dashboard' },
          ].map(item => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className="w-full flex items-center gap-3 px-5 py-3.5 border-b border-[#334155] last:border-0 hover:bg-[#334155]/30 transition text-left"
            >
              <span className="text-base">{item.icon}</span>
              <span className="text-white text-sm flex-1">{item.label}</span>
              <span className="text-[#475569]">→</span>
            </button>
          ))}
        </motion.div>

        {/* Logout */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          onClick={handleLogout}
          className="w-full py-3.5 rounded-2xl font-semibold text-sm border border-[#EF4444]/30 text-[#EF4444] hover:bg-[#EF4444]/10 transition active:scale-[0.98]"
        >
          Sign Out
        </motion.button>

        <p className="text-center text-[#334155] text-xs mt-4">ChargeFlow v1.0 · Built with React + Supabase</p>
      </div>
    </div>
  )
}
