import { PAPER_OPTIONS } from '../../lib/letterModel.js'

export default function PaperPicker({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {PAPER_OPTIONS.map((paper) => (
        <button
          key={paper.id}
          type="button"
          title={paper.label}
          onClick={() => onChange(paper.id)}
          className={`h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 ${
            value === paper.id ? 'border-ink' : 'border-ink/15'
          }`}
          style={{ background: paper.swatch }}
        />
      ))}
    </div>
  )
}
