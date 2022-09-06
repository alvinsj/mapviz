import compose from 'lodash.flowright'

import { provideTheme } from '../../contexts/ThemeContext'
import { provideFeatureFlags } from '../../contexts/FeatureFlagContext'

import RegionLayer, {
  useCustomControls as useRegionLayerControls,
} from './RegionLayer'
import CustomLayer, {
  useCustomControls as useCustomLayerControls,
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
        useCustomControls: useRegionLayerControls,
      },
    },
    {
      name: 'CustomLayer',
      component: CustomLayer,
      hooks: {
        useCustomControls: useCustomLayerControls,
      },
    }
  )
)(Map)
