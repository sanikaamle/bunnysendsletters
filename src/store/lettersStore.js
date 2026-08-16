import { create } from 'zustand'
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore'
import { db } from '../lib/firebase.js'
import { useAuthStore } from './authStore.js'

const LETTERS_COLLECTION = 'letters'

function defaultTextStyle() {
  return {
    fontFamily: '"Fraunces", serif',
    fontSize: 18,
    bold: false,
    italic: false,
    color: '#493C34',
    align: 'left',
  }
}

function docToLetter(docSnap, { forceReceived = false } = {}) {
  const data = docSnap.data()
  return {
    id: docSnap.id,
    sender: data.senderName || '',
    senderId: data.ownerUid,
    senderEmail: data.senderEmail || null,
    recipientEmail: data.recipientEmail || '',
    title: data.title || '',
    content: data.content || '',
    textStyle: data.textStyle || defaultTextStyle(),
    background: data.background || 'cream',
    decorations: data.decorations || [],
    images: data.images || [],
    createdAt: data.createdAt || new Date().toISOString(),
    scheduledFor: data.scheduledFor || null,
    openWhenLabel: data.openWhenLabel || null,
    status: forceReceived ? 'received' : data.status || 'draft',
    favorite: Boolean(data.favorite),
    opened: Boolean(data.opened),
  }
}

export const useLettersStore = create((set, get) => ({
  letters: [],
  loading: false,
  loaded: false,
  fetchError: null,

  reset: () => set({ letters: [], loaded: false, fetchError: null }),

  fetchLetters: async () => {
    const user = useAuthStore.getState().user
    if (!user) return
    set({ loading: true })
    try {
      const mineSnap = await getDocs(
        query(collection(db, LETTERS_COLLECTION), where('ownerUid', '==', user.uid))
      )
      const receivedSnap = await getDocs(
        query(
          collection(db, LETTERS_COLLECTION),
          where('recipientEmail', '==', user.email),
          where('status', '==', 'sent')
        )
      )

      const mine = mineSnap.docs.map((d) => docToLetter(d))
      const received = receivedSnap.docs
        .filter((d) => d.data().ownerUid !== user.uid)
        .map((d) => docToLetter(d, { forceReceived: true }))

      set({ letters: [...mine, ...received], loading: false, loaded: true, fetchError: null })
    } catch (err) {
      console.error('Failed to load letters:', err.message)
      set({ loading: false, loaded: true, fetchError: err.message })
    }
  },

  getLetter: (id) => get().letters.find((l) => l.id === id),

  // Fetches a single letter directly from Firestore, for when it isn't
  // in the local store yet (e.g. a deep link or a fresh page load).
  fetchLetterById: async (id) => {
    const snap = await getDoc(doc(db, LETTERS_COLLECTION, id))
    if (!snap.exists()) return null
    const user = useAuthStore.getState().user
    const isRecipient = user && snap.data().recipientEmail === user.email && snap.data().ownerUid !== user.uid
    const letter = docToLetter(snap, { forceReceived: isRecipient })
    get().upsertLocal(letter)
    return letter
  },

  upsertLocal: (letter) => {
    set((state) => {
      const exists = state.letters.some((l) => l.id === letter.id)
      return {
        letters: exists
          ? state.letters.map((l) => (l.id === letter.id ? letter : l))
          : [letter, ...state.letters],
      }
    })
  },

  createDraft: async () => {
    const user = useAuthStore.getState().user
    if (!user) throw new Error('You need to be logged in.')
    const payload = {
      ownerUid: user.uid,
      senderName: user.name,
      senderEmail: user.email,
      recipientEmail: '',
      title: '',
      content: '',
      textStyle: defaultTextStyle(),
      background: 'butter',
      decorations: [],
      images: [],
      status: 'draft',
      favorite: false,
      opened: false,
      scheduledFor: null,
      openWhenLabel: null,
      createdAt: new Date().toISOString(),
    }
    const docRef = await addDoc(collection(db, LETTERS_COLLECTION), payload)
    const letter = docToLetter({ id: docRef.id, data: () => payload })
    get().upsertLocal(letter)
    return letter.id
  },

  saveDraft: async (id, patch) => {
    await updateDoc(doc(db, LETTERS_COLLECTION, id), toFirestorePatch(patch))
    const letter = await get().fetchLetterById(id)
    return letter
  },

  sendLetter: async (id, patch) => {
    const fullPatch = {
      ...toFirestorePatch(patch),
      status: 'sent',
      sentAt: new Date().toISOString(),
    }
    await updateDoc(doc(db, LETTERS_COLLECTION, id), fullPatch)
    const letter = await get().fetchLetterById(id)
    const shareUrl = `${window.location.origin}/view/${id}`
    return { letter, shareUrl }
  },

  toggleFavorite: async (id) => {
    const current = get().getLetter(id)
    await updateDoc(doc(db, LETTERS_COLLECTION, id), { favorite: !current?.favorite })
    await get().fetchLetterById(id)
  },

  markOpened: async (id) => {
  await updateDoc(doc(db, LETTERS_COLLECTION, id), { opened: true })
  await get().fetchLetterById(id)
},

deleteLetter: async (id) => {
  await deleteDoc(doc(db, LETTERS_COLLECTION, id))
  set((state) => ({
    letters: state.letters.filter((l) => l.id !== id)
  }))
},

  inbox: () => get().letters.filter((l) => l.status === 'received'),
  sent: () => get().letters.filter((l) => l.status === 'sent'),
  drafts: () => get().letters.filter((l) => l.status === 'draft'),
  favorites: () => get().letters.filter((l) => l.favorite),
}))

function toFirestorePatch(patch) {
  // Firestore rejects `undefined` anywhere in the payload, including
  // nested inside arrays/objects (e.g. a decoration's `frame` field).
  // JSON round-tripping strips those: undefined object keys are
  // dropped, undefined array entries become null.
  return JSON.parse(JSON.stringify(patch))
}

// Used by the public /view/:id page — no login required, doesn't touch
// the authenticated user's letters list.
export async function fetchPublicLetter(id) {
  const snap = await getDoc(doc(db, LETTERS_COLLECTION, id))
  if (!snap.exists()) return null
  const letter = docToLetter(snap, { forceReceived: true })
  return letter
}

export async function openPublicLetter(id) {
  await updateDoc(doc(db, LETTERS_COLLECTION, id), { opened: true })
  return fetchPublicLetter(id)
}
