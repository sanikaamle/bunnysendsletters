import { useRef, useState, useCallback } from 'react'

// Minimal undo/redo: keeps a stack of full snapshots. Good enough for a
// letter-sized document; not meant for huge documents or high-frequency
// updates (callers should only push on meaningful, discrete changes).
export function useHistoryState(initial) {
  const [state, setState] = useState(initial)
  const historyRef = useRef([initial])
  const indexRef = useRef(0)

  const set = useCallback((updater) => {
    setState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      historyRef.current = historyRef.current.slice(0, indexRef.current + 1)
      historyRef.current.push(next)
      indexRef.current = historyRef.current.length - 1
      return next
    })
  }, [])

  const undo = useCallback(() => {
    if (indexRef.current > 0) {
      indexRef.current -= 1
      setState(historyRef.current[indexRef.current])
    }
  }, [])

  const redo = useCallback(() => {
    if (indexRef.current < historyRef.current.length - 1) {
      indexRef.current += 1
      setState(historyRef.current[indexRef.current])
    }
  }, [])

  const canUndo = indexRef.current > 0
  const canRedo = indexRef.current < historyRef.current.length - 1

  return { state, set, undo, redo, canUndo, canRedo }
}
