import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

export default function AuthPage() {
  const [tab, setTab] = useState('login') // 'login' | 'signup'
  const [formData, setFormData] = useState({ email: '', password: '', fullName: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Redirect to the page the user tried to visit, or dashboard
  const from = location.state?.from?.pathname || '/dashboard'

  function handleChange(e) {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (tab === 'login') {
      const { error } = await signIn(formData.email, formData.password)
      if (error) {
        setError(error.message)
      } else {
        navigate(from, { replace: true })
      }
    } else {
      if (!formData.fullName.trim()) {
        setError('Please enter your full name.')
        setLoading(false)
        return
      }
      const { error } = await signUp(formData.email, formData.password, formData.fullName)
      if (error) {
        setError(error.message)
      } else {
        setSuccessMsg('Account created! Check your email to verify, then log in.')
        setTab('login')
        setFormData({ email: formData.email, password: '', fullName: '' })
      }
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#10B981] opacity-[0.05] blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#3B82F6] opacity-[0.05] blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center text-white font-bold text-lg">
            ⚡
          </div>
          <span className="text-2xl font-bold text-white">ChargeFlow</span>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-8">
          {/* Tab switcher */}
          <div className="flex bg-[#0F172A] rounded-xl p-1 mb-8">
            {['login', 'signup'].map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(''); setSuccessMsg('') }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  tab === t
                    ? 'bg-[#10B981] text-white shadow'
                    : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                {t === 'login' ? 'Log In' : 'Sign Up'}
              </button>
            ))}
          </div>

          {/* Title */}
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, x: tab === 'login' ? -10 : 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <h1 className="text-xl font-semibold text-white mb-1">
                {tab === 'login' ? 'Welcome back' : 'Create your account'}
              </h1>
              <p className="text-muted text-sm mb-6">
                {tab === 'login'
                  ? 'Sign in to access your charging dashboard.'
                  : 'Join ChargeFlow and find EV chargers in seconds.'}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Success message */}
          {successMsg && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-[#065F46] border border-[#10B981] text-[#6EE7B7] text-sm">
              ✓ {successMsg}
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-[#450A0A] border border-[#EF4444] text-[#FCA5A5] text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Full Name (signup only) */}
            {tab === 'signup' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label className="block text-sm text-muted mb-1.5" htmlFor="fullName">
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Atharva Joshi"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-[#0F172A] border border-[#334155] text-white placeholder-[#475569] focus:outline-none focus:border-[#10B981] transition-colors text-sm"
                  required={tab === 'signup'}
                />
              </motion.div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm text-muted mb-1.5" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-[#0F172A] border border-[#334155] text-white placeholder-[#475569] focus:outline-none focus:border-[#10B981] transition-colors text-sm"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-muted mb-1.5" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-[#0F172A] border border-[#334155] text-white placeholder-[#475569] focus:outline-none focus:border-[#10B981] transition-colors text-sm"
                required
                minLength={6}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full py-3 rounded-xl gradient-brand text-white font-semibold text-sm transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  {tab === 'login' ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                tab === 'login' ? 'Sign In →' : 'Create Account →'
              )}
            </button>
          </form>

          {/* Footer link */}
          <p className="text-center text-muted text-sm mt-6">
            {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => { setTab(tab === 'login' ? 'signup' : 'login'); setError('') }}
              className="text-[#10B981] hover:underline font-medium"
            >
              {tab === 'login' ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </div>

        {/* Back to home */}
        <p className="text-center mt-6">
          <a href="/" className="text-muted text-sm hover:text-white transition-colors">
            ← Back to home
          </a>
        </p>
      </motion.div>
    </div>
  )
}
