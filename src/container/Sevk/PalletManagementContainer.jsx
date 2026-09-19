import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import produce from 'immer'
import usePayload from '../../hooks/usePayload'
import useAuthHeader from '../../hooks/useAuthHeader'
import useDepoCode from '../../hooks/useDepoCode'
import { notifyError } from '../../layout/Layout'
import PalletBarcodeGenerator from '../../components/PalletBarcode/PalletBarcodeGenerator'
import { deletePalletBarcode, deletePalletBarcodeDetail, generateOrderPalletBarcodeRelation, getPalletBarcodeList } from '../../services/PalletBarcodeOrderRelService'
import { generatePayload } from '../../utils/Utils'

function PalletManagementContainer({ orderNumber, orderDetail, openPalletDialog, onClose }) {
  const navigate = useNavigate()
  const headers = useAuthHeader()
  const depoCode = useDepoCode()

  const [palletBarcodeList, setPalletBarcodeList] = useState([])
  const [palletList, setPalletList] = useState([])

  const createPalletBarcodeRequest = usePayload({
    aurOrderId: orderNumber,
    palletBarcodeList,
  })

  const fetchPalletBarcodeList = async (aurOrderId) => {
    if (aurOrderId !== '') {
      const res = await getPalletBarcodeList(headers, aurOrderId)
      res && setPalletList(res)
    }
  }

  const fetchGeneratePalletBarcode = async (payload) => {
    try {
      const res = await generateOrderPalletBarcodeRelation(payload)
      res && setPalletList([...palletList, res])
      res && setPalletBarcodeList([])
    } catch (e) {
      notifyError(e.message)
    }
  }

  const fetchAddPalletBarcode = async (payload, palletBarcodeId) => {
    try {
      const res = await generateOrderPalletBarcodeRelation(payload)
      res &&
        setPalletList(
          produce((draft) => {
            const data = draft.find((q) => q.palletBarcodeId === palletBarcodeId)
            res.palletBarcodeList.forEach((q) => data.palletBarcodeList.push(q))
          })
        )
      res && setPalletBarcodeList([])
    } catch (e) {
      notifyError(e.message)
    }
  }

  const fetchDeletePalletBarcodeById = async (id) => {
    const res = await deletePalletBarcode(id, headers)
    res === 'success' && setPalletList(palletList.filter((q) => q.palletBarcodeId !== id))
  }

  const fetchDeletePalletBarcodeDetailById = async (body, stockCode, palletBarcodeId) => {
    const res = await deletePalletBarcodeDetail(headers, body)
    res === 'success' &&
      setPalletList(
        produce((draft) => {
          const data = draft.find((q) => q.palletBarcodeId === palletBarcodeId)
          if (data.palletBarcodeList.filter((q) => q.status === true).length === 1) {
            data.palletBarcodeStatus = false
            data.palletBarcodeList.forEach((q) => (q.status = false))
          } else {
            const filteredData = data.palletBarcodeList.find((q) => q.stockCode === stockCode)
            filteredData.status = false
          }
        })
      )
  }

  const handlePrintBarcode = (palletList) => {
    navigate(`/d:${depoCode}/barcode-generate?barcodes=${palletList.map((q) => q.palletBarcode).join(',')}`)
  }

  const handlePalletBarcodeList = (status, id) => {
    if (status === false) {
      setPalletBarcodeList(palletBarcodeList.filter((q) => q !== id))
    }
    if (status === true) {
      if (!palletBarcodeList.includes(id)) {
        setPalletBarcodeList([...palletBarcodeList, id])
      }
    }
  }

  const createPalletBarcode = () => {
    fetchGeneratePalletBarcode(createPalletBarcodeRequest)
  }

  const addPalletBarcode = (palletBarcodeId) => {
    let payload = { aurOrderId: orderNumber, palletBarcodeId: palletBarcodeId, palletBarcodeList: palletBarcodeList }
    fetchAddPalletBarcode(generatePayload(payload), palletBarcodeId)
  }

  useEffect(() => {
    fetchPalletBarcodeList(orderNumber)
  }, [orderNumber, headers])

  return (
    <PalletBarcodeGenerator
      openPalletDialog={openPalletDialog}
      handlePalletDialog={onClose}
      orderDetail={orderDetail.filter((od) => {
        return !palletList.find((pl) => {
          return pl.palletBarcodeList.find((pbl) => {
            return pbl.stockCode === od.stokKodu && pbl.status === true
          })
        })
      })}
      palletBarcodeList={palletBarcodeList}
      handlePalletBarcodeList={handlePalletBarcodeList}
      createPalletBarcode={createPalletBarcode}
      palletList={palletList}
      fetchDeletePalletBarcodeById={fetchDeletePalletBarcodeById}
      fetchDeletePalletBarcodeDetailById={fetchDeletePalletBarcodeDetailById}
      addProductPalletBarcode={addPalletBarcode}
      handlePrintBarcode={handlePrintBarcode}
    />
  )
}

export default PalletManagementContainer
