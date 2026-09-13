import React from 'react'
import { Box, Button, Divider, IconButton, SwipeableDrawer, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import BulkListDetail from './BulkListDetail'

function BulkListDrawer({ open, onClose, bulkList, apiList, checked, setChecked, handleApiList, depoList, selectedDepoList, handleAddDepoList, isLoading }) {
  return (
    <SwipeableDrawer
      anchor="right"
      open={open}
      onClose={onClose}
      onOpen={() => {}}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 420 },
          display: 'flex',
          flexDirection: 'column',
        },
      }}
      sx={{
        zIndex: 'tooltip',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1.5 }}>
        <Typography variant="h6" fontWeight={600}>
          Kalem Ekle
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <Box sx={{ flex: 1, minHeight: 0, overflow: 'hidden', p: 1 }}>
        <BulkListDetail
          bulkList={bulkList}
          apiList={apiList}
          checked={checked}
          setChecked={setChecked}
          handleApiList={handleApiList}
          depoList={depoList}
          selectedDepoList={selectedDepoList}
          handleChangeStatus={handleAddDepoList}
          loading={isLoading}
        />
      </Box>
      <Divider />
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Button variant="contained" fullWidth onClick={handleApiList}>
          Tamamla
        </Button>
        <Button variant="outlined" fullWidth onClick={onClose} sx={{ display: { xs: 'flex', sm: 'none' } }}>
          Kapat
        </Button>
      </Box>
    </SwipeableDrawer>
  )
}

export default React.memo(BulkListDrawer)
