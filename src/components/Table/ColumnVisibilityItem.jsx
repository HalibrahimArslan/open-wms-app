import React, { useState } from 'react'
import { DraggableListItem } from './DraggableListItem'

const ColumnVisibilityItem = ({ column, handleChangeVisibility, index, moveListItem, disabled, draggable, locked }) => {
  const [checked, setChecked] = useState(column.visible)

  const handleChecked = (event) => {
    setChecked(event.target.checked)
    handleChangeVisibility(column.field, event.target.checked)
  }
  return (
    <DraggableListItem
      index={index}
      text={column.headerName}
      moveListItem={moveListItem}
      checked={checked}
      handleChecked={handleChecked}
      disabled={disabled}
      draggable={draggable}
      locked={locked}
    />
  )
}

export default ColumnVisibilityItem
