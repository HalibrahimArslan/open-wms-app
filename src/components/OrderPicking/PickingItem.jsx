import { Box, Paper, Typography, useTheme } from '@mui/material'
import React from 'react'
import PickingCard from './PickingCard'
import BasicSlider from '../../shared/components/Slider/BasicSlider'

export default function PickingItem({ list, master, adresList }) {
  const theme = useTheme()
  return (
    <Box sx={{ backgroundColor: theme.palette.action.hover }} p={0.5} borderRadius={theme.shape.borderRadius} position={'relative'} mb={1}>
      <Box display={'flex'} gap={1}>
        {list
          .filter((todo) => todo.pieceMaster.stokKodu === master)
          .slice(0, 1)
          .map((item) => (
            <Box
              display={'flex'}
              justifyContent={'row'}
              gap={2}
              bgcolor={theme.palette.action.focus}
              borderRadius={theme.shape.borderRadius}
              m={'auto'}
              p={'0 1rem'}
              alignItems={'center'}
            >
              <Typography variant="subtitle1">{item.pieceMaster.stokKodu}</Typography>
              <Typography variant="subtitle2">{item.pieceMaster.stokAdi}</Typography>
            </Box>
          ))}
      </Box>
      <Typography
        variant="h6"
        sx={{
          position: 'absolute',
          top: '37.5%',
          left: -50,
          transform: 'rotate(270deg) ',
          zIndex: 999,
          bgcolor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          borderTopLeftRadius: theme.shape.borderRadius,
          borderTopRightRadius: theme.shape.borderRadius,
          padding: 0.5,
          marginRight: 1,
        }}
      >
        Parçalı Ürün
      </Typography>

      <BasicSlider
        bgImage={false}
        children={list && list.length > 0 && list.filter((todo) => todo.pieceMaster.stokKodu === master).map((t) => <PickingCard item={t} adresList={adresList} />)}
      />
    </Box>
  )
}
