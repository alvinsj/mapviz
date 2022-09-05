import { useCallback, useEffect, useState } from 'react'
/* eslint-disable @typescript-eslint/no-explicit-any */
export type Flag<T> = {
  key: string
  defaultValue: T
}

export type GetFlags = (flags: Flag<any>[]) => Promise<{ [key: string]: any }>
export type SetFlag = (flag: Flag<any>, val: any) => Promise<void>
export type GetFlag = <T>(f: Flag<T>) => T | undefined

export type UseFeatureFlagsOpts = {
  setFlag: SetFlag
  onError: (e: any) => void
}

export function useFeatureFlags(
  flags: Flag<any>[],
  getFlags: GetFlags,
  opts?: UseFeatureFlagsOpts
) {
  const { setFlag = () => undefined, onError = () => undefined } = opts || {}
  const [values, setValues] = useState<{ [key: string]: any }>({})
  const [, setCount] = useState(0)
  const forceUpdate = useCallback(() => setCount((count) => count + 1), [])
  const replaceFlag = useCallback<SetFlag>(
    async (flag, value) => {
      try {
        await setFlag(flag, value)
      } catch (e) {
        onError(e)
      } finally {
        // optimistic update, or keep app running
        setValues((values) => {
          return {
            ...values,
            [flag.key]: value,
          }
        })
      }
    },
    [onError, setFlag]
  )

  useEffect(() => {
    getFlags(flags)
      .then((values) => {
        setValues(values)
      })
      .catch((e) => {
        onError(e)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // once

  const getValue = useCallback((f: Flag<any>) => values[f.key], [values])

  return {
    getValue,
    forceUpdate,
    replaceFlag,
  }
}

export default useFeatureFlags
