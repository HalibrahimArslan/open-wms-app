import * as React from 'react'
import ViewListIcon from '@mui/icons-material/ViewList'
import ViewModuleIcon from '@mui/icons-material/ViewModule'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import { Box, Paper, Button, Stack, Divider, Typography, useTheme } from '@mui/material'
import OrderProgressItem from '../Order/OrderProgressItem'
import Picking from './Picking'
import EditIcon from '@mui/icons-material/Edit'

export default function PickingSelect({ list, adresList, opType, handleNavigate }) {
  const theme = useTheme()
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
        borderRadius: theme.radius.section,
        border: '1px solid',
        borderColor: 'divider',
        overflow: 'hidden',
        backgroundColor: 'background.paper',
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
          backgroundColor: (theme) => theme.palette.surface.subtle,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 800,
          }}
        >
          Sipariş Detayları
        </Typography>

        <Stack
          direction="row"
          spacing={{ xs: 1, sm: 1.5 }}
          sx={{
            alignItems: 'center',
            flexWrap: 'wrap',
            rowGap: 1,
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
                borderRadius: theme.radius.control,
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
              borderRadius: theme.radius.control,
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
