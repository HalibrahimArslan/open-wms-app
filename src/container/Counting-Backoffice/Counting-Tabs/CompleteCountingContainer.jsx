import React, { useContext, useState } from 'react'
import { notify, notifyError } from '../../../layout/Layout'
import { completeCounting, partialUpdateCounting } from '../../../services/CountingDefinitionService'
import usePatchHeader from '../../../hooks/usePatchHeader'
import ConfirmDialog from '../../../components/Dialog/ConfirmDialog'
import { CountingContext } from '../../../context/CountingContext'
import SplitButton from '../../../components/Button/SplitButton'

export default function CompleteCountingContainer({ countingList, handleCountingList, handleUpdateCountingStatus, handleVisible }) {
  const { selectedCountingId } = useContext(CountingContext)
  const headers = usePatchHeader()
  const [loading, setLoading] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [actionType, setActionType] = useState('complete')

  let selectedCounting = countingList.find((item) => item.id === selectedCountingId)
  const isActive = selectedCounting?.sayimDurumu === 'ACTIVE'
  const isParking = selectedCounting?.sayimDurumu === 'PARKING'
  const title = actionType === 'park' ? 'Sayımı Parka Al' : actionType === 'activate' ? 'Parktan Aktife Al' : actionType === 'reject' ? 'İptal Onay Uyarısı' : 'Sayımı Tamamla'
  const operationTitle =
    actionType === 'park'
      ? 'Sayımı parka almak istediğinize emin misiniz?'
      : actionType === 'activate'
        ? 'Bu sayımı tekrar aktif duruma almak istediğinize emin misiniz?'
        : actionType === 'reject'
          ? 'Bu sayımı iptal etmek istediğinizden emin misiniz? İptal edilen sayım geri alınamaz ve stok verileri değiştirilmeyecektir.'
          : 'Sayımı tamamlamak istediğinize emin misiniz?'

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  const handleOpenDialog = (type) => {
    setActionType(type)
    setOpenDialog(true)
  }

  const getActionLabel = (type) => {
    if (type === 'park') return 'Sayımı Parka Al'
    if (type === 'activate') return 'Parktan Aktife Al'
    if (type === 'reject') return 'İptal Et'
    return 'Sayımı Tamamla'
  }

  const handleCompleteCounting = async () => {
    const invalidByAction =
      actionType === 'park' && !isActive
        ? 'Bu işlem yalnızca ACTIVE durumundaki sayımlar için yapılabilir.'
        : actionType === 'complete' && !isParking
          ? 'Bu işlem yalnızca PARKING durumundaki sayımlar için yapılabilir.'
          : (actionType === 'activate' || actionType === 'reject') && !isParking
            ? 'Bu işlem yalnızca PARKING durumundaki sayımlar için yapılabilir.'
            : ''

    if (invalidByAction) {
      notifyError(invalidByAction)
      setOpenDialog(false)
      return
    }

    try {
      setLoading(true)
      if (actionType === 'park') {
        await partialUpdateCounting(selectedCountingId, {
          method: 'PATCH',
          headers: headers,
          body: JSON.stringify({
            id: selectedCountingId,
            sayimDurumu: 'PARKING',
          }),
        })
        notify('Sayım park durumuna alındı')
        handleUpdateCountingStatus(selectedCountingId, 'PARKING')
      } else if (actionType === 'activate') {
        await partialUpdateCounting(selectedCountingId, {
          method: 'PATCH',
          headers: headers,
          body: JSON.stringify({
            id: selectedCountingId,
            sayimDurumu: 'ACTIVE',
          }),
        })
        notify('Sayım tekrar aktif duruma alındı')
        handleUpdateCountingStatus(selectedCountingId, 'ACTIVE')
      } else if (actionType === 'reject') {
        await partialUpdateCounting(selectedCountingId, {
          method: 'PATCH',
          headers: headers,
          body: JSON.stringify({
            id: selectedCountingId,
            sayimDurumu: 'REJECTED',
          }),
        })
        notify('Sayım iptal edildi')
        handleCountingList(selectedCountingId)
      } else {
        await completeCounting(headers, selectedCountingId)
        notify('Sayım tamamlama işlemi başlatıldı. Bildirimlerinizi kontrol ediniz')
        handleCountingList(selectedCountingId)
      }
    } catch (e) {
      notifyError(e.message)
    } finally {
      setLoading(false)
      setOpenDialog(false)
    }
  }

  const availableMenuOptions = () => {
    if (isActive) {
      return [{ label: getActionLabel('park'), onClick: () => handleOpenDialog('park') }]
    }

    if (isParking) {
      return [
        { label: getActionLabel('activate'), onClick: () => handleOpenDialog('activate') },
        { type: 'divider' },
        { label: getActionLabel('complete'), onClick: () => handleOpenDialog('complete') },
        { type: 'divider' },
        { label: getActionLabel('reject'), onClick: () => handleOpenDialog('reject') },
      ]
    }

    return [{ label: 'Durum işlemi yok', disabled: true, variant: 'info' }]
  }

  return (
    <>
      <SplitButton
        variant="outlined"
        size="small"
        disabled={loading}
        ariaLabel="Sayım aksiyonları"
        primary={{ label: 'Yeni Sayım', onClick: handleVisible }}
        options={availableMenuOptions()}
      />
      <ConfirmDialog dialogStatus={openDialog} handleClose={handleCloseDialog} dialogTitle={title} dialogContentText={operationTitle} handleOperate={handleCompleteCounting} />
    </>
  )
}
