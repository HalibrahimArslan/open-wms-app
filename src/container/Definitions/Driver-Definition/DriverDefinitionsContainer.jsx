import React, { useEffect, useState } from 'react'
import { DataGrid, trTR } from '@mui/x-data-grid'
import { Skeleton, Box, TextField, Button } from '@mui/material'
import { deleteDriver, getFilterDrivers, updateDrivers } from '../../../services/DriverService'
import useAuthHeader from '../../../hooks/useAuthHeader'
import { notify, notifyError } from '../../../layout/Layout'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import ActionHeader from '../../../shared/components/ActionHeader'
import AddDriverModal from '../../../components/Dialog/AddDriverDialog'
import AurDialog from '../../../shared/components/Dialog/AurDialog'
import ConfirmDialog from '../../../components/Dialog/ConfirmDialog'
import CustomToolbar from '../../../shared/components/DataGrid/CustomToolbar'

const MAX_PLATE_LEN = 15

const DriverDefinitionsContainer = () => {
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(false)
  const [createDriver, setCreateDriver] = useState(false)
  const [updateDriver, setUpdateDriver] = useState(false)
  const [selectedDriver, setSelectedDriver] = useState(null)
  const [editedDriver, setEditedDriver] = useState(null)
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
            setEditedDriver({ ...params.row })
            setUpdateDriver(true)
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

  const handleUpdateDriver = async () => {
    if (!editedDriver || !editedDriver.id) return

    const lp = (editedDriver.licensePlate || '').trim()
    const tp = (editedDriver.trailerPlate || '').trim()
    if (lp.length > MAX_PLATE_LEN) return notifyError('Plaka 15 haneden fazla olamaz.')
    if (tp.length > MAX_PLATE_LEN) return notifyError('Dorse plaka 15 haneden fazla olamaz.')

    const payload = {
      id: editedDriver.id,
      driverName: editedDriver.driverName,
      phoneNumber: editedDriver.phoneNumber,
      licensePlate: lp,
      trailerPlate: tp,
      identityNumber: editedDriver.identityNumber,
      opType: editedDriver.opType,
    }

    try {
      await updateDrivers(headers, editedDriver.id, payload)

      setDrivers((prev) => prev.map((driver) => (driver.id === editedDriver.id ? { ...driver, ...editedDriver } : driver)))

      setUpdateDriver(false)
      notify('Şoför başarıyla güncellendi.')
    } catch (error) {
      notifyError(error.message)
    }
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
      <ActionHeader title={'Şoför Tanımlamaları'} handleClick={() => setCreateDriver(true)} />
      <DataGrid
        autoHeight
        rows={drivers}
        columns={columns}
        pageSize={20}
        loading={loading}
        rowsPerPageOptions={[50, 100]}
        localeText={trTR.components.MuiDataGrid.defaultProps.localeText}
        disableRowSelectionOnClick
        components={{ Toolbar: CustomToolbar }}
        getRowId={(row) => Number(row.id)}
        filterMode="server"
        disableColumnFilter
        filterModel={filterModel}
        onFilterModelChange={handleFilterModelChange}
        componentsProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
      />

      <AddDriverModal
        open={createDriver}
        onClose={() => setCreateDriver(false)}
        onSave={(newDriver) => {
          setDrivers((prev) => [...prev, newDriver])
          setCreateDriver(false)
          notify('Şoför başarıyla eklendi.')
        }}
      />

      <AurDialog
        open={updateDriver}
        handleClose={() => setUpdateDriver(false)}
        scroll="paper"
        paperProps={{ sx: { width: '80%', maxHeight: '90vh' } }}
        disabled={false}
        children={
          <Box display="flex" flexDirection="column" gap={2} p={2}>
            {editedDriver && (
              <>
                <TextField
                  label="Ad Soyad"
                  value={editedDriver.driverName || ''}
                  onChange={(e) => setEditedDriver((prev) => ({ ...prev, driverName: e.target.value }))}
                  fullWidth
                  size="small"
                />

                <TextField
                  label="Telefon"
                  value={editedDriver.phoneNumber || ''}
                  onChange={(e) => setEditedDriver((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                  fullWidth
                  size="small"
                />

                <TextField
                  label="Plaka"
                  value={editedDriver.licensePlate || ''}
                  onChange={(e) => setEditedDriver((prev) => ({ ...prev, licensePlate: e.target.value }))}
                  fullWidth
                  size="small"
                  inputProps={{ maxLength: MAX_PLATE_LEN }}
                  helperText="Maksimum 15 karakter"
                />

                {/* ✅ trailerPlate edit alanı */}
                <TextField
                  label="Dorse Plaka"
                  value={editedDriver.trailerPlate || ''}
                  onChange={(e) => setEditedDriver((prev) => ({ ...prev, trailerPlate: e.target.value }))}
                  fullWidth
                  size="small"
                  inputProps={{ maxLength: MAX_PLATE_LEN }}
                  helperText="Maksimum 15 karakter"
                />

                <TextField
                  label="TC Kimlik No"
                  value={editedDriver.identityNumber || ''}
                  onChange={(e) => setEditedDriver((prev) => ({ ...prev, identityNumber: e.target.value }))}
                  fullWidth
                  size="small"
                />

                <Box display="flex" justifyContent="flex-end">
                  <Button size="small" variant="contained" color="primary" onClick={handleUpdateDriver}>
                    Kaydet
                  </Button>
                </Box>
              </>
            )}
          </Box>
        }
      />

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
