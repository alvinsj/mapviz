import { useState, useEffect, useCallback, ReactElement, FC } from 'react'
import {
  FileDropzone,
  FileListItem,
  LoadingPlaceholder,
  withTheme2,
  Field,
  VerticalGroup,
  Container,
  DropzoneFile,
} from '@grafana/ui'
import { useContextSelector } from 'use-context-selector'

import { TreeList } from './Tree'
import context from '../context'
import { useLocation } from 'react-router-dom'
import useMultiPolygonLayer from '../hooks/useMultiPolygonLayer'

const fileListRenderer = (
  file: DropzoneFile,
  removeFile: (file: DropzoneFile) => void
) => {
  return (
    <FileListItem
      file={{ ...file, progress: undefined }}
      removeFile={removeFile}
    />
  )
}
export type Props = { width: number }
const GeoJsonExplorer: FC<Props> = ({ width }) => {
  const setContextState = useContextSelector(context, (v) => (v as any)[1])
  const setMapLayerData = useCallback(
    (data: mapboxgl.MapboxGeoJSONFeature) => {
      setContextState((s: any) => ({
        ...s,
        mapLayerData: data,
      }))
    },
    [setContextState]
  )
  // read the geojson file
  const [data, setData] = useState<mapboxgl.MapboxGeoJSONFeature | null>(null)

  // show structure of the geojson file recursively in a tree
  const [tree, setTree] = useState<ReactElement | null>(null)
  const [file, setFile] = useState('')
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    if (data) {
      setTree(<TreeList width={width} data={data} />)
      setMapLayerData(data)
      setLoading(false)
    }
  }, [data, setMapLayerData, width])

  // use location state to get the url of the geojson file
  const { state: locationState } = useLocation()
  const { mapLayerData } = useMultiPolygonLayer(
    locationState?.url || ''
  )
  const showSelectedLayer = !!locationState?.url && !file
  const isLoading = loading || (locationState?.url && !mapLayerData)
  useEffect(() => {
    if (mapLayerData) {
      setLoading(true)
      setTree(null)
      setData(mapLayerData)
    }
  }, [mapLayerData])

  return (
    <Container padding="md">
      <VerticalGroup spacing="md">
        <Field
          label="Upload a geojson file"
          description="Explore the content upon upload"
        >
          <FileDropzone
            fileListRenderer={fileListRenderer}
            options={{ multiple: false, accept: '.geojson' }}
            readAs="readAsText"
            onLoad={(result) => {
              setLoading(true)
              setFile(result as string)
              setTree(null)
              setData(JSON.parse(result as string))
            }}
          />
        </Field>
        {showSelectedLayer && (
          <a href={locationState.url} target="_blank" rel="noreferrer">
            {locationState.url}
          </a>
        )}
        {isLoading && <LoadingPlaceholder text="Loading data..." />}
        {!!tree && (
          <Field label="Structure">
            <>{tree}</>
          </Field>
        )}
      </VerticalGroup>
    </Container>
  )
}

export default withTheme2(GeoJsonExplorer)
