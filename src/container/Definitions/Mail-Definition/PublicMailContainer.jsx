import { useEffect, useState } from 'react'
import { useContainer } from 'unstated-next'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import { Box, Button } from '@mui/material'
import { DataStore } from '../../../store/DataStore'
import useAuthHeader from '../../../hooks/useAuthHeader'
import { generatePayload } from '../../../utils/Utils'
import PublicMailCreateForm from '../../../components/Form/PublicMailCreateForm'
import { createPublicMail, deletePublicMail, getPublicMails } from '../../../services/AurMailAddToService'
import { notifyError } from '../../../layout/Layout'
import ExtendedDialog from '../../../shared/components/Dialog/ExtendedDialog'
import DynamicTable from '../../../shared/components/Table/DynamicTable'

const PublicMailContainer = () => {
  const [mails, setMails] = useState([])
  const [open, setOpen] = useState(false)
  const { account } = useContainer(DataStore)
  const headers = useAuthHeader()

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleCreateEmail = (values) => {
    let payload = generatePayload({ ...values, companyCode: account.companyCode })
    fetchCreatePublicMail(payload)
  }

  const fetchPublicMails = async (companyCode) => {
    try {
      const res = await getPublicMails(companyCode, headers)
      res && setMails(res)
    } catch (error) {
      notifyError(error.message)
    }
  }

  const fetchCreatePublicMail = async (payload) => {
    try {
      const res = await createPublicMail(payload)
      res && setMails([...mails, res])
      res && handleClose()
    } catch (error) {
      notifyError(error.message)
    }
  }

  const fetchDeletePublicMail = async (row) => {
    try {
      await deletePublicMail(row.id, headers)
      setMails((prevMails) => prevMails.filter((mail) => mail.id !== row.id))
    } catch (error) {
      notifyError(error.message)
    }
  }

  const columns = [
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
            fetchDeletePublicMail(row)
          },
          icon: <DeleteOutlinedIcon />,
        },
      ],
    },
  ]

  useEffect(() => {
    if (account.companyCode) {
      fetchPublicMails(account.companyCode)
    }
  }, [account.companyCode])

  return (
    <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
      <Box display={'flex'} justifyContent={'flex-end'} alignItems={'center'}>
        <Button variant="outlined" onClick={handleOpen}>
          Ekle
        </Button>
      </Box>
      <DynamicTable data={mails} columns={columns} tableSx={{ height: 500 }} />
      <ExtendedDialog dialogHeader={'Genel Alıcı Ekle'} open={open} handleClose={handleClose} dialogContent={<PublicMailCreateForm handleCreateEmail={handleCreateEmail} />} />
    </Box>
  )
}

export default PublicMailContainer
