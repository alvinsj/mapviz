import { ComponentType, createContext, memo, useContext, useMemo } from 'react'
import useFeatureFlags, {
  Flag,
  GetFlag,
  SetFlag,
  FlagValue,
} from '../hooks/useFeatureFlags'
import FLAGS from '../config/featureFlags'

export type FeatureFlagContextType = [GetFlag, SetFlag]

export const FeatureFlagContext = createContext<FeatureFlagContextType>([
  () => undefined,
  () => Promise.resolve(undefined),
])

const getFeatureFlags = (flags: Flag<FlagValue>[]) => {
  return Promise.resolve(
    flags.reduce((ret, flag) => {
      ret[flag.key] = flag.defaultValue
      return ret
    }, {} as { [name: string]: FlagValue })
  )
}

export const provideFeatureFlags = (Base: ComponentType) =>
  memo(function WithTheme(props) {
    const { getValue, replaceFlag } = useFeatureFlags(FLAGS, getFeatureFlags)

    const context = useMemo<[(f: Flag<FlagValue>) => FlagValue, SetFlag]>(
      () => [getValue, replaceFlag],
      [getValue, replaceFlag]
    )
    return (
      <FeatureFlagContext.Provider value={context}>
        <Base {...props} />
      </FeatureFlagContext.Provider>
    )
  })

export function useFeatureFlagContext() {
  return useContext(FeatureFlagContext)
}
