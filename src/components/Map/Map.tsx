import { ReactNode } from 'react'
import ReactMapGl, {
  FullscreenControl,
  MapProps,
  NavigationControl,
  ScaleControl,
} from 'react-map-gl'
import maplibreGl from 'maplibre-gl'

import MapMediator from './MapPluginMediator'
import CustomControls from '../CustomControls'
import useBaseMap from '../../hooks/useBaseMap'

export type Props = {
  id: string
  children: ReactNode
  pluginMediator: MapMediator
}

function Map({ id, children, pluginMediator, ...mapProps }: Props) {
  const { mapStyle, renderBaseControls } = useBaseMap()

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
          {...mapProps}
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
              {renderBaseControls()}
              {pluginMediator.useCustomControls(id)}
            </div>
          </CustomControls>
        </ReactMapGl>
      )}
    </div>
  )
}

export default Map
