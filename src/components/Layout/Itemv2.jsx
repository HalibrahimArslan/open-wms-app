import { styled } from '@mui/material/styles'

const StyledDiv = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.surface.panel,
  ...theme.typography.body2,
  textAlign: 'center',
  color: theme.palette.text.secondary,
  borderRadius: theme.radius.section,
  minHeight: `calc(100vh - 100px)`,
  padding: theme.spacing(2),
}))

export default function Itemv2(props) {
  return <StyledDiv>{props.children}</StyledDiv>
}
