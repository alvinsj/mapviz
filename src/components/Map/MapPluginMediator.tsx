import { ComponentType, ReactNode } from 'react'
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
    Base: ComponentType<
      MapProps & { id: string; reuseMaps: true; pluginMediator: MapMediator }
    >
  ) => {
    // one instance per addMapPlugins's call
    const mapMediator = new MapMediator(plugins)

    return function MapWithPlugins(
      props: MapProps & { id: string; reuseMaps: true }
    ) {
      if (!props.id || !props.reuseMaps)
        throw new Error('id and reuseMaps are required props to use Map plugin')

      return (
        <Base {...props} pluginMediator={mapMediator}>
          {mapMediator.renderMapChildren(props.id)}
          {props.children}
        </Base>
      )
    }
  }

export class MapMediator {
  _plugins: Plugin[]

  constructor(plugins: Plugin[]) {
    this._plugins = plugins
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
