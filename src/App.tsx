import { useState } from 'react'
import Map from './components/Map'

import './App.css'

import GeoExplorer from './components/GeoExplorer'
import context from './context'

const StateProvider = ({ children }) => (
  <context.Provider value={useState({ mapLayerData: undefined })}>
    {children}
  </context.Provider>
)


function App() {
  return (
    <StateProvider>
      <div
        className="App"
        style={{
          width: '100vw',
          display: 'flex',
          justifyContent: 'space-around',
        }}
      >
        <div style={{ height: '100vh', width: '40vw', overflow: 'scroll' }}>
          <GeoExplorer />
        </div>
        <Map id="map2" reuseMaps style={{ height: '100vh', width: '60vw' }} />
      </div >
    </StateProvider>
  )
}

export default App
