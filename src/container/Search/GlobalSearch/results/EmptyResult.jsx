import { Box, Typography } from '@mui/material'
import SearchOffRoundedIcon from '@mui/icons-material/SearchOffRounded'

export default function EmptyResult({ msg = 'Arama sonucu bulunamadı.' }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        py: 4,
        color: 'text.secondary',
      }}
    >
      <SearchOffRoundedIcon sx={{ fontSize: 40, opacity: 0.6 }} />
      <Typography variant="body2">{msg}</Typography>
    </Box>
  )
}
