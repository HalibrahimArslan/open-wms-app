import { Box, Skeleton } from '@mui/material'
import React from 'react'

const RepetableSkeleton = ({ length }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        gap: 1,
      }}
    >
      {Array.from({ length: length }).map((_, index) => (
        <Skeleton key={index} variant="rectangular" height={75} />
      ))}
    </Box>
  )
}

export default RepetableSkeleton
