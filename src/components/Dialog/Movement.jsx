import { Box, Typography, useTheme } from '@mui/material'
import { Icon } from '@iconify/react'
import NotFound from '../../shared/components/NotFound/NotFound'

export default function Movement({ order, orderStatus }) {
  const theme = useTheme()
  let fontsize = '35px'

  const getOrderIcon = (statusId) => {
    const icons = [
      <Icon fontSize={fontsize} icon="lets-icons:order" />,
      <Icon fontSize={fontsize} icon="mingcute:transfer-fill" />,
      <Icon fontSize={fontsize} icon="streamline:shipment-check" />,
      <Icon fontSize={fontsize} icon="fluent-mdl2:completed" />,
    ]

    return icons[statusId]
  }

  const getStyle = (index, size, statusId) => {
    if (index !== size - 1) {
      return {
        content: '" "',
        backgroundColor: index < statusId - 1 ? theme.palette.success.main : theme.palette.error.dark,
        padding: '5px',
        right: 1,
        transform: 'translateX(50px)',
        position: 'absolute',
        width: '50px',
      }
    }
  }

  if (order && (order.length === 0 || order === undefined)) {
    return <NotFound msg={'Sipariş Bulunamadı'} />
  }

  return (
    <Box sx={{ display: 'flex', overflowX: 'auto', gap: 6, padding: 4 }}>
      <>
        {Array.from({ length: 4 }).map((i, index) => (
          <Box
            key={orderStatus[index]}
            sx={{
              position: 'relative',
              display: 'flex',
              backgroundColor: theme.palette.action.focus,
              borderRadius: '50%',
              padding: '20px',
              justifyContent: 'center',
              alignItems: 'center',
              '&:after': getStyle(index, 4, 2),
            }}
          >
            {getOrderIcon(index)}
            <Typography key={`text-${index}`} sx={{ position: 'absolute', top: -25 }}>
              {orderStatus[index]}
            </Typography>
          </Box>
        ))}
      </>
    </Box>
  )
}
