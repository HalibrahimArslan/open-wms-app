import { Box, Button, CircularProgress, Drawer, IconButton, List, Skeleton } from '@mui/material'
import { utils, writeFile } from 'xlsx'
import { getCountingReportById, getCountingReportMicroById } from '../../../services/CountingDetailService'
import useAuthHeader from '../../../hooks/useAuthHeader'
import { useContext, useState } from 'react'
import { useEffect } from 'react'
import { getNotCountedAddressList } from '../../../services/AdressService'
import Iconify from '../../../components/Iconify/Iconify'
import { notifyError } from '../../../layout/Layout'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import TabPanel from '../../../components/Tabs/TabPanel'
import ReportListItemButton from '../../../components/List/ReportListItemButton'
import ComparativeCountingReport from './ComparativeCountingReport'
import SwipeableDrawerWrapper, { SwipeableDrawerHeader } from '../../../shared/components/Slider/SwipeableDrawerWrapper'
import CountingAssignCellToUsers from '../Location-User-Matching/CountingAssignCellToUsers'
import { CountingContext } from '../../../context/CountingContext'

export default function CountingReportContainer() {
  const { selectedCountingId } = useContext(CountingContext)
  const date = new Date().toLocaleDateString()
  const time = new Date().toLocaleTimeString()

  const headers = useAuthHeader()
  const [countingList, setCountingList] = useState([])
  const [microCountingList, setMicroCountingList] = useState([])
  const [notCountedList, setNotCountedList] = useState([])
  const [reportDates, setReportDates] = useState({ counting: null, micro: null, notCounted: null })
  const [enable, setEnable] = useState(true)
  const [loading, setLoading] = useState(false)
  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  })
  const [tabValue, setTabValue] = useState(0)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const handleChangeTabs = (event, newValue) => {
    setTabValue(newValue)
  }

  const handleOpenDrawer = () => {
    setState({ ...state, bottom: true })
  }

  const handleOnExport = () => {
    let wb = utils.book_new()
    let ws = utils.json_to_sheet(countingList)
    utils.book_append_sheet(wb, ws, 'Sayım Sonuçları Adres Bazlı')
    writeFile(wb, `sayim-${date}-${time}.xlsx`)
  }

  const handleOnExportMicro = () => {
    let wb = utils.book_new()
    let ws = utils.json_to_sheet(microCountingList)
    utils.book_append_sheet(wb, ws, 'Sayım Sonuçları Ürün Bazlı ')
    writeFile(wb, `sayim-${date}-${time}.xlsx`)
  }

  const handleExportNotCountedList = () => {
    let wb = utils.book_new()
    let ws = utils.json_to_sheet(notCountedList)
    utils.book_append_sheet(wb, ws, 'Sayılmayan Adresler')
    writeFile(wb, 'islem_gormeyen_adresler.xlsx')
  }

  const toggleDrawer = (anchor, open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return
    }

    setState({ ...state, [anchor]: open })
  }

  useEffect(() => {
    if (selectedCountingId > 0) {
      setEnable(true)
      fetchAllReports()
    }
  }, [selectedCountingId])

  const fetchAllReports = async () => {
    try {
      setLoading(true)
      await Promise.all([fetchCountingListData(), fetchNotCountedListData(), fetchCountingMicroListData()])
    } finally {
      setLoading(false)
    }
  }

  const fetchCountingListData = async () => {
    try {
      const res = await getCountingReportById(headers, selectedCountingId)
      res && setCountingList(res)
      res && res.length > 0 && setEnable(false)
      setReportDates((prev) => ({ ...prev, counting: new Date() }))
    } catch (e) {
      notifyError(e.message)
    }
  }

  const fetchCountingMicroListData = async () => {
    try {
      const res = await getCountingReportMicroById(headers, selectedCountingId)
      res && setMicroCountingList(res)
      res && res.length > 0 && setEnable(false)
      setReportDates((prev) => ({ ...prev, micro: new Date() }))
    } catch (e) {
      notifyError(e.message)
    }
  }

  const fetchNotCountedListData = async () => {
    try {
      const res = await getNotCountedAddressList(headers, selectedCountingId)
      res && setNotCountedList(res)
      setReportDates((prev) => ({ ...prev, notCounted: new Date() }))
    } catch (e) {
      notifyError(e.message)
    }
  }

  return (
    <Box display={'flex'} gap={2} flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
      <Button variant="contained" onClick={handleOpenDrawer} disabled={enable} startIcon={<Iconify icon="mdi:report-box-outline" />}>
        Raporlar
      </Button>
      <Button variant="outlined" onClick={() => setDrawerOpen(true)} endIcon={<Iconify icon="pajamas:assignee" />}>
        Hücre Atama
      </Button>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: { xs: '100%', sm: 600 }, maxWidth: '100vw' } }}
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 2 }}
      >
        <Box sx={{ p: 2, height: '100%', boxSizing: 'border-box', overflow: 'auto' }}>
          <CountingAssignCellToUsers handleClose={() => setDrawerOpen(false)} />
        </Box>
      </Drawer>
      <SwipeableDrawerWrapper anchor={'bottom'} state={state} toggleDrawer={toggleDrawer}>
        <SwipeableDrawerHeader title="Raporlar" />
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 1 }}>
          <Tabs value={tabValue} onChange={handleChangeTabs} aria-label="report-tabs">
            <Tab label="Sayım Raporları" />
            <Tab label="Karşılaştırma Raporları" />
          </Tabs>
          {tabValue === 0 && (
            <IconButton onClick={fetchAllReports} disabled={loading} title="Yeniden çek">
              {loading ? <CircularProgress size={20} /> : <Iconify icon="mdi:refresh" />}
            </IconButton>
          )}
        </Box>
        <TabPanel value={tabValue} index={0}>
          <List>
            {loading ? (
              [0, 1, 2].map((i) => <Skeleton key={i} variant="rounded" height={76} sx={{ mt: 0.5 }} />)
            ) : (
              <>
                <ReportListItemButton reportName={'Sayım Hareketleri Adres Bazlı'} handleExport={handleOnExport} fetchedAt={reportDates.counting} />
                <ReportListItemButton reportName={'Sayım Hareketleri Ürün Bazlı'} handleExport={handleOnExportMicro} fetchedAt={reportDates.micro} />
                <ReportListItemButton reportName={'Sayılmayan Adresler'} handleExport={handleExportNotCountedList} fetchedAt={reportDates.notCounted} />
              </>
            )}
          </List>
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <ComparativeCountingReport />
        </TabPanel>
      </SwipeableDrawerWrapper>
    </Box>
  )
}
