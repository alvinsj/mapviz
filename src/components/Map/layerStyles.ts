import { FillLayer, CircleLayer } from 'react-map-gl'
import { Theme } from '../../types'

export const regionLayerStyle = ({
  theme,
  modifyColor = (v) => v,
}: LayerStyleOpts): FillLayer =>
  ({
    type: 'fill',
    paint: {
      'fill-color':
        theme === 'dark' ? modifyColor('cyan') : modifyColor('blue'),
      'fill-opacity': 0.1,
      'fill-outline-color': theme === 'dark' ? 'white' : 'black',
    },
  } as FillLayer)

export const pointLayerStyle = ({
  theme,
  modifyColor = (v) => v,
}: LayerStyleOpts): CircleLayer =>
  ({
    type: 'circle',
    paint: {
      'circle-color':
        theme === 'dark' ? modifyColor('cyan') : modifyColor('blue'),
      'circle-radius': 5,
    },
  } as CircleLayer)

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

type LayerStyleOpts = {
  theme: Theme
  modifyColor?: (color: string) => string
}

export const layerStyle = ({
  theme,
  modifyColor = (v) => v,
}: LayerStyleOpts): FillLayer =>
  ({
    type: 'fill',
    paint: {
      'fill-color':
        theme === 'dark' ? modifyColor('cyan') : modifyColor('blue'),
      'fill-opacity': 0.3,
      'fill-outline-color':
        theme === 'dark' ? modifyColor('cyan') : modifyColor('lightblue'),
    },
  } as FillLayer)

export const highlightLayerStyle = ({ theme }: { theme: Theme }): FillLayer =>
  ({
    type: 'fill',
    paint: {
      'fill-color': theme === 'dark' ? 'cyan' : 'blue',
      'fill-opacity': 0.32,
    },
  } as FillLayer)
