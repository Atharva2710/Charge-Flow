import { getStatusColor, getStatusLabel } from '../../data/mockStations'
import { formatDistance } from '../../utils/distanceCalc'

/**
 * StationCard — shows one charging station in the sidebar list.
 * Clicking it selects the station and flies the map to it.
 */
export default function StationCard({ station, isSelected, onClick }) {
  const { name, address, available_slots, total_slots, status, distance, rating, chargers } = station

  // Get unique connector types this station has
  const connectorTypes = [...new Set(chargers.map(c => c.connector_type))]

  // Lowest price at this station
  const minPrice = Math.min(...chargers.map(c => c.price_per_kwh))

  const statusColor = getStatusColor(status)
  const statusLabel = getStatusLabel(status)

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
        isSelected
          ? 'border-[#10B981] bg-[#065F46]/20'
          : 'border-[#334155] bg-[#1E293B] hover:border-[#475569]'
      }`}
    >
      {/* Top row: name + distance */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-medium text-white text-sm leading-tight flex-1">{name}</h3>
        {distance !== null && (
          <span className="text-xs text-[#94A3B8] whitespace-nowrap">{formatDistance(distance)}</span>
        )}
      </div>

      {/* Address */}
      <p className="text-xs text-[#64748B] mb-3 leading-tight">{address}</p>

      {/* Status + slots */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: statusColor }}
          />
          <span className="text-xs font-medium" style={{ color: statusColor }}>
            {statusLabel}
          </span>
        </div>
        <span className="text-xs text-[#94A3B8]">
          {available_slots}/{total_slots} slots
        </span>
      </div>

      {/* Connector types + price */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1 flex-wrap">
          {connectorTypes.slice(0, 3).map(type => (
            <span
              key={type}
              className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#0F172A] text-[#94A3B8] border border-[#334155]"
            >
              {type}
            </span>
          ))}
        </div>
        <span className="text-xs text-[#10B981] font-medium">₹{minPrice}/kWh</span>
      </div>

      {/* Rating */}
      {rating && (
        <div className="mt-2 flex items-center gap-1">
          <span className="text-[#F59E0B] text-xs">★</span>
          <span className="text-xs text-[#94A3B8]">{rating}</span>
        </div>
      )}
    </button>
  )
}
