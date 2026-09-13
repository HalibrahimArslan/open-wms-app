import React, { useCallback } from 'react'
import { List, useTheme } from '@mui/material'
import ColumnVisibilityItem from '../../components/Table/ColumnVisibilityItem'

const AddressModelCreate = ({ addressModel, setAddressModel }) => {
  const theme = useTheme()
  const handleChangeVisibility = (field, newValue) => {
    setAddressModel((prev) => prev.map((column) => (column.field === field ? { ...column, visible: newValue } : column)))
  }

  return (
    <List>
      {addressModel.map((model, index) => (
        <ColumnVisibilityItem key={model.field} column={model} handleChangeVisibility={handleChangeVisibility} index={index} moveListItem={() => {}} />
      ))}
    </List>
  )
}

export default AddressModelCreate
