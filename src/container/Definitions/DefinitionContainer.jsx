import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import { Outlet } from 'react-router'
import { useMediaQuery, useTheme } from '@mui/material'
import DefinationsMenu from './DefinitionsMenu'

export default function DefinitionContainer() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Grid container direction={isMobile ? 'column' : 'row'} spacing={{ xs: 2, sm: 2, md: 5 }}>
      <Grid item xs={2.5}>
        <DefinationsMenu />
      </Grid>
      <Grid item xs={9.5}>
        <Outlet />
      </Grid>
    </Grid>
  )
}
