import * as React from 'react'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Checkbox from '@mui/material/Checkbox'
import { Box } from '@mui/material'
import useDebounce from '../../hooks/useDebounce'
import SearchBox from '../SearchBox'

export default function DynamicSearchBox({ checked, setChecked, bulkList, searchText, handleChangeSearch, searchTextSize, displayField, keyField, searchValue }) {
  const [filteredList, setFilteredList] = React.useState([bulkList])

  const debouncedSearchText = useDebounce(searchText, 100)

  React.useEffect(() => {
    if (searchText.length > 0) {
      setFilteredList(bulkList.filter((item) => item[displayField].includes(debouncedSearchText.toUpperCase())))
    } else {
      setFilteredList(bulkList)
    }
  }, [searchText])

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value)
    const newChecked = [...checked]

    if (currentIndex === -1) {
      newChecked.push(value)
    } else {
      newChecked.splice(currentIndex, 1)
    }
    setChecked(newChecked)
  }

  React.useEffect(() => {
    setFilteredList(bulkList)
  }, [bulkList])

  return (
    <Box>
      <SearchBox handleChangeSearch={handleChangeSearch} top={5} size={searchTextSize} search={searchValue} />
      <List sx={{ width: '100%', width: 250, height: 200, overflow: 'auto' }}>
        {filteredList.map((item) => {
          const labelId = `checkbox-list-label-${item[keyField]}`
          return (
            <ListItem key={item[keyField]} disablePadding>
              <ListItemButton role={undefined} onClick={handleToggle(item[keyField])} dense>
                <ListItemIcon>
                  <Checkbox edge="start" checked={checked.indexOf(item[keyField]) !== -1} tabIndex={-1} disableRipple inputProps={{ 'aria-labelledby': labelId }} size="small" />
                </ListItemIcon>
                <ListItemText id={labelId} primary={`${item[displayField]}`} sx={{ fontSize: 2 }} />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>
    </Box>
  )
}
