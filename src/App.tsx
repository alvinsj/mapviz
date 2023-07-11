import { useState, ReactNode, FC, useEffect } from 'react'
import Map from './components/Map'

import './App.css'

import GeoJsonExplorer from './components/GeoJsonExplorer'
import context from './context'
import { TabContent, TabsBar, Tab, PageToolbar } from '@grafana/ui'
import AdjustableWidthLayout from './components/AdjustableWidthLayout'
import AvailableData from './components/AvailableData'

type StateProviderProps = {
  children: ReactNode
}
const StateProvider = ({ children }: StateProviderProps) => (
  <context.Provider value={useState({ mapLayerData: undefined })}>
    {children}
  </context.Provider>
)

const initialTabs = [
  { label: 'Open a map layer', key: 'explore', active: true },
  { label: 'Available data', key: 'data', active: false },
]

const Left: FC<{ width: number }> = ({ width }) => {
  const [tabs, updateTabs] = useState(initialTabs)

  return (
    <main className="main" style={{ width }}>
      <TabsBar>
        {tabs.map((tab, index) => {
          return (
            <Tab
              key={index}
              label={tab.label}
              active={tab.active}
              onChangeTab={() =>
                updateTabs(
                  tabs.map((tab, idx) => ({ ...tab, active: idx === index }))
                )
              }
            />
          )
        })}
      </TabsBar>
      <TabContent className="tabContent">
        {tabs[0].active && <GeoJsonExplorer />}
        {tabs[1].active && <AvailableData />}
      </TabContent>
    </main>
  )
}

const MainMap: FC<{ width: number }> = ({ width }) => {
  return <Map id="main-map" className="map" reuseMaps width={width} />
}

function App() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <StateProvider>
      <PageToolbar title="Explore." />
      <div className="app">
        <AdjustableWidthLayout
          contents={[Left, MainMap]}
          initialWidths={[windowWidth * 0.3, windowWidth * 0.7]}
        />
      </div>
    </StateProvider>
  )
}

export default App
