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

// ── PEER REVIEWS ────────────────────────────────────────────────────────

export async function addStationReview(userId, stationId, rating, comment) {
  if (!userId) return { error: 'Not logged in' }

  const payload = {
    user_id: userId,
    station_id: stationId.toString(),
    rating: parseInt(rating, 10),
    comment: comment || ''
  }

  // Uses upsert in case they are modifying an existing review
  const { data, error } = await supabase
    .from('reviews')
    .upsert([payload], { onConflict: 'user_id, station_id' })
    .select()
    .single()

  return { data, error }
}

export async function fetchStationRatings() {
  // Fetch all reviews and group them by station to calculate averages
  const { data, error } = await supabase
    .from('reviews')
    .select('station_id, rating')

  if (error) {
    console.error('Error fetching ratings:', error)
    return {}
  }

  // Calculate averages client-side for simplicity
  const stationStats = {}
  data.forEach(r => {
    if (!stationStats[r.station_id]) {
      stationStats[r.station_id] = { sum: 0, count: 0 }
    }
    stationStats[r.station_id].sum += r.rating
    stationStats[r.station_id].count += 1
  })

  // Format into average scores
  const aggregates = {}
  Object.keys(stationStats).forEach(id => {
    const avg = stationStats[id].sum / stationStats[id].count
    aggregates[id] = {
      average: parseFloat(avg.toFixed(1)),
      count: stationStats[id].count
    }
  })

  return aggregates
}

export async function checkUserReview(userId, stationId) {
  if (!userId) return null
  const { data, error } = await supabase
    .from('reviews')
    .select('rating, comment')
    .eq('user_id', userId)
    .eq('station_id', stationId.toString())
    .maybeSingle()
  
  if (error) return null
  return data
}
