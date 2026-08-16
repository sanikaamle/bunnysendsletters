import { Rnd } from 'react-rnd'
import { useRef } from 'react'
import { X, RotateCw, ArrowUpToLine, ArrowDownToLine } from 'lucide-react'

const handleStyle = {
  width: '12px',
  height: '12px',
  borderRadius: '9999px',
  background: '#493C34',
  border: '2px solid #FBF5EA',
  boxShadow: '0 1px 3px rgba(73,60,52,0.4)',
}

const DRAG_THRESHOLD_PX = 4

function isSideways(deg) {
  const normalized = ((deg % 360) + 360) % 360
  return normalized === 90 || normalized === 270
}

function rotateItem(item, newRotation) {
  const rotation = ((newRotation % 360) + 360) % 360

  if (isSideways(item.rotation) !== isSideways(rotation)) {
    return {
      ...item,
      rotation,
      width: item.height,
      height: item.width,
    }
  }

  return {
    ...item,
    rotation,
  }
}

export default function DraggableItem({
  item,
  selected,
  onSelect,
  onChange,
  onDelete,
  onBringForward,
  onSendBackward,
}) {
  const rotateStateRef = useRef(null)

  function handleRotatePointerDown(e) {
    e.stopPropagation()

    // Prevent the browser from interpreting the gesture as scrolling.
    e.currentTarget.setPointerCapture?.(e.pointerId)

    const startX = e.clientX
    const startY = e.clientY
    const startRotation = item.rotation || 0

    const box = e.currentTarget.closest('[data-item-box]')

    if (!box) return

    const rect = box.getBoundingClientRect()

    const center = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    }

    rotateStateRef.current = {
      dragged: false,
    }

    function onMove(moveEvent) {
      const dx = moveEvent.clientX - startX
      const dy = moveEvent.clientY - startY

      if (
        !rotateStateRef.current.dragged &&
        Math.hypot(dx, dy) > DRAG_THRESHOLD_PX
      ) {
        rotateStateRef.current.dragged = true
      }

      if (rotateStateRef.current.dragged) {
        const angle =
          (Math.atan2(
            moveEvent.clientY - center.y,
            moveEvent.clientX - center.x
          ) *
            180) /
            Math.PI +
          90

        onChange({
          ...item,
          rotation: Math.round(angle),
        })
      }
    }

    function onUp() {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)

      if (!rotateStateRef.current.dragged) {
        onChange(rotateItem(item, startRotation + 90))
      }

      rotateStateRef.current = null
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
  }

  const isPolaroid =
    item.type === 'image' && item.frame === 'polaroid'

  const rotation = item.rotation || 0

  return (
    <Rnd
      size={{
        width: item.width,
        height: item.height,
      }}
      position={{
        x: item.x,
        y: item.y,
      }}
      style={{
        zIndex: item.layer,
      }}
      enableResizing={selected}
      disableDragging={false}
      onDragStop={(e, d) =>
        onChange({
          ...item,
          x: d.x,
          y: d.y,
        })
      }
      onResizeStop={(e, dir, ref, delta, pos) =>
        onChange({
          ...item,
          width: parseInt(ref.style.width, 10),
          height: parseInt(ref.style.height, 10),
          ...pos,
        })
      }
      resizeHandleStyles={{
        topLeft: handleStyle,
        topRight: handleStyle,
        bottomLeft: handleStyle,
        bottomRight: handleStyle,
      }}
    >
      <div
        data-item-box
        className="relative h-full w-full"
        style={{
          transform: `rotate(${rotation}deg)`,
          transformOrigin: 'center center',
          touchAction: 'none',
        }}
        onMouseDown={(e) => {
          e.stopPropagation()
          onSelect(item.id)
        }}
        onTouchStart={(e) => {
          e.stopPropagation()
          onSelect(item.id)
        }}
      >
        <div
          className={
            isPolaroid
              ? 'h-full w-full bg-white p-2 pb-6 shadow-[0_8px_16px_rgba(73,60,52,0.25)]'
              : 'h-full w-full'
          }
        >
          <img
            src={item.assetUrl}
            alt=""
            draggable={false}
            className={`h-full w-full select-none object-contain ${
              item.frame === 'rounded' ? 'rounded-xl' : ''
            }`}
          />
        </div>

        {selected && (
          <div className="pointer-events-none absolute inset-0">
            <div className="pointer-events-auto absolute -top-9 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-ink px-2 py-1 shadow-lg">
              <button
                type="button"
                title="Tap to rotate 90° - drag to rotate freely"
                onPointerDown={handleRotatePointerDown}
                className="cursor-grab touch-none rounded-full p-1 text-cream hover:bg-white/20 active:cursor-grabbing"
              >
                <RotateCw size={14} />
              </button>

              <button
                type="button"
                title="Bring forward"
                onClick={(e) => {
                  e.stopPropagation()
                  onBringForward(item.id)
                }}
                className="rounded-full p-1 text-cream hover:bg-white/20"
              >
                <ArrowUpToLine size={14} />
              </button>

              <button
                type="button"
                title="Send backward"
                onClick={(e) => {
                  e.stopPropagation()
                  onSendBackward(item.id)
                }}
                className="rounded-full p-1 text-cream hover:bg-white/20"
              >
                <ArrowDownToLine size={14} />
              </button>

              <button
                type="button"
                title="Delete"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(item.id)
                }}
                className="rounded-full p-1 text-cream hover:bg-pink-deep/60"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </Rnd>
  )
}