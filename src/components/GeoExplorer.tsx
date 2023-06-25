import { useState, useEffect, useCallback } from 'react'
import Tree from './Tree'
import { useContextSelector } from 'use-context-selector'
import context from '../context'
import { GeoJSONFeature } from 'maplibre-gl'

const label = (title: string, count?: number) =>
  <span style={{ color: 'gray' }}>{title} <sup>{count && `(${count})`}</sup></span>

const getTree = (obj: any) => {
  if (obj && typeof obj === 'object') {
    const items = Object.keys(obj).map((key) => {
      return (
        <Tree key={key}
          summary={
            typeof obj[key] === 'object' ?
              label(key, obj[key] instanceof Array ? obj[key].length : null) :
              <>{label(key)}: {getTree(obj[key])}</>
          }
          hideCollapsible={typeof obj[key] !== 'object' || obj[key] === null}
        >
          {getTree(obj[key])}
        </Tree >
      )
    })

    return <ul>{items}</ul>

  } else {
    return obj
  }
}

const GeoExplorer = () => {

  const setContextState = useContextSelector(context, v => (v as any)[1])
  const setMapLayerData = useCallback((data: GeoJSONFeature) => {
    setContextState((s: any) => ({
      ...s,
      mapLayerData: data,
    }))
  }, [setContextState])
  // read the geojson file
  const [data, setData] = useState(null)

  // show structure of the geojson file recursively in a tree 
  const [tree, setTree] = useState(null)
  useEffect(() => {
    if (data) {
      setTree(getTree(data))
      setMapLayerData(data)
    }
  }
    , [data, setMapLayerData])


  return (
    <div>
      <h1>GeoExplorer</h1>

      {/* file input to load data */}
      <input type="file" onChange={(e) => {
        const target = e.target as HTMLInputElement
        const file = target?.files?.[0]
        const reader = new FileReader()
        reader.onload = (e) => {
          const target = e.target as FileReader
          const fileUrl = target.result as string
          const data = JSON.parse(fileUrl)
          setData(data)
        }
        if (file) reader.readAsText(file)
      }} />

      <ul>{tree}</ul>
    </div>
  )

}

export default GeoExplorer

