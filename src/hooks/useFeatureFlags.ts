import { useCallback, useEffect, useState } from 'react'
/* eslint-disable @typescript-eslint/no-explicit-any */
export type Flag<T> = {
  key: string
  defaultValue: T
}

export type GetFlags = (flags: Flag<any>[]) => Promise<{ [key: string]: any }>
export type SetFlag = (key: string, val: any) => Promise<void>
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
  const updateFlags = useCallback(() => setCount((count) => count + 1), [])
  const replaceFlag = useCallback<SetFlag>(
    async (key, value) => {
      try {
        await setFlag(key, value)
      } catch (e) {
        onError(e)
      } finally {
        // optimistic update, or keep app running
        setValues((values) => {
          return {
            ...values,
            [key]: value,
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

  const keyVals = flags.reduce((ret, flag) => {
    if (values[flag.key]) ret[flag.key] = values[flag.key]
    else ret[flag.key] = flag.defaultValue

    return ret
  }, {} as { [key: string]: any })

  return {
    ...keyVals,
    updateFlags,
    replaceFlag,
  }
}

export default useFeatureFlags
