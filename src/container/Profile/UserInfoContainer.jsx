import { useEffect, useState } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material'
import { useContainer } from 'unstated-next'
import useAuthHeader from '../../hooks/useAuthHeader'
import { updateUser } from '../../services/UserService'
import { generatePayload } from '../../utils/Utils'
import { getAuthorities, changePassword, getUserAuthorities } from '../../services/AccountService'
import { useSearchParams } from 'react-router-dom'
import { DataStore } from '../../store/DataStore'
import UserForm from '../../components/Form/UserForm'
import PasswordForm from '../../components/Form/PasswordForm'
import { notify, notifyError } from '../../layout/Layout'

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

export default function UserInfoContainer() {
  const [searchparams] = useSearchParams()
  const [value, setValue] = useState(Number(searchparams.get('value')))
  const [authorities, setAuthorities] = useState([])
  const { account } = useContainer(DataStore)
  const headers = useAuthHeader()
  const theme = useTheme()

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const handleClickUpdateUser = async (values) => {
    try {
      const currentUser = account
      const updatedUser = { ...(currentUser || {}), ...values }
      await updateUser(headers, updatedUser)
      notify('Güncellendi')
    } catch (error) {
      notifyError(error.message)
    }
  }

  const handleChangePassword = async (values) => {
    try {
      await changePassword(
        generatePayload({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        })
      )
      setValue(0)
    } catch (error) {
      notifyError(error.message)
    }
  }

  const fetchAllAuthorities = async () => {
    try {
      const res = await getAuthorities(headers)
      res && setAuthorities(res)
    } catch (error) {
      notifyError(error)
    }
  }

  useEffect(() => {
    fetchAllAuthorities()
  }, [])

  return (
    <Box sx={{ minHeight: '500px', width: '100%' }}>
      <Box>
        <Typography variant="h6" fontWeight={theme.typography.fontWeightMedium} textAlign={'start'}>
          Kullanıcı Bilgilerim
        </Typography>
      </Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Profil Bilgilerim" />
          <Tab label="Şifre Değişikliği" />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Typography fontWeight={theme.typography.fontWeightBold} textAlign={'start'} variant="subtitle1">
          Profil Bilgileri
        </Typography>
        <Typography textAlign={'start'} variant="subtitle2">
          Depodaki deneyiminizi en iyi seviyede tutabilmemiz için gereken bilgilerinizi buradan düzenleyebilirsiniz.
        </Typography>
        <UserForm
          initialValues={{
            firstName: account?.firstName,
            lastName: account?.lastName,
            login: account?.login,
            authorities: account?.authorities,
          }}
          validationSchema={null}
          onSubmit={handleClickUpdateUser}
          backButtonLabel="Geri"
          saveButtonLabel="Kaydet"
          authorities={authorities}
          userAuthorities={account?.authorities || []}
        />
      </CustomTabPanel>

      <CustomTabPanel value={value} index={1}>
        <Typography textAlign={'start'} variant="subtitle2">
          Şifreniz en az bir harf, rakam veya özel karakter içermeli. Ayrıca şifreniz en az 4 karakterden oluşmalı.
        </Typography>

        <PasswordForm
          initialValues={{
            currentPassword: '',
            newPassword: '',
            newPasswordConfirm: '',
          }}
          validationSchema={''}
          onSubmit={handleChangePassword}
          backButtonLabel="Geri"
          saveButtonLabel="Şifre Güncelle"
        />
      </CustomTabPanel>
    </Box>
  )
}
