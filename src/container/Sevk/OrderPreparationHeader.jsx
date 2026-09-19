import React from 'react'
import { Box, Stack, Typography, Chip } from '@mui/material'
import LocalShippingTwoToneIcon from '@mui/icons-material/LocalShippingTwoTone'
import AssignmentTwoToneIcon from '@mui/icons-material/AssignmentTwoTone'
import BusinessIcon from '@mui/icons-material/Business'

const OrderPreparationHeader = ({ orderType, orderNumber, orderInfo }) => {
  return (
    <Box sx={{ px: 1, pt: 1 }}>
      <Stack
        direction="row"
        spacing={2.5}
        sx={{
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            p: 2,
            borderRadius: 4,
            backgroundColor: 'primary.main',
            color: 'primary.contrastText',
            display: 'flex',
            boxShadow: (theme) => `0 12px 24px ${theme.palette.primary.main}20`,
          }}
        >
          {orderType === 'MSK' ? <LocalShippingTwoToneIcon sx={{ fontSize: 40 }} /> : <AssignmentTwoToneIcon sx={{ fontSize: 40 }} />}
        </Box>
        <Box>
          <Stack
            direction="row"
            spacing={1.5}
            sx={{
              alignItems: 'center',
              mb: 0.5,
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 900,
                letterSpacing: '-0.03em',
              }}
            >
              {orderType === 'MSK' ? 'Müşteri Sevkiyatı' : 'Sipariş Hazırlama'}
            </Typography>
            <Chip label={orderNumber} color="primary" variant="soft" size="small" sx={{ fontWeight: 700, borderRadius: 1.5 }} />
          </Stack>

          <Stack
            direction="row"
            spacing={2}
            sx={{
              alignItems: 'center',
            }}
          >
            <Stack
              direction="row"
              spacing={0.5}
              sx={{
                alignItems: 'center',
              }}
            >
              <BusinessIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Typography
                variant="body1"
                sx={{
                  color: 'text.primary',
                  fontWeight: 600,
                }}
              >
                {orderInfo.firmName || 'Yükleniyor...'}
              </Typography>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Box>
  )
}

export default OrderPreparationHeader
