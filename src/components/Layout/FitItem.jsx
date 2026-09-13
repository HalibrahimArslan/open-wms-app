import { styled } from '@mui/material/styles'
import { Box, useMediaQuery } from '@mui/material'

const upperItem = '130px'
const upperItemMobile = '130px'

const Item = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : 'white',
  position: 'relative',
  ...theme.typography.body2,
  textAlign: 'center',
  color: theme.palette.text.primary,
  borderRadius: '5px',
  height: useMediaQuery(theme.breakpoints.down('lg')) ? `calc(100dvh - ${upperItemMobile})` : `calc(100dvh - ${upperItem})`,
  overflow: 'auto',
  boxShadow: 'rgba(0, 57, 132, 0.1) 0px 4px 8px 0px',
}))

export default function FitItem(props) {
  return <Item>{props.children}</Item>
}
