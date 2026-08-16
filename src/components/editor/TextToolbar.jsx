import { Bold, Italic, AlignLeft, AlignCenter, AlignRight } from 'lucide-react'
import { FONT_OPTIONS } from '../../lib/letterModel.js'

export default function TextToolbar({ textStyle, onChange }) {
  function patch(p) {
    onChange({ ...textStyle, ...p })
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        value={textStyle.fontFamily}
        onChange={(e) => patch({ fontFamily: e.target.value })}
        className="rounded-lg border border-ink/15 bg-cream px-2 py-1.5 text-sm text-ink"
      >
        {FONT_OPTIONS.map((f) => (
          <option key={f.id} value={f.family}>
            {f.label}
          </option>
        ))}
      </select>

      <input
        type="number"
        min={10}
        max={48}
        value={textStyle.fontSize}
        onChange={(e) => patch({ fontSize: Number(e.target.value) })}
        className="w-16 rounded-lg border border-ink/15 bg-cream px-2 py-1.5 text-sm text-ink"
      />

      <div className="flex items-center gap-1 rounded-lg border border-ink/15 p-1">
        <button
          type="button"
          onClick={() => patch({ bold: !textStyle.bold })}
          className={`rounded p-1.5 ${textStyle.bold ? 'bg-ink text-cream' : 'text-ink-soft hover:bg-cream-deep'}`}
        >
          <Bold size={15} />
        </button>
        <button
          type="button"
          onClick={() => patch({ italic: !textStyle.italic })}
          className={`rounded p-1.5 ${textStyle.italic ? 'bg-ink text-cream' : 'text-ink-soft hover:bg-cream-deep'}`}
        >
          <Italic size={15} />
        </button>
      </div>

      <input
        type="color"
        value={textStyle.color}
        onChange={(e) => patch({ color: e.target.value })}
        className="h-8 w-8 cursor-pointer rounded-lg border border-ink/15 bg-cream p-0.5"
      />

      <div className="flex items-center gap-1 rounded-lg border border-ink/15 p-1">
        {[
          { key: 'left', Icon: AlignLeft },
          { key: 'center', Icon: AlignCenter },
          { key: 'right', Icon: AlignRight },
        ].map(({ key, Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => patch({ align: key })}
            className={`rounded p-1.5 ${textStyle.align === key ? 'bg-ink text-cream' : 'text-ink-soft hover:bg-cream-deep'}`}
          >
            <Icon size={15} />
          </button>
        ))}
      </div>
    </div>
  )
}
