// Firestore documents cap out at ~1MB, and a letter document also holds
// its text, stickers, and other photos - so each photo needs to be small.
// This resizes + re-encodes as JPEG, shrinking further if still too big.

async function loadBitmap(file) {
  if ('createImageBitmap' in window) {
    return createImageBitmap(file)
  }
  // Fallback for browsers without createImageBitmap.
  const url = URL.createObjectURL(file)
  try {
    const img = new Image()
    await new Promise((resolve, reject) => {
      img.onload = resolve
      img.onerror = reject
      img.src = url
    })
    return img
  } finally {
    URL.revokeObjectURL(url)
  }
}

function fitWithin(width, height, maxDim) {
  if (width <= maxDim && height <= maxDim) return { width, height }
  const scale = maxDim / Math.max(width, height)
  return { width: Math.round(width * scale), height: Math.round(height * scale) }
}

function drawToDataUrl(source, width, height, quality) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  ctx.drawImage(source, 0, 0, width, height)
  return canvas.toDataURL('image/jpeg', quality)
}

export async function compressImageToDataUrl(
  file,
  { maxDim = 800, quality = 0.7, maxBytes = 350_000 } = {}
) {
  const source = await loadBitmap(file)
  let { width, height } = fitWithin(source.width, source.height, maxDim)
  let q = quality

  for (let attempt = 0; attempt < 6; attempt++) {
    const dataUrl = drawToDataUrl(source, width, height, q)
    const approxBytes = dataUrl.length * 0.75 // base64 -> raw byte estimate
    if (approxBytes <= maxBytes) return dataUrl
    q = Math.max(0.35, q - 0.12)
    width = Math.round(width * 0.85)
    height = Math.round(height * 0.85)
  }

  throw new Error('This photo is too large even after compression - try a smaller image.')
}
