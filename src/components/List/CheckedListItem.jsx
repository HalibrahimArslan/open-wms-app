import * as React from 'react'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Checkbox from '@mui/material/Checkbox'
import NotFound from '../../shared/components/NotFound/NotFound'
import { Divider, Typography, useTheme } from '@mui/material'

const CheckedListItem = React.memo(({ data, displayField, keyField, checkedList, handleCheckedList, multiple = true, header, maxWidth = 360 }) => {
  const theme = useTheme()

  const handleToggle = React.useCallback(
    (value) => () => {
      let newChecked

      if (multiple) {
        const currentIndex = checkedList.indexOf(value)
        newChecked = [...checkedList]

        if (currentIndex === -1) {
          newChecked.push(value)
        } else {
          newChecked.splice(currentIndex, 1)
        }
      } else {
        newChecked = [value]
      }

      handleCheckedList(newChecked)
    },
    [checkedList, handleCheckedList, multiple]
  )

  if (data.length === 0) {
    return <NotFound msg={'Veri Bulunamadı'} />
  }

  return (
    <List
      sx={{
        width: '100%',
        maxWidth: maxWidth,
        bgcolor: theme.palette.action.hover,
      }}
    >
      {header && (
        <>
          <Typography variant="body2" gutterBottom ml={2}>
            {header}
          </Typography>
          <Divider />
        </>
      )}
      {data.map((value) => (
        <MemoizedListItem
          key={value[keyField]}
          value={value}
          checked={checkedList.indexOf(value[keyField]) !== -1}
          handleToggle={handleToggle(value[keyField])}
          displayField={displayField}
          keyField={keyField}
        />
      ))}
    </List>
  )
})

const MemoizedListItem = React.memo(({ value, checked, handleToggle, displayField, keyField }) => {
  const labelId = `checkbox-list-label-${value[keyField]}`

  return (
    <ListItem disablePadding>
      <ListItemButton role={undefined} onClick={handleToggle} dense>
        <ListItemIcon>
          <Checkbox edge="start" checked={checked} tabIndex={-1} disableRipple inputProps={{ 'aria-labelledby': labelId }} />
        </ListItemIcon>
        <ListItemText id={labelId} primary={value[displayField]} />
      </ListItemButton>
    </ListItem>
  )
})

export default CheckedListItem
