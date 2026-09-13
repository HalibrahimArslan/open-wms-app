import { Grid, Paper, Typography, useTheme } from '@mui/material'
import { useEffect, useMemo } from 'react'
import { Outlet, useSearchParams } from 'react-router-dom'
import PalletBarcodeContainer from '../Pallet-Barcode/PalletBarcodeContainer'
import WaybillChartContainer from './WaybillChartContainer'
import StorageRateContainer from './StorageRateContainer'
import RayonStorageRateContainer from './RayonStorageRateContainer'
import Seo from '../../shared/components/Seo'
import BRAND from '../../config/brand'
import { useContainer } from 'unstated-next'
import { DataStore } from '../../store/DataStore'
import { getAccountDisplayName } from '../../utils/Utils'

export default function Dashboard() {
  const theme = useTheme()
  const [searchParams, setSearchParams] = useSearchParams()
  const { account } = useContainer(DataStore)

  // Hesap istegi donene kadar ad bos kalir; bu durumda yalnizca selamlama
  // gosterilir, boylece basligin icerigi sonradan yerine oturur.
  const displayName = useMemo(() => getAccountDisplayName(account), [account])

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
              // Dashboard'un sarmalayicisi (Layout/Itemv2) icerigi ortaliyor;
              // karsilama blogu sola hizali olmali.
              textAlign: 'left',
              backgroundColor: theme.palette.secondary.main,
              boxShadow: ' rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px',
              borderRadius: theme.radius.card,
            }}
          >
            {displayName ? (
              <>
                <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.2 }}>
                  {BRAND.greeting},
                </Typography>
                <Typography variant="h4" fontWeight={theme.typography.fontWeightMedium} sx={{ marginTop: 0.5 }}>
                  {displayName}
                </Typography>
              </>
            ) : (
              // Hesap istegi donene kadar iki satirlik duzen bos gorunmesin
              <Typography variant="h4" fontWeight={theme.typography.fontWeightMedium}>
                {BRAND.greeting}
              </Typography>
            )}
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
