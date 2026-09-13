import * as React from 'react'
import SwipeableDrawer from '@mui/material/SwipeableDrawer'
import { Box, Button, Divider, Typography, useMediaQuery, useTheme } from '@mui/material'
import { styled } from '@mui/material/styles'
import { grey } from '@mui/material/colors'
import SearchBox from '../../../components/SearchBox'

const StyledBox = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'light' ? '#fff' : grey[800],
}))

const Puller = styled('div')(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: theme.palette.mode === 'light' ? grey[300] : grey[900],
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 20px)',
}))

export const SwipeableDrawerHeader = ({ title, searchable, search, handleChangeSearch, buttonLabel, handleOperate }) => {
  return (
    <StyledBox sx={{ padding: 1, position: 'sticky', top: 0, zIndex: 'tooltip' }}>
      <Puller />
      <Typography variant="subtitle1" component="div" sx={{ p: 1 }}>
        {title}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
        <Box flex={9}>{searchable && <SearchBox search={search} handleChangeSearch={handleChangeSearch} top={10} size="small" />}</Box>
        {buttonLabel && (
          <Box flex={1} sx={{ display: 'flex', justifyContent: 'flex-end', whiteSpace: 'nowrap' }}>
            <Button variant="contained" onClick={handleOperate} sx={{ borderRadius: 20, boxShadow: 0, '&:hover': { boxShadow: 0 } }}>
              {buttonLabel}
            </Button>
          </Box>
        )}
      </Box>

      <Divider />
    </StyledBox>
  )
}

const SwipeableDrawerWrapper = ({ anchor, state, toggleDrawer, children }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
  return (
    <React.Fragment key={anchor}>
      <SwipeableDrawer
        anchor={anchor}
        open={state[anchor]}
        onClose={toggleDrawer(anchor, false)}
        onOpen={toggleDrawer(anchor, true)}
        PaperProps={{
          style: {
            width: isMobile ? '97%' : '600px',
            margin: 'auto',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
        }}
        sx={{ position: 'relative' }}
      >
        <StyledBox sx={{ minHeight: 150, maxHeight: 400, overflow: 'auto' }}>{children}</StyledBox>
      </SwipeableDrawer>
    </React.Fragment>
  )
}

export default SwipeableDrawerWrapper
