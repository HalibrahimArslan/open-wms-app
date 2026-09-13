import { useState, useEffect, forwardRef } from 'react'
import Dialog from '@mui/material/Dialog'
import Slide from '@mui/material/Slide'
import Box from '@mui/material/Box'
import { Fab, IconButton, Paper, useMediaQuery } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import usePayload from '../../hooks/usePayload'
import { executeServiceMikro, getFirmOrderBulkList } from '../../services/MikroService'
import { reformOrders, reformDispatchOrders, getOrderMasterList } from '../../services/OrderDetailService'
import useAuthHeader from '../../hooks/useAuthHeader'
import { OrderJustifyContainer } from '../../store/OrderJustifyContainer'
import { useTheme } from '@mui/material'
import useDepoCode from '../../hooks/useDepoCode'
import { notify, notifyError } from '../../layout/Layout'
import OrderJustifyDrawer from './OrderJustifyDrawer'
import OrderJustifyMobile from './OrderJustifyMobile'
import CloseIcon from '@mui/icons-material/Close'
import Movement from '../../components/Dialog/Movement'
import OrderHeaderCard from './OrderHeaderCard'
import OrderEditTabs from './OrderEditTabs'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'
import LoadingInner from '../../components/Loading/LoadingInner'

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

const drawerWidth = 400

export default function OrderEditContainer() {
  const theme = useTheme()
  const depoCode = useDepoCode()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const firmCodeList = OrderJustifyContainer.useContainer().firmCode
  const { handleCancelledList, handleFirmList, orderSituation, cancelledItem, handleSituation } = OrderJustifyContainer.useContainer()

  const [open, setOpen] = useState(true)
  const [filteredList, setFilteredList] = useState([])
  const [orderList, setOrderList] = useState([])
  const [addedList, setAddedList] = useState([])
  const [deleteItems, setDeleteItems] = useState([])
  const [bulkList, setBulkList] = useState([])
  const [firmName, setFirmName] = useState('')
  const [orderStatus, setOrderStatus] = useState('')
  const [value, setValue] = useState('1')
  const [loading, setLoading] = useState(false)
  const [microLoading, setMicroLoading] = useState(false)
  const orderStatus2 = ['Olusturuldu', 'Toplanıldı', 'Sevke Hazır', 'Sevk Edildi']

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const nav = useNavigate()
  const headers = useAuthHeader()
  const { firmCode, orderType, cariBaglantiTipi, cariCode, orderNo } = useParams()

  const generateRequest = (aurOrderId, status, deleteItems, addedItems) => {
    let dto = {
      aurOrderId,
      status,
      deleteItems,
      addedItems,
    }
    return dto
  }

  const payload = usePayload(generateRequest(orderNo, orderSituation ? 'SUSPENDED' : orderStatus, deleteItems, addedList))

  const executeReq = usePayload({
    data: {
      depoNo: Number(depoCode),
      firmCode: firmCode,
      sipTip: orderType === 'FMK' ? 1 : 0,
    },
    serviceName: 'depoService.getFirmStockOrderList',
  })

  const params = usePayload({
    depoList: [Number(depoCode)],
    firmCode: firmCode,
    sipTip: 0,
    transGroupCode: cariCode === '0' ? '' : cariCode,
  })

  const fetchExecuteData = async () => {
    try {
      setMicroLoading(true)
      const res = await executeServiceMikro(executeReq)
      res && setFilteredList(res)
    } catch (err) {
      notifyError(err.message)
    } finally {
      setMicroLoading(false)
    }
  }

  const fetchBulkListData = async () => {
    try {
      setMicroLoading(true)
      const res = await getFirmOrderBulkList(params)
      res && setBulkList(res)
    } catch (err) {
      notifyError(err.message)
    } finally {
      setMicroLoading(false)
    }
  }

  const fetchReformDataList = async (payload) => {
    try {
      let response
      if (orderType === 'FMK') {
        response = await reformOrders(payload)
      } else {
        response = await reformDispatchOrders(payload)
      }
      response && notify('Sipariş başarıyla düzenlendi')
      response && nav(`/d:${depoCode}/ordertracing`)
    } catch (err) {
      notifyError('Sipariş düzenlenirken hata oluştu')
    }
  }

  const fetchTmpData = async () => {
    try {
      let query = `id.equals=${orderNo}`
      const res = await getOrderMasterList(headers, query)
      res && setFirmName(res[0].firmName)
      res && setOrderStatus(res[0].status)
      res && setOrderList(res[0].details)
    } catch (err) {
      notifyError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveChanges = () => {
    fetchReformDataList(payload)
  }

  const handleClose = () => {
    nav(-1)
  }

  const handleStatus = (value) => {
    setOrderStatus(value)
  }

  useEffect(() => {
    if (orderType === 'FMK') {
      if (cancelledItem.length > 0) {
        let distinctList = orderList.filter((el) => {
          return cancelledItem.some((f) => {
            return f === el.stokKodu
          })
        })
        setDeleteItems(distinctList)
      } else {
        setDeleteItems([])
      }
    }
    if (orderType === 'MSK') {
      if (cancelledItem.length > 0) {
        let distinctList = orderList.filter((el) => {
          return cancelledItem.some((f) => {
            return f === el.sipUid
          })
        })
        setDeleteItems(distinctList)
      } else {
        setDeleteItems([])
      }
    }
  }, [cancelledItem, orderList, orderType])

  useEffect(() => {
    if (orderType === 'FMK') {
      fetchExecuteData()
    }
    if (orderType === 'MSK') {
      fetchBulkListData()
    }
  }, [orderType])

  useEffect(() => {
    if (orderNo) {
      setAddedList([])
      setDeleteItems([])
      handleCancelledList([])
      handleSituation()
      handleFirmList([])
      fetchTmpData()
    }
  }, [orderNo])

  useEffect(() => {
    if (orderType === 'FMK') {
      if (firmCodeList.length > 0) {
        let distinctList = filteredList.filter((el) => {
          return firmCodeList.some((f) => {
            return f === el.stokKodu
          })
        })
        setAddedList(distinctList)
      } else {
        setAddedList([])
      }
    }
    if (orderType === 'MSK') {
      if (firmCodeList.length > 0) {
        let distinctList = bulkList.filter((el) => {
          return firmCodeList.some((f) => {
            return f === el.sipUid
          })
        })
        setAddedList(distinctList)
      } else {
        setAddedList([])
      }
    }
  }, [firmCodeList, filteredList, bulkList, orderType])

  return (
    <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition} sx={{ bgcolor: theme.palette.action.hover }}>
      <Box
        sx={{
          display: isMobile ? 'none' : 'flex',
          bgcolor: theme.palette.background.paper,
          height: '100dvh',
        }}
      >
        <Fab variant="extended" aria-label="add" sx={{ position: 'fixed', bottom: 20, right: 20 }} onClick={handleSaveChanges}>
          <SaveOutlinedIcon sx={{ mr: 1 }} />
          KAYDET
        </Fab>
        <Box
          sx={{
            position: 'fixed',
            top: 10,
            height: '10%',
            left: 10,
            overflow: 'auto',
            width: drawerWidth,
          }}
          elevation={2}
        >
          <OrderHeaderCard firmName={firmName} />
        </Box>
        <Paper
          sx={{
            position: 'fixed',
            top: 100,
            height: 'calc(100dvh - 120px)',
            left: 10,
            overflow: 'auto',
            width: drawerWidth,
          }}
          elevation={1}
        >
          {microLoading ? (
            <LoadingInner text={'Veri Çekiliyor'} />
          ) : (
            <OrderJustifyDrawer list={orderType === 'FMK' ? filteredList : bulkList} orderType={orderType} cariBaglantiTipi={cariBaglantiTipi} />
          )}
        </Paper>
        <Box component="main" sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, gap: 3 }} ml={55} mt={2} position={'relative'} overflow={'auto'}>
          <Box display={'flex'} justifyContent={'center'} alignItems={'center'} overflow={'auto'}>
            {loading ? <LoadingInner text={'Veri Çekiliyor'} /> : <Movement order={orderList} orderStatus={orderStatus2} />}
          </Box>
          <Box sx={{ width: '100%', typography: 'body1', position: 'relative' }}>
            {loading ? <LoadingInner text={'Veri Çekiliyor'} /> : <OrderEditTabs value={value} handleChange={handleChange} orderList={orderList} addedList={addedList} />}
          </Box>
        </Box>
      </Box>

      <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close" sx={{ position: 'fixed', right: 10, top: 3 }} size="large" backgroundColor="primary">
        <CloseIcon />
      </IconButton>

      {isMobile && (
        <OrderJustifyMobile lists={orderList} bulkLists={filteredList} opType={orderType} payload={payload} cariBaglantiTipi={cariBaglantiTipi} orderStatus2={orderStatus2} />
      )}
    </Dialog>
  )
}
