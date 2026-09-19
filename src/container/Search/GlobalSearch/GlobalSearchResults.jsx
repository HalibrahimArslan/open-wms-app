import { Alert, Box, CircularProgress, Typography } from '@mui/material'
import { SearchType } from './detectSearchType'
import IdleHint from './results/IdleHint'
import UnknownResult from './results/UnknownResult'
import BarkodResult from './results/BarkodResult'
import StokResult from './results/StokResult'
import AdresResult from './results/AdresResult'
import SiparisResult from './results/SiparisResult'
import PaletResult from './results/PaletResult'

export default function GlobalSearchResults({ query, detected, type, loading, error, data, onActionDone }) {
  if (!query) {
    return <IdleHint />
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5, py: 4 }}>
        <CircularProgress size={28} />
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
          }}
        >
          Aranıyor...
        </Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="warning" sx={{ borderRadius: 2 }}>
        {error}
      </Alert>
    )
  }

  if (!type || type === SearchType.UNKNOWN) {
    return <UnknownResult />
  }

  if (type === SearchType.INVALID) {
    return <UnknownResult hint={detected?.hint} />
  }

  if (type === SearchType.BARKOD) return <BarkodResult data={data} />
  if (type === SearchType.STOK) return <StokResult data={data} query={query} />
  if (type === SearchType.ADRES) return <AdresResult data={data} />
  if (type === SearchType.SIPARIS) return <SiparisResult data={data} onActionDone={onActionDone} />
  if (type === SearchType.PALET) return <PaletResult data={data} query={query} />

  return <UnknownResult />
}
