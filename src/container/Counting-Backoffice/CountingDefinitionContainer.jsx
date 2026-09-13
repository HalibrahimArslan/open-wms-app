import { useContext, useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { Accordion, AccordionDetails, AccordionSummary, Button, Chip, Divider, Drawer, Paper, Stack, Typography, useMediaQuery, useTheme } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import CountingDefinitionForm from './CountingDefinitionForm'
import { getDepoAddresses } from '../../services/AdressService'
import useAuthHeader from '../../hooks/useAuthHeader'
import { useSWRConfig } from 'swr'
import CountingWatching from './Counting-Watching/CountingWatching'
import CountingTabs from './Counting-Tabs/CountingTabs'
import ActiveCountingAlert from './ActiveCountingAlert'
import { useContainer } from 'unstated-next'
import { styled } from '@mui/material/styles'
import { notifyError } from '../../layout/Layout'
import { getCountingDefinitionList } from '../../services/CountingDetailService'
import useDepoCode from '../../hooks/useDepoCode'
import { DepoContainer } from '../../store/DepoContainer'
import { getTransferDepoCode } from '../../utils/Utils'
import { CountingContext } from '../../context/CountingContext'
import CompleteCountingContainer from './Counting-Tabs/CompleteCountingContainer'
import PickCounting from '../../components/Combobox/PickCounting'

const Item = styled(Paper)(({ theme }) => ({
  textAlign: 'left',
  borderRadius: theme.shape.borderRadius * 1.5,
  padding: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  height: '100%',
}))

export default function CountingDefinitionContainer() {
  const { handleAddresses, handleSelectedCountingId, selectedCountingId } = useContext(CountingContext)
  const [activeCountingList, setActiveCountingList] = useState([])
  const [isVisible, setVisible] = useState(false)
  const [warningExpanded, setWarningExpanded] = useState(true)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const headers = useAuthHeader()
  const { cache } = useSWRConfig()
  const depoCode = useDepoCode()
  const { allDepoList } = useContainer(DepoContainer)
  const transferDepoCode = getTransferDepoCode(depoCode, allDepoList)

  const handleCompleteCountingList = (id) => {
    setActiveCountingList(activeCountingList.filter((item) => item.id !== id))
    handleSelectedCountingId(0)
  }

  const handleUpdateCountingStatus = (id, sayimDurumu) => {
    setActiveCountingList(activeCountingList.map((item) => (item.id === id ? { ...item, sayimDurumu } : item)))
  }

  const handleAddCountingList = (item) => {
    setActiveCountingList([...activeCountingList, item])
  }

  const handleVisible = () => {
    setVisible(!isVisible)
  }

  const fetchAddressData = async () => {
    const res = await getDepoAddresses(headers)
    res && handleAddresses(res)
  }

  const fetchAddresses = async () => {
    if (cache.get('depoAddressList')) {
      handleAddresses(cache.get('depoAddressList'))
    } else {
      try {
        const res = await fetchAddressData(headers)
        res && handleAddresses(res)
        cache.set('depoAddressList', res)
      } catch (e) {
        notifyError(e.message)
      }
    }
  }

  const fetchActiveCounting = async () => {
    try {
      let query = `depoNo.equals=${transferDepoCode}&status.equals=true&sayimDurumu.in=ACTIVE,PARKING`
      const res = await getCountingDefinitionList(headers, query)
      res && setActiveCountingList(res)
    } catch (e) {
      notifyError(e.message)
    }
  }

  useEffect(() => {
    fetchAddresses()
  }, [])

  useEffect(() => {
    if (transferDepoCode) {
      fetchActiveCounting()
    }
  }, [transferDepoCode])

  const selectedCounting = activeCountingList.find((item) => item.id === selectedCountingId) || null
  const statusLabel =
    selectedCounting?.sayimDurumu === 'PARKING'
      ? 'Parkta'
      : selectedCounting?.sayimDurumu === 'REJECTED'
        ? 'Iptal Edildi'
        : selectedCounting?.sayimDurumu === 'COMPLETED'
          ? 'Tamamlandı'
          : selectedCounting?.sayimDurumu === 'ACTIVE'
            ? 'Aktif'
            : 'Sayım seçilmedi'
  const statusColor =
    selectedCounting?.sayimDurumu === 'PARKING'
      ? 'warning'
      : selectedCounting?.sayimDurumu === 'REJECTED'
        ? 'error'
        : selectedCounting?.sayimDurumu === 'COMPLETED'
          ? 'default'
          : selectedCounting?.sayimDurumu === 'ACTIVE'
            ? 'success'
            : 'default'
  const warningCount = activeCountingList.length

  return (
    <Grid container spacing={2} alignItems="stretch">
      <Grid item xs={12}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 3 },
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Stack spacing={2}>
            <Stack direction={isMobile ? 'column' : 'row'} justifyContent="space-between" alignItems={isMobile ? 'flex-start' : 'center'} spacing={2}>
              <Box>
                <Typography variant="h5" textAlign={'left'} sx={{ fontWeight: 700, lineHeight: 1.25 }}>
                  Sayım Yönetim Paneli
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1.25 }}>
                  Sayımı seçin, ana aksiyonları kullanın ve detayları aşağıdaki sekmelerden takip edin.
                </Typography>
              </Box>

              <Stack direction={isMobile ? 'column' : 'row'} spacing={1} sx={{ width: isMobile ? '100%' : 'auto' }}>
                <PickCounting countingList={activeCountingList} />
                <CompleteCountingContainer
                  countingList={activeCountingList}
                  handleCountingList={handleCompleteCountingList}
                  handleUpdateCountingStatus={handleUpdateCountingStatus}
                  handleVisible={handleVisible}
                />
              </Stack>
            </Stack>
          </Stack>
        </Paper>
      </Grid>

      <Grid item xs={12} lg={8.5}>
        <Stack spacing={2}>
          <Accordion
            expanded={warningExpanded}
            onChange={(event, expanded) => setWarningExpanded(expanded)}
            disableGutters
            elevation={0}
            sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 1.5, bgcolor: 'action.hover' }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                minHeight: 42,
                '& .MuiAccordionSummary-content': {
                  my: 0.75,
                  alignItems: 'center',
                },
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography sx={{ fontWeight: 600, fontSize: theme.typography.pxToRem(14.5), lineHeight: 1.2 }}>Sayım Uyarıları</Typography>
                <Chip
                  color={warningCount > 0 ? 'warning' : 'success'}
                  variant={warningCount > 0 ? 'filled' : 'outlined'}
                  label={warningCount > 0 ? `${warningCount} uyarı` : 'Uyarı yok'}
                  sx={{
                    height: 26,
                    '& .MuiChip-label': {
                      px: 1,
                      fontSize: (theme) => theme.typography.pxToRem(12),
                      fontWeight: 500,
                    },
                  }}
                />
              </Stack>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 0.25, pb: 1 }}>
              <Box maxHeight={220} overflow="auto" sx={{ textAlign: 'left' }}>
                <ActiveCountingAlert activeCountingList={activeCountingList} />
              </Box>
            </AccordionDetails>
          </Accordion>

          <Item>
            <CountingTabs />
          </Item>
        </Stack>
      </Grid>

      <Grid item xs={12} lg={3.5}>
        <Stack spacing={2} sx={{ position: { lg: 'sticky' }, top: { lg: theme.spacing(2) } }}>
          <Item sx={{ p: 1.5 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {selectedCounting?.sayimAdi || 'Aktif sayım seçilmedi'}
            </Typography>
            <Box sx={{ mt: 1 }}>
              <Chip
                color={statusColor}
                label={statusLabel}
                sx={{
                  height: 32,
                  '& .MuiChip-label': {
                    px: 1.5,
                    fontSize: (theme) => theme.typography.pxToRem(13.5),
                    fontWeight: 500,
                  },
                }}
              />
            </Box>
          </Item>
          <Item sx={{ p: 1.5 }}>
            <CountingWatching />
          </Item>
        </Stack>
      </Grid>

      <Drawer
        anchor={isMobile ? 'bottom' : 'right'}
        open={isVisible}
        onClose={handleVisible}
        PaperProps={{
          sx: {
            width: isMobile ? '100%' : 520,
            p: 2,
            display: 'flex',
          },
        }}
        sx={{
          zIndex: (theme) => theme.zIndex.appBar + 1,
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Yeni Sayım Tanımı</Typography>
          <Button size="small" startIcon={<CloseIcon />} onClick={handleVisible}>
            Kapat
          </Button>
        </Stack>
        <Divider sx={{ my: 1.5 }} />
        <Box sx={{ overflowY: 'auto', pr: 0.5 }}>
          <CountingDefinitionForm open={true} handleAddCountingList={handleAddCountingList} handleVisible={handleVisible} />
        </Box>
      </Drawer>
    </Grid>
  )
}
