import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore.js'
import { useLettersStore } from '../../store/lettersStore.js'

export default function RequireAuth({ children }) {
  const location = useLocation()
  const authReady = useAuthStore((s) => s.authReady)
  const user = useAuthStore((s) => s.user)
  const loaded = useLettersStore((s) => s.loaded)
  const fetchError = useLettersStore((s) => s.fetchError)
  const fetchLetters = useLettersStore((s) => s.fetchLetters)

  // Firebase reports the session asynchronously on first load - wait for
  // it so a logged-in user refreshing the page doesn't get bounced to
  // /login before their session is restored.
  if (!authReady) {
    return (
      <div className="grid min-h-screen place-items-center bg-cream">
        <p className="font-[var(--font-hand)] text-2xl text-pink-deep">Loading…</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (!loaded) {
    return (
      <div className="grid min-h-screen place-items-center bg-cream">
        <p className="font-[var(--font-hand)] text-2xl text-pink-deep">
          Fetching your letters…
        </p>
      </div>
    )
  }

  if (fetchError) {
    return (
      <div className="grid min-h-screen place-items-center bg-cream px-6 text-center">
        <div>
          <p className="font-[var(--font-display)] text-xl text-ink">
            Couldn't reach your letters.
          </p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-ink-soft">{fetchError}</p>
          <button
            type="button"
            onClick={() => fetchLetters()}
            className="mt-5 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-cream"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  return children
}
