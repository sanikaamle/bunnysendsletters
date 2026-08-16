export const PAPER_STYLES = {
  cream: { background: '#FBF5EA' },
  butter: { background: '#F2D98E' },
  pink: { background: '#F3C9D4' },
  lavender: { background: '#DED2ED' },
  sage: { background: '#B7C8A4' },
  textured: { background: '#FFFFFF' },
  red: { background: '#D9534F' },
  skyblue: { background: '#87CEEB' },
  black: { background: '#1A1A1A' },
}

export function paperStyle(id) {
  return PAPER_STYLES[id] || PAPER_STYLES.butter
}