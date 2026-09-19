import * as React from 'react'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Button from '@mui/material/Button'
import { Divider, useTheme } from '@mui/material'
import ReceivingPerson from '../../container/Receiving/MalKabulPerson/ReceivingPerson'
import { assignOrder } from '../../services/OrderService'
import usePayload from '../../hooks/usePayload'
import SevkiyatPerson from '../../container/Sevk/SevkiyatPerson/SevkiyatPerson'
import { useNavigate } from 'react-router'
import useDepoCode from '../../hooks/useDepoCode'
import { getTransGroupCode, getTransGroupName } from '../../utils/Utils'
import useIsMobile from '../../hooks/useIsMobile'
import { notify, notifyError } from '../../layout/Layout'

export default function DispatchAssignDialog({
  isPressed,
  setPressed,
  opType,
  firmName,
  firmCode,
  transferDepoCode,
  cariBaglantiTipi,
  orderNo,
  menuId,
  orderList,
  sevkAddressInfo,
  bolgeKodu,
  selectedOrderNos,
}) {
  let request = []
  const [isProcessing, setProcessing] = React.useState(false)
  const [person, setPerson] = React.useState(0)
  const navigate = useNavigate()
  const depoCode = useDepoCode()

  const handlePerson = (person) => {
    setPerson(person)
  }

  const handleClose = () => {
    setPressed(false)
  }

  const matchBody = (barkod, teslimMiktar, siparisMiktar, stokAdi, stokKodu, stokBirimi, sipUid, siparisNo) => {
    let dto = {
      barkod: barkod,
      siparisMiktar: siparisMiktar,
      teslimMiktar: teslimMiktar,
      stokAdi: stokAdi,
      stokKodu: stokKodu,
      stokBirimi: stokBirimi,
      sipUid: sipUid,
      siparisNo: siparisNo,
      observerAmount: 0,
    }

    request.push(dto)
  }

  const orderAssign = (
    aurTmpDetailList,
    aurUserId,
    depoNo,
    transferDepoCode,
    firmCode,
    opType,
    belgeNo,
    firmName,
    cariBaglantiTipi,
    cariCode,
    orderInfo,
    sevkAddressInfo,
    bolgeKodu
  ) => {
    aurTmpDetailList.map((todo) => matchBody(todo.barkod, 0, todo.siparisMiktar, todo.stokAdi, todo.stokKodu, todo.stokBirimi, todo.sipUid, todo.orderNo))
    let dto = {
      aurTmpDetailList: request,
      aurUserId: aurUserId,
      depoNo: transferDepoCode,
      firmCode: firmCode,
      opType: opType,
      belgeNo: belgeNo,
      firmName: firmName,
      cariBaglantiTipi: cariBaglantiTipi,
      cariCode: cariCode,
      addressId: '1',
      orderInfo: orderInfo,
      sevkAddressId: sevkAddressInfo.sevkAddressId,
      sevkAddress: sevkAddressInfo.sevkAddress,
      sevkTel: sevkAddressInfo.sevkTel,
      sevkMuhatap: sevkAddressInfo.sevkMuhatap,
      sevkAcikAdres: sevkAddressInfo.sevkAcikAdres,
      bolgeKodu: bolgeKodu,
      orderDepoCode: Number(depoNo),
    }

    return dto
  }

  const body = usePayload(
    orderAssign(
      orderList,
      person,
      depoCode,
      transferDepoCode,
      firmCode,
      opType,
      '',
      getTransGroupName(cariBaglantiTipi, firmName, orderNo, selectedOrderNos),
      cariBaglantiTipi,
      getTransGroupCode(cariBaglantiTipi, orderNo, selectedOrderNos),
      '',
      sevkAddressInfo,
      bolgeKodu
    )
  )

  const fetchAssignOrders = async () => {
    try {
      setProcessing(true)
      if (person === 0) {
        notifyError('Kullanıcı Seçiniz')
        setProcessing(false)
        return
      }
      if (orderList.length === 0) {
        notifyError('En az 1 ürün eklemelisniz')
        setProcessing(false)
        return
      }

      const res = await assignOrder(body)
      if (res) {
        notify('Atama İşlemi Tamamlandı')
        setProcessing(false)
        navigate(`/d:${depoCode}/${menuId}/cari-selection`)
      }
    } catch (e) {
      notifyError(e.message)
      setProcessing(false)
    }
  }

  return (
    <Modal sx={{ display: 'flex' }} open={isPressed} onClose={handleClose}>
      <Box
        sx={{
          position: 'relative',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          maxHeight: '100dvh',
          width: 'auto',
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
          overflow: 'auto',
        }}
      >
        <TableContainer direction="column" sx={{ maxHeight: '50dvh', overflow: 'auto' }}>
          <Table sx={{ flexGrow: 1 }} aria-label="simple table">
            <TableHead sx={{ backgroundColor: '#9BE8D6' }}>
              <TableRow>
                <TableCell align="left">Sipariş No</TableCell>
                <TableCell align="left">Ürün Adı</TableCell>
                <TableCell align="left">Stok Kodu</TableCell>
                <TableCell align="left">Barkod</TableCell>
                <TableCell align="left">Siparis Miktar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orderList.map((row) => (
                <TableRow key={row.stokKodu} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell align="left">{row.orderNo}</TableCell>
                  <TableCell align="left">{row.stokAdi}</TableCell>
                  <TableCell align="left">{row.stokKodu}</TableCell>
                  <TableCell align="left">{row.barkod}</TableCell>
                  <TableCell align="left">{row.siparisMiktar}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Divider />

        <Box mt={2}>{opType === 'FMK' ? <ReceivingPerson person={person} handlePerson={handlePerson} /> : <SevkiyatPerson person={person} handlePerson={handlePerson} />}</Box>
        <Box
          mt={2}
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 2,
            flexGrow: 1,
          }}
        >
          <Button variant="outlined" disabled={isProcessing} onClick={handleClose}>
            KAPAT
          </Button>
          <Button variant="contained" disabled={isProcessing} onClick={() => fetchAssignOrders()}>
            KALEMLERİ ATA
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}
