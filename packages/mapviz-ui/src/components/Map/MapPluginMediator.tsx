import { ComponentType, useMemo } from 'react'
import { MapProps } from 'react-map-gl'

import { MapPluginComponentProps } from '../types'

export type Plugin = {
  name: string
  component: ComponentType<MapPluginComponentProps>
  hooks?: {
    customControls?: ComponentType<MapPluginComponentProps>
  }
}

export type WithMapMediator = MapProps & {
  id: string
  pluginMediator: MapMediator
}

export const addMapPlugins =
  (...plugins: Plugin[]) =>
    (Base: ComponentType<WithMapMediator>) =>
      function MapWithPlugins(props: MapProps & { id: string }) {
        if (!props.id) throw new Error('id is required props to use Map plugin')
        const mapMediator = useMemo(
          () => new MapMediator(plugins, props.id), [props.id])

        return <Base {...props} pluginMediator={mapMediator} />
      }

export class MapMediator {
  _plugins: Plugin[]
  _id: string

  constructor(plugins: Plugin[], id: string) {
    this._plugins = plugins
    this._id = id
  }

  // returns rendered children
  renderMapChildren(mapId: string) {
    return this._plugins
      .map((p) => {
        const Child = p.component
        return <Child key={p.name} mapId={mapId} />
      })
      .filter((c) => Boolean(c))
  }

  // returns rendered result from hooks
  renderCustomControls(mapId: string) {
    const controls = this._plugins
      .map((p) => {
        // NOTE need to maintain hooks here
        const Controls = p?.hooks?.customControls

        if (Controls) return <Controls key={p.name} mapId={mapId} />
      })
      .filter((c) => Boolean(c))

    return controls
  }
}

export default MapMediator
