import { useEffect } from 'react'
import { Box, Dialog, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/system'
import GlobalSearchInput from './GlobalSearchInput'
import GlobalSearchResults from './GlobalSearchResults'
import useGlobalSearch from './useGlobalSearch'

export default function GlobalSearchDialog({ open, onClose }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { query, setQuery, reset, detected, type, loading, error, data } = useGlobalSearch()

  useEffect(() => {
    if (!open) {
      reset()
    }
  }, [open])

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={isMobile}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: isMobile ? 0 : 2,
            minHeight: isMobile ? '100%' : '70vh',
            maxHeight: isMobile ? '100%' : '80vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          },
        },
      }}
    >
      <GlobalSearchInput value={query} onChange={setQuery} detected={detected} loading={loading} onClear={() => setQuery('')} onClose={onClose} autoFocus />
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: 2,
        }}
      >
        <GlobalSearchResults query={query} detected={detected} type={type} loading={loading} error={error} data={data} onActionDone={onClose} />
      </Box>
    </Dialog>
  )
}
