import React from 'react'
import { Box, List, ListItem, ListItemText, Typography, Paper, Divider, Button } from '@mui/material'
import { CheckCircle } from '@mui/icons-material'

export default function ComboItemPartial({ value, handleChange, list = [], label = 'Seçim yapınız', handleComplete }) {
  const handleItemSelect = (item) => {
    handleChange(item.key)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      {label && (
        <Typography variant="h6" sx={{ mb: 1, color: 'text.secondary' }}>
          {label}
        </Typography>
      )}

      <Paper
        elevation={2}
        sx={{
          maxHeight: 300,
          overflow: 'hidden',
          borderRadius: 2,
        }}
      >
        <List sx={{ p: 1, overflow: 'auto' }}>
          {list.length > 0 ? (
            list.map((item, index) => (
              <React.Fragment key={item.key}>
                <ListItem
                  onClick={() => handleItemSelect(item)}
                  sx={{
                    borderRadius: 1,
                    cursor: 'pointer',
                    backgroundColor: item.key === value ? 'primary.main' : 'transparent',
                    color: item.key === value ? 'primary.contrastText' : 'text.primary',
                    '&:hover': {
                      backgroundColor: item.key === value ? 'primary.dark' : 'action.hover',
                    },
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 500,
                        }}
                      >
                        {item.orderNo} - {item.stockCode}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        variant="body2"
                        sx={{
                          color: item.key === value ? 'primary.contrastText' : 'text.secondary',
                        }}
                      >
                        {item.code}
                      </Typography>
                    }
                  />
                </ListItem>
                {index < list.length - 1 && (
                  <Divider
                    sx={{
                      mx: 2,
                      my: 0.5,
                      opacity: 0.6,
                    }}
                  />
                )}
              </React.Fragment>
            ))
          ) : (
            <ListItem>
              <ListItemText
                primary={
                  <Typography
                    variant="body2"
                    align="center"
                    sx={{
                      color: 'text.secondary',
                    }}
                  >
                    Liste boş
                  </Typography>
                }
              />
            </ListItem>
          )}
        </List>
      </Paper>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <Button variant="contained" disabled={!value} onClick={handleComplete} startIcon={<CheckCircle />}>
          Tamamla
        </Button>
      </Box>
    </Box>
  )
}
