import { useMemo, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { getAllBookings, isBookingActive } from '../hooks/useBooking'
import { fetchUserBookings } from '../services/bookingService'

export default function DashboardPage() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const [bookings, setBookings] = useState([])

  useEffect(() => {
    setBookings(getAllBookings())

    async function syncDb() {
      if (!user?.id) return
      const dbBookings = await fetchUserBookings(user.id)
      
      if (dbBookings && dbBookings.length > 0) {
        setBookings(dbBookings.map(db => ({
          id: db.id,
          stationId: db.station_id,
          stationName: db.station_name,
          charger: { connector_type: db.charger_type },
          duration: db.duration_minutes,
          vehicleName: db.vehicle_name,
          estimatedCost: db.estimated_cost,
          estimatedKwh: db.estimated_kwh,
          status: db.status,
          bookedAt: db.created_at,
          expiresAt: db.end_time
        })))
      }
    }
    syncDb()
  }, [user])

  // useMemo — derive stats from bookings without recalculating every render
  const stats = useMemo(() => {
    const active = bookings.filter(b => isBookingActive(b)).length
    const totalKwh = bookings.reduce((sum, b) => sum + (b.estimatedKwh || 0), 0)
    const totalSpent = bookings.reduce((sum, b) => sum + (b.estimatedCost || 0), 0)
    return {
      total: bookings.length,
      active,
      totalKwh: totalKwh.toFixed(1),
      totalSpent: totalSpent.toFixed(0),
    }
  }, [bookings])

  // Get display name from Supabase user metadata or email
  const displayName = user?.user_metadata?.full_name
    || user?.email?.split('@')[0]
    || 'Driver'

  const recentBookings = bookings.slice(0, 3)

  async function handleLogout() {
    await signOut()
    navigate('/')
  }

  const statCards = [
    { label: 'Total Bookings', value: stats.total, icon: '📋', color: '#3B82F6' },
    { label: 'Active Now', value: stats.active, icon: '⚡', color: '#10B981' },
    { label: 'kWh Charged', value: stats.totalKwh, icon: '🔋', color: '#F59E0B' },
    { label: 'Total Spent', value: `₹${stats.totalSpent}`, icon: '💳', color: '#8B5CF6' },
  ]

  const quickActions = [
    { label: 'Find Charger', icon: '🗺', desc: 'View live EV map', path: '/map', gradient: 'from-[#10B981] to-[#3B82F6]' },
    { label: 'My Bookings', icon: '📋', desc: 'Active & past slots', path: '/bookings', gradient: 'from-[#3B82F6] to-[#8B5CF6]' },
    { label: 'Profile', icon: '👤', desc: 'Account settings', path: '/profile', gradient: 'from-[#8B5CF6] to-[#EC4899]' },
  ]

  return (
    <div className="min-h-screen bg-[#0F172A]">
      {/* Navbar */}
      <nav className="h-14 flex items-center justify-between px-4 md:px-6 bg-[#0F172A]/90 backdrop-blur border-b border-[#1E293B] sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <span className="text-lg">⚡</span>
          <span className="font-bold text-white">ChargeFlow</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/profile')}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-[#10B981] to-[#3B82F6] flex items-center justify-center text-white text-sm font-bold"
          >
            {displayName[0].toUpperCase()}
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Welcome header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-[#3B82F6]">{displayName}</span>
          </h1>
          <p className="text-[#64748B] mt-1 text-sm">
            {stats.active > 0
              ? `You have ${stats.active} active booking${stats.active > 1 ? 's' : ''} right now`
              : 'No active bookings — find a charger near you'}
          </p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
          {statCards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-[#1E293B] rounded-2xl p-4 border border-[#334155]"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xl">{card.icon}</span>
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: card.color }}
                />
              </div>
              <p className="text-2xl font-bold text-white">{card.value}</p>
              <p className="text-[#64748B] text-xs mt-1">{card.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-sm font-medium text-[#94A3B8] uppercase tracking-wider mb-3">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={() => navigate(action.path)}
                className="flex items-center gap-4 p-4 rounded-2xl bg-[#1E293B] border border-[#334155] hover:border-[#475569] transition-all group text-left active:scale-[0.98]"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-110 transition-transform`}>
                  {action.icon}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{action.label}</p>
                  <p className="text-[#64748B] text-xs mt-0.5">{action.desc}</p>
                </div>
                <span className="ml-auto text-[#475569] group-hover:text-[#94A3B8] transition">→</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Recent Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-[#94A3B8] uppercase tracking-wider">
              Recent Bookings
            </h2>
            {bookings.length > 0 && (
              <button
                onClick={() => navigate('/bookings')}
                className="text-xs text-[#10B981] hover:underline"
              >
                View all
              </button>
            )}
          </div>

          {recentBookings.length === 0 ? (
            <div className="bg-[#1E293B] rounded-2xl border border-[#334155] p-8 text-center">
              <p className="text-3xl mb-3">⚡</p>
              <p className="text-white font-medium mb-1">No bookings yet</p>
              <p className="text-[#64748B] text-sm mb-4">Find a nearby EV charger and reserve your first slot</p>
              <button
                onClick={() => navigate('/map')}
                className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-[#10B981] to-[#3B82F6] text-white hover:opacity-90 transition"
              >
                Open Map
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {recentBookings.map(booking => {
                const active = isBookingActive(booking)
                return (
                  <div
                    key={booking.id}
                    className="bg-[#1E293B] rounded-2xl border border-[#334155] p-4 flex items-center gap-4"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${
                      active ? 'bg-[#065F46]/30' :
                      booking.status === 'cancelled' ? 'bg-[#7F1D1D]/30' :
                      'bg-[#1E293B]'
                    }`}>
                      {active ? '⚡' : booking.status === 'cancelled' ? '✕' : '✓'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{booking.stationName}</p>
                      <p className="text-[#64748B] text-xs">
                        {booking.charger?.connector_type} · {booking.duration} min
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-[#10B981] font-semibold text-sm">₹{booking.estimatedCost}</p>
                      <span className={`text-xs ${
                        active ? 'text-[#10B981]' :
                        booking.status === 'cancelled' ? 'text-[#EF4444]' :
                        'text-[#64748B]'
                      }`}>
                        {active ? 'Active' : booking.status === 'cancelled' ? 'Cancelled' : 'Done'}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
