import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock } from 'lucide-react'

function formatUnlockDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function EnvelopeGate({ letter, onOpened }) {
  const [opening, setOpening] = useState(false)

  const isLocked =
    letter.scheduledFor && new Date(letter.scheduledFor).getTime() > Date.now()

  function handleOpen() {
    setOpening(true)
    // let the flap-lift animation play before revealing the letter
    setTimeout(() => onOpened(), 900)
  }

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      {letter.openWhenLabel && (
        <p className="mb-6 font-[var(--font-hand)] text-2xl text-pink-deep">
          {letter.openWhenLabel}
        </p>
      )}

      <div className="relative h-56 w-80 max-w-full">
        {/* envelope body */}
        <svg viewBox="0 0 320 220" className="absolute inset-0 h-full w-full drop-shadow-[0_20px_36px_rgba(73,60,52,0.25)]">
          <rect x="4" y="4" width="312" height="212" rx="12" fill="#F3C9D4" />
          <path d="M8 30 L160 150 L312 30" fill="none" stroke="#E9A9BA" strokeWidth="4" />
        </svg>

        {/* animated flap */}
        <AnimatePresence>
          {!opening ? (
            <motion.svg
              viewBox="0 0 320 140"
              className="absolute left-0 top-0 h-[70%] w-full origin-top"
              initial={{ rotateX: 0 }}
              animate={{ rotateX: 0 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <path d="M4 6 L160 118 L316 6 Z" fill="#E9A9BA" stroke="#DE93A8" strokeWidth="2" />
            </motion.svg>
          ) : (
            <motion.svg
              viewBox="0 0 320 140"
              className="absolute left-0 top-0 h-[70%] w-full origin-top"
              initial={{ rotateX: 0 }}
              animate={{ rotateX: -170 }}
              transition={{ duration: 0.7, ease: 'easeInOut' }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <path d="M4 6 L160 118 L316 6 Z" fill="#E9A9BA" stroke="#DE93A8" strokeWidth="2" />
            </motion.svg>
          )}
        </AnimatePresence>

        {/* wax seal */}
        {!opening && (
          <div className="absolute left-1/2 top-[38%] grid h-11 w-11 -translate-x-1/2 place-items-center rounded-full bg-[#E9A9BA] shadow-md">
            <span className="text-lg">💌</span>
          </div>
        )}

        {isLocked && (
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-ink px-3 py-1 text-xs text-cream shadow">
            <Lock size={11} className="mr-1 inline" />
            Unlocks {formatUnlockDate(letter.scheduledFor)}
          </div>
        )}
      </div>

      <h2 className="mt-8 font-[var(--font-display)] text-2xl text-ink">
        You've received a letter 💌
      </h2>
      <p className="mt-1 text-ink-soft">From {letter.sender}</p>

      {isLocked ? (
        <p className="mt-6 max-w-xs text-sm text-ink-soft">
          This one's tucked away until the right moment. Come back on{' '}
          {formatUnlockDate(letter.scheduledFor)} to open it.
        </p>
      ) : (
        <button
          type="button"
          onClick={handleOpen}
          disabled={opening}
          className="mt-8 rounded-full bg-ink px-7 py-3 text-sm font-medium text-cream shadow-[0_6px_18px_rgba(73,60,52,0.28)] transition-transform hover:-translate-y-0.5 disabled:opacity-60"
        >
          {opening ? 'Opening…' : 'Open Letter'}
        </button>
      )}
    </div>
  )
}
