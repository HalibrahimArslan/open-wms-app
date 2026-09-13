import { Box, Chip, Divider, Stack, Typography } from '@mui/material'
import React, { Fragment } from 'react'

export default function ActiveCountingAlert({ activeCountingList }) {
  const getStatusConfig = (status) => {
    if (status === 'PARKING') {
      return { label: 'Parkta', color: 'info' }
    }
    return { label: 'Aktif', color: 'success' }
  }

  return (
    <Fragment>
      <Stack spacing={0.5}>
        {activeCountingList.length > 0 ? (
          activeCountingList.map((countingItem, index) => {
            const statusConfig = getStatusConfig(countingItem.sayimDurumu)
            return (
              <Box key={countingItem.id} sx={{ textAlign: 'left' }}>
                <Stack direction="row" alignItems="center" spacing={0.75} sx={{ py: 0.35, flexWrap: 'wrap' }}>
                  <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>
                    {countingItem.sayimAdi} adlı
                  </Typography>
                  <Chip
                    size="small"
                    color={statusConfig.color}
                    label={statusConfig.label}
                    sx={{
                      height: 22,
                      '& .MuiChip-label': {
                        px: 0.9,
                        fontSize: (theme) => theme.typography.pxToRem(11.5),
                        fontWeight: 500,
                      },
                    }}
                  />
                  <Typography variant="body2" color="text.primary">
                    sayımınız mevcuttur.
                  </Typography>
                </Stack>
                {index !== activeCountingList.length - 1 ? <Divider sx={{ mt: 0.5 }} /> : null}
              </Box>
            )
          })
        ) : (
          <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'left' }}>
            Devam eden herhangi bir sayımınız yoktur.
          </Typography>
        )}
      </Stack>
    </Fragment>
  )
}
