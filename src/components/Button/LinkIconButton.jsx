import React, { useState } from 'react'
import { Box, Divider, ListItemButton, Typography, useTheme } from '@mui/material'

function LinkIconButton({ list }) {
  const theme = useTheme()
  const [activeItemIndex, setActiveItemIndex] = useState(null)

  const handleItemClick = (index) => {
    setActiveItemIndex(index)
    list[index].onClick && list[index].onClick?.()
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {list.map((item, index) => (
        <ListItemButton
          key={index}
          sx={{
            borderRadius: theme.shape.borderRadius,
            background: activeItemIndex === index ? theme.palette.primary.main : theme.palette.secondary.main,
            color: activeItemIndex === index ? 'white' : 'black',
            '&:hover': {
              background: activeItemIndex === index ? theme.palette.secondary.dark : theme.palette.grey[300],
            },
            gap: 2,
          }}
          onClick={() => handleItemClick(index)}
        >
          {item.icon && (
            <>
              {item.icon}
              <Divider sx={{ height: '30px', width: '1px' }} color={activeItemIndex === index ? '#FFFFFF' : 'black'} orientation="vertical" />
            </>
          )}
          {item.text && <Typography variant="subtitle1">{item.text}</Typography>}
        </ListItemButton>
      ))}
    </Box>
  )
}

export default LinkIconButton
