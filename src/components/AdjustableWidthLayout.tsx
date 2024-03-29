import { useEffect, useState } from 'react'

import './AdjustableWidthLayout.css'
type Props = {
  contents: React.FC<{ width: number }>[]
  initialWidths: number[]
}

const AdjustableWidthLayout: React.FC<Props> = ({
  contents,
  initialWidths,
}: Props) => {
  const [widths, setWidths] = useState<number[]>(initialWidths)

  const handleResize = (index: number, adjustedWidth: number) => {
    const newWidths = [...widths]
    let newWidth = Math.max(adjustedWidth, 300)
    newWidth = Math.min(newWidth, window.innerWidth - 300)

    newWidths[index] = newWidth
    // adjust the width of the next element to keep the total width the same
    newWidths[index + 1] = newWidths[index + 1] - (newWidth - widths[index])
    setWidths(newWidths)
  }

  useEffect(() => {
    setWidths(initialWidths)
  }, [initialWidths])

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
              onPointerDown={(e) => {
                const startX = e.clientX
                const startWidth = width

                const handlePointerMove = (event: PointerEvent) => {
                  const newWidth = startWidth + event.clientX - startX
                  handleResize(index, newWidth)
                }

                const handlePointerUp = () => {
                  window.removeEventListener('pointermove', handlePointerMove)
                  window.removeEventListener('pointerup', handlePointerUp)
                }

                window.addEventListener('pointermove', handlePointerMove)
                window.addEventListener('pointerup', handlePointerUp)
              }}
            />
          </div>
        )
      })}
    </div>
  )
}

export default AdjustableWidthLayout
