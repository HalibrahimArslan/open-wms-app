import { useMemo } from 'react'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import Drawer from '@mui/material/Drawer'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Backdrop, Box, Chip, Divider, IconButton, useTheme } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { styled } from '@mui/material/styles'
import NotFound from '../../shared/components/NotFound/NotFound'
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from '../../constants/orderStatusColors'
import useIsMobile from '../../hooks/useIsMobile'

const drawerWidth = 280

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-start',
}))

export default function OrderTracingDrawer({ order, id, open, handleDrawerClose }) {
  const theme = useTheme()
  const isMobile = useIsMobile()

  const selectedOrder = useMemo(() => {
    if (order && order.length > 0 && id) {
      return order.filter((q) => q.id === id)
    }

    return []
  }, [order, id])

  return (
    <>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
        }}
        anchor="right"
        open={open}
        onClose={handleDrawerClose}
        slotProps={{
          paper: {
            sx: {
              width: isMobile ? '100%' : 520,
              display: 'flex',
            },
          },
        }}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>{theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}</IconButton>
          <Box sx={{ flex: 1 }}>{`AUR - ${id}`}</Box>
          {isMobile && (
            <IconButton onClick={handleDrawerClose}>
              <CloseIcon />
            </IconButton>
          )}
        </DrawerHeader>
        <Divider />

        {selectedOrder && selectedOrder.length === 0 ? (
          <NotFound msg={'Sipariş Bulunamadı'} />
        ) : (
          <Box sx={{ p: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
            {selectedOrder[0].details.map((detail) => (
              <Accordion
                sx={{
                  backgroundColor: ORDER_STATUS_COLORS[detail.status] ?? theme.palette.grey[300],
                }}
                key={detail.sipUid}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header" sx={{ width: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', pr: 1 }}>
                    <Typography variant="subtitle1">{detail.stokKodu}</Typography>
                    {ORDER_STATUS_LABELS[detail.status] && (
                      <Chip
                        label={ORDER_STATUS_LABELS[detail.status]}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          fontSize: '0.7rem',
                          bgcolor: ORDER_STATUS_COLORS[detail.status],
                          border: '1px solid rgba(0,0,0,0.15)',
                        }}
                      />
                    )}
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box
                    key={detail.id}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      border: '2px solid',
                      borderColor: theme.palette.primary.main,
                      background: theme.palette.secondary.secondary,
                      borderRadius: theme.shape.borderRadius,
                      padding: 2,
                    }}
                  >
                    <Box>Barkod : {detail.barkod}</Box>
                    <Divider />
                    <Box>Stok Adı : {detail.stokAdi}</Box>
                    <Divider />
                    <Box>Siparis Miktar : {detail.siparisMiktar.toFixed(2)}</Box>
                    <Divider />
                    <Box>Teslim Miktar : {detail.teslimMiktar}</Box>
                    <Divider />
                    <Box>Siparis No : {detail.siparisNo}</Box>
                    <Divider />
                    <Box>Sevk Miktar : {detail.observerAmount}</Box>
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        )}
      </Drawer>
    </>
  )
}
