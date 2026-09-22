import useAuthHeader from '../../hooks/useAuthHeader'
import { saveDriver, updateDrivers } from '../../services/DriverService'
import { notifyError } from '../../layout/Layout'
import ExtendedDialog from '../../shared/components/Dialog/ExtendedDialog'
import DriverForm from '../Form/DriverForm'

export default function DriverDialog({ open, onClose, driver, onSave }) {
  const headers = useAuthHeader()

  const handleDriver = async (payload) => {
    try {
      const savedDriver = driver ? await updateDrivers(headers, driver.id, payload) : await saveDriver(headers, payload)
      onSave(savedDriver)
      onClose()
    } catch (err) {
      notifyError(err.message)
    }
  }

  return (
    <ExtendedDialog
      dialogHeader={driver ? 'Şoför Düzenle' : 'Yeni Şoför Ekle'}
      open={open}
      handleClose={onClose}
      dialogContent={<DriverForm initialDriver={driver} handleDriver={handleDriver} />}
    />
  )
}
