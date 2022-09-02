import { FillLayer} from 'react-map-gl'

export const regionLayerStyle = () : FillLayer => ({
  type: 'fill',
  paint: {
    'fill-opacity': 0.1,
    'fill-outline-color': 'white',
  }
} as FillLayer)

export const highlightRegionLayerStyle = () : FillLayer => ({
  type: 'fill',
  paint: {
    'fill-color': 'white',
    'fill-opacity': 0.3,
  }
} as FillLayer)