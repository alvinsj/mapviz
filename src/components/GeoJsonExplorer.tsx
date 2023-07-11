import { useState, useEffect, useCallback } from 'react'
import { GeoJSONFeature } from 'maplibre-gl'
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

import Tree from './Tree'
import context from '../context'
import { useLocation } from 'react-router-dom'
import useMultiPolygonLayer from '../hooks/useMultiPolygonLayer'

const label = (title: string, count?: number) => (
  <span style={{ color: 'gray' }}>
    {title} <sup>{count && `(${count})`}</sup>
  </span>
)

const getTree = (obj: any) => {
  if (obj && typeof obj === 'object') {
    const items = Object.keys(obj).map((key) => {
      return (
        <Tree
          key={key}
          summary={
            typeof obj[key] === 'object' ? (
              label(key, obj[key] instanceof Array ? obj[key].length : null)
            ) : (
              <>
                {label(key)}: {getTree(obj[key])}
              </>
            )
          }
          hideCollapsible={typeof obj[key] !== 'object' || obj[key] === null}
        >
          {getTree(obj[key])}
        </Tree>
      )
    })

    return <ul>{items}</ul>
  } else {
    return obj
  }
}
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

const GeoJsonExplorer = () => {
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
  const [tree, setTree] = useState(null)
  const [file, setFile] = useState('')
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    if (data) {
      setTree(getTree(data))
      setMapLayerData(data)
      setLoading(false)
    }
  }, [data, setMapLayerData])

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
