import { useEffect, useState } from 'react'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import { Box, Button } from '@mui/material'
import { generatePayload } from '../../../utils/Utils'
import { getGroupMailAddress, createGroupMailAddress, deleteGroupMailAddress } from '../../../services/GroupMailAddressService'
import useAuthHeader from '../../../hooks/useAuthHeader'
import { notify, notifyError } from '../../../layout/Layout'
import StockGroupMailCreateForm from '../../../components/Form/StockGroupMailCreateForm'
import ExtendedDialog from '../../../shared/components/Dialog/ExtendedDialog'
import DynamicTable from '../../../shared/components/Table/DynamicTable'

const StockMailContainer = () => {
  const [mails, setMails] = useState([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const headers = useAuthHeader()

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleCreateEmail = (values) => {
    let payload = generatePayload({ ...values })
    return fetchCreateGroupMail(payload)
  }

  const fetchDeleteGroupMail = async (id) => {
    try {
      await deleteGroupMailAddress(id, headers)
      setMails((prevMails) => prevMails.filter((mail) => mail.id !== id))
      notify('Alıcı başarıyla silindi.')
    } catch (error) {
      notifyError(error.message)
    }
  }

  const fetchCreateGroupMail = async (payload) => {
    try {
      const res = await createGroupMailAddress(payload)
      res && setMails((prevMails) => [...prevMails, res])
      res && handleClose()
      res && notify('Alıcı başarıyla eklendi.')
    } catch (error) {
      notifyError(error.message)
    }
  }

  const fetchStockGroupMails = async () => {
    try {
      setLoading(true)
      const res = await getGroupMailAddress(headers)
      res && setMails(res)
    } catch (error) {
      notifyError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    { field: 'grupKodu', headerName: 'Stok Grup Kodu', visible: true },
    { field: 'mailAdres', headerName: 'Mail Adresi', visible: true },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Sil',
      visible: true,
      getActions: (row) => [
        {
          id: row.id,
          name: 'Sil',
          onClick: () => {
            fetchDeleteGroupMail(row.id)
          },
          icon: <DeleteOutlinedIcon />,
        },
      ],
    },
  ]

  useEffect(() => {
    fetchStockGroupMails()
  }, [])

  return (
    <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
      >
        <Button variant="outlined" onClick={handleOpen}>
          Ekle
        </Button>
      </Box>
      <DynamicTable data={mails} columns={columns} loading={loading} tableSx={{ height: 500 }} />
      <ExtendedDialog dialogHeader={'Stok Alıcısı Ekle'} open={open} handleClose={handleClose} dialogContent={<StockGroupMailCreateForm handleCreateEmail={handleCreateEmail} />} />
    </Box>
  )
}

export default StockMailContainer
