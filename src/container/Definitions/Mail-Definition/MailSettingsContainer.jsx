import { useEffect, useState } from 'react'
import { createOrUpdateLookup, deleteMails, getLookupsByLookupNames } from '../../../services/LookupService'
import { generatePayload } from '../../../utils/Utils'
import { notify, notifyError } from '../../../layout/Layout'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined'
import { Box, Button, IconButton, Typography, useTheme } from '@mui/material'
import LookupForm from '../../../components/Form/LookupForm'
import SettingsIcon from '@mui/icons-material/Settings'
import DynamicTable from '../../../shared/components/Table/DynamicTable'
import ExtendedDialog from '../../../shared/components/Dialog/ExtendedDialog'
import IosSwitch from '../../../components/Switch/IosSwitch'
import useAuthHeader from '../../../hooks/useAuthHeader'

const mailKeys = ['Z_REPORT_MAIL', 'MAIL_NOT_FOUND']
const mailSettingKeys = ['Z_REPORT_MAIL_STATUS', 'MAIL_STATUS']

const MailSettingsContainer = () => {
  const [mails, setMails] = useState([])
  const [mailSettings, setMailSettings] = useState([])
  const [open, setOpen] = useState(false)
  const [settingDialog, setSettingDialog] = useState(false)
  const [selectedLookup, setSelectedLookup] = useState(null)

  const theme = useTheme()
  const headers = useAuthHeader()
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleAdd = () => {
    setSelectedLookup(null)
    handleOpen()
  }

  const fetchDeleteMail = async (id) => {
    try {
      const res = await deleteMails(headers, id)
      if (!res) return

      setMails((prev) => prev.filter((m) => m.id !== id))
      notify('Kayıt silindi.')
    } catch (error) {
      notifyError(error?.message || 'Silme işlemi sırasında hata oluştu.')
    }
  }

  const columns = [
    { field: 'lookupName', headerName: 'Key', visible: true },
    { field: 'lookupCode', headerName: 'Değer', visible: true },
    { field: 'lookupDescription', headerName: 'Açıklama', visible: true },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Aksiyonlar',
      visible: true,
      getActions: (row) => [
        {
          id: row.id,
          name: 'Düzenle',
          onClick: () => {
            setSelectedLookup(row)
            handleOpen()
          },
          icon: <EditOutlinedIcon />,
        },
        {
          id: row.id,
          name: 'Sil',
          onClick: () => fetchDeleteMail(row.id),
          icon: <DeleteOutlineIcon />,
        },
      ],
    },
  ]

  const getLookupKeyStatus = (key) => {
    let searchKey = mailSettings.find((mail) => mail.lookupName === key)
    if (searchKey) {
      return searchKey.lookupCode === 'true' ? true : false
    }
    return null
  }

  const handleLookup = (values) => {
    const payload = generatePayload(values)
    const isEdit = Boolean(values?.id || selectedLookup?.id)
    fetchCreateLookup(payload, isEdit)
  }

  const fetchLookups = async () => {
    try {
      const res = await getLookupsByLookupNames(generatePayload(mailKeys))
      res && setMails(res)
    } catch (error) {
      notifyError(error.message)
    }
  }

  const fetchMailSettings = async () => {
    try {
      const res = await getLookupsByLookupNames(generatePayload(mailSettingKeys))
      res && setMailSettings(res)
    } catch (error) {
      notifyError(error.message)
    }
  }

  const fetchUpdateMailSettings = async (payload) => {
    try {
      const res = await createOrUpdateLookup(payload)
      res &&
        setMailSettings((prevMailSettings) => prevMailSettings.map((mailSetting) => (mailSetting.id === res.id ? { ...mailSetting, lookupCode: res.lookupCode } : mailSetting)))
    } catch (error) {
      notifyError(error.message)
    }
  }

  const fetchCreateLookup = async (payload, isEdit) => {
    try {
      const res = await createOrUpdateLookup(payload)
      if (!res) return

      setMails((prev) => {
        const exists = prev.some((m) => m.id === res.id)
        return exists ? prev.map((m) => (m.id === res.id ? res : m)) : [...prev, res]
      })

      if (isEdit) notify('Kayıt güncellendi.')
      else notify('Kayıt oluşturuldu.')

      setOpen(false)
      setSelectedLookup(null)
    } catch (error) {
      notifyError(error?.message || 'İşlem sırasında hata oluştu.')
    }
  }

  useEffect(() => {
    fetchLookups()
    fetchMailSettings()
  }, [])

  return (
    <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <IconButton onClick={() => setSettingDialog(true)} disabled={mailSettings && mailSettings.length === 0}>
          <SettingsIcon />
        </IconButton>
        <Button variant="outlined" onClick={handleAdd}>
          Ekle
        </Button>
      </Box>

      <DynamicTable data={mails} columns={columns} tableSx={{ height: 500 }} size={'small'} />

      <ExtendedDialog
        dialogHeader={'Mail Key Ekle'}
        open={open}
        handleClose={handleClose}
        dialogContent={<LookupForm initialLookup={selectedLookup} handleLookup={handleLookup} />}
      />

      <ExtendedDialog
        dialogHeader={'Mail Ayarları'}
        open={settingDialog}
        handleClose={() => setSettingDialog(false)}
        dialogContent={
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
            }}
          >
            {mailSettings &&
              mailSettings.map((mailSetting) => (
                <Box
                  key={mailSetting.id}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 1,
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: theme.typography.fontWeightBold,
                    }}
                  >
                    {mailSetting.lookupName}
                  </Typography>
                  <IosSwitch
                    checked={mailSetting.lookupCode === 'true'}
                    onChange={(event) => {
                      fetchUpdateMailSettings(
                        generatePayload({
                          ...mailSetting,
                          lookupCode: event.target.checked,
                        })
                      )
                    }}
                  />
                </Box>
              ))}
          </Box>
        }
      />
    </Box>
  )
}

export default MailSettingsContainer
