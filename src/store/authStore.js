import { create } from 'zustand'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth } from '../lib/firebase.js'

export const useAuthStore = create((set) => ({
  user: null, // { uid, name, email }
  authReady: false, // becomes true once Firebase has told us the initial auth state
  status: 'idle', // idle | loading | error
  error: null,

  signup: async ({ name, email, password }) => {
    set({ status: 'loading', error: null })
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(cred.user, { displayName: name })
      set({
        user: { uid: cred.user.uid, name, email: cred.user.email },
        status: 'idle',
      })
      return true
    } catch (err) {
      set({ status: 'error', error: friendlyAuthError(err) })
      return false
    }
  },

  login: async ({ email, password }) => {
    set({ status: 'loading', error: null })
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password)
      set({
        user: {
          uid: cred.user.uid,
          name: cred.user.displayName || cred.user.email,
          email: cred.user.email,
        },
        status: 'idle',
      })
      return true
    } catch (err) {
      set({ status: 'error', error: friendlyAuthError(err) })
      return false
    }
  },

  logout: async () => {
    await signOut(auth)
    set({ user: null })
  },
}))

// Keeps the store in sync with Firebase's own session persistence, so a
// page refresh (or opening the app in a new tab) restores the logged-in
// state without us managing tokens by hand.
onAuthStateChanged(auth, (firebaseUser) => {
  useAuthStore.setState({
    user: firebaseUser
      ? {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email,
          email: firebaseUser.email,
        }
      : null,
    authReady: true,
  })
})

function friendlyAuthError(err) {
  const code = err.code || ''
  if (code.includes('email-already-in-use')) return 'An account with that email already exists.'
  if (code.includes('invalid-credential') || code.includes('wrong-password') || code.includes('user-not-found')) {
    return 'Incorrect email or password.'
  }
  if (code.includes('weak-password')) return 'Password must be at least 6 characters.'
  if (code.includes('invalid-email')) return 'That email address looks invalid.'
  if (code.includes('network-request-failed')) return "Couldn't reach the server. Check your connection."
  return err.message || 'Something went wrong. Please try again.'
}