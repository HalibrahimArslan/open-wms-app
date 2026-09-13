import { Box, Typography } from '@mui/material'

const OrderItemColumn = (props) => {
  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, mb: 1 }}>
        {props.title}
      </Typography>
      <Typography variant="body1" fontWeight="medium" align="center">
        {props.value}
      </Typography>
    </Box>
  )
}

export default OrderItemColumn
