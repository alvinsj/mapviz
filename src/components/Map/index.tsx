import compose from 'lodash.flowright'

import { provideTheme } from '../../contexts/ThemeContext'
import { provideFeatureFlags } from '../../contexts/FeatureFlagContext'

import RegionLayer, {
  useControls as useRegionLayerControls,
} from './RegionLayer'
import CustomLayer, {
  useControls as useCustomLayerControls,
} from './CustomLayer'

import Map from './Map'
import { addMapPlugins } from './MapPluginMediator'

export default compose(
  provideFeatureFlags,
  provideTheme,
  addMapPlugins(
    {
      name: 'RegionLayer',
      component: RegionLayer,
      hooks: {
        useControls: useRegionLayerControls,
      },
    },
    {
      name: 'CustomLayer',
      component: CustomLayer,
      hooks: {
        useControls: useCustomLayerControls,
      },
    }
  )
)(Map)
