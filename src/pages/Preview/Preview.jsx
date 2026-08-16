import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar.jsx'
import EnvelopeGate from '../../components/preview/EnvelopeGate.jsx'
import ReceivedActions from '../../components/preview/ReceivedActions.jsx'
import ShareLinkModal from '../../components/ui/ShareLinkModal.jsx'
import { useLettersStore } from '../../store/lettersStore.js'
import { paperStyle } from '../../lib/paperStyles.js'

function LetterSheet({ letter }) {
  const allDecorations = [...letter.decorations, ...letter.images]
  return (
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
  )
}

export default function Preview() {
  const { letterId } = useParams()
  const navigate = useNavigate()
  const letter = useLettersStore((s) => s.getLetter(letterId))
  const fetchLetterById = useLettersStore((s) => s.fetchLetterById)
  const sendLetter = useLettersStore((s) => s.sendLetter)
  const markOpened = useLettersStore((s) => s.markOpened)
  const [justOpened, setJustOpened] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const [shareUrl, setShareUrl] = useState(null)

  // The letter might not be in the local "mine + received" list yet
  // (e.g. someone opened a share link for a letter that isn't matched
  // to their account) - fall back to a direct fetch by id.
  useEffect(() => {
    if (!letter) {
      fetchLetterById(letterId).then((found) => {
        if (!found) setNotFound(true)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [letterId, letter])

  if (!letter) {
    return (
      <div className="min-h-screen bg-cream">
        <Navbar />
        <p className="p-10 text-ink-soft">
          {notFound ? "This letter couldn't be found." : 'Loading…'}
        </p>
      </div>
    )
  }

  async function handleSend() {
    try {
      const { shareUrl } = await sendLetter(letterId, letter)
      setShareUrl(shareUrl)
    } catch (err) {
      alert(err.message)
    }
  }

  // Received + not yet opened -> envelope gate first.
  if (letter.status === 'received' && !letter.opened && !justOpened) {
    return (
      <div className="min-h-screen bg-cream">
        <Navbar />
        <EnvelopeGate
          letter={letter}
          onOpened={() => {
            markOpened(letterId)
            setJustOpened(true)
          }}
        />
      </div>
    )
  }

  // Received + opened -> full letter with react/favorite/reply.
  if (letter.status === 'received') {
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
          <LetterSheet letter={letter} />
          <ReceivedActions letter={letter} />
        </main>
      </div>
    )
  }

  // Sender's own pre-send preview (drafts) or a plain look back at a sent letter.
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-10 md:px-8">
        {letter.title && (
          <h1 className="mb-4 text-center font-[var(--font-display)] text-2xl text-ink">
            {letter.title}
          </h1>
        )}
        <LetterSheet letter={letter} />

        {letter.status === 'draft' && (
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate(`/editor/${letterId}`)}
              className="rounded-full border border-ink/15 px-6 py-3 text-sm font-medium text-ink hover:bg-cream-deep"
            >
              Back to Edit
            </button>
            <button
              type="button"
              onClick={handleSend}
              className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-cream shadow-[0_6px_18px_rgba(73,60,52,0.28)] transition-transform hover:-translate-y-0.5"
            >
              Send Letter 💌
            </button>
          </div>
        )}
      </main>

      {shareUrl && (
        <ShareLinkModal
          url={shareUrl}
          onClose={() => {
            setShareUrl(null)
            navigate('/letters')
          }}
        />
      )}
    </div>
  )
}
