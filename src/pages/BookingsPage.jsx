import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { getAllBookings, cancelBooking, isBookingActive } from '../hooks/useBooking'
import { fetchUserBookings, cancelUserBookingInDB, addStationReview } from '../services/bookingService'
import { useAuth } from '../context/AuthContext'

export default function BookingsPage() {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [activeTab, setActiveTab] = useState('active') // 'active' | 'history'
  const [cancellingId, setCancellingId] = useState(null)
  
  // Review State
  const [reviewModal, setReviewModal] = useState({ open: false, stationId: null, stationName: '', rating: 5, comment: '', posting: false })
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

    setTimeout(async () => {
      // 1. Cancel in local storage (fallback)
      cancelBooking(bookingId)

      // 2. Cancel in Supabase Cloud DB
      if (user?.id && !bookingId.toString().startsWith('BK-')) {
        await cancelUserBookingInDB(bookingId)
      }

      // 3. Update local React state instantly to reflect UI change
      setBookings(prev => prev.map(b => 
        b.id === bookingId ? { ...b, status: 'cancelled' } : b
      ))
      
      setCancellingId(null)
    }, 800)
  }, [user])

  const submitReview = async (e) => {
    e.preventDefault()
    setReviewModal(prev => ({ ...prev, posting: true }))
    
    await addStationReview(user.id, reviewModal.stationId, reviewModal.rating, reviewModal.comment)
    
    // Quick local state feedback that review was submitted
    alert('Thank you for leaving a review!')
    setReviewModal({ open: false, stationId: null, stationName: '', rating: 5, comment: '', posting: false })
  }

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

                      {/* Review button for Completed bookings */}
                      {!active && booking.status !== 'cancelled' && (
                        <button
                          onClick={() => setReviewModal({ open: true, stationId: booking.stationId, stationName: booking.stationName, rating: 5, comment: '', posting: false })}
                          className="w-full py-2.5 rounded-xl text-sm font-medium border border-[#3B82F6]/40 text-[#3B82F6] hover:bg-[#3B82F6]/10 transition"
                        >
                          ⭐ Leave a Review
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

      {/* ── Review Modal ── */}
      <AnimatePresence>
        {reviewModal.open && (
           <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setReviewModal(p => ({ ...p, open: false }))}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-sm bg-[#0F172A] border border-[#1E293B] rounded-2xl shadow-2xl p-6"
            >
              <h2 className="font-bold text-white text-lg">Rate this Station</h2>
              <p className="text-[#64748B] text-xs mt-1 mb-4">{reviewModal.stationName}</p>

              <form onSubmit={submitReview} className="flex flex-col gap-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewModal(p => ({ ...p, rating: star }))}
                      className={`text-3xl transition-colors ${star <= reviewModal.rating ? 'text-[#F59E0B]' : 'text-[#334155]'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>

                <textarea
                  placeholder="Leave a comment (optional)..."
                  value={reviewModal.comment}
                  onChange={e => setReviewModal(p => ({ ...p, comment: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-[#1E293B] border border-[#334155] text-white text-sm focus:outline-none focus:border-[#3B82F6] transition resize-none min-h-[100px]"
                />

                <div className="flex gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setReviewModal(p => ({ ...p, open: false }))}
                    className="flex-1 py-3 rounded-xl font-semibold text-sm bg-[#1E293B] text-[#94A3B8] hover:text-white transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={reviewModal.posting}
                    className="flex-1 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-[#10B981] to-[#3B82F6] text-white transition hover:opacity-90 disabled:opacity-50"
                  >
                    {reviewModal.posting ? 'Posting...' : 'Submit Review'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

