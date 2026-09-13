import React from 'react'
import { ListItemButton, ListItemIcon, ListItemText, useTheme } from '@mui/material'
import Iconify from '../Iconify/Iconify'

export default function ReportListItemButton({ reportName, handleExport, fetchedAt }) {
  const theme = useTheme()

  return (
    <ListItemButton sx={{ bgcolor: theme.palette.action.hover, padding: '1rem', mt: 0.5 }} onClick={handleExport}>
      <ListItemText primary={reportName} secondary={fetchedAt ? `Son güncelleme: ${fetchedAt.toLocaleString('tr-TR')}` : 'Henüz güncellenmedi'} />
      <ListItemIcon>
        <Iconify icon="lucide:download" />
      </ListItemIcon>
    </ListItemButton>
  )
}
