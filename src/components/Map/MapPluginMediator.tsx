import { ComponentType, ReactNode } from 'react'
import { MapProps } from 'react-map-gl'

export type UseControlsProps = {
  key: string
}

export type Plugin = {
  name: string
  component: ComponentType<{ mapId: string }>
  hooks?: {
    useControls?: (mapId: string, props: UseControlsProps) => ReactNode
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

  renderMapChildren(mapId: string) {
    return this._plugins.map((p) => {
      const Child = p.component
      return <Child key={p.name} mapId={mapId} />
    })
  }

  renderCustomControls(mapId: string) {
    const c = this._plugins
      .map((p) => {
        const control = p?.hooks?.useControls?.(mapId, {
          key: `customControls-${p.name}`,
        })
        return control
      })
      .filter((c) => c)

    return c
  }
}

export default MapMediator
