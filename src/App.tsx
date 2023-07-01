import { useState, ReactNode } from 'react'
import Map from './components/Map'

import './App.css'

import GeoJsonExplorer from './components/GeoJsonExplorer'
import context from './context'
import { TabContent, TabsBar, Tab, PageToolbar } from '@grafana/ui'

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
]

function App() {
  const [tabs, updateTabs] = useState(initialTabs)

  return (
    <StateProvider>
      <PageToolbar title="Explore." />
      <div className="app">
        <main className='main'>
          <TabsBar>
            {tabs.map((tab, index) => {
              return (
                <Tab
                  key={index}
                  label={tab.label}
                  active={tab.active}
                  onChangeTab={() => updateTabs(tabs.map((tab, idx) => ({ ...tab, active: idx === index })))}
                />
              )
            })}
          </TabsBar>
          <TabContent className="tabContent">
            <GeoJsonExplorer />
          </TabContent>
        </main>
        <Map id="map2" className="map" reuseMaps />
      </div>
    </StateProvider>
  )
}

export default App
