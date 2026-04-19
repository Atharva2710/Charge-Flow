import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { getAllBookings, cancelBooking, isBookingActive } from '../hooks/useBooking'
import { fetchUserBookings } from '../services/bookingService'
import { useAuth } from '../context/AuthContext'

export default function BookingsPage() {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [activeTab, setActiveTab] = useState('active') // 'active' | 'history'
  const [cancellingId, setCancellingId] = useState(null)
  const [, setTick] = useState(0) // Used to force a re-render every second
  const { user } = useAuth()

  // Live countdown ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Load bookings (hybrid approach: Local instantly -> DB optionally)
  useEffect(() => {
    // 1. Instant load from local
    setBookings(getAllBookings())

    // 2. Background sync from Supabase
    async function syncDb() {
      if (!user?.id) return
      const dbBookings = await fetchUserBookings(user.id)
      
      if (dbBookings && dbBookings.length > 0) {
        // Map DB snake_case columns back to our React camelCase state
        const mapped = dbBookings.map(db => ({
          id: db.id,
          stationId: db.station_id,
          stationName: db.station_name,
          stationAddress: 'Location hidden', // Not stored in our simple DB schema
          charger: { connector_type: db.charger_type, max_kw: '?' },
          duration: db.duration_minutes,
          vehicleName: db.vehicle_name,
          estimatedCost: db.estimated_cost,
          estimatedKwh: db.estimated_kwh,
          status: db.status,
          bookedAt: db.created_at,
          expiresAt: db.end_time
        }))

        // Optional: Replace local state if DB is successful
        // Note: For this demo, we merge or let DB override if it has data
        setBookings(mapped)
      }
    }
    
    syncDb()
  }, [user])

  const activeBookings = bookings.filter(b => isBookingActive(b))
  const historyBookings = bookings.filter(b => !isBookingActive(b))

  const handleCancel = useCallback((bookingId) => {
    setCancellingId(bookingId)
    setTimeout(() => {
      const updated = cancelBooking(bookingId)
      setBookings(updated)
      setCancellingId(null)
    }, 800)
  }, [])

  function timeRemaining(expiresAt) {
    const diff = new Date(expiresAt) - new Date()
    if (diff <= 0) return 'Expired'
    const mins = Math.floor(diff / 60000)
    const secs = Math.floor((diff % 60000) / 1000)
    return `${mins}m ${secs}s remaining`
  }

  function formatDate(isoString) {
    return new Date(isoString).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  }

  const displayedBookings = activeTab === 'active' ? activeBookings : historyBookings

  return (
    <div className="min-h-screen bg-[#0F172A]">
      {/* Navbar */}
      <nav className="h-14 flex items-center justify-between px-4 md:px-6 bg-[#0F172A]/90 backdrop-blur border-b border-[#1E293B] sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/map')} className="text-[#94A3B8] hover:text-white transition text-sm">
            ←
          </button>
          <div className="flex items-center gap-2">
            <span className="text-lg">⚡</span>
            <span className="font-bold text-white">My Bookings</span>
          </div>
        </div>
        <button
          onClick={() => navigate('/map')}
          className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#10B981] to-[#3B82F6] text-white text-xs font-semibold hover:opacity-90 transition"
        >
          + New Booking
        </button>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Tab switcher */}
        <div className="flex bg-[#1E293B] rounded-xl p-1 mb-6">
          {[
            { key: 'active', label: `Active (${activeBookings.length})` },
            { key: 'history', label: `History (${historyBookings.length})` },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-gradient-to-r from-[#10B981] to-[#3B82F6] text-white shadow'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Bookings list */}
        <AnimatePresence mode="wait">
          {displayedBookings.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="text-5xl mb-4">{activeTab === 'active' ? '⚡' : '📋'}</div>
              <h3 className="text-white font-semibold text-lg mb-2">
                {activeTab === 'active' ? 'No Active Bookings' : 'No History Yet'}
              </h3>
              <p className="text-[#64748B] text-sm mb-6">
                {activeTab === 'active'
                  ? 'Find a charger and reserve your slot from the map'
                  : 'Your completed and cancelled bookings will appear here'}
              </p>
              {activeTab === 'active' && (
                <button
                  onClick={() => navigate('/map')}
                  className="px-6 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-[#10B981] to-[#3B82F6] text-white hover:opacity-90 transition"
                >
                  Find Charger on Map
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col gap-4"
            >
              {displayedBookings.map(booking => {
                const active = isBookingActive(booking)
                const cancelling = cancellingId === booking.id

                return (
                  <motion.div
                    key={booking.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`bg-[#1E293B] rounded-2xl border overflow-hidden ${
                      active ? 'border-[#10B981]/40' : 'border-[#334155]'
                    }`}
                  >
                    {/* Status bar */}
                    <div className={`h-1 w-full ${
                      booking.status === 'cancelled' ? 'bg-[#EF4444]' :
                      active ? 'bg-gradient-to-r from-[#10B981] to-[#3B82F6]' :
                      'bg-[#64748B]'
                    }`} />

                    <div className="p-5">
                      {/* Top row */}
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                              booking.status === 'cancelled' ? 'bg-[#7F1D1D] text-[#FCA5A5]' :
                              active ? 'bg-[#065F46] text-[#10B981]' :
                              'bg-[#1E293B] text-[#64748B] border border-[#334155]'
                            }`}>
                              {booking.status === 'cancelled' ? 'Cancelled' : active ? 'Active' : 'Completed'}
                            </span>
                            <span className="text-[#64748B] text-xs">{booking.id}</span>
                          </div>
                          <h3 className="font-semibold text-white">{booking.stationName}</h3>
                          <p className="text-[#64748B] text-xs">{booking.stationAddress}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[#10B981] font-bold text-lg">₹{booking.estimatedCost}</p>
                          <p className="text-[#64748B] text-xs">{booking.estimatedKwh} kWh</p>
                        </div>
                      </div>

                      {/* Details grid */}
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        {[
                          { label: 'Charger', value: booking.charger?.connector_type },
                          { label: 'Power', value: `${booking.charger?.max_kw} kW` },
                          { label: 'Duration', value: `${booking.duration} min` },
                        ].map(({ label, value }) => (
                          <div key={label} className="bg-[#0F172A] rounded-xl p-2.5 text-center">
                            <p className="text-[#64748B] text-xs">{label}</p>
                            <p className="text-white text-sm font-medium mt-0.5">{value}</p>
                          </div>
                        ))}
                      </div>

                      {/* Vehicle + time */}
                      <div className="flex items-center justify-between text-xs mb-4">
                        <span className="text-[#94A3B8]">
                          Vehicle: <span className="text-white">{booking.vehicleName}</span>
                        </span>
                        {active ? (
                          <span className="text-[#F59E0B] font-medium animate-pulse">
                            {timeRemaining(booking.expiresAt)}
                          </span>
                        ) : (
                          <span className="text-[#64748B]">{formatDate(booking.bookedAt)}</span>
                        )}
                      </div>

                      {/* Cancel button */}
                      {active && (
                        <button
                          onClick={() => handleCancel(booking.id)}
                          disabled={cancelling}
                          className="w-full py-2.5 rounded-xl text-sm font-medium border border-[#EF4444]/40 text-[#EF4444] hover:bg-[#EF4444]/10 transition disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {cancelling && (
                            <span className="w-3.5 h-3.5 border-2 border-[#EF4444] border-t-transparent rounded-full animate-spin" />
                          )}
                          {cancelling ? 'Cancelling...' : 'Cancel Booking'}
                        </button>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
