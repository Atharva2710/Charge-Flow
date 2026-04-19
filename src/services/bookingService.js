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
