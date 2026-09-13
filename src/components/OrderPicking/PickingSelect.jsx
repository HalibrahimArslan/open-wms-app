import * as React from 'react'
import ViewListIcon from '@mui/icons-material/ViewList'
import ViewModuleIcon from '@mui/icons-material/ViewModule'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import { Box, Paper, Button, Stack, Divider } from '@mui/material'
import OrderProgressItem from '../Order/OrderProgressItem'
import Picking from './Picking'
import EditIcon from '@mui/icons-material/Edit'

import Typography from '@mui/material/Typography'
import ListAltIcon from '@mui/icons-material/ListAlt'

export default function PickingSelect({ list, adresList, opType, handleNavigate }) {
  const [view, setView] = React.useState('list')

  const handleChange = (event, nextView) => {
    if (nextView !== null) {
      setView(nextView)
      return
    }
    setView('list')
  }

  return (
    <Paper
      elevation={0}
      sx={{
        position: 'relative',
        borderRadius: 4,
        border: '1px solid',
        borderColor: 'divider',
        overflow: 'hidden',
        backgroundColor: 'background.paper',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        mb: 4,
      }}
    >
      <Box
        sx={{
          p: { xs: 1.5, sm: 2 },
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: { xs: 1.5, sm: 0 },
          backgroundColor: (theme) => (theme.palette.mode === 'light' ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.02)'),
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="h6" fontWeight={800}>
          Sipariş Detayları
        </Typography>

        <Stack
          direction="row"
          spacing={{ xs: 1, sm: 1.5 }}
          alignItems="center"
          flexWrap="wrap"
          rowGap={1}
          sx={{
            width: { xs: '100%', sm: 'auto' },
            justifyContent: { xs: 'space-between', sm: 'flex-end' },
          }}
        >
          <ToggleButtonGroup
            size="small"
            value={view}
            exclusive
            onChange={handleChange}
            sx={{
              backgroundColor: 'background.paper',
              '& .MuiToggleButton-root': {
                border: 'none',
                borderRadius: 2,
                px: { xs: 1.25, sm: 2 },
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                },
              },
            }}
          >
            <ToggleButton value="list">
              <ViewListIcon fontSize="small" sx={{ mr: 1 }} />
              Liste
            </ToggleButton>
            <ToggleButton value="module">
              <ViewModuleIcon fontSize="small" sx={{ mr: 1 }} />
              Kutu
            </ToggleButton>
          </ToggleButtonGroup>

          <Divider orientation="vertical" flexItem sx={{ mx: 0.5, display: { xs: 'none', sm: 'block' } }} />

          <Button
            variant="outlined"
            color="primary"
            onClick={handleNavigate}
            startIcon={<EditIcon />}
            sx={{
              borderRadius: 2.5,
              textTransform: 'none',
              fontWeight: 700,
              px: { xs: 2, sm: 3 },
            }}
          >
            Düzenle
          </Button>
        </Stack>
      </Box>

      <Box sx={{ p: 0 }}>
        {view === 'list' && <OrderProgressItem list={list} adresList={adresList} opType={opType} handleNavigate={handleNavigate} />}
        {view === 'module' && <Picking list={list} adresList={adresList} opType={opType} />}
      </Box>
    </Paper>
  )
}
