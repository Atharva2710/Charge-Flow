import { useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useBooking } from '../../hooks/useBooking'
import { getStatusColor } from '../../data/mockStations'

const DURATION_OPTIONS = [
  { label: '30 min', value: 30 },
  { label: '1 hour', value: 60 },
  { label: '2 hours', value: 120 },
  { label: '4 hours', value: 240 },
]

const VEHICLE_SUGGESTIONS = [
  'Tata Nexon EV', 'Tata Tiago EV', 'MG ZS EV', 'Hyundai Ioniq 5',
  'Kia EV6', 'BYD Atto 3', 'Ola S1 Pro', 'Ather 450X',
]

export default function BookingModal({ station, onClose }) {
  const {
    step, selectedCharger, duration, vehicleName,
    loading, error, estimatedKwh, estimatedCost,
    selectCharger, setDuration, setVehicleName,
    goToConfirm, confirmBooking, reset,
  } = useBooking()

  // Only show available chargers
  const availableChargers = station.chargers.filter(c => c.status === 'available')

  const handleClose = useCallback(() => {
    reset()
    onClose()
  }, [reset, onClose])

  const handleConfirm = useCallback(() => {
    confirmBooking(station)
  }, [confirmBooking, station])

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        {/* Modal */}
        <motion.div
          key="modal"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={e => e.stopPropagation()}
          className="w-full max-w-lg bg-[#0F172A] border border-[#1E293B] rounded-2xl overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-[#1E293B] flex items-center justify-between">
            <div>
              <h2 className="font-bold text-white text-lg">Reserve a Slot</h2>
              <p className="text-[#64748B] text-xs mt-0.5 truncate max-w-xs">{station.name}</p>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-lg bg-[#1E293B] text-[#94A3B8] hover:text-white flex items-center justify-center transition"
            >
              ✕
            </button>
          </div>

          {/* Step Indicator */}
          <div className="px-6 pt-4 flex gap-2">
            {['Select', 'Confirm', 'Done'].map((label, i) => {
              const stepIdx = step === 'select' ? 0 : step === 'confirm' ? 1 : 2
              const isActive = i === stepIdx
              const isDone = i < stepIdx
              return (
                <div key={label} className="flex items-center gap-2 flex-1">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    isDone ? 'bg-[#10B981] text-white' :
                    isActive ? 'bg-[#3B82F6] text-white' :
                    'bg-[#1E293B] text-[#64748B]'
                  }`}>
                    {isDone ? '✓' : i + 1}
                  </div>
                  <span className={`text-xs ${isActive ? 'text-white' : 'text-[#64748B]'}`}>{label}</span>
                  {i < 2 && <div className="flex-1 h-px bg-[#1E293B]" />}
                </div>
              )
            })}
          </div>

          <div className="px-6 py-4">
            {/* ── STEP 1: SELECT ── */}
            {step === 'select' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-5">

                {/* Charger Selection */}
                <div>
                  <label className="text-xs font-medium text-[#94A3B8] uppercase tracking-wider mb-2 block">
                    Choose Charger Slot
                  </label>
                  {availableChargers.length === 0 ? (
                    <p className="text-[#64748B] text-sm text-center py-4">No available slots right now</p>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {availableChargers.map(charger => (
                        <button
                          key={charger.id}
                          onClick={() => selectCharger(charger)}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
                            selectedCharger?.id === charger.id
                              ? 'border-[#10B981] bg-[#065F46]/20'
                              : 'border-[#334155] bg-[#1E293B] hover:border-[#475569]'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-2.5 h-2.5 rounded-full ${selectedCharger?.id === charger.id ? 'bg-[#10B981]' : 'bg-[#475569]'}`} />
                            <span className="text-white text-sm font-medium">{charger.connector_type}</span>
                            <span className="text-[#64748B] text-xs">{charger.max_kw} kW</span>
                          </div>
                          <span className="text-[#10B981] text-sm font-medium">₹{charger.price_per_kwh}/kWh</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Duration Selector */}
                <div>
                  <label className="text-xs font-medium text-[#94A3B8] uppercase tracking-wider mb-2 block">
                    Charging Duration
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {DURATION_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => setDuration(opt.value)}
                        className={`py-2.5 rounded-xl text-sm font-medium border transition-all ${
                          duration === opt.value
                            ? 'border-[#3B82F6] bg-[#1E3A5F] text-[#3B82F6]'
                            : 'border-[#334155] bg-[#1E293B] text-[#94A3B8] hover:border-[#475569]'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Vehicle Name */}
                <div>
                  <label className="text-xs font-medium text-[#94A3B8] uppercase tracking-wider mb-2 block">
                    Your Vehicle
                  </label>
                  <input
                    type="text"
                    value={vehicleName}
                    onChange={e => setVehicleName(e.target.value)}
                    placeholder="e.g. Tata Nexon EV"
                    list="vehicles"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1E293B] border border-[#334155] text-white placeholder-[#64748B] text-sm focus:outline-none focus:border-[#3B82F6] transition"
                  />
                  <datalist id="vehicles">
                    {VEHICLE_SUGGESTIONS.map(v => <option key={v} value={v} />)}
                  </datalist>
                </div>

                {/* Live Price Preview */}
                {selectedCharger && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-[#1E293B] rounded-xl px-4 py-3 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-[#94A3B8] text-xs">Estimated cost</p>
                      <p className="text-white font-bold text-lg">₹{estimatedCost}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[#94A3B8] text-xs">Energy</p>
                      <p className="text-[#10B981] font-medium">{estimatedKwh} kWh</p>
                    </div>
                  </motion.div>
                )}

                {error && <p className="text-[#EF4444] text-sm text-center">{error}</p>}

                <button
                  onClick={goToConfirm}
                  className="w-full py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-[#10B981] to-[#3B82F6] text-white hover:opacity-90 transition active:scale-[0.98]"
                >
                  Continue to Confirm
                </button>
              </motion.div>
            )}

            {/* ── STEP 2: CONFIRM ── */}
            {step === 'confirm' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-4">
                <div className="bg-[#1E293B] rounded-xl p-4 flex flex-col gap-3">
                  {[
                    { label: 'Station', value: station.name },
                    { label: 'Charger', value: `${selectedCharger?.connector_type} · ${selectedCharger?.max_kw} kW` },
                    { label: 'Duration', value: `${duration} minutes` },
                    { label: 'Vehicle', value: vehicleName },
                    { label: 'Energy', value: `~${estimatedKwh} kWh` },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-center">
                      <span className="text-[#64748B] text-sm">{label}</span>
                      <span className="text-white text-sm font-medium">{value}</span>
                    </div>
                  ))}
                  <div className="border-t border-[#334155] pt-3 flex justify-between items-center">
                    <span className="text-white font-semibold">Total Est.</span>
                    <span className="text-[#10B981] font-bold text-xl">₹{estimatedCost}</span>
                  </div>
                </div>
                <p className="text-[#64748B] text-xs text-center">
                  Slot held for 15 minutes after confirmation
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => { /* go back */ reset(); }}
                    className="flex-1 py-3 rounded-xl font-semibold text-sm bg-[#1E293B] text-[#94A3B8] hover:text-white border border-[#334155] transition"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleConfirm}
                    disabled={loading}
                    className="flex-2 flex-grow py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-[#10B981] to-[#3B82F6] text-white hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                    {loading ? 'Booking...' : 'Confirm Booking'}
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── STEP 3: SUCCESS ── */}
            {step === 'success' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center text-center gap-4 py-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
                  className="w-20 h-20 rounded-full bg-[#065F46]/30 border-2 border-[#10B981] flex items-center justify-center text-4xl"
                >
                  ✓
                </motion.div>
                <div>
                  <h3 className="text-white font-bold text-xl">Booking Confirmed!</h3>
                  <p className="text-[#94A3B8] text-sm mt-1">Your slot is reserved for {duration} minutes</p>
                </div>
                <div className="bg-[#1E293B] rounded-xl p-4 w-full text-left">
                  <p className="text-[#64748B] text-xs mb-1">Station</p>
                  <p className="text-white text-sm font-medium">{station.name}</p>
                  <p className="text-[#64748B] text-xs mt-3 mb-1">Charger</p>
                  <p className="text-white text-sm font-medium">{selectedCharger?.connector_type} · {selectedCharger?.max_kw} kW</p>
                  <p className="text-[#64748B] text-xs mt-3 mb-1">Estimated Cost</p>
                  <p className="text-[#10B981] text-lg font-bold">₹{estimatedCost}</p>
                </div>
                <div className="flex gap-3 w-full">
                  <button
                    onClick={handleClose}
                    className="flex-1 py-3 rounded-xl font-semibold text-sm bg-[#1E293B] text-[#94A3B8] hover:text-white border border-[#334155] transition"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => { handleClose(); window.location.href = '/bookings'; }}
                    className="flex-1 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-[#10B981] to-[#3B82F6] text-white hover:opacity-90 transition"
                  >
                    View Bookings
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
