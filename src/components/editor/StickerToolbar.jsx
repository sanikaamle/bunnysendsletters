import { useState } from 'react'
import { STICKER_CATEGORIES } from '../../lib/letterModel.js'
import { STICKER_LIBRARY, STICKER_CATEGORY_LABELS } from './stickerLibrary.js'

export default function StickerToolbar({ onAddSticker }) {
  const [activeCategory, setActiveCategory] = useState(STICKER_CATEGORIES[0])
  const stickers = STICKER_LIBRARY[activeCategory] || []

  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        {STICKER_CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              activeCategory === cat
                ? 'bg-ink text-cream'
                : 'bg-cream-deep text-ink-soft hover:bg-pink/40'
            }`}
          >
            {STICKER_CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-4 gap-2">
        {stickers.map((sticker) => (
          <button
            key={sticker.id}
            type="button"
            title={sticker.label}
            onClick={() => onAddSticker(sticker, activeCategory)}
            className="flex aspect-square items-center justify-center rounded-xl bg-cream-deep/60 p-2 transition-transform hover:-translate-y-0.5 hover:bg-pink/30"
          >
            <img src={sticker.url} alt={sticker.label} className="h-full w-full" />
          </button>
        ))}
        {stickers.length === 0 && (
          <p className="col-span-4 text-xs text-ink-soft">No stickers in this category yet.</p>
        )}
      </div>
    </div>
  )
}
