import * as React from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight'
import Picking from '../../assets/images/cards/picking.jpg'
import { Box, useTheme } from '@mui/material'

export default function OrderSummaryCard({ header, title, subHeader, orderCount, orderNo, orderDetails, notCountingItem, handleClick }) {
  const theme = useTheme()
  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        border: '2px solid',
        borderColor: theme.palette.primary.main,
        background: theme.palette.secondary.secondary,
        borderRadius: theme.shape.borderRadius,
      }}
      onClick={handleClick}
    >
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: theme.palette.primary.main }} aria-label="recipe">
            {header}
          </Avatar>
        }
        title={orderNo}
        subheader={subHeader}
      />
      <CardMedia component="img" height="100" image={Picking} alt="dormitory" sx={{ objectFit: 'cover' }} />
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ overflow: 'auto', height: '100px', padding: 1 }}>
            {orderDetails &&
              orderDetails.length > 0 &&
              orderDetails.map((item) => (
                <Typography variant="h4" alignItems={'flex-start'} padding={0.25}>
                  {item}
                </Typography>
              ))}
          </Box>
          <Box
            marginLeft={'auto'}
            sx={{
              border: `2px solid ${theme.palette.primary.main + '3B'}`,
              borderRadius: theme.shape.borderRadius,
              backgroundColor: theme.palette.secondary.main,
            }}
          >
            <Typography variant="h6" alignItems={'center'} padding={0.25}>
              {notCountingItem} / {orderCount}
            </Typography>
          </Box>
        </Box>
      </CardContent>
      <CardActions
        disableSpacing
        sx={{
          borderTop: `2px solid ${theme.palette.primary.main + '3B'}`,
          backgroundColor: theme.palette.secondary.main,
        }}
      >
        <Typography variant="h6" alignItems={'center'} marginLeft={0.25}>
          {title.slice(0, 15) + '...'}
        </Typography>
        <IconButton aria-label="settings" sx={{ marginLeft: 'auto' }}>
          <KeyboardDoubleArrowRightIcon />
        </IconButton>
      </CardActions>
    </Card>
  )
}
