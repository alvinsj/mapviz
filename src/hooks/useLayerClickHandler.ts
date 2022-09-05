/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react'
import { useMap } from 'react-map-gl'

export function useLayerClickHandler(
  mapId: string,
  layerId: string,
  onClick: (ev: any) => void
) {
  const { [mapId]: map } = useMap()
  useEffect(() => {
    if (!map) return

    console.log('mapRef.current', map)
    map.on('click', layerId, onClick)

    const copy = map
    return () => {
      copy?.off('click', layerId, onClick)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map])
}

export default useLayerClickHandler
