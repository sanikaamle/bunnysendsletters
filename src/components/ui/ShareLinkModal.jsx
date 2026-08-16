import { useState } from 'react'
import { Copy, Check, X } from 'lucide-react'

export default function ShareLinkModal({ url, onClose }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API can fail (permissions, insecure context) - the
      // input is still selectable/copyable by hand as a fallback.
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/40 px-6 backdrop-blur-sm">
      <div className="deckle-edge paper-grain relative w-full max-w-md rounded-2xl bg-cream p-8 shadow-[0_25px_60px_rgba(73,60,52,0.3)]">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-ink-soft hover:bg-cream-deep"
        >
          <X size={18} />
        </button>

        <p className="text-4xl">💌</p>
        <h2 className="mt-3 font-[var(--font-display)] text-2xl text-ink">Your letter is ready</h2>
        <p className="mt-2 text-sm text-ink-soft">
          Copy this link and send it however you like — text, email, DM.
          Opening it plays the same envelope reveal.
        </p>

        <div className="mt-5 flex items-center gap-2 rounded-xl border border-ink/15 bg-white/60 p-2">
          <input
            readOnly
            value={url}
            onFocus={(e) => e.target.select()}
            className="flex-1 truncate bg-transparent px-2 py-1.5 text-sm text-ink outline-none"
          />
          <button
            type="button"
            onClick={handleCopy}
            className="flex shrink-0 items-center gap-1.5 rounded-lg bg-ink px-3 py-1.5 text-xs font-medium text-cream"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-full border border-ink/15 px-6 py-3 text-sm font-medium text-ink hover:bg-cream-deep"
        >
          Done
        </button>
      </div>
    </div>
  )
}
