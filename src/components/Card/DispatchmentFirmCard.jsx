import { Card, CardContent, Chip, Divider, Typography, useTheme } from '@mui/material'

const DispatchmentFirmCard = ({ handleListItemClick, firm }) => {
  const theme = useTheme()
  return (
    <Card
      key={firm.cariKod}
      onClick={() => handleListItemClick(firm.cariKod, firm.cariUnvan, firm.orderList, firm.orderLineItemCount, firm.cariBaglantiTipi, firm.bolgeKodu)}
      sx={{
        border: '2px solid',
        borderColor: theme.palette.primary.main,
        background: theme.palette.secondary.secondary,
        borderRadius: theme.shape.borderRadius,
        minHeight: '150px',
        cursor: 'pointer',
      }}
    >
      <CardContent
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography
          align="left"
          sx={{
            fontWeight: theme.typography.fontWeightMedium,
          }}
        >
          {firm.bolgeAdi}
        </Typography>
        {firm.cariBaglantiTipi === '4' && (
          <Chip
            label={'BAYİ'}
            sx={{
              borderRadius: 2,
              bgcolor: theme.palette.primary.main,
              color: 'white',
            }}
          />
        )}
      </CardContent>
      <Divider flexItem />
      <CardContent>
        <Typography align="left">{firm.cariUnvan}</Typography>
      </CardContent>
    </Card>
  )
}

export default DispatchmentFirmCard
