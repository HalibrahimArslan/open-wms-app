import { Avatar, Box, Typography } from '@mui/material'
import React from 'react'
import Done from '../../assets/images/cards/done.png'

export default function OrderInformation({ src, info }) {
  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
      }}
      marginTop={4}
    >
      <Avatar alt="orderDone" src={src ? src : Done} sx={{ width: 150, height: 150 }} />
      <Typography sx={{ marginTop: 2 }}>{info ? info : 'HERHANGİ BİR SİPARİŞ KAYIDI BULUNAMADI'}</Typography>
    </Box>
  )
}
