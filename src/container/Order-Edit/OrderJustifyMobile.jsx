import * as React from 'react'
import Box from '@mui/material/Box'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import Paper from '@mui/material/Paper'
import { useParams } from 'react-router-dom'
import useDepoCode from '../../hooks/useDepoCode'
import usePayload from '../../hooks/usePayload'
import { getFirmOrderBulkList } from '../../services/MikroService'
import { useEffect } from 'react'
import { Button } from '@mui/material'
import OrderSuspendItem from './OrderSuspendItem'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'
import { reformOrders, reformDispatchOrders } from '../../services/OrderDetailService'
import OrderJustifyDrawer from './OrderJustifyDrawer'
import AddBoxIcon from '@mui/icons-material/AddBox'
import Inventory2TwoToneIcon from '@mui/icons-material/Inventory2TwoTone'
import Movement from '../../components/Dialog/Movement'
import { useState, useRef } from 'react'
import { notify } from '../../layout/Layout'

export default function OrderJustifyMobile({ lists, bulkLists, opType, payload, orderStatus2, cariBaglantiTipi }) {
  const [list, setList] = useState([])
  const [value, setValue] = useState(0)

  let { firmCode, cariCode } = useParams()
  let depoCode = useDepoCode()
  const ref = useRef(null)

  const executeReq = usePayload({
    depoList: [Number(depoCode)],
    firmCode: firmCode,
    sipTip: 0,
    transGroupCode: cariCode === '0' ? '' : cariCode,
  })

  const fetchExecuteData = async () => {
    const res = await getFirmOrderBulkList(executeReq)
    res && setList(res)
  }

  useEffect(() => {
    if (value === 1) {
      fetchExecuteData()
    }
  }, [value])

  useEffect(() => {
    ref.current.ownerDocument.body.scrollTop = 0
  }, [value])

  const fetchReformDataList = async (payload) => {
    const res = await reformOrders(payload)
    res && res === 'success' && notify('Sipariş başarıyla düzenlendi')
    res && window.history.back()
  }
  const fetchReformSevkiyatDataList = async (payload) => {
    const res = await reformDispatchOrders(payload)
    res && res === 'success' && notify('Sipariş başarıyla düzenlendi')
    res && window.history.back()
  }

  return (
    <Box ref={ref}>
      <Button
        variant="outlined"
        startIcon={<SaveOutlinedIcon />}
        disableElevation
        sx={{ position: 'fixed', top: 8, left: 5 }}
        onClick={() => {
          if (opType === 'FMK') {
            fetchReformDataList(payload)
          } else {
            fetchReformSevkiyatDataList(payload)
          }
        }}
      >
        Kaydet
      </Button>
      <Box marginTop={5} p={1}>
        <Movement order={lists} orderStatus={orderStatus2} />
        {value === 0 && <OrderSuspendItem list={lists} bulkList={bulkLists} opType={opType} />}
        {value === 1 && <OrderJustifyDrawer list={list} opType={opType} cariBaglantiTipi={cariBaglantiTipi} />}
      </Box>
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={5}>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue)
          }}
        >
          <BottomNavigationAction label="Sipariş Kalemleri" icon={<Inventory2TwoToneIcon />} />
          <BottomNavigationAction label="Kalem Ekle" icon={<AddBoxIcon />} />
        </BottomNavigation>
      </Paper>
    </Box>
  )
}
