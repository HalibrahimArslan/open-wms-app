import { getPrintablePalletBarcodeList } from '../../services/PalletBarcodeOrderRelService'
import useAuthHeader from '../../hooks/useAuthHeader'
import { useRef, useState } from 'react'
import { useEffect } from 'react'
import { Box, Typography, useTheme } from '@mui/material'
import { notifyError } from '../../layout/Layout'
import PalletMasterList from '../../components/List/PalletMasterList'
import { generateDocument } from '../../services/PrintService'
import ExtendedDialog from '../../shared/components/Dialog/ExtendedDialog'
import LoadingButton from '../../components/Button/LoadingButton'
import PrintIcon from '@mui/icons-material/Print'
import { generatePayload } from '../../utils/Utils'
import RepetableSkeleton from '../../components/Loading/RepetableSkeleton'

export default function PalletBarcodeContainer() {
  const headers = useAuthHeader()
  const theme = useTheme()

  const [palletList, setPalleteList] = useState([])
  const [selectedPalletList, setSelectedPalletList] = useState([])
  const [printLoading, setPrintLoading] = useState(false)
  const [printDialog, setPrintDialog] = useState(false)
  const [loading, setLoading] = useState(false)

  const document = useRef('')

  const handlePrint = () => {
    let selectedPallets = palletList.filter((row) => selectedPalletList.includes(row.id))
    let data = []
    selectedPallets.forEach((pallet) => {
      data.push({
        cariName: pallet.customerName,
        adres: pallet.address,
        tel: pallet.phoneNumber,
        siparisNo: pallet.orderNo,
        palletBarcode: pallet.barcode,
      })
    })
    let payload = {
      data,
      template: 'palletbarcode.pug',
      locale: 'tr',
      width: '100mm',
      height: '150mm',
    }
    fetchDocument(generatePayload(payload))
  }

  const handlePalletList = (palletId) => {
    setSelectedPalletList((prev) => (prev.includes(palletId) ? prev.filter((item) => item !== palletId) : [...prev, palletId]))
  }

  const fetchPrintablePalletBarcodeList = async () => {
    try {
      setLoading(true)
      const data = await getPrintablePalletBarcodeList(headers)
      data && setPalleteList(data)
    } catch (err) {
      notifyError(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchDocument = async (payload) => {
    try {
      setPrintLoading(true)
      const bodyContent = await generateDocument(payload)
      document.current = bodyContent
      setPrintDialog(true)
    } catch (error) {
      notifyError(error.message)
    } finally {
      setPrintLoading(false)
    }
  }

  useEffect(() => {
    fetchPrintablePalletBarcodeList()
  }, [])

  return (
    <Box backgroundColor={theme.palette.secondary.light} pl={1} borderRadius={theme.shape.borderRadius}>
      <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} pr={1} pb={1} pt={1}>
        <Typography variant="h6" fontWeight={theme.typography.fontWeightMedium} align="left">
          Palet Barkodları
        </Typography>
        <LoadingButton
          loading={printLoading}
          variant={'outlined'}
          text={`${selectedPalletList.length} - Yazdır`}
          onClick={handlePrint}
          endIcon={<PrintIcon />}
          disabled={selectedPalletList.length === 0}
        />
      </Box>
      <Box overflow={'auto'} height={500} pr={1}>
        {loading ? <RepetableSkeleton length={7} /> : <PalletMasterList palletList={palletList} selectedPalletList={selectedPalletList} handlePalletList={handlePalletList} />}
      </Box>
      <ExtendedDialog
        fullScreen={true}
        open={printDialog}
        handleClose={() => setPrintDialog(false)}
        dialogContent={<iframe style={{ width: '100%', height: 'calc(100dvh - 50px)' }} src={document.current} />}
      />
    </Box>
  )
}
