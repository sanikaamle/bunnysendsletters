// PetalPost — canonical Letter data model.
// This shape is what the editor reads/writes, what preview renders,
// and what should eventually be persisted to a database as-is.
// Every position/size/rotation is stored so a letter can be
// reconstructed pixel-for-pixel later.

/**
 * @typedef {Object} DecorationItem
 * @property {string} id
 * @property {'sticker'|'image'} type
 * @property {string} assetUrl        - path to the sticker/photo asset
 * @property {string} [category]      - flowers | stars | hearts | stamps | tape | teddy | misc (stickers only)
 * @property {number} x               - px, relative to canvas top-left
 * @property {number} y
 * @property {number} width
 * @property {number} height
 * @property {number} rotation        - degrees
 * @property {number} layer           - z-index / stacking order
 * @property {'none'|'rounded'|'polaroid'} [frame] - images only
 */

/**
 * @typedef {Object} Letter
 * @property {string} id
 * @property {string} sender
 * @property {string} recipientEmail
 * @property {string} title
 * @property {string} content            - rich text / HTML of the written letter
 * @property {TextStyle} textStyle
 * @property {string} background         - one of PAPER_OPTIONS ids
 * @property {DecorationItem[]} decorations
 * @property {DecorationItem[]} images
 * @property {string} createdAt          - ISO date
 * @property {string|null} scheduledFor  - ISO date; "open when" unlock date, null = opens immediately
 * @property {string|null} openWhenLabel - e.g. "Open when you're sad"
 * @property {'draft'|'sent'|'received'} status
 * @property {boolean} favorite
 * @property {boolean} opened            - has the recipient opened the envelope yet
 */

/**
 * @typedef {Object} TextStyle
 * @property {string} fontFamily
 * @property {number} fontSize
 * @property {boolean} bold
 * @property {boolean} italic
 * @property {string} color
 * @property {'left'|'center'|'right'} align
 */

export const PAPER_OPTIONS = [
  { id: 'butter', label: 'Butter Yellow', swatch: '#F2D98E' },
  { id: 'pink', label: 'Baby Pink', swatch: '#F3C9D4' },
  { id: 'lavender', label: 'Soft Lavender', swatch: '#DED2ED' },
  { id: 'sage', label: 'Sage', swatch: '#B7C8A4' },
  { id: 'textured', label: 'White Textured', swatch: '#FFFFFF' },
  { id: 'red', label: 'Red', swatch: '#D9534F' },
  { id: 'skyblue', label: 'Sky Blue', swatch: '#87CEEB' },
  { id: 'black', label: 'Black', swatch: '#1A1A1A' },
]

export const STICKER_CATEGORIES = [
  'flowers',
  'stars',
  'hearts',
  'stamps',
  'tape',
  'teddy',
  'misc',
]

export const FONT_OPTIONS = [
  { id: 'fraunces', label: 'Fraunces (serif)', family: '"Fraunces", serif' },
  { id: 'caveat', label: 'Caveat (handwriting)', family: '"Caveat", cursive' },
  { id: 'nunito', label: 'Nunito (clean)', family: '"Nunito", sans-serif' },
]

export function createBlankLetter({ sender = '' } = {}) {
  return {
    id: crypto.randomUUID(),
    sender,
    recipientEmail: '',
    title: '',
    content: '',
    textStyle: {
      fontFamily: FONT_OPTIONS[0].family,
      fontSize: 18,
      bold: false,
      italic: false,
      color: '#493C34',
      align: 'left',
    },
    background: 'cream',
    decorations: [],
    images: [],
    createdAt: new Date().toISOString(),
    scheduledFor: null,
    openWhenLabel: null,
    status: 'draft',
    favorite: false,
    opened: false,
  }
}

export function createDecorationItem({ assetUrl, category, type = 'sticker' }) {
  return {
    id: crypto.randomUUID(),
    type,
    assetUrl,
    category,
    x: 120,
    y: 120,
    width: 96,
    height: 96,
    rotation: 0,
    layer: Date.now(),
    frame: type === 'image' ? 'polaroid' : 'none',
  }
}
