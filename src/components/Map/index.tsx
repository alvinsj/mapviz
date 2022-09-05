import compose from 'lodash.flowright'

import { provideTheme } from '../../contexts/ThemeContext'
import RegionLayer from './RegionLayer'
import CustomLayer from './CustomLayer'

import Map from './Map'
import { addMapPlugins } from './MapMediator'

export default compose(
  provideTheme,
  addMapPlugins(
    {
      name: 'RegionLayer',
      component: RegionLayer,
    },
    {
      name: 'CustomLayer',
      component: CustomLayer,
      useControls: CustomLayer.useControls,
    }
  )
)(Map)
