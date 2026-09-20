import { Box, Divider, IconButton, Typography, useTheme } from '@mui/material'
import { cloneElement } from 'react'
import AddCircleIcon from '@mui/icons-material/AddCircle'

/**
 * Ekran basligi ve ekrana ait aksiyonlar.
 *
 * Standart: aksiyonlar (arama, filtre ac/kapa, disa aktar, ekle) basligin TAM
 * KARSISINDA, ayni satirda durur. Baslik altinda ayri bir aksiyon satiri
 * acilmaz; ekrandan ekrana degisen yerlesim olmamasi icin bu bilesen kullanilir.
 *
 * Baslik hicbir zaman yatay bosluk almaz, cunku hemen altindaki tablo ya da
 * kart da almaz; aldigi anda baslik ile ilk sutun basligi birbirinden kayiyor.
 * Onceden yatay bosluk `hide` prop'una bagliydi (p: hide ? 1 : 0), yani ekle
 * dugmesinin gizli olup olmamasi baslik hizasini degistiriyordu.
 *
 * actions: baslik satirinin sagina yerlesen ogeler (genelde Stack icinde).
 * hide: ekle dugmesini gizler.
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
          gap: 1.5,
          // Aksiyon olsun olmasin serit ayni yukseklikte kalsin diye.
          minHeight: 48,
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
      {/* Ayracin altindaki bosluk once <br /> ile veriliyordu; satir yuksekligi
          kadar, yani yazi tipine gore degisen bir bosluktu. Artik olcekten. */}
      <Divider flexItem sx={{ marginBottom: 2 }} />
    </>
  )
}

export default ActionHeader
