import { useReducer, useCallback } from 'react'

/**
 * useBooking — manages the entire booking flow as a state machine.
 *
 * Uses useReducer (not useState) because booking has multiple
 * interdependent fields that update together — perfect for a reducer.
 *
 * Steps: 'select' → 'confirm' → 'success'
 */

const BOOKING_KEY = 'chargeflow_bookings'

// ── Initial state ──────────────────────────────────────────────
const initialState = {
  step: 'select',      // current step in the booking flow
  selectedCharger: null,  // the specific charger slot chosen
  duration: 60,        // minutes: 30 | 60 | 120 | 240
  vehicleName: '',     // user's vehicle (e.g. "Tata Nexon EV")
  loading: false,
  error: null,
}

// ── Reducer ────────────────────────────────────────────────────
function bookingReducer(state, action) {
  switch (action.type) {
    case 'SET_CHARGER':
      return { ...state, selectedCharger: action.payload, error: null }
    case 'SET_DURATION':
      return { ...state, duration: action.payload }
    case 'SET_VEHICLE':
      return { ...state, vehicleName: action.payload }
    case 'NEXT_STEP':
      return { ...state, step: action.payload }
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
    case 'RESET':
      return { ...initialState }
    default:
      return state
  }
}

// ── Hook ───────────────────────────────────────────────────────
export function useBooking() {
  const [state, dispatch] = useReducer(bookingReducer, initialState)

  // Calculate estimated cost
  const estimatedKwh = state.selectedCharger
    ? parseFloat(((state.selectedCharger.max_kw * state.duration) / 60).toFixed(2))
    : 0

  const estimatedCost = state.selectedCharger
    ? parseFloat((estimatedKwh * state.selectedCharger.price_per_kwh).toFixed(2))
    : 0

  // useCallback — stable reference, won't re-create on every render
  const selectCharger = useCallback((charger) => {
    dispatch({ type: 'SET_CHARGER', payload: charger })
  }, [])

  const setDuration = useCallback((mins) => {
    dispatch({ type: 'SET_DURATION', payload: mins })
  }, [])

  const setVehicleName = useCallback((name) => {
    dispatch({ type: 'SET_VEHICLE', payload: name })
  }, [])

  const goToConfirm = useCallback(() => {
    if (!state.selectedCharger) {
      dispatch({ type: 'SET_ERROR', payload: 'Please select a charger slot.' })
      return
    }
    if (!state.vehicleName.trim()) {
      dispatch({ type: 'SET_ERROR', payload: 'Please enter your vehicle name.' })
      return
    }
    dispatch({ type: 'NEXT_STEP', payload: 'confirm' })
  }, [state.selectedCharger, state.vehicleName])

  const confirmBooking = useCallback((station) => {
    dispatch({ type: 'SET_LOADING', payload: true })

    // Simulate async booking (replace with Supabase insert later)
    setTimeout(() => {
      const booking = {
        id: `BK-${Date.now()}`,
        stationId: station.id,
        stationName: station.name,
        stationAddress: station.address,
        charger: state.selectedCharger,
        duration: state.duration,
        vehicleName: state.vehicleName,
        estimatedKwh,
        estimatedCost,
        status: 'active',
        bookedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + state.duration * 60 * 1000).toISOString(),
      }

      // Save to localStorage
      const existing = JSON.parse(localStorage.getItem(BOOKING_KEY) || '[]')
      existing.unshift(booking)
      localStorage.setItem(BOOKING_KEY, JSON.stringify(existing))

      dispatch({ type: 'SET_LOADING', payload: false })
      dispatch({ type: 'NEXT_STEP', payload: 'success' })
    }, 1200)
  }, [state.selectedCharger, state.duration, state.vehicleName, estimatedKwh, estimatedCost])

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' })
  }, [])

  return {
    ...state,
    estimatedKwh,
    estimatedCost,
    selectCharger,
    setDuration,
    setVehicleName,
    goToConfirm,
    confirmBooking,
    reset,
  }
}

// ── Helpers for BookingsPage ───────────────────────────────────
export function getAllBookings() {
  return JSON.parse(localStorage.getItem(BOOKING_KEY) || '[]')
}

export function cancelBooking(bookingId) {
  const bookings = getAllBookings()
  const updated = bookings.map(b =>
    b.id === bookingId ? { ...b, status: 'cancelled' } : b
  )
  localStorage.setItem(BOOKING_KEY, JSON.stringify(updated))
  return updated
}

export function isBookingActive(booking) {
  return booking.status === 'active' && new Date(booking.expiresAt) > new Date()
}
