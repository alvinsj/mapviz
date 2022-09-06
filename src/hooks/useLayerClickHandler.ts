/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect } from 'react'
import { useMap } from 'react-map-gl'

export function useLayerClickHandler(
  mapId: string,
  layerId: string,
  // FIXME event type
  onClick: (ev: any) => void
) {
  const { [mapId]: map } = useMap()
  useEffect(() => {
    if (!map) return

    map.on('click', layerId, onClick)

    const copy = map
    return () => {
      copy?.off('click', layerId, onClick)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map])

  return {
    add: useCallback(() => {
      map?.on('click', layerId, onClick)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [map]),
    remove: useCallback(() => {
      map?.off('click', layerId, onClick)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [map]),
  }
}

export default useLayerClickHandler
