import WarehouseIcon from '@mui/icons-material/Warehouse'
import Divider from '@mui/material/Divider'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import React from 'react'

export default function DepoItem({ todo, depoCode, handleListItemClick }) {
  return (
    <ListItemButton key={todo.code} value={depoCode} onClick={() => handleListItemClick(todo.code, todo.name)}>
      <ListItemIcon>
        <WarehouseIcon />
      </ListItemIcon>
      <ListItemText primary={todo.name} />
      <Divider />
    </ListItemButton>
  )
}
