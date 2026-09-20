import { Box, Divider, IconButton, Typography, useTheme } from '@mui/material'
import { cloneElement } from 'react'
import AddCircleIcon from '@mui/icons-material/AddCircle'

/**
 * Ekran basligi ve ekrana ait aksiyonlar.
 *
 * Standart: aksiyonlar (filtre ac/kapa, disa aktar, ekle) basligin TAM
 * KARSISINDA, ayni satirda durur. Baslik altinda ayri bir aksiyon satiri
 * acilmaz; ekrandan ekrana degisen yerlesim olmamasi icin bu bilesen kullanilir.
 *
 * actions: baslik satirinin sagina yerlesen dugmeler (genelde Stack icinde).
 */
function ActionHeader({ handleClick, title, Icon, hide, actions }) {
  const theme = useTheme()
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 1,
          p: hide ? 1 : 0,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: theme.typography.fontWeightMedium,
          }}
        >
          {title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {actions}
          {handleClick && Icon ? (
            <IconButton onClick={handleClick}>{cloneElement(Icon, { sx: { fontSize: 35 } })}</IconButton>
          ) : (
            <IconButton onClick={handleClick} sx={{ display: hide ? 'none' : 'block' }}>
              <AddCircleIcon sx={{ fontSize: 40 }} />
            </IconButton>
          )}
        </Box>
      </Box>
      <Divider flexItem />
      <br />
    </>
  )
}

export default ActionHeader
