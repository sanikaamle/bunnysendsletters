import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore.js'

export default function Navbar() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  const links = user
    ? [
        { to: '/', label: 'Home' },
        { to: '/dashboard', label: 'Dashboard' },
        { to: '/letters', label: 'My Letters' },
      ]
    : [
        { to: '/', label: 'Home' },
        { to: '/login', label: 'Login' },
      ]

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <header className="border-b border-ink/10 bg-cream/90">
      <div className="mx-auto flex max-w-6xl flex-col px-5 py-5 sm:px-6 md:flex-row md:items-center md:justify-between md:py-6">

        {/* Logo + Name */}
        <Link
          to="/"
          className="flex min-w-0 items-center gap-3"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pink-100 text-xl">
            💌
          </span>

          <span className="truncate text-2xl font-medium text-ink sm:text-3xl">
            BunnySendsYouLetters
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-[15px] transition-colors hover:text-ink ${
                  isActive
                    ? 'font-semibold text-ink'
                    : 'text-ink-soft'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}

          {user && (
            <button
              type="button"
              onClick={handleLogout}
              className="text-[15px] text-ink-soft transition-colors hover:text-ink"
            >
              Log out
            </button>
          )}
        </nav>

        {/* Right side */}
        <div className="mt-4 flex w-full items-center justify-center gap-4 md:mt-0 md:w-auto md:justify-end">

          {user && (
            <span className="hidden text-sm text-ink-soft sm:inline">
              Hi, {user.name.split(' ')[0]}
            </span>
          )}

          <Link
            to="/editor"
            className="rounded-full bg-ink px-6 py-3 text-center text-sm font-medium text-cream shadow-[0_4px_14px_rgba(73,60,52,0.25)] transition-transform hover:-translate-y-0.5 active:translate-y-0"
          >
            Write a Letter <span aria-hidden>💌</span>
          </Link>

        </div>
      </div>
    </header>
  )
}