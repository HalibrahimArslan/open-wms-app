import { Box, Divider, Typography, useTheme } from '@mui/material'
import React from 'react'

function AddressInfo({ miktar, address }) {
  const theme = useTheme()

  return (
    <Box
      sx={{
        display: 'flex',
        p: 1,
        border: '2px solid',
        gap: 1,
        borderColor: theme.palette.primary.main,
        background: theme.palette.secondary.secondary,
        borderRadius: 1,
        width: '100%',
        position: 'relative',
        justifyContent: 'space-between',
      }}
    >
      <Typography
        sx={{
          fontWeight: theme.typography.fontWeightBold,
        }}
      >
        {' '}
        {address}{' '}
      </Typography>
      <Box sx={{ flexGrow: 1 }} />
      <Divider orientation="vertical" flexItem />
      <Typography> {miktar} </Typography>
    </Box>
  )
}

export default AddressInfo
