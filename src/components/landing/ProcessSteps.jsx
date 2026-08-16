const steps = [
  {
    label: 'Write',
    emoji: '🖋️',
    copy: 'Start with a blank sheet of stationery and put your words down.',
  },
  {
    label: 'Decorate',
    emoji: '🌸',
    copy: 'Add stickers, tape, and photos until the page feels like you.',
  },
  {
    label: 'Send',
    emoji: '💌',
    copy: 'Address it to someone you care about and drop it in the post.',
  },
  {
    label: 'Treasure',
    emoji: '🕊️',
    copy: 'They open it slowly, and keep it long after the moment passes.',
  },
]

export default function ProcessSteps() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20 md:px-10">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => (
          <div key={step.label} className="relative">
            <div className="paper-grain deckle-edge rounded-2xl bg-cream-deep/70 p-6 shadow-[0_10px_24px_rgba(73,60,52,0.08)] transition-transform hover:-translate-y-1">
              <div className="mb-3 text-3xl">{step.emoji}</div>
              <h3 className="mb-1 font-[var(--font-display)] text-lg text-ink">
                {step.label}
              </h3>
              <p className="text-sm leading-relaxed text-ink-soft">{step.copy}</p>
            </div>
            {i < steps.length - 1 && (
              <span
                aria-hidden
                className="absolute -right-4 top-1/2 hidden -translate-y-1/2 font-[var(--font-hand)] text-2xl text-ink-soft/60 lg:block"
              >
                →
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
