import { useCallback, useEffect, useState } from 'react'
export type Flag<T> = {
  key: string
  defaultValue: FlagValue
}
export type FlagValue = boolean

export type GetFlags = (
  flags: Flag<FlagValue>[]
) => Promise<{ [key: string]: FlagValue }>
export type SetFlag = (flag: Flag<FlagValue>, val: FlagValue) => Promise<void>
export type GetFlag = (f: Flag<FlagValue>) => FlagValue | undefined

export type UseFeatureFlagsOpts = {
  setFlag: SetFlag
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onError: (e: any) => void // FIXME specify error type
}

export function useFeatureFlags(
  flags: Flag<FlagValue>[],
  getFlags: GetFlags,
  opts?: UseFeatureFlagsOpts
) {
  const { setFlag = () => undefined, onError = () => undefined } = opts || {}
  const [values, setValues] = useState<{ [key: string]: FlagValue }>({})
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

  const getValue = useCallback((f: Flag<FlagValue>) => values[f.key], [values])

  return {
    getValue,
    forceUpdate,
    replaceFlag,
  }
}

export default useFeatureFlags
