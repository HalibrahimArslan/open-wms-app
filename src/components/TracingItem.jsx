import { Grid, Paper, Box, Typography, Divider } from '@mui/material'
import React from 'react'

export default function TracingItem({ content, header }) {
  return (
    <Grid
      component={Paper}
      sx={{
        p: 2,
      }}
    >
      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        <Typography
          variant="h5"
          sx={{
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {header}
        </Typography>
      </Box>
      <Divider />
      <Box
        sx={{
          marginTop: 2,
          display: 'flex',
          flexGrow: 1,
          justifyContent: 'center',
        }}
      >
        <Typography variant="h3">{content}</Typography>
      </Box>
    </Grid>
  )
}
