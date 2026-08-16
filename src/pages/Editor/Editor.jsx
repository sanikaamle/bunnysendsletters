import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Undo2, Redo2, ImagePlus } from 'lucide-react'
import Navbar from '../../components/layout/Navbar.jsx'
import TextToolbar from '../../components/editor/TextToolbar.jsx'
import StickerToolbar from '../../components/editor/StickerToolbar.jsx'
import PaperPicker from '../../components/editor/PaperPicker.jsx'
import DraggableItem from '../../components/editor/DraggableItem.jsx'
import ShareLinkModal from '../../components/ui/ShareLinkModal.jsx'
import { useLettersStore } from '../../store/lettersStore.js'
import { createDecorationItem } from '../../lib/letterModel.js'
import { paperStyle } from '../../lib/paperStyles.js'
import { useHistoryState } from '../../lib/useHistoryState.js'
import { compressImageToDataUrl } from '../../lib/compressImage.js'

export default function Editor() {
  const { letterId } = useParams()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const getLetter = useLettersStore((s) => s.getLetter)
  const createDraft = useLettersStore((s) => s.createDraft)
  const saveDraft = useLettersStore((s) => s.saveDraft)
  const sendLetter = useLettersStore((s) => s.sendLetter)

  const [resolvedId, setResolvedId] = useState(letterId || null)
  const [selectedId, setSelectedId] = useState(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [sending, setSending] = useState(false)
  const [shareUrl, setShareUrl] = useState(null)

  const {
    state: letter,
    set: setLetter,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useHistoryState(letterId ? getLetter(letterId) : null)

  useEffect(() => {
    if (!letterId) {
      createDraft().then((newId) => {
        setResolvedId(newId)
        navigate(`/editor/${newId}`, { replace: true })
      })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [letterId])

  useEffect(() => {
    if (letterId) {
      setResolvedId(letterId)
      setLetter(getLetter(letterId))
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [letterId])

  if (!letter) {
    return (
      <div className="min-h-screen bg-cream">
        <Navbar />
        <p className="p-10 text-ink-soft">Loading your letter…</p>
      </div>
    )
  }

  function allDecorations() {
    return [...letter.decorations, ...letter.images]
  }

  function updateItem(updated) {
    setLetter((prev) => {
      const inDecorations = prev.decorations.some(
        (d) => d.id === updated.id
      )

      return inDecorations
        ? {
            ...prev,
            decorations: prev.decorations.map((d) =>
              d.id === updated.id ? updated : d
            ),
          }
        : {
            ...prev,
            images: prev.images.map((d) =>
              d.id === updated.id ? updated : d
            ),
          }
    })
  }

  function deleteItem(id) {
    setLetter((prev) => ({
      ...prev,
      decorations: prev.decorations.filter((d) => d.id !== id),
      images: prev.images.filter((d) => d.id !== id),
    }))

    setSelectedId(null)
  }

  function reorderLayer(id, direction) {
    setLetter((prev) => {
      const all = [...prev.decorations, ...prev.images]
      const layers = all.map((d) => d.layer)

      const targetLayer =
        direction === 'forward'
          ? Math.max(...layers, 0) + 1
          : Math.min(...layers, 0) - 1

      const apply = (list) =>
        list.map((d) =>
          d.id === id ? { ...d, layer: targetLayer } : d
        )

      return {
        ...prev,
        decorations: apply(prev.decorations),
        images: apply(prev.images),
      }
    })
  }

  function handleAddSticker(sticker, category) {
    const item = createDecorationItem({
      assetUrl: sticker.url,
      category,
      type: 'sticker',
    })

    item.x = 140 + Math.random() * 60
    item.y = 140 + Math.random() * 60

    setLetter((prev) => ({
      ...prev,
      decorations: [...prev.decorations, item],
    }))

    setSelectedId(item.id)
  }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0]

    if (!file) return

    e.target.value = ''

    const item = createDecorationItem({
      assetUrl: URL.createObjectURL(file),
      type: 'image',
    })

    item.width = 180
    item.height = 220
    item.x = 160
    item.y = 160
    
    setLetter((prev) => ({
      ...prev,
      images: [...prev.images, item],
    }))

    setSelectedId(item.id)

    // Swap the local preview for a compressed, savable version.
    // It has to travel inside the letter's Firestore document.
    setUploadingImage(true)

    try {
      const dataUrl = await compressImageToDataUrl(file)

      setLetter((prev) => ({
        ...prev,
        images: prev.images.map((img) =>
          img.id === item.id
            ? { ...img, assetUrl: dataUrl }
            : img
        ),
      }))
    } catch (err) {
      alert(err.message)

      setLetter((prev) => ({
        ...prev,
        images: prev.images.filter((img) => img.id !== item.id),
      }))
    } finally {
      setUploadingImage(false)
    }
  }

  async function handleSaveDraft() {
    await saveDraft(resolvedId, letter)
    navigate('/letters')
  }

  async function handlePreview() {
    await saveDraft(resolvedId, letter)
    navigate(`/preview/${resolvedId}`)
  }

  async function handleSend() {
    setSending(true)

    try {
      const { shareUrl } = await sendLetter(resolvedId, letter)
      setShareUrl(shareUrl)
    } catch (err) {
      alert(err.message)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <div className="mb-5 flex flex-col gap-3 rounded-2xl bg-cream-deep/50 p-4 md:flex-row md:items-center md:gap-6">
          <input
            type="text"
            placeholder="Letter title (optional)"
            value={letter.title}
            onChange={(e) =>
              setLetter((prev) => ({
                ...prev,
                title: e.target.value,
              }))
            }
            className="flex-1 rounded-lg border border-ink/15 bg-cream px-3 py-2 text-sm text-ink"
          />

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={!canUndo}
              onClick={undo}
              title="Undo"
              className="rounded-lg p-2 text-ink-soft hover:bg-cream disabled:opacity-30"
            >
              <Undo2 size={17} />
            </button>

            <button
              type="button"
              disabled={!canRedo}
              onClick={redo}
              title="Redo"
              className="rounded-lg p-2 text-ink-soft hover:bg-cream disabled:opacity-30"
            >
              <Redo2 size={17} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr_260px]">
          <aside className="order-2 space-y-6 lg:order-1">
            <div className="rounded-2xl bg-cream-deep/50 p-4">
              <h3 className="mb-3 font-[var(--font-display)] text-sm text-ink">
                Paper
              </h3>

              <PaperPicker
                value={letter.background}
                onChange={(background) =>
                  setLetter((prev) => ({
                    ...prev,
                    background,
                    // Black paper + the default dark ink text would be
                    // unreadable - switch to a light color automatically.
                    textStyle:
                      background === 'black'
                        ? { ...prev.textStyle, color: '#FBF5EA' }
                        : prev.textStyle,
                  }))
                }
              />
            </div>

            <div className="rounded-2xl bg-cream-deep/50 p-4">
              <h3 className="mb-3 font-[var(--font-display)] text-sm text-ink">
                Photos
              </h3>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-ink/25 py-4 text-sm text-ink-soft hover:bg-cream disabled:opacity-60"
              >
                <ImagePlus size={16} />

                {uploadingImage
                  ? 'Compressing…'
                  : 'Upload a photo'}
              </button>

              <p className="mt-2 text-xs text-ink-soft/70">
                Photos are compressed to fit in the letter. A couple work
                best — a whole album will get squeezed a lot.
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </aside>

          <div className="order-1 lg:order-2">
            <div className="mb-3">
              <TextToolbar
                textStyle={letter.textStyle}
                onChange={(textStyle) =>
                  setLetter((prev) => ({
                    ...prev,
                    textStyle,
                  }))
                }
              />
            </div>

            <div
              className="deckle-edge paper-grain relative mx-auto min-h-[560px] w-full max-w-2xl overflow-hidden rounded-lg p-10 shadow-[0_20px_45px_rgba(73,60,52,0.18)]"
              style={paperStyle(letter.background)}
              onMouseDown={(e) => {
                if (e.target === e.currentTarget) {
                  setSelectedId(null)
                }
              }}
            >
              <textarea
                value={letter.content}
                onChange={(e) =>
                  setLetter((prev) => ({
                    ...prev,
                    content: e.target.value,
                  }))
                }
                onMouseDown={() => setSelectedId(null)}
                placeholder="Dear..."
                className="h-full min-h-[480px] w-full resize-none bg-transparent outline-none placeholder:text-ink-soft/50"
                style={{
                  fontFamily: letter.textStyle.fontFamily,
                  fontSize: letter.textStyle.fontSize,
                  fontWeight: letter.textStyle.bold ? 700 : 400,
                  fontStyle: letter.textStyle.italic
                    ? 'italic'
                    : 'normal',
                  color: letter.textStyle.color,
                  textAlign: letter.textStyle.align,
                }}
              />

              {allDecorations().map((item) => (
                <DraggableItem
                  key={item.id}
                  item={item}
                  selected={selectedId === item.id}
                  onSelect={setSelectedId}
                  onChange={updateItem}
                  onDelete={deleteItem}
                  onBringForward={(id) =>
                    reorderLayer(id, 'forward')
                  }
                  onSendBackward={(id) =>
                    reorderLayer(id, 'backward')
                  }
                />
              ))}
            </div>
          </div>

          <aside className="order-3 space-y-6">
            <div className="rounded-2xl bg-cream-deep/50 p-4">
              <h3 className="mb-3 font-[var(--font-display)] text-sm text-ink">
                Decorate
              </h3>

              <StickerToolbar
                onAddSticker={handleAddSticker}
              />
            </div>
          </aside>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="rounded-full border border-ink/15 px-6 py-3 text-sm font-medium text-ink hover:bg-cream-deep"
          >
            Save Draft
          </button>

          <button
            type="button"
            onClick={handlePreview}
            className="rounded-full border border-ink/15 px-6 py-3 text-sm font-medium text-ink hover:bg-cream-deep"
          >
            Preview
          </button>

          <button
            type="button"
            onClick={handleSend}
            disabled={sending}
            className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-cream shadow-[0_6px_18px_rgba(73,60,52,0.28)] transition-transform hover:-translate-y-0.5 disabled:opacity-60"
          >
            {sending ? 'Sending…' : 'Send Letter 💌'}
          </button>
        </div>
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