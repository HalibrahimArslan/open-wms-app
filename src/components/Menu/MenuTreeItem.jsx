import { Collapse, List, ListItemButton, ListItemText, ListItemIcon, useTheme } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import SettingsIcon from '@mui/icons-material/Settings'
import RemoveIcon from '@mui/icons-material/Remove'
import { useState } from 'react'
import MenuItem from './MenuItem'
import Iconify from '../Iconify/Iconify'

export default function MenuTreeItem({ item, children, leaf, handleClick, openMenuId, handleToggle }) {
  const theme = useTheme()
  const isOpen = openMenuId === item.id

  const handleOperate = (item) => {
    if (!leaf) {
      handleToggle(item.id)
    }
    handleClick(item)
  }

  return (
    <>
      <ListItemButton
        onClick={() => handleOperate(item)}
        selected={openMenuId === item.id}
        sx={{
          borderRadius: 3,
          paddingRight: 2,
          paddingLeft: 2,
          '&:before': {
            content: '""',
            position: 'absolute',
            width: 3,
            height: '90%',
            left: '2rem',
            backgroundColor: theme.palette.primary.main,
            borderRadius: 3,
            display: leaf ? (children ? 'none' : 'block') : 'none',
          },
        }}
      >
        <ListItemIcon>
          {leaf ? (
            <></>
          ) : item.icon ? (
            <Iconify
              icon={item.icon}
              style={{
                color: openMenuId === item.id && theme.palette.primary.main,
              }}
            />
          ) : (
            <SettingsIcon />
          )}
        </ListItemIcon>
        <ListItemText primary={item.name} />
        {item.children.length > 0 ? isOpen ? <RemoveIcon /> : <AddIcon /> : <></>}
      </ListItemButton>
      <Collapse in={item.children.length > 0 && isOpen} timeout="auto" unmountOnExit>
        <MenuItem data={item.children} leaf={true} handleClick={handleClick} openMenuId={openMenuId} handleToogle={handleToggle} />
      </Collapse>
    </>
  )
}
