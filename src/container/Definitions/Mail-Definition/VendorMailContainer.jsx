import { useEffect, useState } from 'react'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import { Box, Button } from '@mui/material'
import useAuthHeader from '../../../hooks/useAuthHeader'
import { generatePayload } from '../../../utils/Utils'
import { createVendorMail, deleteVendorMail, getVendorMails } from '../../../services/VendorMailAddressService'
import VendorMailCreateForm from '../../../components/Form/VendorMailCreateForm'
import { notifyError } from '../../../layout/Layout'
import { useContainer } from 'unstated-next'
import { DataStore } from '../../../store/DataStore'
import ExtendedDialog from '../../../shared/components/Dialog/ExtendedDialog'
import DynamicTable from '../../../shared/components/Table/DynamicTable'

const VendorMailContainer = () => {
  const [mails, setMails] = useState([])
  const [open, setOpen] = useState(false)

  const headers = useAuthHeader()
  const { account } = useContainer(DataStore)

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleCreateEmail = (values) => {
    let payload = generatePayload({ ...values, companyCode: account.companyCode, connectionType: 'VENDOR' })
    fetchCreateVendorMail(payload)
  }

  const fetchDeleteVendorMail = async (id) => {
    try {
      await deleteVendorMail(id, headers)
      setMails((prevMails) => prevMails.filter((mail) => mail.id !== id))
    } catch (error) {
      notifyError(error.message)
    }
  }

  const fetchCreateVendorMail = async (payload) => {
    try {
      const res = await createVendorMail(payload)
      res && setMails([...mails, res])
      handleClose()
    } catch (error) {
      notifyError(error.message)
    }
  }

  const fetchVendorMails = async (companyCode) => {
    try {
      const res = await getVendorMails(headers, companyCode)
      res && setMails(res)
    } catch (error) {
      notifyError(error.message)
    }
  }

  const columns = [
    { field: 'customerCode', headerName: 'Cari Kodu', visible: true },
    { field: 'districtCode', headerName: 'Bölge Kodu', visible: true },
    { field: 'mail', headerName: 'Mail', visible: true },
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
            fetchDeleteVendorMail(row.id)
          },
          icon: <DeleteOutlinedIcon />,
        },
      ],
    },
  ]

  useEffect(() => {
    if (account) {
      fetchVendorMails(account.companyCode)
    }
  }, [account.companyCode])

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
      <DynamicTable data={mails} columns={columns} tableSx={{ height: 500 }} />
      <ExtendedDialog dialogHeader={'Genel Alıcı Ekle'} open={open} handleClose={handleClose} dialogContent={<VendorMailCreateForm handleCreateEmail={handleCreateEmail} />} />
    </Box>
  )
}

export default VendorMailContainer
