import Grid from '@mui/material/Grid'
import { Outlet } from 'react-router'
import DefinationsMenu from './DefinitionsMenu'

export default function DefinitionContainer() {
  return (
    <Grid container spacing={{ xs: 2, md: 5 }}>
      <Grid size={{ xs: 12, md: 2.5 }}>
        <DefinationsMenu />
      </Grid>
      <Grid size={{ xs: 12, md: 9.5 }} sx={{ minWidth: 0 }}>
        <Outlet />
      </Grid>
    </Grid>
  )
}
