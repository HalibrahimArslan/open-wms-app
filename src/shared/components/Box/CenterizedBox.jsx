import { Box } from '@mui/material'
import React from 'react'

export default function CenterizeBox(props) {
  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      {props.children}
    </Box>
  )
}
