import { useEffect, useMemo, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { Box } from '@mui/material'
import { useContainer } from 'unstated-next'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { deleteWarehouse, getWarehouses } from '../../../services/WarehouseService'
import useAuthHeader from '../../../hooks/useAuthHeader'
import { notify, notifyError } from '../../../layout/Layout'
import { DataStore } from '../../../store/DataStore'
import { DepoContainer } from '../../../store/DepoContainer'
import ActionHeader from '../../../shared/components/ActionHeader'
import TableSearchField from '../../../shared/components/Table/TableSearchField'
import ReadOnlyCheckbox from '../../../shared/components/ReadOnlyCheckbox'
import WarehouseDialog from '../../../components/Dialog/WarehouseDialog'
import ConfirmDialog from '../../../components/Dialog/ConfirmDialog'

const WarehouseContainer = () => {
  const [warehouses, setWarehouses] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [warehouseDialog, setWarehouseDialog] = useState(false)
  const [selectedWarehouse, setSelectedWarehouse] = useState(null)
  const [isDelete, setIsDelete] = useState(false)

  const headers = useAuthHeader()
  const { account } = useContainer(DataStore)
  const { refreshWarehouseLists } = useContainer(DepoContainer)

  const warehouseName = (code) => warehouses.find((warehouse) => warehouse.code === code?.trim())?.name ?? ''

  const booleanColumn = (field, headerName) => ({
    field,
    headerName,
    flex: 0.6,
    minWidth: 130,
    sortable: false,
    filterable: false,
    renderCell: (params) => <ReadOnlyCheckbox checked={params.value} />,
  })

  const columns = [
    { field: 'code', headerName: 'Depo Kodu', flex: 0.5, minWidth: 110 },
    { field: 'name', headerName: 'Depo Adı', flex: 1, minWidth: 160 },
    { field: 'receivingCode', headerName: 'Mal Kabul Depo Kodu', flex: 0.7, minWidth: 150 },
    {
      field: 'transferCode',
      headerName: 'Transfer Depo',
      flex: 1,
      minWidth: 160,
      valueGetter: (value) => (value?.trim() ? [value.trim(), warehouseName(value)].filter(Boolean).join(' - ') : ''),
    },
    booleanColumn('countable', 'Sayılabilir'),
    booleanColumn('real', 'Gerçek Depo'),
    booleanColumn('autoScan', 'Otomatik Arttırma'),
    booleanColumn('uniquePickingAddress', 'Toplama Gözü Tekil'),
    {
      field: 'edit',
      headerName: 'Düzenle',
      sortable: false,
      filterable: false,
      flex: 0.4,
      minWidth: 80,
      renderCell: (params) => (
        <EditIcon
          onClick={() => {
            setSelectedWarehouse(params.row)
            setWarehouseDialog(true)
          }}
          sx={{ color: 'primary.main', cursor: 'pointer' }}
        />
      ),
    },
    {
      field: 'delete',
      headerName: 'Sil',
      sortable: false,
      filterable: false,
      flex: 0.4,
      minWidth: 70,
      renderCell: (params) => (
        <DeleteIcon
          onClick={() => {
            setSelectedWarehouse(params.row)
            setIsDelete(true)
          }}
          sx={{ color: 'error.main', cursor: 'pointer' }}
        />
      ),
    },
  ]

  const getAllWarehouses = async () => {
    setLoading(true)
    try {
      const allWarehouses = await getWarehouses(headers, `companyCode.equals=${account.companyCode}&sort=code,asc&size=1000`)
      setWarehouses(allWarehouses)
    } catch (error) {
      notifyError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (account?.companyCode) {
      getAllWarehouses()
    }
  }, [account?.companyCode])

  const filteredWarehouses = useMemo(() => {
    const term = search.trim().toLocaleLowerCase('tr')
    if (!term) return warehouses
    return warehouses.filter((warehouse) => [warehouse.code, warehouse.name].some((value) => value?.toLocaleLowerCase('tr').includes(term)))
  }, [warehouses, search])

  const handleSaveWarehouse = (savedWarehouse) => {
    const isEdit = Boolean(selectedWarehouse)
    setWarehouses((prev) => (isEdit ? prev.map((warehouse) => (warehouse.id === savedWarehouse.id ? savedWarehouse : warehouse)) : [...prev, savedWarehouse]))
    refreshWarehouseLists()
    notify(isEdit ? 'Depo başarıyla güncellendi.' : 'Depo başarıyla eklendi.')
  }

  const handleDeleteWarehouse = async () => {
    if (!selectedWarehouse || !selectedWarehouse.id) return
    try {
      await deleteWarehouse(headers, selectedWarehouse.id)
      setWarehouses((prev) => prev.filter((warehouse) => Number(warehouse.id) !== Number(selectedWarehouse.id)))
      refreshWarehouseLists()
      notify('Depo başarıyla silindi.')
    } catch (error) {
      notifyError(error.message)
    } finally {
      setIsDelete(false)
      setSelectedWarehouse(null)
    }
  }

  return (
    <Box>
      <ActionHeader
        title={'Depolar'}
        subtitle={`${warehouses.length} depo`}
        actions={<TableSearchField placeholder="Depo kodu ya da adı ara" value={search} onChange={(event) => setSearch(event.target.value)} />}
        handleClick={() => {
          setSelectedWarehouse(null)
          setWarehouseDialog(true)
        }}
      />
      <DataGrid
        autoHeight
        rows={filteredWarehouses}
        columns={columns}
        loading={loading}
        pageSizeOptions={[25, 50, 100]}
        initialState={{ pagination: { paginationModel: { pageSize: 25 } } }}
        disableRowSelectionOnClick
        getRowId={(row) => Number(row.id)}
      />

      <WarehouseDialog open={warehouseDialog} onClose={() => setWarehouseDialog(false)} warehouse={selectedWarehouse} warehouses={warehouses} onSave={handleSaveWarehouse} />

      <ConfirmDialog
        dialogStatus={isDelete}
        dialogTitle="Depo Silme"
        dialogContentText={`${selectedWarehouse?.code ?? ''} ${selectedWarehouse?.name ?? ''} deposunu silmek istediğinize emin misiniz?`}
        handleClose={() => setIsDelete(false)}
        handleOperate={handleDeleteWarehouse}
      />
    </Box>
  )
}

export default WarehouseContainer
