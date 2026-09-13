import { Badge, Box, CardHeader, Typography } from '@mui/material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

export default function AddressRecommendationItem({ item, theme, handleAllAddress }) {
  return (
    <Badge badgeContent={item.size} color="primary">
      <Card
        onClick={() => handleAllAddress(item.stockCode)}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          '&:hover': {
            transform: 'scale(1.05)',
            transition: 'all 0.3s ease-in-out',
          },
          height: 'auto',
          width: 175,
          borderTop: `10px solid ${theme.palette.primary.main}`,
        }}
      >
        <CardHeader subheader={'Miktar'} title={item.miktar} titleTypographyProps={{ align: 'center' }} subheaderTypographyProps={{ align: 'center' }} />
        <CardContent>
          <Box border={0.25} borderRadius={2} backgroundColor={theme.palette.secondary.main}>
            <Typography sx={{ fontWeight: 'bold' }} textAlign={'center'}>
              Stok Kodu
            </Typography>
            <Typography textAlign={'center'}>{item.stockCode}</Typography>

            <Typography sx={{ fontWeight: 'bold' }} textAlign={'center'}>
              Adres
            </Typography>
            <Typography textAlign={'center'}>{item.address}</Typography>
          </Box>
        </CardContent>
      </Card>
    </Badge>
  )
}
