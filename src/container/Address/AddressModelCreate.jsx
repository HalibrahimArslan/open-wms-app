import React from 'react'
import { List } from '@mui/material'
import ColumnVisibilityItem from '../../components/Table/ColumnVisibilityItem'

const AddressModelCreate = ({ addressModel, setAddressModel }) => {
  const handleChangeVisibility = (field, newValue) => {
    setAddressModel((prev) => prev.map((column) => (column.field === field ? { ...column, visible: newValue } : column)))
  }

  const moveListItem = (dragIndex, hoverIndex) => {
    setAddressModel((prev) => {
      const next = [...prev]
      const [movedItem] = next.splice(dragIndex, 1)
      next.splice(hoverIndex, 0, movedItem)
      return next
    })
  }

  return (
    <List>
      {addressModel.map((model, index) => {
        const locked = model.field === 'HALL'
        return (
          <ColumnVisibilityItem
            key={model.field}
            column={model}
            handleChangeVisibility={handleChangeVisibility}
            index={index}
            moveListItem={moveListItem}
            locked={locked}
            draggable={!locked}
          />
        )
      })}
    </List>
  )
}

export default AddressModelCreate
