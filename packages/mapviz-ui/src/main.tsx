import React from 'react'
import ReactDOM from 'react-dom/client'
import { MapProvider } from 'react-map-gl'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.scss'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <MapProvider>
        <App />
      </MapProvider>
    </BrowserRouter>
  </React.StrictMode>
)
