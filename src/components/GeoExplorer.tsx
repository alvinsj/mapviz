import { useState, useEffect, useCallback } from 'react'
import Tree from './Tree'
import { useContextSelector } from 'use-context-selector'
import context from '../context'

const label = (title, count) =>
  <span style={{ color: 'gray' }}>{title} <sup>{count && `(${count})`}</sup></span>

const getTree = (obj) => {
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

  const setContextState = useContextSelector(context, v => v[1])
  const setMapLayerData = useCallback((data) => {
    setContextState(s => ({
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
        const file = e.target.files[0]
        const reader = new FileReader()
        reader.onload = (e) => {
          const data = JSON.parse(e.target.result)
          setData(data)
        }
        reader.readAsText(file)
      }} />

      <ul>{tree}</ul>
    </div>
  )

}

export default GeoExplorer

