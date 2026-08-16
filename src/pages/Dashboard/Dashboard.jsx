import { Link, useNavigate } from 'react-router-dom'
import { Inbox, Send, FileEdit, Heart } from 'lucide-react'
import Navbar from '../../components/layout/Navbar.jsx'
import LetterCard from '../../components/ui/LetterCard.jsx'
import { useLettersStore } from '../../store/lettersStore.js'
import { useAuthStore } from '../../store/authStore.js'

const sections = [
  { key: 'inbox', label: 'Inbox', icon: Inbox, color: 'bg-powder/60' },
  { key: 'sent', label: 'Sent Letters', icon: Send, color: 'bg-pink/50' },
  { key: 'drafts', label: 'Drafts', icon: FileEdit, color: 'bg-butter/50' },
  { key: 'favorites', label: 'Favorites', icon: Heart, color: 'bg-lavender/60' },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const letters = useLettersStore((s) => s.letters)
  const createDraft = useLettersStore((s) => s.createDraft)

  // Derive everything from the one stable `letters` array instead of
  // calling store methods like s.inbox() as selectors - those build a
  // brand new array every call, which makes React think the store
  // changed on every render and loops forever.
  const counts = {
    inbox: letters.filter((l) => l.status === 'received').length,
    sent: letters.filter((l) => l.status === 'sent').length,
    drafts: letters.filter((l) => l.status === 'draft').length,
    favorites: letters.filter((l) => l.favorite).length,
  }

  const recent = [...letters]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4)

  const greeting = (() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  })()

  async function handleWriteNew() {
    const id = await createDraft()
    navigate(`/editor/${id}`)
  }

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      <main className="mx-auto max-w-6xl px-6 py-12 md:px-10">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="font-[var(--font-hand)] text-2xl text-pink-deep">
              {greeting}, {user?.name || 'there'} 🌷
            </p>
            <h1 className="mt-1 font-[var(--font-display)] text-3xl text-ink">
              Your letterbox
            </h1>
          </div>
          <button
            type="button"
            onClick={handleWriteNew}
            className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-cream shadow-[0_6px_18px_rgba(73,60,52,0.28)] transition-transform hover:-translate-y-0.5"
          >
            Write a new letter 💌
          </button>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {sections.map(({ key, label, icon: Icon, color }) => (
            <Link
              key={key}
              to="/letters"
              state={{ tab: key }}
              className={`deckle-edge rounded-2xl p-5 shadow-[0_8px_18px_rgba(73,60,52,0.08)] transition-transform hover:-translate-y-1 ${color}`}
            >
              <Icon size={22} className="text-ink" />
              <p className="mt-3 font-[var(--font-display)] text-lg text-ink">{label}</p>
              <p className="text-sm text-ink-soft">{counts[key]} letters</p>
            </Link>
          ))}
        </div>

        <div className="mt-14">
          <h2 className="mb-5 font-[var(--font-display)] text-2xl text-ink">
            Recently on your desk
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {recent.map((letter) => (
              <LetterCard key={letter.id} letter={letter} />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
