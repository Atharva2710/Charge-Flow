import { supabase } from './supabaseClient'

export async function createBookingInDB(bookingData, userId) {
  if (!userId) return { error: 'User must be logged in' }

  const dbPayload = {
    user_id: userId,
    station_id: bookingData.stationId.toString(),
    station_name: bookingData.stationName,
    charger_type: bookingData.charger.connector_type,
    duration_minutes: bookingData.duration,
    vehicle_name: bookingData.vehicleName || 'Guest Vehicle',
    estimated_cost: bookingData.estimatedCost,
    estimated_kwh: bookingData.estimatedKwh,
    status: 'active',
    end_time: bookingData.endTime
  }

  const { data, error } = await supabase
    .from('bookings')
    .insert([dbPayload])
    .select()
    .single()

  return { data, error }
}

export async function fetchUserBookings(userId) {
  if (!userId) return []

  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching bookings:', error)
    return []
  }
  return data
}

export async function cancelUserBookingInDB(bookingId) {
  if (!bookingId) return { error: 'No booking ID provided' }

  // Supabase takes UUIDs, while local storage used 'BK-...'. 
  // We only send to DB if it's a valid Supabase UUID (or we let Supabase handle the mismatch safely).
  const { data, error } = await supabase
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('id', bookingId)
    .select()

  return { data, error }
}

// ── MY GARAGE (Vehicles) ────────────────────────────────────────────────

export async function fetchUserVehicles(userId) {
  if (!userId) return []

  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching vehicles:', error)
    return []
  }
  return data
}

export async function addVehicle(userId, vehicleData) {
  if (!userId) return { error: 'User must be logged in' }

  const payload = {
    user_id: userId,
    vendor_name: vehicleData.vendor,
    model_name: vehicleData.model,
    battery_capacity: vehicleData.battery,
    connector_type: vehicleData.connector
  }

  const { data, error } = await supabase
    .from('vehicles')
    .insert([payload])
    .select()
    .single()

  return { data, error }
}

export async function deleteVehicle(vehicleId) {
  if (!vehicleId) return { error: 'No vehicle id' }

  const { data, error } = await supabase
    .from('vehicles')
    .delete()
    .eq('id', vehicleId)

  return { data, error }
}
