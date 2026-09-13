import { Box, Divider, IconButton, Typography, useTheme } from '@mui/material'
import { cloneElement } from 'react'
import AddCircleIcon from '@mui/icons-material/AddCircle'

function ActionHeader({ handleClick, title, Icon, hide }) {
  const theme = useTheme()
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: hide ? 1 : 0,
        }}
      >
        <Typography variant="h5" fontWeight={theme.typography.fontWeightMedium}>
          {title}
        </Typography>
        {handleClick && Icon ? (
          <IconButton onClick={handleClick}>{cloneElement(Icon, { sx: { fontSize: 35 } })}</IconButton>
        ) : (
          <IconButton onClick={handleClick} sx={{ display: hide ? 'none' : 'block' }}>
            <AddCircleIcon sx={{ fontSize: 40 }} />
          </IconButton>
        )}
      </Box>
      <Divider flexItem />
      <br />
    </>
  )
}

export default ActionHeader
