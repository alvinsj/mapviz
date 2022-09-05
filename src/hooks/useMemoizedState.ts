/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from 'react'

export function useMemoizedState<T>(value: T, key: string) {
  const memoized = localStorage.getItem(key),
    memoizedValue = memoized ? JSON.parse(memoized) : undefined

  const [state, setState] = useState(memoizedValue ?? value)

  // handle key change
  useEffect(() => {
    const memoized = localStorage.getItem(key),
      memoizedValue = memoized ? JSON.parse(memoized) : undefined

    setState(memoizedValue ?? value)
  }, [key])

  return [
    state,
    useCallback((newState: T) => {
      if (typeof newState === 'function') setState(newState(state))
      // never unset
      else if (newState) {
        localStorage.setItem(key, JSON.stringify(newState))
        setState(newState)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []), // once
  ]
}

export default useMemoizedState
