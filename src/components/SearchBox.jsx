import { Box, OutlinedInput, InputAdornment, IconButton, useTheme } from '@mui/material'
import ControlledRadioGroup from './Radio/ControlledRadioGroup'
import { useState } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha'
import SwipeableDrawerWrapper, { SwipeableDrawerHeader } from '../shared/components/Slider/SwipeableDrawerWrapper'

export default function SearchBox({ search, handleChangeSearch, searchLabel, zIndex, top, size, data, value, handleChange, drawerHeaderTitle, actionIcon }) {
  const anchor = 'bottom'
  const theme = useTheme()
  const ActionIcon = actionIcon || SortByAlphaIcon
  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  })

  const handleChangeValue = (e) => {
    handleChangeSearch(e.target.value)
  }

  const handleClear = () => {
    handleChangeSearch('')
  }

  const toggleDrawer = (anchor, open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return
    }
    setState({ ...state, [anchor]: open })
  }

  return (
    <Box
      position="sticky"
      zIndex={zIndex ? 10 : 0}
      top={top || '0px'}
      sx={{
        display: 'flex',
        margin: '5px',
      }}
    >
      <OutlinedInput
        id="search-box-input"
        value={search || ''}
        onChange={handleChangeValue}
        fullWidth
        placeholder={searchLabel || 'Ara'}
        size={size || 'medium'}
        startAdornment={
          <InputAdornment position="start">
            <SearchIcon sx={{ color: 'text.secondary' }} />
          </InputAdornment>
        }
        endAdornment={
          search ? (
            <InputAdornment position="end">
              <IconButton onClick={handleClear} edge="end" size="small" aria-label="temizle">
                <ClearIcon fontSize="small" sx={{ color: 'text.secondary' }} />
              </IconButton>
            </InputAdornment>
          ) : null
        }
        sx={{
          borderRadius: '20px',
          backgroundColor: theme.palette.background.paper,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.divider,
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.main,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.main,
          },
          boxShadow: theme.shadows[1],
        }}
      />
      {data && value && handleChange && drawerHeaderTitle && (
        <>
          <IconButton
            size="small"
            color="primary"
            aria-label="directions"
            sx={{
              position: 'absolute',
              right: 5,
              top: '50%',
              transform: 'translate(0%, -50%)',
            }}
            onClick={toggleDrawer(anchor, true)}
          >
            <ActionIcon />
          </IconButton>
          <SwipeableDrawerWrapper anchor={anchor} state={state} toggleDrawer={toggleDrawer}>
            <SwipeableDrawerHeader title={drawerHeaderTitle} searchable={false} />
            <Box sx={{ p: 2 }}>
              <ControlledRadioGroup formTitle="" value={value} handleChange={handleChange} data={data} />
            </Box>
          </SwipeableDrawerWrapper>
        </>
      )}
    </Box>
  )
}
