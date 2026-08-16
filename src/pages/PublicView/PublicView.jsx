import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar.jsx'
import EnvelopeGate from '../../components/preview/EnvelopeGate.jsx'
import { fetchPublicLetter, openPublicLetter } from '../../store/lettersStore.js'
import { paperStyle } from '../../lib/paperStyles.js'

// Public, no-login-required view for the copied share link.
export default function PublicView() {
  const { letterId } = useParams()
  const [letter, setLetter] = useState(null)
  const [error, setError] = useState(null)
  const [justOpened, setJustOpened] = useState(false)

  useEffect(() => {
    fetchPublicLetter(letterId)
      .then((found) => {
        if (found) setLetter(found)
        else setError('not-found')
      })
      .catch((err) => setError(err.message))
  }, [letterId])

  if (error) {
    return (
      <div className="min-h-screen bg-cream">
        <Navbar />
        <p className="p-10 text-center text-ink-soft">
          This letter link doesn't seem to be valid anymore.
        </p>
      </div>
    )
  }

  if (!letter) {
    return (
      <div className="min-h-screen bg-cream">
        <Navbar />
        <p className="p-10 text-center text-ink-soft">Loading your letter…</p>
      </div>
    )
  }

  if (!letter.opened && !justOpened) {
    return (
      <div className="min-h-screen bg-cream">
        <Navbar />
        <EnvelopeGate
          letter={letter}
          onOpened={async () => {
            const updated = await openPublicLetter(letterId)
            setLetter(updated)
            setJustOpened(true)
          }}
        />
      </div>
    )
  }

  const allDecorations = [...letter.decorations, ...letter.images]

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-10 md:px-8">
        <p className="mb-2 text-center text-sm text-ink-soft">From {letter.sender}</p>
        {letter.title && (
          <h1 className="mb-4 text-center font-[var(--font-display)] text-2xl text-ink">
            {letter.title}
          </h1>
        )}
        <div
          className="deckle-edge paper-grain relative mx-auto min-h-[560px] w-full overflow-hidden rounded-lg p-10 shadow-[0_25px_55px_rgba(73,60,52,0.22)]"
          style={paperStyle(letter.background)}
        >
          <p
            className="whitespace-pre-wrap"
            style={{
              fontFamily: letter.textStyle.fontFamily,
              fontSize: letter.textStyle.fontSize,
              fontWeight: letter.textStyle.bold ? 700 : 400,
              fontStyle: letter.textStyle.italic ? 'italic' : 'normal',
              color: letter.textStyle.color,
              textAlign: letter.textStyle.align,
            }}
          >
            {letter.content}
          </p>
          {allDecorations.map((item) => (
            <div
              key={item.id}
              className="absolute"
              style={{
                left: item.x,
                top: item.y,
                width: item.width,
                height: item.height,
                zIndex: item.layer,
                transform: `rotate(${item.rotation}deg)`,
              }}
            >
              <div
                className={
                  item.frame === 'polaroid'
                    ? 'h-full w-full bg-white p-2 pb-6 shadow-[0_8px_16px_rgba(73,60,52,0.25)]'
                    : 'h-full w-full'
                }
              >
                <img
                  src={item.assetUrl}
                  alt=""
                  className={`h-full w-full object-contain ${item.frame === 'rounded' ? 'rounded-xl' : ''}`}
                />
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-ink-soft">
          Want to write one back?{' '}
          <a href="/signup" className="font-medium text-ink underline">
            Create a free PetalPost account
          </a>
        </p>
      </main>
    </div>
  )
}
