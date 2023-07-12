import { Container } from '@grafana/ui'
import { useCallback, useEffect, useState, FC } from 'react'
import { useContextSelector } from 'use-context-selector'
import useSWR from 'swr'
import { mergeWith, isArray } from 'lodash'
import { Field } from '@grafana/ui'
import Tree from './Tree'

import context from '../context'
import { get, curryRight } from 'lodash'
import mapboxgl from 'mapbox-gl'

const bounds = [103.58, 1.16, 104.1, 1.5]
const boundsInQuery = {
  lomin: bounds[0] + '',
  lamin: bounds[1] + '',
  lomax: bounds[2] + '',
  lamax: bounds[3] + '',
}
function customizer(objValue: any, srcValue: any) {
  if (isArray(objValue)) {
    return objValue.concat(srcValue)
  }
}
const propertyMap = [
  'icao24',
  'callsign',
  'origin_country',
  'time_position',
  'last_contact',
  'longitude',
  'latitude',
  'baro_altitude',
  'on_ground',
  'velocity',
  'true_track',
  'vertical_rate',
  'sensors',
  'geo_altitude',
  'squawk',
  'spi',
  'position_source',
  'category',
]
const makeLens = (path: string) => curryRight(get, 2)(path)

const memoryCache = {} as any
const generateRandomDarkThemeColor = (key: string) => {
  if (memoryCache[key]) {
    return memoryCache[key]
  }

  const r = Math.floor(Math.random() * 200) + 55
  const g = Math.floor(Math.random() * 200) + 55
  const b = Math.floor(Math.random() * 200) + 55

  memoryCache[key] = `rgb(${r},${g},${b})`
  return memoryCache[key]
}

type GeoJsonFeatureMapper = (
  key: string,
  point: any,
  latLens: any,
  longLens: any,
  propertyMap: any
) => GeoJSON.Feature

const toPointGeoJsonFeature: GeoJsonFeatureMapper = (
  key,
  point,
  latLens,
  longLens,
  propertyMap
) => {
  const [longitude, latitude] = [longLens(point), latLens(point)]
  return {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [longitude, latitude],
    },
    properties: Object.keys(propertyMap).reduce(
      (acc, key) => {
        const name = `${propertyMap[key]}`.trim()
        acc[name] = `${point[key]}`.trim()
        return acc
      },
      { color: generateRandomDarkThemeColor(key) } as any
    ),
  }
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

type FetchStatusProps = {
  url: string
  onUpdateData: (data: mapboxgl.MapboxGeoJSONFeature) => void
}
const FetchStatus: FC<FetchStatusProps> = ({ url, onUpdateData }) => {
  const setContextState = useContextSelector(context, (v) => (v as any)[1])
  const setAPILayerData = useCallback(
    (data: GeoJSON.FeatureCollection) => {
      setContextState((s: any) => {
        const newData = {
          ...s,
          apiLayerData: { ...mergeWith(s.apiLayerData, data, customizer) },
        }
        onUpdateData(newData.apiLayerData)
        return newData
      })
    },
    [setContextState]
  )

  const { data, error } = useSWR(url, fetcher, { refreshInterval: 10000 })
  useEffect(() => {
    if (data) {
      const latLens = makeLens('6')
      const longLens = makeLens('5')
      const keyLens = makeLens('0')
      const dataPointsLens = makeLens('states')

      const points = dataPointsLens(data).map((point: object) =>
        toPointGeoJsonFeature(
          keyLens(point),
          point,
          latLens,
          longLens,
          propertyMap
        )
      )
      const geoJson: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: points,
      }
      setAPILayerData(geoJson)
    }
  }, [data, setAPILayerData])

  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>

  return (
    <div>
      Loaded{' '}
      <a href={url} target="_blank" rel="noreferrer">
        {new URL(url).pathname} !
      </a>
    </div>
  )
}

type Props = {
  width: number
}
const QueryAPI: React.FC<Props> = ({ width }) => {
  const [url, setUrl] = useState('')
  const [data, setData] = useState<mapboxgl.MapboxGeoJSONFeature | null>(null)
  return (
    <Container padding="md">
      <Field label="Query an API" description="and display API content">
        <button
          onClick={() =>
            setUrl(
              `https://opensky-network.org/api/states/all?${new URLSearchParams(
                boundsInQuery
              )}`
            )
          }
        >
          1. Show flights with opensky-network.org
        </button>
      </Field>
      {url && <FetchStatus url={url} onUpdateData={setData} />}
      {data && (
        <Field label="Structure">
          <Tree width={width} data={data} />
        </Field>
      )}
    </Container>
  )
}

export default QueryAPI
