import React, { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { Box } from '@mui/material'
import { deleteDriver, getFilterDrivers } from '../../../services/DriverService'
import useAuthHeader from '../../../hooks/useAuthHeader'
import { notify, notifyError } from '../../../layout/Layout'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import ActionHeader from '../../../shared/components/ActionHeader'
import DriverDialog from '../../../components/Dialog/DriverDialog'
import ConfirmDialog from '../../../components/Dialog/ConfirmDialog'
import CustomToolbar from '../../../shared/components/DataGrid/CustomToolbar'

const DriverDefinitionsContainer = () => {
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(false)
  const [driverDialog, setDriverDialog] = useState(false)
  const [selectedDriver, setSelectedDriver] = useState(null)
  const [isDelete, setIsDelete] = useState(false)
  const [filterModel, setFilterModel] = useState({
    items: [],
    quickFilterValues: [],
  })

  const headers = useAuthHeader()

  const columns = [
    { field: 'driverName', headerName: 'Ad Soyad', flex: 1, minWidth: 150 },
    { field: 'phoneNumber', headerName: 'Telefon', flex: 1, minWidth: 150 },
    { field: 'identityNumber', headerName: 'TC Kimlik No', flex: 1 },
    { field: 'licensePlate', headerName: 'Plaka', flex: 1 },
    { field: 'trailerPlate', headerName: 'Dorse Plaka', flex: 1 },
    {
      field: 'edit',
      headerName: 'Düzenle',
      sortable: false,
      filterable: false,
      flex: 0.5,
      renderCell: (params) => (
        <EditIcon
          onClick={() => {
            setSelectedDriver(params.row)
            setDriverDialog(true)
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
      flex: 0.5,
      renderCell: (params) => (
        <DeleteIcon
          onClick={() => {
            setSelectedDriver(params.row)
            setIsDelete(true)
          }}
          sx={{ color: 'error.main', cursor: 'pointer' }}
        />
      ),
    },
  ]

  const getAllDrivers = async (query = '') => {
    setLoading(true)
    try {
      const allDrivers = await getFilterDrivers(headers, query)
      setDrivers(allDrivers)
    } catch (error) {
      notifyError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getAllDrivers()
  }, [])

  const handleFilterModelChange = (model) => {
    setFilterModel(model)
    const query = (model.quickFilterValues || []).join(' ').trim()
    getAllDrivers(query)
  }

  const handleSaveDriver = (savedDriver) => {
    const isEdit = Boolean(selectedDriver)
    setDrivers((prev) => (isEdit ? prev.map((driver) => (driver.id === savedDriver.id ? savedDriver : driver)) : [...prev, savedDriver]))
    notify(isEdit ? 'Şoför başarıyla güncellendi.' : 'Şoför başarıyla eklendi.')
  }

  const handleDeleteDriver = async () => {
    if (!selectedDriver || !selectedDriver.id) return
    try {
      await deleteDriver(selectedDriver.id, headers)
      setDrivers((prev) => prev.filter((driver) => Number(driver.id) !== Number(selectedDriver.id)))
      notify('Şoför başarıyla silindi.')
    } catch (error) {
      notifyError(error.message)
    } finally {
      setIsDelete(false)
      setSelectedDriver(null)
    }
  }

  return (
    <Box>
      <ActionHeader
        title={'Şoför Tanımlamaları'}
        handleClick={() => {
          setSelectedDriver(null)
          setDriverDialog(true)
        }}
      />
      <DataGrid
        autoHeight
        rows={drivers}
        columns={columns}
        pageSize={20}
        loading={loading}
        rowsPerPageOptions={[50, 100]}
        disableRowSelectionOnClick
        slots={{ toolbar: CustomToolbar }}
        getRowId={(row) => Number(row.id)}
        filterMode="server"
        disableColumnFilter
        filterModel={filterModel}
        onFilterModelChange={handleFilterModelChange}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
        showToolbar
      />

      <DriverDialog open={driverDialog} onClose={() => setDriverDialog(false)} driver={selectedDriver} onSave={handleSaveDriver} />

      <ConfirmDialog
        dialogStatus={isDelete}
        dialogTitle="Şoför Silme"
        dialogContentText="Bu şoförü silmek istediğinize emin misiniz?"
        handleClose={() => setIsDelete(false)}
        handleOperate={handleDeleteDriver}
      />
    </Box>
  )
}

export default DriverDefinitionsContainer
