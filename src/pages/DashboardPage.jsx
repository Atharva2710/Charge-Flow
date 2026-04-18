import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function DashboardPage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Driver'

  return (
    <div className="min-h-screen bg-primary text-white">
      {/* Navbar */}
      <nav className="glass border-b border-subtle px-6 h-16 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center text-sm font-bold">⚡</div>
          <span className="text-lg font-bold">ChargeFlow</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/map')} className="text-sm text-muted hover:text-white transition">Map</button>
          <button onClick={() => navigate('/profile')} className="text-sm text-muted hover:text-white transition">Profile</button>
          <button onClick={handleSignOut} className="text-sm px-3 py-1.5 rounded-lg border border-subtle text-muted hover:text-white hover:border-[#EF4444] transition">
            Sign Out
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <h1 className="text-3xl font-bold mb-1">Good evening, {userName} 👋</h1>
          <p className="text-muted">Here's your charging overview for today.</p>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Sessions This Month', value: '0', icon: '⚡' },
            { label: 'kWh Charged', value: '0.0', icon: '🔋' },
            { label: 'Total Spent', value: '₹0', icon: '💳' },
            { label: 'Saved vs Petrol', value: '₹0', icon: '📈' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="glass rounded-2xl border border-subtle p-5"
            >
              <div className="text-2xl mb-2">{stat.icon}</div>
              <p className="text-2xl font-bold text-brand">{stat.value}</p>
              <p className="text-muted text-xs mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-2xl border border-subtle p-6 hover:border-[#10B981] transition-colors cursor-pointer group"
            onClick={() => navigate('/map')}
          >
            <div className="text-3xl mb-4">🗺️</div>
            <h3 className="font-semibold text-lg mb-2 group-hover:text-brand transition-colors">Find a Charger</h3>
            <p className="text-muted text-sm">Open the live map and find available charging stations near you right now.</p>
            <span className="mt-4 inline-block text-brand text-sm font-medium">Open Map →</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="glass rounded-2xl border border-subtle p-6 hover:border-[#3B82F6] transition-colors cursor-pointer group"
            onClick={() => navigate('/profile')}
          >
            <div className="text-3xl mb-4">🚗</div>
            <h3 className="font-semibold text-lg mb-2 group-hover:text-[#3B82F6] transition-colors">Add Your Vehicle</h3>
            <p className="text-muted text-sm">Tell us your EV model so we can filter chargers by compatibility automatically.</p>
            <span className="mt-4 inline-block text-[#3B82F6] text-sm font-medium">Set Up Vehicle →</span>
          </motion.div>
        </div>

        {/* Recent Activity Placeholder */}
        <div className="mt-10 glass rounded-2xl border border-subtle p-6">
          <h2 className="font-semibold text-lg mb-4">Recent Sessions</h2>
          <div className="flex flex-col items-center py-10 text-center">
            <div className="text-5xl mb-4">🔌</div>
            <p className="text-white font-medium mb-1">No sessions yet</p>
            <p className="text-muted text-sm">Your first charging session will appear here.</p>
            <button
              onClick={() => navigate('/map')}
              className="mt-5 px-5 py-2.5 rounded-xl gradient-brand text-white text-sm font-medium hover:opacity-90 transition"
            >
              Find a Charger →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
