import { useState, useEffect, useMemo } from 'react'
import { MOCK_STATIONS, getStationStatus } from '../data/mockStations'
import { getDistanceKm } from '../utils/distanceCalc'

/**
 * useChargers — the core data hook for the map.
 *
 * Takes the user's current GPS coords and optional filters.
 * Returns stations sorted by distance, with distance attached.
 *
 * React concepts used:
 * - useState for filters
 * - useEffect to (re)fetch when userCoords changes
 * - useMemo to sort + filter — expensive computation memoized
 */
export function useChargers(userCoords, filters = {}) {
  const [stations, setStations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch stations (using mock data; swap for Supabase later)
  useEffect(() => {
    setLoading(true)
    // Simulate async fetch
    setTimeout(() => {
      setStations(MOCK_STATIONS)
      setLoading(false)
    }, 600)
  }, [])

  // useMemo — only recompute when stations, userCoords, or filters change
  const processedStations = useMemo(() => {
    if (!stations.length) return []

    let result = stations.map(station => {
      const distance = userCoords
        ? getDistanceKm(userCoords.lat, userCoords.lng, station.latitude, station.longitude)
        : null
      const status = getStationStatus(station)
      return { ...station, distance, status }
    })

    // Apply filters
    if (filters.connectorType) {
      result = result.filter(s =>
        s.chargers.some(c => c.connector_type === filters.connectorType)
      )
    }
    if (filters.minKw) {
      result = result.filter(s =>
        s.chargers.some(c => c.max_kw >= filters.minKw)
      )
    }
    if (filters.availableOnly) {
      result = result.filter(s => s.available_slots > 0)
    }
    if (filters.maxDistance && userCoords) {
      result = result.filter(s => s.distance <= filters.maxDistance)
    }

    // Sort by distance (closest first)
    result.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity))

    return result
  }, [stations, userCoords, filters])

  return { stations: processedStations, loading, error }
}
