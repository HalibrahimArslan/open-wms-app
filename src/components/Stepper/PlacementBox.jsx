import React from 'react'
import { Box, TextField, useTheme } from '@mui/material'

export default function PlacementBox({ label, value, handleChange, fetchData, disable }) {
  const theme = useTheme()
  return (
    <Box
      sx={{
        padding: 2,
        margin: 2,
        borderRadius: theme.shape.borderRadius,
        bgcolor: theme.palette.secondary.main,
        display: 'flex',
        flexGrow: 1,
        justifyContent: 'center',
      }}
    >
      <TextField
        id="outlined-basic"
        disabled={disable}
        label={label}
        variant="outlined"
        value={value}
        onChange={handleChange}
        onKeyPress={(ev) => {
          if (ev.key === 'Enter') {
            ev.preventDefault()
            fetchData()
          }
        }}
      />
    </Box>
  )
}
