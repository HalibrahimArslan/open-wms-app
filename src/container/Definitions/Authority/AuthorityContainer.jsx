import { useEffect, useMemo, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { Box, TextField } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { useContainer } from 'unstated-next'
import { createAuthority, deleteAuthority, getAuthorityList } from '../../../services/AuthorityService'
import useAuthHeader from '../../../hooks/useAuthHeader'
import { notify, notifyError } from '../../../layout/Layout'
import ActionHeader from '../../../shared/components/ActionHeader'
import TableSearchField from '../../../shared/components/Table/TableSearchField'
import ExtendedDialog from '../../../shared/components/Dialog/ExtendedDialog'
import ConfirmDialog from '../../../components/Dialog/ConfirmDialog'
import EmptyState from '../../../shared/components/EmptyState/EmptyState'
import { DataStore } from '../../../store/DataStore'

const AuthorityContainer = () => {
  const [authorities, setAuthorities] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [saving, setSaving] = useState(false)
  const [selectedAuthority, setSelectedAuthority] = useState(null)

  const headers = useAuthHeader()
  const { account } = useContainer(DataStore)
  const isAdmin = Boolean(account?.authorities?.includes('ROLE_ADMIN'))

  const columns = [
    { field: 'name', headerName: 'Yetki Adı', flex: 1, minWidth: 200 },
    {
      field: 'delete',
      headerName: 'Sil',
      sortable: false,
      filterable: false,
      flex: 0.2,
      minWidth: 70,
      renderCell: (params) => <DeleteIcon onClick={() => setSelectedAuthority(params.row)} sx={{ color: 'error.main', cursor: 'pointer' }} />,
    },
  ]

  const fetchAuthorities = async () => {
    setLoading(true)
    try {
      const res = await getAuthorityList(headers)
      setAuthorities(res)
    } catch (error) {
      notifyError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAdmin) fetchAuthorities()
  }, [isAdmin])

  const filteredAuthorities = useMemo(() => {
    const term = search.trim().toLocaleLowerCase('tr')
    if (!term) return authorities
    return authorities.filter((authority) => authority.name.toLocaleLowerCase('tr').includes(term))
  }, [authorities, search])

  const handleCloseCreate = () => {
    setCreateOpen(false)
    setNewName('')
  }

  const handleCreate = async () => {
    try {
      setSaving(true)
      await createAuthority(headers, newName.trim())
      notify('Yetki başarıyla eklendi.')
      handleCloseCreate()
      fetchAuthorities()
    } catch (error) {
      notifyError(error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedAuthority) return
    try {
      await deleteAuthority(headers, selectedAuthority.name)
      setAuthorities((prev) => prev.filter((authority) => authority.name !== selectedAuthority.name))
      notify('Yetki başarıyla silindi.')
    } catch (error) {
      notifyError(error.message)
    } finally {
      setSelectedAuthority(null)
    }
  }

  if (!account) return null

  if (!isAdmin) {
    return <EmptyState icon={<LockOutlinedIcon />} title="Yetkiniz yoktur" description="Bu sayfayı yalnızca ROLE_ADMIN yetkisine sahip kullanıcılar görüntüleyebilir." />
  }

  return (
    <Box>
      <ActionHeader
        title="Yetki Tanımları"
        subtitle={`${authorities.length} yetki`}
        actions={<TableSearchField placeholder="Yetki adı ara" value={search} onChange={(event) => setSearch(event.target.value)} />}
        handleClick={() => setCreateOpen(true)}
      />
      <DataGrid
        autoHeight
        rows={filteredAuthorities}
        columns={columns}
        loading={loading}
        pageSizeOptions={[25, 50, 100]}
        initialState={{ pagination: { paginationModel: { pageSize: 25 } } }}
        disableRowSelectionOnClick
        getRowId={(row) => row.name}
      />

      <ExtendedDialog
        open={createOpen}
        handleClose={handleCloseCreate}
        handleSave={handleCreate}
        dialogHeader="Yeni Yetki Ekle"
        actionButtonName="Kaydet"
        actionButtonDisaled={saving || !newName.trim()}
        dialogContent={
          <TextField value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Yetki Adı (örn. ROLE_DEPOCU)" inputProps={{ maxLength: 50 }} fullWidth autoFocus />
        }
      />

      <ConfirmDialog
        dialogStatus={Boolean(selectedAuthority)}
        dialogTitle="Yetki Silme"
        dialogContentText={`${selectedAuthority?.name ?? ''} yetkisini silmek istediğinize emin misiniz?`}
        handleClose={() => setSelectedAuthority(null)}
        handleOperate={handleDelete}
      />
    </Box>
  )
}

export default AuthorityContainer
