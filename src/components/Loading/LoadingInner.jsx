import React from 'react'
import { CircularProgress, Box, Alert, useTheme } from '@mui/material'

export default function LoadingInner({ text }) {
  const theme = useTheme()
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        padding: 2,
      }}
    >
      <Alert severity="warning">{text}</Alert>
      <CircularProgress color="primary" />
    </Box>
  )
}
