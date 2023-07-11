import compose from 'lodash.flowright'

import { provideTheme } from '../../contexts/ThemeContext'
import { provideFeatureFlags } from '../../contexts/FeatureFlagContext'

import RegionLayer, {
  CustomControls as RegionLayerControls,
} from './RegionLayer'
// import CustomLayer, {
//   CustomControls as CustomLayerControls,
// } from './CustomLayer'

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
        customControls: RegionLayerControls,
      },
    },
    // {
    //   name: 'CustomLayer',
    //   component: CustomLayer,
    //   hooks: {
    //     customControls: CustomLayerControls,
    //   },
    // }
  )
)(Map)
