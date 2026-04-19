// Real EV charging stations across Mumbai and Pune
// Data includes real locations, charger types, and realistic status
export const MOCK_STATIONS = [
  {
    id: '1',
    name: 'Tata Power EV Hub — BKC',
    latitude: 19.0596,
    longitude: 72.8656,
    city: 'Mumbai',
    address: 'Bandra Kurla Complex, Mumbai',
    total_slots: 6,
    available_slots: 4,
    chargers: [
      { id: 'c1', connector_type: 'CCS2', max_kw: 50, status: 'available', price_per_kwh: 18 },
      { id: 'c2', connector_type: 'CCS2', max_kw: 50, status: 'charging', price_per_kwh: 18 },
      { id: 'c3', connector_type: 'Type2', max_kw: 22, status: 'available', price_per_kwh: 14 },
      { id: 'c4', connector_type: 'Type2', max_kw: 22, status: 'available', price_per_kwh: 14 },
      { id: 'c5', connector_type: 'CCS2', max_kw: 120, status: 'available', price_per_kwh: 22 },
      { id: 'c6', connector_type: 'CHAdeMO', max_kw: 50, status: 'offline', price_per_kwh: 18 },
    ],
    is_verified: true,
    rating: 4.5,
    review_count: 38,
  },
  {
    id: '2',
    name: 'Magenta ChargeGrid — Powai',
    latitude: 19.1186,
    longitude: 72.9063,
    city: 'Mumbai',
    address: 'Hiranandani Gardens, Powai, Mumbai',
    total_slots: 4,
    available_slots: 0,
    chargers: [
      { id: 'c7', connector_type: 'CCS2', max_kw: 30, status: 'charging', price_per_kwh: 16 },
      { id: 'c8', connector_type: 'CCS2', max_kw: 30, status: 'charging', price_per_kwh: 16 },
      { id: 'c9', connector_type: 'Type2', max_kw: 7, status: 'charging', price_per_kwh: 12 },
      { id: 'c10', connector_type: 'Type2', max_kw: 7, status: 'reserved', price_per_kwh: 12 },
    ],
    is_verified: true,
    rating: 4.2,
    review_count: 21,
  },
  {
    id: '3',
    name: 'Ather Grid — Bandra West',
    latitude: 19.0596,
    longitude: 72.8295,
    city: 'Mumbai',
    address: 'Hill Road, Bandra West, Mumbai',
    total_slots: 3,
    available_slots: 1,
    chargers: [
      { id: 'c11', connector_type: 'Type2', max_kw: 22, status: 'available', price_per_kwh: 15 },
      { id: 'c12', connector_type: 'Type2', max_kw: 22, status: 'charging', price_per_kwh: 15 },
      { id: 'c13', connector_type: 'Type2', max_kw: 22, status: 'charging', price_per_kwh: 15 },
    ],
    is_verified: true,
    rating: 4.7,
    review_count: 56,
  },
  {
    id: '4',
    name: 'Charge Zone — Lower Parel',
    latitude: 18.9981,
    longitude: 72.8317,
    city: 'Mumbai',
    address: 'Phoenix Palladium Mall, Lower Parel, Mumbai',
    total_slots: 8,
    available_slots: 5,
    chargers: [
      { id: 'c14', connector_type: 'CCS2', max_kw: 150, status: 'available', price_per_kwh: 25 },
      { id: 'c15', connector_type: 'CCS2', max_kw: 150, status: 'available', price_per_kwh: 25 },
      { id: 'c16', connector_type: 'CCS2', max_kw: 50, status: 'available', price_per_kwh: 20 },
      { id: 'c17', connector_type: 'Type2', max_kw: 22, status: 'charging', price_per_kwh: 14 },
      { id: 'c18', connector_type: 'Type2', max_kw: 22, status: 'charging', price_per_kwh: 14 },
      { id: 'c19', connector_type: 'Type2', max_kw: 22, status: 'available', price_per_kwh: 14 },
      { id: 'c20', connector_type: 'CHAdeMO', max_kw: 50, status: 'available', price_per_kwh: 20 },
      { id: 'c21', connector_type: 'CCS2', max_kw: 50, status: 'available', price_per_kwh: 20 },
    ],
    is_verified: true,
    rating: 4.4,
    review_count: 94,
  },
  {
    id: '5',
    name: 'HPCL EV Point — Worli',
    latitude: 19.0119,
    longitude: 72.8155,
    city: 'Mumbai',
    address: 'HPCL Petrol Station, Worli Sea Face, Mumbai',
    total_slots: 2,
    available_slots: 2,
    chargers: [
      { id: 'c22', connector_type: 'Bharat AC', max_kw: 7, status: 'available', price_per_kwh: 10 },
      { id: 'c23', connector_type: 'Bharat DC', max_kw: 15, status: 'available', price_per_kwh: 13 },
    ],
    is_verified: true,
    rating: 3.9,
    review_count: 14,
  },
  {
    id: '6',
    name: 'Volttic Charging Hub — Andheri East',
    latitude: 19.1197,
    longitude: 72.8468,
    city: 'Mumbai',
    address: 'MIDC Industrial Area, Andheri East, Mumbai',
    total_slots: 5,
    available_slots: 3,
    chargers: [
      { id: 'c24', connector_type: 'CCS2', max_kw: 60, status: 'available', price_per_kwh: 19 },
      { id: 'c25', connector_type: 'CCS2', max_kw: 60, status: 'available', price_per_kwh: 19 },
      { id: 'c26', connector_type: 'Type2', max_kw: 22, status: 'charging', price_per_kwh: 14 },
      { id: 'c27', connector_type: 'Type2', max_kw: 22, status: 'charging', price_per_kwh: 14 },
      { id: 'c28', connector_type: 'CCS2', max_kw: 60, status: 'available', price_per_kwh: 19 },
    ],
    is_verified: false,
    rating: 4.1,
    review_count: 8,
  },
  {
    id: '7',
    name: 'Kazam EV Park — Goregaon',
    latitude: 19.1523,
    longitude: 72.8493,
    city: 'Mumbai',
    address: 'Oberoi Mall Complex, Goregaon East, Mumbai',
    total_slots: 4,
    available_slots: 0,
    chargers: [
      { id: 'c29', connector_type: 'CCS2', max_kw: 50, status: 'offline', price_per_kwh: 18 },
      { id: 'c30', connector_type: 'CCS2', max_kw: 50, status: 'offline', price_per_kwh: 18 },
      { id: 'c31', connector_type: 'Type2', max_kw: 22, status: 'offline', price_per_kwh: 14 },
      { id: 'c32', connector_type: 'Type2', max_kw: 22, status: 'offline', price_per_kwh: 14 },
    ],
    is_verified: true,
    rating: 2.8,
    review_count: 33,
  },
  {
    id: '8',
    name: 'EESL Smart Charger — Juhu',
    latitude: 19.1075,
    longitude: 72.8263,
    city: 'Mumbai',
    address: 'Juhu Tara Road, Juhu, Mumbai',
    total_slots: 3,
    available_slots: 2,
    chargers: [
      { id: 'c33', connector_type: 'CCS2', max_kw: 25, status: 'available', price_per_kwh: 15 },
      { id: 'c34', connector_type: 'Type2', max_kw: 22, status: 'available', price_per_kwh: 13 },
      { id: 'c35', connector_type: 'Bharat DC', max_kw: 15, status: 'charging', price_per_kwh: 11 },
    ],
    is_verified: true,
    rating: 4.0,
    review_count: 19,
  },

  // ── Bengaluru Stations ──
  {
    id: '9',
    name: 'Tata Power EV Hub — Koramangala',
    latitude: 12.9352,
    longitude: 77.6245,
    city: 'Bengaluru',
    address: '6th Block, Koramangala, Bengaluru',
    total_slots: 6,
    available_slots: 3,
    chargers: [
      { id: 'c36', connector_type: 'CCS2', max_kw: 50, status: 'available', price_per_kwh: 18 },
      { id: 'c37', connector_type: 'CCS2', max_kw: 50, status: 'charging', price_per_kwh: 18 },
      { id: 'c38', connector_type: 'Type2', max_kw: 22, status: 'available', price_per_kwh: 14 },
      { id: 'c39', connector_type: 'Type2', max_kw: 22, status: 'available', price_per_kwh: 14 },
      { id: 'c40', connector_type: 'CCS2', max_kw: 100, status: 'charging', price_per_kwh: 22 },
      { id: 'c41', connector_type: 'CHAdeMO', max_kw: 50, status: 'available', price_per_kwh: 18 },
    ],
    is_verified: true,
    rating: 4.6,
    review_count: 72,
  },
  {
    id: '10',
    name: 'Charge Zone — Indiranagar',
    latitude: 12.9784,
    longitude: 77.6408,
    city: 'Bengaluru',
    address: '100 Feet Road, Indiranagar, Bengaluru',
    total_slots: 4,
    available_slots: 0,
    chargers: [
      { id: 'c42', connector_type: 'CCS2', max_kw: 150, status: 'charging', price_per_kwh: 25 },
      { id: 'c43', connector_type: 'CCS2', max_kw: 150, status: 'charging', price_per_kwh: 25 },
      { id: 'c44', connector_type: 'Type2', max_kw: 22, status: 'charging', price_per_kwh: 14 },
      { id: 'c45', connector_type: 'Type2', max_kw: 22, status: 'reserved', price_per_kwh: 14 },
    ],
    is_verified: true,
    rating: 4.3,
    review_count: 44,
  },
  {
    id: '11',
    name: 'Ather Grid — HSR Layout',
    latitude: 12.9116,
    longitude: 77.6389,
    city: 'Bengaluru',
    address: 'Sector 1, HSR Layout, Bengaluru',
    total_slots: 3,
    available_slots: 2,
    chargers: [
      { id: 'c46', connector_type: 'Type2', max_kw: 22, status: 'available', price_per_kwh: 15 },
      { id: 'c47', connector_type: 'Type2', max_kw: 22, status: 'available', price_per_kwh: 15 },
      { id: 'c48', connector_type: 'CCS2', max_kw: 60, status: 'charging', price_per_kwh: 20 },
    ],
    is_verified: true,
    rating: 4.8,
    review_count: 91,
  },
  {
    id: '12',
    name: 'Magenta ChargeGrid — Whitefield',
    latitude: 12.9698,
    longitude: 77.7499,
    city: 'Bengaluru',
    address: 'ITPL Road, Whitefield, Bengaluru',
    total_slots: 5,
    available_slots: 1,
    chargers: [
      { id: 'c49', connector_type: 'CCS2', max_kw: 60, status: 'charging', price_per_kwh: 19 },
      { id: 'c50', connector_type: 'CCS2', max_kw: 60, status: 'charging', price_per_kwh: 19 },
      { id: 'c51', connector_type: 'CCS2', max_kw: 60, status: 'charging', price_per_kwh: 19 },
      { id: 'c52', connector_type: 'Type2', max_kw: 22, status: 'available', price_per_kwh: 13 },
      { id: 'c53', connector_type: 'Type2', max_kw: 22, status: 'charging', price_per_kwh: 13 },
    ],
    is_verified: true,
    rating: 4.2,
    review_count: 28,
  },
  {
    id: '13',
    name: 'HPCL EV Point — MG Road',
    latitude: 12.9757,
    longitude: 77.6099,
    city: 'Bengaluru',
    address: 'HPCL Station, MG Road, Bengaluru',
    total_slots: 2,
    available_slots: 2,
    chargers: [
      { id: 'c54', connector_type: 'Bharat AC', max_kw: 7, status: 'available', price_per_kwh: 10 },
      { id: 'c55', connector_type: 'Bharat DC', max_kw: 15, status: 'available', price_per_kwh: 13 },
    ],
    is_verified: true,
    rating: 3.7,
    review_count: 11,
  },
  {
    id: '14',
    name: 'Volttic Fast Charging — Electronic City',
    latitude: 12.8449,
    longitude: 77.6608,
    city: 'Bengaluru',
    address: 'Phase 1, Electronic City, Bengaluru',
    total_slots: 4,
    available_slots: 4,
    chargers: [
      { id: 'c56', connector_type: 'CCS2', max_kw: 120, status: 'available', price_per_kwh: 22 },
      { id: 'c57', connector_type: 'CCS2', max_kw: 120, status: 'available', price_per_kwh: 22 },
      { id: 'c58', connector_type: 'Type2', max_kw: 22, status: 'available', price_per_kwh: 15 },
      { id: 'c59', connector_type: 'Type2', max_kw: 22, status: 'available', price_per_kwh: 15 },
    ],
    is_verified: false,
    rating: 4.0,
    review_count: 6,
  },
  {
    id: '15',
    name: 'Kazam EV Hub — Malleshwaram',
    latitude: 13.0032,
    longitude: 77.5681,
    city: 'Bengaluru',
    address: '18th Cross, Malleshwaram, Bengaluru',
    total_slots: 3,
    available_slots: 0,
    chargers: [
      { id: 'c60', connector_type: 'CCS2', max_kw: 50, status: 'offline', price_per_kwh: 18 },
      { id: 'c61', connector_type: 'Type2', max_kw: 22, status: 'offline', price_per_kwh: 14 },
      { id: 'c62', connector_type: 'Type2', max_kw: 22, status: 'offline', price_per_kwh: 14 },
    ],
    is_verified: true,
    rating: 3.1,
    review_count: 17,
  },
]

/**
 * Determine the station's availability status from its chargers
 */
export function getStationStatus(station) {
  const { available_slots, total_slots } = station
  if (available_slots === 0) {
    // Check if all are offline
    const allOffline = station.chargers.every(c => c.status === 'offline')
    return allOffline ? 'offline' : 'full'
  }
  if (available_slots === 1) return 'limited'
  return 'available'
}

/**
 * Get the color for a station marker based on status
 */
export function getStatusColor(status) {
  switch (status) {
    case 'available': return '#10B981' // green
    case 'limited':   return '#F59E0B' // amber
    case 'full':      return '#EF4444' // red
    case 'offline':   return '#64748B' // grey
    default:          return '#64748B'
  }
}

/**
 * Get display label for status
 */
export function getStatusLabel(status) {
  switch (status) {
    case 'available': return 'Available'
    case 'limited':   return '1 slot left'
    case 'full':      return 'Full'
    case 'offline':   return 'Offline'
    default:          return 'Unknown'
  }
}
