import { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { Box, Chip } from '@mui/material'
import { getCompanies, deleteCompany } from '../../services/CompanyService'
import useAuthHeader from '../../hooks/useAuthHeader'
import { notify, notifyError } from '../../layout/Layout'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import ActionHeader from '../../shared/components/ActionHeader'
import CompanyDialog from '../../components/Dialog/CompanyDialog'
import ConfirmDialog from '../../components/Dialog/ConfirmDialog'
import CustomToolbar from '../../shared/components/DataGrid/CustomToolbar'
import { ERP_TYPES } from '../../schemas/schemas'

const erpTypeLabel = (value) => ERP_TYPES.find((type) => type.value === value)?.label ?? value

const CompanyContainer = () => {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(false)
  const [companyDialog, setCompanyDialog] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [isDelete, setIsDelete] = useState(false)

  const headers = useAuthHeader()

  const columns = [
    { field: 'companyCode', headerName: 'Şirket Kodu', flex: 0.5, minWidth: 120 },
    { field: 'companyName', headerName: 'Şirket Adı', flex: 1, minWidth: 180 },
    { field: 'erpType', headerName: 'ERP Tipi', flex: 0.7, minWidth: 140, valueFormatter: (value) => erpTypeLabel(value) },
    {
      field: 'erpApiActive',
      headerName: 'ERP Bağlantısı',
      flex: 0.6,
      minWidth: 140,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Chip
          label={params.row.apiParameters?.erpApiActive ? 'Aktif' : 'Pasif'}
          color={params.row.apiParameters?.erpApiActive ? 'success' : 'default'}
          size="small"
        />
      ),
    },
    {
      field: 'edit',
      headerName: 'Düzenle',
      sortable: false,
      filterable: false,
      flex: 0.5,
      renderCell: (params) => (
        <EditIcon
          onClick={() => {
            setSelectedCompany(params.row)
            setCompanyDialog(true)
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
            setSelectedCompany(params.row)
            setIsDelete(true)
          }}
          sx={{ color: 'error.main', cursor: 'pointer' }}
        />
      ),
    },
  ]

  const getAllCompanies = async () => {
    setLoading(true)
    try {
      const allCompanies = await getCompanies(headers)
      setCompanies(allCompanies)
    } catch (error) {
      notifyError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getAllCompanies()
  }, [])

  const handleSaveCompany = (savedCompany) => {
    const isEdit = Boolean(selectedCompany)
    setCompanies((prev) => (isEdit ? prev.map((company) => (company.id === savedCompany.id ? savedCompany : company)) : [...prev, savedCompany]))
    notify(isEdit ? 'Şirket başarıyla güncellendi.' : 'Şirket başarıyla eklendi.')
  }

  const handleDeleteCompany = async () => {
    if (!selectedCompany || !selectedCompany.id) return
    try {
      await deleteCompany(headers, selectedCompany.id)
      setCompanies((prev) => prev.filter((company) => Number(company.id) !== Number(selectedCompany.id)))
      notify('Şirket başarıyla silindi.')
    } catch (error) {
      notifyError(error.message)
    } finally {
      setIsDelete(false)
      setSelectedCompany(null)
    }
  }

  return (
    <Box>
      <ActionHeader
        title={'Şirket Yönetimi'}
        handleClick={() => {
          setSelectedCompany(null)
          setCompanyDialog(true)
        }}
      />
      <DataGrid
        autoHeight
        rows={companies}
        columns={columns}
        pageSize={20}
        loading={loading}
        rowsPerPageOptions={[50, 100]}
        disableRowSelectionOnClick
        slots={{ toolbar: CustomToolbar }}
        getRowId={(row) => Number(row.id)}
        showToolbar
      />

      <CompanyDialog open={companyDialog} onClose={() => setCompanyDialog(false)} company={selectedCompany} onSave={handleSaveCompany} />

      <ConfirmDialog
        dialogStatus={isDelete}
        dialogTitle="Şirket Silme"
        dialogContentText="Bu şirketi silmek istediğinize emin misiniz?"
        handleClose={() => setIsDelete(false)}
        handleOperate={handleDeleteCompany}
      />
    </Box>
  )
}

export default CompanyContainer
