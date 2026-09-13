import { styled } from '@mui/material/styles'

const StyledDiv = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : 'white',
  ...theme.typography.body2,
  textAlign: 'center',
  color: theme.palette.text.secondary,
  borderRadius: theme.shape.borderRadius,
  minHeight: `calc(100vh - 100px)`,
  padding: theme.spacing(2),
}))

export default function Itemv2(props) {
  return <StyledDiv>{props.children}</StyledDiv>
}
