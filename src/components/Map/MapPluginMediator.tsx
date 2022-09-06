import { ComponentType, ReactNode, useMemo } from 'react'
import { MapProps } from 'react-map-gl'

export type useCustomControlsProps = {
  key: string
}

export type Plugin = {
  name: string
  component: ComponentType<{ mapId: string }>
  hooks?: {
    useCustomControls?: (
      mapId: string,
      props: useCustomControlsProps
    ) => ReactNode
  }
}

export const addMapPlugins =
  (...plugins: Plugin[]) =>
  (
    Base: ComponentType<MapProps & { id: string; pluginMediator: MapMediator }>
  ) =>
    function MapWithPlugins(props: MapProps & { id: string }) {
      if (!props.id) throw new Error('id is required props to use Map plugin')
      const mapMediator = useMemo(() => new MapMediator(plugins, props.id), [])

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
  useCustomControls(mapId: string) {
    const controls = this._plugins
      .map((p) => {
        // NOTE need to maintain hooks here
        const control = p?.hooks?.useCustomControls?.(mapId, {
          key: `customControls-${p.name}`,
        })
        return control
      })
      .filter((c) => Boolean(c))

    return controls
  }
}

export default MapMediator
