/* eslint-disable react/display-name */
import { useRef, ReactElement } from 'react'
import List, { ListRowProps } from 'react-virtualized/dist/commonjs/List'
import 'react-virtualized/styles.css'
import './Tree.css'
import { Index } from 'react-virtualized'

function renderItem(
  listRef: ListRef,
  item: Item,
  keyPrefix: string
): ReactElement {
  const onClick = function (event: any) {
    event.stopPropagation()
    item.expanded = !item.expanded

    listRef?.current.recomputeRowHeights()
    listRef?.current.forceUpdate()
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const props = { key: keyPrefix, onClick: (event: any) => { } }
  let children: Array<any> = []
  let itemText

  if (item.expanded) {
    props.onClick = onClick
    itemText = (
      <span>
        {'[-] '} {item.name}
      </span>
    )
    children = item.children.map(function (child, index) {
      return renderItem(listRef, child, keyPrefix + '-' + index)
    })
  } else if (item.children.length) {
    props.onClick = onClick
    itemText = (
      <span>
        {'[+] '} {item.name}
      </span>
    )
  } else {
    itemText = (
      <span>
        {'    '} {item.name}
      </span>
    )
  }

  children.unshift(
    <div
      {...{
        className: 'item',
        style: {
          cursor: item.children.length ? 'pointer' : 'auto',
        },
      }}
    >
      {itemText}
    </div>
  )

  return (
    <ul>
      <li {...props}>{children}</li>
    </ul>
  )
}

const toCellRenderer =
  (listRef: ListRef, items: Item[]) => (params: ListRowProps) => {
    const renderedCell = renderItem(
      listRef,
      items[params.index],
      `${params.index}`
    )

    return (
      <ul key={params.key} style={params.style}>
        {renderedCell}
      </ul>
    )
  }

function getExpandedItemCount(item: Item) {
  let count = 1

  if (item.expanded) {
    count += item.children
      .map(getExpandedItemCount)
      .reduce(function (total, count) {
        return total + count
      }, 0)
  }

  return count
}

const toRowHeight = (items: Item[]) => (params: Index) => {
  const height = getExpandedItemCount(items[params.index]) * 35
  return height
}

type Item = {
  name: string | ReactElement
  expanded: boolean
  children: Item[] | never[]
}

type MapEntries = (entry: [string, any]) => Item

const entriesToItems: MapEntries = ([key, value]) => {
  if (value && typeof value === 'object') {
    const items = Object.entries(value).map(entriesToItems)
    return {
      name: (
        <span>
          {key} <sup>({items.length})</sup>
        </span>
      ),
      expanded: false,
      children: items,
    }
  } else {
    return {
      name: (
        <span>
          {key}: <code>{value}</code>
        </span>
      ),
      expanded: false,
      children: [],
    }
  }
}
export type Props = { data: mapboxgl.MapboxGeoJSONFeature; width: number }

// FIXME: any
type ListRef = any
export const TreeList = ({ data, width }: Props) => {
  const listRef = useRef<ListRef | undefined>()

  if (!data || Object.keys(data).length === 0) return null

  const items = Object.entries(data).map(entriesToItems)

  return (
    <List
      ref={listRef}
      width={width}
      height={window.innerHeight * 0.5}
      rowHeight={toRowHeight(items)}
      rowCount={items.length}
      rowRenderer={toCellRenderer(listRef, items)}
    />
  )
}

export default TreeList
