import { useState, ReactNode } from 'react'

type Props = {
  summary: ReactNode
  hideCollapsible?: boolean
  children: ReactNode
}
const Tree = ({ summary, hideCollapsible, children }: Props) => {
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

