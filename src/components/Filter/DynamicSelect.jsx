import { Box, Button, Menu, useTheme } from '@mui/material'
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined'
import { useState } from 'react'
import DynamicSearchBox from './DynamicSearchBox'

const DynamicSelect = ({ buttonName, icon, data, checkedFilter, setCheckedFilter, displayField, keyField }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [searchText, setSearchText] = useState('')

  const theme = useTheme()
  const open = Boolean(anchorEl)

  const handleChangeSearch = (text) => {
    setSearchText(text)
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <Box sx={{ minWidth: 100 }}>
      <Button
        sx={{
          textTransform: 'none',
          borderColor: theme.palette.grey[300],
          borderRadius: 2,
          py: 1,
        }}
        variant="outlined"
        startIcon={icon}
        endIcon={<KeyboardArrowDownOutlinedIcon />}
        onClick={handleClick}
      >
        {buttonName}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        sx={{
          borderRadius: 2,
        }}
      >
        <DynamicSearchBox
          checked={checkedFilter}
          setChecked={setCheckedFilter}
          bulkList={data}
          searchText={searchText}
          handleChangeSearch={handleChangeSearch}
          searchTextSize="small"
          displayField={displayField ? displayField : 'value'}
          keyField={keyField ? keyField : 'id'}
          searchValue={searchText}
        />
      </Menu>
    </Box>
  )
}

export default DynamicSelect
