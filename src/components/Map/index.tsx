import compose from 'lodash.flowright'

import { provideTheme } from '../../contexts/ThemeContext'
import { provideFeatureFlags } from '../../contexts/FeatureFlagContext'

import RegionLayer from './RegionLayer'
import CustomLayer from './CustomLayer'

import Map from './Map'
import { addMapPlugins } from './MapMediator'

export default compose(
  provideFeatureFlags,
  provideTheme,
  addMapPlugins(
    {
      name: 'RegionLayer',
      component: RegionLayer,
      useControls: RegionLayer.useControls,
    },
    {
      name: 'CustomLayer',
      component: CustomLayer,
      useControls: CustomLayer.useControls,
    }
  )
)(Map)
