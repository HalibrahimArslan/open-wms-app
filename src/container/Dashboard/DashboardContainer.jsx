import { Grid, Paper, Stack, Typography, useTheme } from '@mui/material'
import { useEffect } from 'react'
import { Outlet, useSearchParams } from 'react-router-dom'
import BrandLogo from '../../components/Brand/BrandLogo'
import useIsMobile from '../../hooks/useIsMobile'
import PalletBarcodeContainer from '../Pallet-Barcode/PalletBarcodeContainer'
import WaybillChartContainer from './WaybillChartContainer'
import StorageRateContainer from './StorageRateContainer'
import RayonStorageRateContainer from './RayonStorageRateContainer'
import Seo from '../../shared/components/Seo'
import BRAND from '../../config/brand'

export default function Dashboard() {
  const theme = useTheme()
  const isMobile = useIsMobile()
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    setSearchParams({ 'free-view': false })
  }, [])

  return (
    <>
      <Seo title="Dashboard" />
      <Grid container direction={'column'} gap={2}>
        <Grid item xs={12}>
          <Paper
            sx={{
              padding: 2,
              backgroundColor: theme.palette.secondary.main,
              boxShadow: ' rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px',
              borderRadius: theme.shape.borderRadius,
            }}
          >
            <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
              <Typography variant="h4" fontWeight={theme.typography.fontWeightMedium} align="right">
                {BRAND.welcomeTitle}
              </Typography>
              {!isMobile && <BrandLogo size={48} />}
            </Stack>
          </Paper>
        </Grid>
        <Grid container item spacing={2}>
          <Grid item xs={12} sm={6} md={5}>
            <PalletBarcodeContainer />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <WaybillChartContainer />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <StorageRateContainer />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <RayonStorageRateContainer />
          </Grid>
        </Grid>
      </Grid>
      <Outlet />
    </>
  )
}
