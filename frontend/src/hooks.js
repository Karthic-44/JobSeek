import { useCallback, useEffect, useState } from 'react'
import { errorMessage } from './api'

/** Runs `load()` whenever `deps` change. Returns the latest data, loading/error state and a reload(). */
export function useLoad(load, deps) {
  const [state, setState] = useState({ data: null, loading: true, error: '' })
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let live = true
    setState((s) => ({ ...s, loading: true, error: '' }))
    load()
      .then((data) => live && setState({ data, loading: false, error: '' }))
      .catch((err) => live && setState({ data: null, loading: false, error: errorMessage(err) }))
    return () => { live = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick])

  const reload = useCallback(() => setTick((t) => t + 1), [])
  return { ...state, reload }
}

export function useDebounced(value, ms = 300) {
  const [v, setV] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setV(value), ms)
    return () => clearTimeout(id)
  }, [value, ms])
  return v
}
