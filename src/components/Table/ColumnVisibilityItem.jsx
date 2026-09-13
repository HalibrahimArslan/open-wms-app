import React, { useState } from 'react'
import { DraggableListItem } from './DraggableListItem'

const ColumnVisibilityItem = ({ column, handleChangeVisibility, index, moveListItem, disabled }) => {
  const [checked, setChecked] = useState(column.visible)

  const handleChecked = (event) => {
    setChecked(event.target.checked)
    handleChangeVisibility(column.field, event.target.checked)
  }
  return (
    <DraggableListItem
      key={column.field}
      index={index}
      id={index}
      text={column.headerName}
      moveListItem={moveListItem}
      checked={checked}
      handleChecked={handleChecked}
      disabled={disabled}
    />
  )
}

export default ColumnVisibilityItem
