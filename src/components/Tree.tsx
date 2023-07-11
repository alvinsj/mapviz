/* eslint-disable react/display-name */
import { useState, ReactNode, useRef } from 'react'
import List from 'react-virtualized/dist/commonjs/List'
import 'react-virtualized/styles.css'
import './Tree.css'

function renderItem(listRef, item, keyPrefix) {
  const onClick = function (event) {
    event.stopPropagation()
    item.expanded = !item.expanded

    listRef?.current.recomputeRowHeights()
    listRef?.current.forceUpdate()
  }

  const props = { key: keyPrefix }
  let children = []
  let itemText

  if (item.expanded) {
    props.onClick = onClick
    itemText = <span>{'[-] '} {item.name}</span>
    children = item.children.map(function (child, index) {
      return renderItem(listRef, child, keyPrefix + '-' + index)
    })
  } else if (item.children.length) {
    props.onClick = onClick
    itemText = <span>{'[+] '} {item.name}</span>
  } else {
    itemText = <span>{'    '} {item.name}</span>
  }

  children.unshift(
    <div
      {...{
        className: 'item',
        key: itemText,
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

const toCellRenderer = (listRef, items) => (params) => {
  const renderedCell = renderItem(listRef, items[params.index], params.index)

  return (
    <ul key={params.key} style={params.style}>
      {renderedCell}
    </ul>
  )
}

function getExpandedItemCount(item) {
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

const toRowHeight = (data) => (params) => {
  const height = getExpandedItemCount(data[params.index]) * 30
  return height
}

const entriesToItems = ([key, value]) => {
  if (value && typeof value === 'object') {
    return {
      name: key,
      expanded: false,
      children: Object.entries(value).map(entriesToItems),
    }
  } else {
    return {
      name: <span>{key}: <code>{value}</code></span>,
      expanded: false,
      children: [],
    }
  }
}
export type Props = { data: mapboxgl.MapboxGeoJSONFeature, width: number }

export const TreeList = ({ data, width }: Props) => {
  const listRef = useRef()

  if (!data || Object.keys(data).length === 0) return null

  const items = Object.entries(data).map(entriesToItems)

  return (
    <List
      ref={listRef}
      width={width}
      height={window.innerHeight / 1.5}
      rowHeight={toRowHeight(items)}
      rowCount={items.length}
      rowRenderer={toCellRenderer(listRef, items)}
    />
  )
}

export default TreeList
