import React from 'react'
import { Typography, Box, useTheme } from '@mui/material'
import { keyframes } from '@mui/system'

const scrollAnimation = keyframes`
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
`

const MarqueeText = ({ text }) => {
  const theme = useTheme()
  return (
    <Box
      sx={{
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        width: '100%',
        backgroundColor: theme.palette.action.hover,
        minHeight: '50px',
        display: 'flex',
        alignItems: 'center',
        borderRadius: theme.shape.borderRadius,
        my: 1,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          display: 'inline-block',
          animation: `${scrollAnimation} 6s linear infinite`,
          textShadow: `4px 2px 2px  white `,
        }}
      >
        {text}
      </Typography>
    </Box>
  )
}

export default MarqueeText
