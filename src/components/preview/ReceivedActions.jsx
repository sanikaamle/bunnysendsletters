import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Send } from 'lucide-react'
import { useLettersStore } from '../../store/lettersStore.js'

export default function ReceivedActions({ letter }) {
  const navigate = useNavigate()
  const toggleFavorite = useLettersStore((s) => s.toggleFavorite)
  const createDraft = useLettersStore((s) => s.createDraft)
  const saveDraft = useLettersStore((s) => s.saveDraft)
  const [reactBurst, setReactBurst] = useState(0)
  const [replying, setReplying] = useState(false)

  function handleReact() {
    setReactBurst((n) => n + 1)
    setTimeout(() => setReactBurst((n) => Math.max(0, n - 1)), 700)
  }

  async function handleReply() {
    setReplying(true)
    try {
      const id = await createDraft()
      await saveDraft(id, {
        title: `Re: ${letter.title || 'your letter'}`,
        recipientEmail: letter.senderEmail || '',
      })
      navigate(`/editor/${id}`)
    } finally {
      setReplying(false)
    }
  }

  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
      <button
        type="button"
        onClick={() => toggleFavorite(letter.id)}
        className="flex items-center gap-2 rounded-full border border-ink/15 px-5 py-2.5 text-sm font-medium text-ink hover:bg-cream-deep"
      >
        <Heart size={16} className={letter.favorite ? 'fill-pink-deep text-pink-deep' : ''} />
        {letter.favorite ? 'Favorited' : 'Favorite'}
      </button>

      <div className="relative">
        <button
          type="button"
          onClick={handleReact}
          className="flex items-center gap-2 rounded-full border border-ink/15 px-5 py-2.5 text-sm font-medium text-ink hover:bg-cream-deep"
        >
          🤍 React
        </button>
        <AnimatePresence>
          {reactBurst > 0 && (
            <motion.span
              key={reactBurst}
              initial={{ opacity: 1, y: 0, scale: 0.6 }}
              animate={{ opacity: 0, y: -34, scale: 1.3 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 text-xl"
            >
              💗
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <button
        type="button"
        onClick={handleReply}
        disabled={replying}
        className="flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-cream shadow-[0_6px_18px_rgba(73,60,52,0.28)] transition-transform hover:-translate-y-0.5 disabled:opacity-60"
      >
        <Send size={15} /> {replying ? 'Preparing…' : 'Send a letter back'}
      </button>
    </div>
  )
}
