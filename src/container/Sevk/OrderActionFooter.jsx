import React from 'react'
import { Box, Button, useTheme, Stack } from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import InventoryIcon from '@mui/icons-material/Inventory'
import RefreshIcon from '@mui/icons-material/Refresh'
import { useMediaQuery } from '@mui/material'

const OrderActionFooter = ({ onComplete, onPallet, onUpdate, updateDisabled }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        p: 2,
        ml: isMobile ? 0 : '260px',
        display: 'flex',
        justifyContent: 'center',
        zIndex: 1100,
        pointerEvents: 'none', // Allow clicking through the outer box
      }}
    >
      <Stack
        direction="row"
        spacing={2}
        sx={{
          width: '100%',
          maxWidth: 600,
          p: 1.5,
          backgroundColor: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(30, 30, 30, 0.9)',
          backdropFilter: 'blur(12px)',
          borderRadius: 4,
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          border: `1px solid ${theme.palette.divider}`,
          pointerEvents: 'auto', // Re-enable pointer events for buttons
        }}
      >
        <Button
          fullWidth
          variant="contained"
          color="success"
          size="large"
          startIcon={<CheckCircleOutlineIcon />}
          onClick={onComplete}
          sx={{
            borderRadius: 3,
            textTransform: 'none',
            fontWeight: 800,
            boxShadow: 'none',
            '&:hover': { boxShadow: theme.shadows[4] },
          }}
        >
          Tamamla
        </Button>

        <Button
          fullWidth
          variant="contained"
          color="primary"
          size="large"
          startIcon={<InventoryIcon />}
          onClick={onPallet}
          sx={{
            borderRadius: 3,
            textTransform: 'none',
            fontWeight: 800,
            boxShadow: 'none',
            '&:hover': { boxShadow: theme.shadows[4] },
          }}
        >
          Palet
        </Button>

        <Button
          fullWidth
          variant="outlined"
          color="inherit"
          size="large"
          disabled={updateDisabled}
          startIcon={<RefreshIcon />}
          onClick={onUpdate}
          sx={{
            borderRadius: 3,
            textTransform: 'none',
            fontWeight: 800,
            borderWidth: 2,
            borderColor: theme.palette.divider,
            '&:hover': { borderWidth: 2, backgroundColor: 'rgba(0,0,0,0.05)' },
          }}
        >
          Güncelle
        </Button>
      </Stack>
    </Box>
  )
}

export default OrderActionFooter
