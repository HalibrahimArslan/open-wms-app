import React from 'react'
import { Box, Divider, IconButton, Stack, Tooltip, Typography } from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'

export default function LotProductCard({ product, onDelete }) {
  const labelRow = (label, value) => (
    <Stack direction="row" spacing={1}>
      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 70, flexShrink: 0 }}>
        {label}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        :
      </Typography>
      <Typography variant="body2" fontWeight={600} sx={{ wordBreak: 'break-word' }}>
        {value}
      </Typography>
    </Stack>
  )

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        bgcolor: 'background.paper',
      }}
    >
      <Tooltip title="Lot takibinden çıkar">
        <IconButton size="small" color="error" onClick={() => onDelete?.(product)} sx={{ position: 'absolute', top: 6, right: 6 }}>
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Stack spacing={0.5} sx={{ pr: 3 }}>
        {labelRow('Stok Kodu', product.stokKodu)}
        {labelRow('Ürün Adı', product.stokAdi)}
      </Stack>

      <Stack spacing={0.75} sx={{ mt: 'auto', pt: 1 }}>
        <Divider sx={{ mb: 0.5 }} />
        <Typography variant="body2" color="text.secondary">
          Barkod
        </Typography>
        <Box
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            px: 1.5,
            py: 1,
            textAlign: 'center',
            fontFamily: 'monospace',
            letterSpacing: 1,
            bgcolor: 'action.hover',
          }}
        >
          {product.anaBarkod}
        </Box>
      </Stack>
    </Box>
  )
}
