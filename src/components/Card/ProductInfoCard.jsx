import { Box, Chip, Divider, Typography, useTheme } from '@mui/material'
import React from 'react'
import img from '../../assets/images/cards/table.png'
import NotFound from '../../shared/components/NotFound/NotFound'

function ProductInfoCard({ productList, totalAmount, approvedUser }) {
  const theme = useTheme()

  if (productList.length === 0) {
    return <NotFound msg={'Sipariş Bulunamadı'} />
  }

  return (
    <>
      {productList &&
        productList.map((product) => (
          <Box
            key={product.id}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              border: '2px solid',
              borderColor: theme.palette.primary.main,
              p: 1,
              mt: 1,
              background: theme.palette.secondary.secondary,
              borderRadius: theme.shape.borderRadius,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: approvedUser ? 'space-between' : 'flex-end',
                mb: 1,
              }}
            >
              {approvedUser ? (
                <Chip color="primary" style={{ maxHeight: '20px' }} label={product.onaylayanKullanici != null && (product.onaylayanKullanici.trim() ? 'Onaylı' : 'Onaysız')} />
              ) : null}

              <Chip style={{ maxHeight: '20px' }} label={product.stokBirimi} />
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  '@keyframes rotateX': {
                    '0%': {
                      transform: 'rotateY(0deg)',
                    },
                    '100%': {
                      transform: 'rotateY(360deg)',
                    },
                  },
                  animation: 'rotateX 3s infinite linear',
                }}
              >
                <img
                  src={img}
                  alt="Product"
                  style={{
                    maxWidth: '50px',
                    maxHeight: '50px',
                  }}
                />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        fontSize: '10px',
                      }}
                    >
                      {approvedUser ? 'Siparis' : 'ERP'}
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 'bold',
                      }}
                    >
                      {product.depodakiMiktar}{' '}
                    </Typography>
                  </Box>
                  <Divider color="black" orientation="vertical" flexItem />
                  <Box>
                    <Typography
                      sx={{
                        fontSize: '10px',
                      }}
                    >
                      {' '}
                      Depo
                    </Typography>
                    <Typography variant="h5"> {totalAmount}</Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        fontSize: theme.typography.fontSize,
                        textAlign: 'end',
                      }}
                    >
                      {product.stokKodu}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: theme.typography.fontSize - 2,
                      }}
                    >
                      {' '}
                      {product.barkod}{' '}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
            <Divider />
            <Box>
              <Typography sx={{ wordBreak: 'break-word' }}>{product.stokAdi}</Typography>
            </Box>
            <Box sx={{ backgroundColor: theme.palette.warning.main, p: 1, borderRadius: theme.shape.borderRadius }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: theme.typography.fontWeightMedium,
                  wordBreak: 'break-word',
                }}
              >
                {product.description ? product.description : 'Açıklama Bulunamadı'}
              </Typography>
            </Box>
          </Box>
        ))}
    </>
  )
}

export default ProductInfoCard
