import { ReactNode } from 'react'
import ReactMapGl, {
  FullscreenControl,
  NavigationControl,
  ScaleControl,
} from 'react-map-gl'
import maplibreGl from 'maplibre-gl'

import MapMediator from './MapMediator'
import CustomControls from '../CustomControls'
import useBaseMap from '../../hooks/useBaseMap'

export type Props = {
  id: string
  children: ReactNode
  mediator: MapMediator
}

function Map({ id, children, mediator }: Props) {
  const { mapStyle, onSwitchTheme } = useBaseMap()

  return (
    <div className="App">
      {mapStyle && (
        <ReactMapGl
          id={id}
          reuseMaps
          initialViewState={{
            longitude: 103.82358,
            latitude: 1.367786,
            zoom: 10,
          }}
          style={{ width: '90vw', height: '90vh' }}
          mapStyle={mapStyle}
          mapLib={maplibreGl}
          attributionControl={false}
          maxBounds={[103.58, 1.16, 104.1, 1.5]}
        >
          {children}

          {/* controls */}
          <FullscreenControl />
          <NavigationControl />
          <ScaleControl />
          <CustomControls>
            <div
              className="maplibregl-ctrl maplibregl-ctrl-group 
              mapboxgl-ctrl mapboxgl-ctrl-group"
            >
              <button type="button" onClick={() => onSwitchTheme('dark')}>
                Dark
              </button>
              <button type="button" onClick={() => onSwitchTheme('light')}>
                Light
              </button>

              {mediator.renderCustomControls(id)}
            </div>
          </CustomControls>
        </ReactMapGl>
      )}
    </div>
  )
}

export default Map
