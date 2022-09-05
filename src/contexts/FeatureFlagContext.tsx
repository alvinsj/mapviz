/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentType, createContext, memo, useContext } from 'react'
import useFeatureFlags, {
  Flag,
  GetFlag,
  SetFlag,
} from '../hooks/useFeatureFlags'
import FLAGS from '../config/featureFlags'

export type FeatureFlagContextType = [GetFlag, SetFlag]

export const FeatureFlagContext = createContext<FeatureFlagContextType>([
  () => undefined,
  () => Promise.resolve(undefined),
])

const getFeatureFlags = (flags: Flag<any>[]) => {
  return Promise.resolve(
    flags.reduce((ret, flag) => {
      ret[flag.key] = flag.defaultValue
      return ret
    }, {} as { [name: string]: any })
  )
}

export const provideFeatureFlags = (Base: ComponentType) =>
  memo(function WithTheme(props) {
    const { getValue, replaceFlag } = useFeatureFlags(FLAGS, getFeatureFlags)

    return (
      <FeatureFlagContext.Provider value={[getValue, replaceFlag]}>
        <Base {...props} />
      </FeatureFlagContext.Provider>
    )
  })

export function useFeatureFlagContext() {
  return useContext(FeatureFlagContext)
}
