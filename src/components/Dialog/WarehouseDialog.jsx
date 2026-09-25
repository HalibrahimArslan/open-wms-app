import { useContainer } from 'unstated-next'
import useAuthHeader from '../../hooks/useAuthHeader'
import { createWarehouse, updateWarehouse } from '../../services/WarehouseService'
import { notifyError } from '../../layout/Layout'
import { DataStore } from '../../store/DataStore'
import ExtendedDialog from '../../shared/components/Dialog/ExtendedDialog'
import WarehouseForm from '../Form/WarehouseForm'

export default function WarehouseDialog({ open, onClose, warehouse, warehouses, onSave }) {
  const headers = useAuthHeader()
  const { account } = useContainer(DataStore)

  const handleWarehouse = async (values) => {
    try {
      const savedWarehouse = warehouse
        ? await updateWarehouse(headers, warehouse.id, {
            id: warehouse.id,
            name: values.name,
            transferCode: values.transferCode ?? '',
            autoScan: values.autoScan,
            uniquePickingAddress: values.uniquePickingAddress,
            countable: values.countable,
            real: values.real,
          })
        : await createWarehouse(headers, { ...values, companyCode: String(account.companyCode) })
      onSave(savedWarehouse)
      onClose()
    } catch (err) {
      notifyError(err.message)
    }
  }

  return (
    <ExtendedDialog
      dialogHeader={warehouse ? 'Depo Düzenle' : 'Yeni Depo Ekle'}
      open={open}
      handleClose={onClose}
      dialogContent={<WarehouseForm initialWarehouse={warehouse} warehouses={warehouses} handleWarehouse={handleWarehouse} />}
    />
  )
}
