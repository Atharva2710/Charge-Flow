import { useEffect, useRef, useState, useCallback } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

import { useGeolocation } from '../hooks/useGeolocation'
import { useChargers } from '../hooks/useChargers'
import StationCard from '../components/station/StationCard'
import BookingModal from '../components/booking/BookingModal'
import { getStatusColor, getStatusLabel } from '../data/mockStations'
import { formatDistance } from '../utils/distanceCalc'

// Set Mapbox token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

// Connector type options for filter
const CONNECTOR_OPTIONS = ['All', 'CCS2', 'CHAdeMO', 'Type2', 'Bharat AC', 'Bharat DC']
const KW_OPTIONS = [{ label: 'Any', value: 0 }, { label: '7+ kW', value: 7 }, { label: '22+ kW', value: 22 }, { label: '50+ kW', value: 50 }, { label: '100+ kW', value: 100 }]

export default function MapPage() {
  const navigate = useNavigate()

  // ── Refs (useRef) — hold map instance without triggering re-renders
  const mapContainer = useRef(null)
  const map = useRef(null)
  const markersRef = useRef({}) // stationId → mapboxgl.Marker

  // ── State
  const [selectedStation, setSelectedStation] = useState(null)
  const [bookingStation, setBookingStation] = useState(null) // station to book
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [filters, setFilters] = useState({
    connectorType: '',
    minKw: 0,
    availableOnly: false,
    maxDistance: 0,
  })

  // ── Custom hooks
  const { coords: userCoords, loading: locationLoading, refresh: refreshLocation } = useGeolocation()
  const { stations, loading: stationsLoading } = useChargers(userCoords, {
    connectorType: filters.connectorType || undefined,
    minKw: filters.minKw || undefined,
    availableOnly: filters.availableOnly || undefined,
  })

  // ── Initialize Mapbox map (useEffect)
  useEffect(() => {
    if (map.current) return // Already initialized

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [72.8777, 19.076], // Mumbai default
      zoom: 11,
      attributionControl: false,
    })

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'bottom-right')

    // Cleanup on unmount
    return () => {
      map.current?.remove()
      map.current = null
    }
  }, [])

  // ── Fly to user location once we have it
  useEffect(() => {
    if (!map.current || !userCoords) return
    map.current.flyTo({
      center: [userCoords.lng, userCoords.lat],
      zoom: 12,
      duration: 1800,
      essential: true,
    })
  }, [userCoords])

  // ── useCallback — stable reference for marker click handler (won't re-create on every render)
  const handleMarkerClick = useCallback((station) => {
    setSelectedStation(station)
    setSidebarOpen(true)

    // Fly map to the clicked station
    map.current?.flyTo({
      center: [station.longitude, station.latitude],
      zoom: 14,
      duration: 800,
    })
  }, [])

  // ── Add/update markers whenever stations change
  useEffect(() => {
    if (!map.current || stationsLoading) return

    // Remove old markers that are no longer in the list
    Object.keys(markersRef.current).forEach(id => {
      if (!stations.find(s => s.id === id)) {
        markersRef.current[id].remove()
        delete markersRef.current[id]
      }
    })

    // Add new markers
    stations.forEach(station => {
      if (markersRef.current[station.id]) return // Already on map

      const color = getStatusColor(station.status)

      // Create custom HTML marker element
      const el = document.createElement('div')
      el.className = 'chargeflow-marker'
      el.style.cssText = `
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: ${color};
        border: 3px solid rgba(255,255,255,0.9);
        box-shadow: 0 0 0 3px ${color}40, 0 4px 12px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 14px;
        transition: transform 0.2s;
      `
      el.innerHTML = '⚡'
      el.title = station.name

      // Hover effect
      el.addEventListener('mouseenter', () => { el.style.transform = 'scale(1.2)' })
      el.addEventListener('mouseleave', () => { el.style.transform = 'scale(1)' })
      el.addEventListener('click', () => handleMarkerClick(station))

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([station.longitude, station.latitude])
        .addTo(map.current)

      markersRef.current[station.id] = marker
    })
  }, [stations, stationsLoading, handleMarkerClick])

  // ── User location marker
  useEffect(() => {
    if (!map.current || !userCoords) return

    // Add a "you are here" marker
    const el = document.createElement('div')
    el.style.cssText = `
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #3B82F6;
      border: 3px solid white;
      box-shadow: 0 0 0 6px rgba(59,130,246,0.3);
    `

    new mapboxgl.Marker({ element: el })
      .setLngLat([userCoords.lng, userCoords.lat])
      .addTo(map.current)
  }, [userCoords])

  const availableCount = stations.filter(s => s.status === 'available' || s.status === 'limited').length

  return (
    <div className="h-screen bg-[#0F172A] flex flex-col overflow-hidden">

      {/* ── Top Navbar ── */}
      <nav className="h-14 flex items-center justify-between px-4 bg-[#0F172A]/90 backdrop-blur border-b border-[#1E293B] z-30 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-[#94A3B8] hover:text-white transition text-sm"
          >
            ←
          </button>
          <div className="flex items-center gap-2">
            <span className="text-lg">⚡</span>
            <span className="font-bold text-white">ChargeFlow</span>
          </div>
          {!stationsLoading && (
            <span className="text-xs text-[#10B981] bg-[#065F46]/30 px-2 py-0.5 rounded-full">
              {availableCount} stations available
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* My Bookings link */}
          <button
            onClick={() => navigate('/bookings')}
            className="px-3 py-1.5 rounded-lg bg-[#1E293B] border border-[#334155] text-[#94A3B8] hover:text-white hover:border-[#10B981] transition text-xs font-medium"
          >
            My Bookings
          </button>
          {/* Locate Me button */}
          <button
            onClick={refreshLocation}
            title="Find my location"
            className="p-2 rounded-lg bg-[#1E293B] border border-[#334155] text-[#94A3B8] hover:text-white hover:border-[#10B981] transition text-sm"
          >
            📍
          </button>
          {/* Toggle sidebar */}
          <button
            onClick={() => setSidebarOpen(v => !v)}
            className="p-2 rounded-lg bg-[#1E293B] border border-[#334155] text-[#94A3B8] hover:text-white transition text-sm"
          >
            ☰
          </button>
        </div>
      </nav>

      {/* ── Main Content ── */}
      <div className="flex flex-1 overflow-hidden relative">

        {/* ── Sidebar ── */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ x: -320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -320, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-80 flex-shrink-0 bg-[#0F172A] border-r border-[#1E293B] flex flex-col z-20 overflow-hidden"
            >
              {/* Filter Bar */}
              <div className="p-3 border-b border-[#1E293B] bg-[#0F172A] flex-shrink-0">
                <p className="text-xs font-medium text-[#94A3B8] mb-2 uppercase tracking-wider">Filter Chargers</p>

                {/* Available only toggle */}
                <label className="flex items-center gap-2 mb-2 cursor-pointer">
                  <div
                    onClick={() => setFilters(f => ({ ...f, availableOnly: !f.availableOnly }))}
                    className={`w-9 h-5 rounded-full transition-colors ${filters.availableOnly ? 'bg-[#10B981]' : 'bg-[#334155]'} relative flex-shrink-0`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${filters.availableOnly ? 'translate-x-4' : 'translate-x-0.5'}`} />
                  </div>
                  <span className="text-xs text-[#94A3B8]">Available only</span>
                </label>

                {/* Connector type */}
                <select
                  value={filters.connectorType}
                  onChange={e => setFilters(f => ({ ...f, connectorType: e.target.value === 'All' ? '' : e.target.value }))}
                  className="w-full px-2 py-1.5 rounded-lg bg-[#1E293B] border border-[#334155] text-[#94A3B8] text-xs focus:outline-none focus:border-[#10B981] mb-2"
                >
                  {CONNECTOR_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>

                {/* Min power */}
                <select
                  value={filters.minKw}
                  onChange={e => setFilters(f => ({ ...f, minKw: Number(e.target.value) }))}
                  className="w-full px-2 py-1.5 rounded-lg bg-[#1E293B] border border-[#334155] text-[#94A3B8] text-xs focus:outline-none focus:border-[#10B981]"
                >
                  {KW_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Station List */}
              <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
                {stationsLoading ? (
                  <div className="flex flex-col items-center py-10 gap-3">
                    <div className="w-6 h-6 rounded-full border-2 border-[#10B981] border-t-transparent animate-spin" />
                    <p className="text-[#94A3B8] text-xs">Finding stations...</p>
                  </div>
                ) : stations.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-3xl mb-2">🔍</p>
                    <p className="text-[#94A3B8] text-sm">No stations match your filters</p>
                    <button
                      onClick={() => setFilters({ connectorType: '', minKw: 0, availableOnly: false, maxDistance: 0 })}
                      className="mt-3 text-[#10B981] text-xs hover:underline"
                    >
                      Clear filters
                    </button>
                  </div>
                ) : (
                  stations.map(station => (
                    <StationCard
                      key={station.id}
                      station={station}
                      isSelected={selectedStation?.id === station.id}
                      onClick={() => handleMarkerClick(station)}
                    />
                  ))
                )}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* ── Map Container ── */}
        <div className="flex-1 relative">
          <div ref={mapContainer} className="w-full h-full" />

          {/* Location loading overlay */}
          {locationLoading && (
            <div className="absolute inset-0 bg-[#0F172A]/60 flex items-center justify-center pointer-events-none">
              <div className="glass rounded-2xl px-6 py-4 flex items-center gap-3">
                <div className="w-5 h-5 rounded-full border-2 border-[#10B981] border-t-transparent animate-spin" />
                <p className="text-white text-sm">Detecting your location...</p>
              </div>
            </div>
          )}

          {/* Legend */}
          <div className="absolute bottom-6 left-4 glass rounded-xl px-3 py-2 flex gap-4">
            {[
              { color: '#10B981', label: 'Available' },
              { color: '#F59E0B', label: '1 left' },
              { color: '#EF4444', label: 'Full' },
              { color: '#64748B', label: 'Offline' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-[11px] text-[#94A3B8]">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Station Detail Panel (slides up from bottom on mobile / right on desktop) ── */}
        <AnimatePresence>
          {selectedStation && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="absolute bottom-0 left-0 right-0 md:right-auto md:left-auto md:top-0 md:w-96 md:right-0 z-30 bg-[#0F172A] border-t md:border-t-0 md:border-l border-[#1E293B] p-5 max-h-[60vh] md:max-h-full overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="font-bold text-white text-base leading-tight">{selectedStation.name}</h2>
                  <p className="text-[#64748B] text-xs mt-1">{selectedStation.address}</p>
                </div>
                <button
                  onClick={() => setSelectedStation(null)}
                  className="w-7 h-7 rounded-lg bg-[#1E293B] text-[#94A3B8] hover:text-white flex items-center justify-center text-sm flex-shrink-0 ml-2"
                >
                  ✕
                </button>
              </div>

              {/* Status row */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: getStatusColor(selectedStation.status) }}
                  />
                  <span
                    className="text-sm font-medium"
                    style={{ color: getStatusColor(selectedStation.status) }}
                  >
                    {getStatusLabel(selectedStation.status)}
                  </span>
                </div>
                <span className="text-sm text-[#94A3B8]">
                  {selectedStation.available_slots}/{selectedStation.total_slots} slots
                </span>
              </div>

              {/* Distance & Rating */}
              <div className="flex gap-3 mb-4">
                {selectedStation.distance != null && (
                  <div className="flex-1 bg-[#1E293B] rounded-xl p-3 text-center">
                    <p className="text-[#10B981] font-bold">{formatDistance(selectedStation.distance)}</p>
                    <p className="text-[#64748B] text-xs mt-0.5">Distance</p>
                  </div>
                )}
                <div className="flex-1 bg-[#1E293B] rounded-xl p-3 text-center">
                  <p className="text-[#F59E0B] font-bold">★ {selectedStation.rating}</p>
                  <p className="text-[#64748B] text-xs mt-0.5">{selectedStation.review_count} reviews</p>
                </div>
              </div>

              {/* Charger slots */}
              <h3 className="text-xs font-medium text-[#94A3B8] uppercase tracking-wider mb-2">
                Charger Slots
              </h3>
              <div className="flex flex-col gap-2 mb-4">
                {selectedStation.chargers.map(charger => {
                  const statusColors = {
                    available: { bg: '#065F46', text: '#10B981', dot: '#10B981' },
                    charging: { bg: '#1E3A5F', text: '#3B82F6', dot: '#3B82F6' },
                    reserved: { bg: '#451A03', text: '#F59E0B', dot: '#F59E0B' },
                    offline: { bg: '#1E1E2E', text: '#64748B', dot: '#64748B' },
                  }
                  const sc = statusColors[charger.status] || statusColors.offline

                  return (
                    <div
                      key={charger.id}
                      className="flex items-center justify-between px-3 py-2.5 rounded-xl"
                      style={{ backgroundColor: `${sc.bg}40`, border: `1px solid ${sc.dot}30` }}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: sc.dot }} />
                        <span className="text-sm text-white font-medium">{charger.connector_type}</span>
                        <span className="text-xs text-[#64748B]">{charger.max_kw} kW</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-[#10B981]">₹{charger.price_per_kwh}/kWh</span>
                        <span className="text-xs capitalize" style={{ color: sc.text }}>
                          {charger.status}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Reserve button */}
              <button
                disabled={selectedStation.available_slots === 0}
                onClick={() => setBookingStation(selectedStation)}
                className="w-full py-3 rounded-xl font-semibold text-sm transition-all
                  bg-gradient-to-r from-[#10B981] to-[#3B82F6] text-white
                  hover:opacity-90 active:scale-[0.98]
                  disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {selectedStation.available_slots === 0 ? 'No Slots Available' : 'Reserve a Slot'}
              </button>

              {selectedStation.is_verified && (
                <p className="text-center text-xs text-[#10B981] mt-2">
                  Verified Station
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Booking Modal ── */}
      {bookingStation && (
        <BookingModal
          station={bookingStation}
          onClose={() => setBookingStation(null)}
        />
      )}
    </div>
  )
}
