import Map from './components/Map'

import './App.css'

function App() {
  return (
    <div
      style={{
        width: '100vw',
        display: 'flex',
        justifyContent: 'space-around',
      }}
    >
      <Map id="map2" reuseMaps style={{ height: '90vh', width: '45vw' }} />
      <Map id="map1" reuseMaps style={{ height: '90vh', width: '45vw' }} />
    </div>
  )
}

export default App
