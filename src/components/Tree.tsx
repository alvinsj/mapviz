import { useState } from 'react'

// collapsible tree list item component
const Tree = ({ summary, hideCollapsible, children }) => {
  const [collapsed, setCollapsed] = useState(true)

  return (
    <li>
      {summary}
      {!hideCollapsible && <span style={{ cursor: 'pointer' }} onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? ' ▶' : ' ▼'}
      </span>}
      <span style={{ display: collapsed ? 'none' : 'block' }}>{children}</span>
    </li>
  )
}

export default Tree

