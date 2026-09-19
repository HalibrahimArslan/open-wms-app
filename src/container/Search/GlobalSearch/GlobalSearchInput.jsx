import { Box, CircularProgress, Divider, IconButton, InputBase, Stack, Tooltip, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/system'
import SearchIcon from '@mui/icons-material/Search'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import BackspaceRoundedIcon from '@mui/icons-material/BackspaceRounded'
import QrCodeRoundedIcon from '@mui/icons-material/QrCodeRounded'
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded'
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded'
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded'
import ViewInArRoundedIcon from '@mui/icons-material/ViewInArRounded'
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded'
import { ResultChip } from './GlobalSearchResultCard'
import { SearchType, TypeLabel } from './detectSearchType'

const TYPE_META = {
  [SearchType.BARKOD]: { color: 'primary', icon: <QrCodeRoundedIcon sx={{ fontSize: 14 }} /> },
  [SearchType.PALET]: { color: 'primary', icon: <ViewInArRoundedIcon sx={{ fontSize: 14 }} /> },
  [SearchType.STOK]: { color: 'primary', icon: <Inventory2RoundedIcon sx={{ fontSize: 14 }} /> },
  [SearchType.ADRES]: { color: 'primary', icon: <LocationOnRoundedIcon sx={{ fontSize: 14 }} /> },
  [SearchType.SIPARIS]: { color: 'primary', icon: <ReceiptLongRoundedIcon sx={{ fontSize: 14 }} /> },
  [SearchType.INVALID]: { color: 'warning', icon: <HelpOutlineRoundedIcon sx={{ fontSize: 14 }} /> },
  [SearchType.UNKNOWN]: { color: 'default', icon: <HelpOutlineRoundedIcon sx={{ fontSize: 14 }} /> },
}

export default function GlobalSearchInput({ value, onChange, detected, loading, onClear, onClose, autoFocus }) {
  const theme = useTheme()
  const isXs = useMediaQuery(theme.breakpoints.down('sm'))
  const meta = detected ? TYPE_META[detected.type] : null
  const label = detected ? TypeLabel[detected.type] : null

  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 2,
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        px: { xs: 1.5, sm: 2 },
        py: 1.25,
      }}
    >
      <Stack
        direction="row"
        sx={{
          alignItems: 'center',
          gap: { xs: 0.5, sm: 1 },
          minWidth: 0,
        }}
      >
        <SearchIcon sx={{ color: 'text.secondary', flexShrink: 0 }} />
        <InputBase
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={isXs ? 'Ara...' : 'Barkod, stok kodu, adres veya sipariş no yazın...'}
          autoFocus={autoFocus}
          fullWidth
          sx={{
            fontSize: 16,
            minWidth: 0,
            flex: 1,
            '& input': { py: 0.5 },
          }}
        />
        {loading && <CircularProgress size={18} sx={{ flexShrink: 0 }} />}
        {label && meta && (
          <ResultChip
            color={meta.color}
            variant={meta.color === 'default' ? 'outlined' : 'filled'}
            icon={meta.icon}
            label={isXs ? null : label}
            sx={{
              flexShrink: 0,
              maxWidth: { xs: 32, sm: 140 },
              '& .MuiChip-icon': { ml: isXs ? 0.6 : undefined },
              '& .MuiChip-label': isXs ? { display: 'none' } : { overflow: 'hidden', textOverflow: 'ellipsis' },
            }}
          />
        )}
        {value && (
          <Tooltip title="Aramayı temizle">
            <IconButton size="small" onClick={onClear} aria-label="aramayı temizle" sx={{ flexShrink: 0 }}>
              <BackspaceRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
        {onClose && (
          <>
            <Divider orientation="vertical" flexItem sx={{ my: 0.5, flexShrink: 0 }} />
            <Tooltip title="Kapat (Esc)">
              <IconButton size="small" onClick={onClose} aria-label="aramayı kapat" sx={{ flexShrink: 0 }}>
                <CloseRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </>
        )}
      </Stack>
    </Box>
  )
}
