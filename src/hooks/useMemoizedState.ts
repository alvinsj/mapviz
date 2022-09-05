/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useState } from 'react'

export function useMemoizedState<T>(value: T, key: string) {
  const memoized = localStorage.getItem(key),
    memoizedValue = memoized ? JSON.parse(memoized) : undefined

  const [state, setState] = useState(
    typeof value === 'undefined' ? memoizedValue : value
  )

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
