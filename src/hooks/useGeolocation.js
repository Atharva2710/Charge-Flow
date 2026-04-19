import { useState, useEffect } from 'react'

/**
 * useGeolocation — wraps navigator.geolocation in a clean React hook.
 *
 * Returns:
 *   coords   → { lat, lng } or null
 *   error    → string error message or null
 *   loading  → true while waiting for permission/position
 *   refresh  → function to re-request location
 */
export function useGeolocation() {
  const [coords, setCoords] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  function requestLocation() {
    setLoading(true)
    setError(null)

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.')
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        setLoading(false)
      },
      (err) => {
        // User denied permission — fall back to Mumbai center
        console.warn('Geolocation denied, using Mumbai default:', err.message)
        setCoords({ lat: 19.076, lng: 72.8777 }) // Mumbai center
        setError('Location access denied. Showing Mumbai.')
        setLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 60000,
      }
    )
  }

  useEffect(() => {
    requestLocation()
  }, [])

  return { coords, error, loading, refresh: requestLocation }
}
