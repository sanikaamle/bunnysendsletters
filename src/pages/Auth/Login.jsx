import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar.jsx'
import { useAuthStore } from '../../store/authStore.js'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const login = useAuthStore((s) => s.login)
  const status = useAuthStore((s) => s.status)
  const error = useAuthStore((s) => s.error)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    const ok = await login({ email, password })
    if (ok) {
      navigate(location.state?.from || '/dashboard', { replace: true })
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <main className="mx-auto flex max-w-md flex-col justify-center px-6 py-20">
        <p className="text-center font-[var(--font-hand)] text-2xl text-pink-deep">
          welcome back
        </p>
        <h1 className="mt-1 text-center font-[var(--font-display)] text-3xl text-ink">
          Log in
        </h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="mb-1 block text-sm text-ink-soft">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-ink/15 bg-white/60 px-4 py-3 text-sm text-ink"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-ink-soft">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-ink/15 bg-white/60 px-4 py-3 text-sm text-ink"
            />
          </div>

          {error && <p className="text-sm text-pink-deep">{error}</p>}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full rounded-full bg-ink px-6 py-3 text-sm font-medium text-cream shadow-[0_6px_18px_rgba(73,60,52,0.28)] disabled:opacity-60"
          >
            {status === 'loading' ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-soft">
          New here?{' '}
          <Link to="/signup" className="font-medium text-ink underline">
            Create an account
          </Link>
        </p>
      </main>
    </div>
  )
}