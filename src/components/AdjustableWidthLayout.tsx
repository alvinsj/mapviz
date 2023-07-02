import { useState } from 'react'

import './AdjustableWidthLayout.css'
type Props = {
  contents: React.FC<{ width: number }>[]
  initialWidths: number[]
}

const AdjustableWidthLayout: React.FC<Props> = ({ contents, initialWidths }: Props) => {
  const [widths, setWidths] = useState<number[]>(initialWidths)

  const handleResize = (index: number, adjustedWidth: number) => {
    const newWidths = [...widths]
    const newWidth = Math.max(adjustedWidth, 300)

    newWidths[index] = newWidth
    // adjust the width of the next element to keep the total width the same
    newWidths[index + 1] = newWidths[index + 1] - (newWidth - widths[index])
    setWidths(newWidths)
  }

  return (
    <div className="adjustable-width-layout">
      {widths.map((width, index) => {
        const Child = contents[index]
        return (
          <div
            key={index}
            className="adjustable-width-element"
            style={{ width: `${width}px` }}
          >
            <Child width={width} />
            <div
              className="resize-handle"
              onMouseDown={(e) => {
                const startX = e.clientX
                const startWidth = width

                const handleMouseMove = (event: MouseEvent) => {
                  const newWidth = startWidth + event.clientX - startX
                  handleResize(index, newWidth)
                }

                const handleMouseUp = () => {
                  window.removeEventListener('mousemove', handleMouseMove)
                  window.removeEventListener('mouseup', handleMouseUp)
                }

                window.addEventListener('mousemove', handleMouseMove)
                window.addEventListener('mouseup', handleMouseUp)
              }}
            />
          </div>)
      })}
    </div>
  )
}


export default AdjustableWidthLayout
