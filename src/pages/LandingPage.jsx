import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

// Feature cards data
const features = [
  {
    icon: '🗺️',
    title: 'Live Charger Map',
    desc: 'See every EV station near you with real-time availability — green means go.',
  },
  {
    icon: '⚡',
    title: 'Smart Compatibility',
    desc: 'Add your vehicle once. Only compatible chargers appear on your map.',
  },
  {
    icon: '📅',
    title: '15-Min Slot Hold',
    desc: 'Reserve a charging slot while you drive to the station. No more wasted trips.',
  },
  {
    icon: '📊',
    title: 'Charging Dashboard',
    desc: 'Track your sessions, costs, and kWh delivered. See your savings vs. petrol.',
  },
]

// Stat highlights
const stats = [
  { value: '2,400+', label: 'Charging Stations' },
  { value: '18 Cities', label: 'Across India' },
  { value: '₹0', label: 'To Get Started' },
]

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
  }),
}

export default function LandingPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  function handleCTA() {
    navigate(isAuthenticated ? '/dashboard' : '/auth')
  }

  return (
    <div className="min-h-screen bg-primary text-white overflow-x-hidden">

      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-subtle">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center text-sm font-bold">
              ⚡
            </div>
            <span className="text-lg font-bold">ChargeFlow</span>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 rounded-lg gradient-brand text-white text-sm font-medium hover:opacity-90 transition"
              >
                Open Dashboard →
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/auth')}
                  className="text-muted text-sm hover:text-white transition"
                >
                  Log In
                </button>
                <button
                  onClick={() => navigate('/auth')}
                  className="px-4 py-2 rounded-lg gradient-brand text-white text-sm font-medium hover:opacity-90 transition"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-20 px-6 text-center overflow-hidden">
        {/* Background glows */}
        <div className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-[#10B981] opacity-[0.07] blur-[120px] pointer-events-none" />
        <div className="absolute top-[40%] right-[-10%] w-[400px] h-[400px] rounded-full bg-[#3B82F6] opacity-[0.05] blur-[100px] pointer-events-none" />

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-subtle text-xs text-muted mb-6"
        >
          <span className="w-2 h-2 rounded-full bg-[#10B981] pulse-green" />
          Real-time availability across 18 Indian cities
        </motion.div>

        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
          className="text-5xl md:text-6xl font-extrabold leading-tight mb-5 max-w-3xl mx-auto"
        >
          Find your next charge.{' '}
          <span className="text-transparent bg-clip-text gradient-brand">
            Instantly.
          </span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
          className="text-[#94A3B8] text-lg max-w-xl mx-auto mb-10 leading-relaxed"
        >
          ChargeFlow shows you exactly which EV chargers near you are free, 
          compatible with your car, and available to reserve — all in real time.
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
          className="flex items-center justify-center gap-4 flex-wrap"
        >
          <button
            id="hero-cta"
            onClick={handleCTA}
            className="px-8 py-3.5 rounded-xl gradient-brand text-white font-semibold text-sm hover:opacity-90 active:scale-[0.98] transition-all glow-brand"
          >
            {isAuthenticated ? 'Open Dashboard →' : 'Start for Free →'}
          </button>
          <button
            onClick={() => navigate('/map')}
            className="px-8 py-3.5 rounded-xl glass border border-subtle text-white font-medium text-sm hover:bg-surface transition-all"
          >
            Explore the Map
          </button>
        </motion.div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="pb-16 px-6">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-3xl mx-auto glass rounded-2xl border border-subtle p-6 grid grid-cols-3 gap-4 text-center"
        >
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-2xl font-bold text-brand">{s.value}</p>
              <p className="text-muted text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── Features ── */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-3">Everything you need. Nothing you don't.</h2>
            <p className="text-muted max-w-xl mx-auto">
              Built for real EV drivers — not just a map, but a complete charging intelligence platform.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="glass rounded-2xl border border-subtle p-6 hover:border-[#10B981] transition-colors group"
              >
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-semibold text-white mb-2 group-hover:text-brand transition-colors">
                  {f.title}
                </h3>
                <p className="text-muted text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-20 px-6">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-3xl mx-auto relative rounded-3xl overflow-hidden"
        >
          <div className="absolute inset-0 gradient-brand opacity-90" />
          <div className="relative z-10 px-10 py-16 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Never get stranded again.
            </h2>
            <p className="text-green-100 mb-8 max-w-md mx-auto">
              Join ChargeFlow today. Real-time availability, smart compatibility filtering, and slot reservations — free to use.
            </p>
            <button
              onClick={handleCTA}
              className="px-8 py-3.5 rounded-xl bg-white text-[#065F46] font-bold text-sm hover:bg-green-50 active:scale-[0.98] transition-all"
            >
              {isAuthenticated ? 'Go to Dashboard →' : 'Create Free Account →'}
            </button>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-subtle py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">⚡</span>
            <span className="font-bold text-sm">ChargeFlow</span>
          </div>
          <p className="text-muted text-xs">
            Built for React End-Term 2029 · Made with ⚡ and React
          </p>
        </div>
      </footer>
    </div>
  )
}
