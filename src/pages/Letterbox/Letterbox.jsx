import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar.jsx'
import LetterCard from '../../components/ui/LetterCard.jsx'
import { useLettersStore } from '../../store/lettersStore.js'

const TABS = [
  { key: 'inbox', label: 'Inbox' },
  { key: 'sent', label: 'Sent' },
  { key: 'drafts', label: 'Drafts' },
  { key: 'favorites', label: 'Favorites' },
]

export default function Letterbox() {
  const location = useLocation()
  const [activeTab, setActiveTab] = useState(location.state?.tab || 'inbox')

  const letters = useLettersStore((s) => s.letters)

  const lettersByTab = {
    inbox: letters.filter((l) => l.status === 'received'),
    sent: letters.filter((l) => l.status === 'sent'),
    drafts: letters.filter((l) => l.status === 'draft'),
    favorites: letters.filter((l) => l.favorite),
  }
  const activeLetters = lettersByTab[activeTab]

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      <main className="mx-auto max-w-6xl px-6 py-12 md:px-10">
        <h1 className="font-[var(--font-display)] text-3xl text-ink">My Letters</h1>

        <div className="mt-6 flex gap-2 border-b border-ink/10">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`relative px-4 py-3 text-sm font-medium transition-colors ${activeTab === tab.key ? 'text-ink' : 'text-ink-soft hover:text-ink'
                }`}
            >
              {tab.label}
              <span className="ml-2 text-xs text-ink-soft/70">
                {lettersByTab[tab.key].length}
              </span>
              {activeTab === tab.key && (
                <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-pink-deep" />
              )}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {activeLetters.length === 0 ? (
            <p className="rounded-2xl bg-cream-deep/60 p-8 text-center text-ink-soft">
              Nothing here yet — this space is waiting for its first letter.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {activeLetters.map((letter) => (
                <LetterCard key={letter.id} letter={letter} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}