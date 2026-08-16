import { Link } from 'react-router-dom'
import { Heart, Trash2 } from 'lucide-react'
import { paperStyle } from '../../lib/paperStyles.js'
import { useLettersStore } from '../../store/lettersStore.js'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })
}

export default function LetterCard({ letter }) {
  const toggleFavorite = useLettersStore((s) => s.toggleFavorite)
  const deleteLetter = useLettersStore((s) => s.deleteLetter)
  const isDraft = letter.status === 'draft'
  const linkTo = isDraft ? `/editor/${letter.id}` : `/preview/${letter.id}`
  const personLabel =
    letter.status === 'received'
      ? `From ${letter.sender}`
      : letter.status === 'sent'
        ? 'Shared via link'
        : 'Draft'

  function handleDelete(e) {
    e.preventDefault()
    const label = letter.title || 'this draft'
    if (window.confirm(`Delete "${label}"? This can't be undone.`)) {
      deleteLetter(letter.id)
    }
  }

  return (
    <div className="group relative">
      <Link
        to={linkTo}
        className="deckle-edge paper-grain block rounded-2xl p-5 shadow-[0_10px_22px_rgba(73,60,52,0.1)] transition-transform hover:-translate-y-1"
        style={paperStyle(letter.background)}
      >
        {letter.openWhenLabel && (
          <span className="mb-2 inline-block rounded-full bg-ink/10 px-3 py-1 font-[var(--font-hand)] text-sm text-ink">
            {letter.openWhenLabel}
          </span>
        )}
        <h3 className="font-[var(--font-display)] text-lg text-ink">
          {letter.title || (isDraft ? 'Untitled draft' : 'A letter')}
        </h3>
        <p className="mt-1 text-xs uppercase tracking-wide text-ink-soft/80">
          {personLabel}
        </p>
        <p className="mt-3 line-clamp-2 text-sm text-ink-soft">
          {letter.status === 'received' && !letter.opened
            ? 'A letter is waiting for you inside 💌'
            : letter.content}
        </p>
        <p className="mt-4 text-xs text-ink-soft/70">{formatDate(letter.createdAt)}</p>
      </Link>

      <div className="absolute right-3 top-3 flex items-center gap-1.5">
        {isDraft && (
          <button
            type="button"
            onClick={handleDelete}
            aria-label="Delete draft"
            title="Delete draft"
            className="rounded-full bg-cream/70 p-1.5 backdrop-blur-sm transition-colors hover:bg-pink/60"
          >
            <Trash2 size={16} className="text-ink-soft" />
          </button>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            toggleFavorite(letter.id)
          }}
          aria-label={letter.favorite ? 'Remove from favorites' : 'Add to favorites'}
          className="rounded-full bg-cream/70 p-1.5 backdrop-blur-sm transition-colors hover:bg-cream"
        >
          <Heart
            size={16}
            className={letter.favorite ? 'fill-pink-deep text-pink-deep' : 'text-ink-soft'}
          />
        </button>
      </div>
    </div>
  )
}