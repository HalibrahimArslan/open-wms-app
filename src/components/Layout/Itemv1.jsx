import { styled } from '@mui/material/styles'
import { Paper } from '@mui/material'

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : theme.palette.background.paper,
  textAlign: 'left',
  color: theme.palette.text.primary,
  minHeight: `calc(100vh - 130px)`,
  padding: theme.spacing(2),
  maxWidth: '2000px',
  width: '100%',
  marginLeft: 'auto',
  marginRight: 'auto',
  boxSizing: 'border-box',
  boxShadow: 'none',
  borderRadius: theme.radius.section,
}))

export default function Itemv1(props) {
  return <Item elevation={0}>{props.children}</Item>
}
