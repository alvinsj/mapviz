import { FillLayer } from 'react-map-gl'
import { Theme } from './hooks/useBaseMap'

export const regionLayerStyle = ({ theme }: { theme: Theme }): FillLayer =>
  ({
    type: 'fill',
    paint: {
      'fill-opacity': 0.05,
      'fill-outline-color': theme === 'dark' ? 'white' : 'black',
    },
  } as FillLayer)

export const highlightRegionLayerStyle = ({
  theme,
}: {
  theme: Theme
}): FillLayer =>
  ({
    type: 'fill',
    paint: {
      'fill-color': theme === 'dark' ? 'white' : 'black',
      'fill-opacity': 0.2,
    },
  } as FillLayer)

export const layerStyle = ({ theme }: { theme: Theme }): FillLayer =>
  ({
    type: 'fill',
    paint: {
      'fill-color': theme === 'dark' ? 'cyan' : 'blue',
      'fill-opacity': 0.3,
      'fill-outline-color': theme === 'dark' ? 'cyan' : 'lightblue',
    },
  } as FillLayer)

export const highlightLayerStyle = ({ theme }: { theme: Theme }): FillLayer =>
  ({
    type: 'fill',
    paint: {
      'fill-color': theme === 'dark' ? 'cyan' : 'blue',
      'fill-opacity': 0.8,
    },
  } as FillLayer)
