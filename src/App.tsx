import { useState, ReactNode, FC, useEffect } from 'react'
import Map from './components/Map'
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom'

import './App.css'

import GeoJsonExplorer from './components/GeoJsonExplorer'
import context from './context'
import { TabContent, TabsBar, Tab, PageToolbar } from '@grafana/ui'
import AdjustableWidthLayout from './components/AdjustableWidthLayout'
import AvailableData from './components/AvailableData'
import QueryAPI from './components/QueryAPI'

type StateProviderProps = {
  children: ReactNode
}
const StateProvider = ({ children }: StateProviderProps) => (
  <context.Provider value={useState({ mapLayerData: undefined })}>
    {children}
  </context.Provider>
)

const initialTabs = [
  {
    label: 'Open a map layer',
    key: 'explore',
    element: (width: number) => <GeoJsonExplorer width={width - 32 - 8} />,
    active: true,
    path: '/',
  },
  {
    label: 'Available data',
    key: 'data',
    element: () => <AvailableData />,
    active: false,
    path: '/data',
  },
  {
    label: 'Query API',
    key: 'query',
    element: (width: number) => <QueryAPI width={width - 32 - 8} />,
    active: false,
    path: '/query',
  },
]

const Left: FC<{ width: number }> = ({ width }) => {
  const [tabs, updateTabs] = useState(initialTabs)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const tab = tabs.find((tab) => tab.path === location.pathname)
    if (tab && !tab.active) {
      updateTabs(
        tabs.map((tab) => ({ ...tab, active: tab.path === location.pathname }))
      )
    }
  }, [location.pathname, tabs])

  return (
    <main className="main" style={{ width }}>
      <TabsBar>
        {tabs.map((tab, index) => {
          return (
            <Tab
              key={index}
              label={tab.label}
              active={tab.active}
              onChangeTab={() => {
                updateTabs(
                  tabs.map((tab, idx) => ({ ...tab, active: idx === index }))
                )
                navigate(tab.path, { replace: true })
              }}
            />
          )
        })}
      </TabsBar>
      <TabContent className="tabContent">
        <Routes>
          {tabs.map((tab) => (
            <Route key={tab.key} path={tab.path} element={tab.element(width)} />
          ))}
        </Routes>
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
