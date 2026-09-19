import { Box, Dialog, Slide, Typography } from '@mui/material'
import React from 'react'
import PasswordForm from '../../components/Form/PasswordForm'
import { generatePayload } from '../../utils/Utils'
import { useNavigate } from 'react-router'
import { notifyError } from '../../layout/Layout'
import { changePassword } from '../../services/AccountService'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

export default function ChangePasswordContainer() {
  const nav = useNavigate()

  const handleChangePassword = async (values) => {
    try {
      await changePassword(
        generatePayload({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        })
      )
      nav('/')
    } catch (error) {
      notifyError(error)
    }
  }

  return (
    <Dialog
      fullScreen
      open={true}
      slots={{
        transition: Transition,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          p: 2,
        }}
      >
        <Box>
          <Typography
            variant="subtitle2"
            sx={{
              textAlign: 'start',
            }}
          >
            Şifreniz en az bir harf, rakam veya özel karakter içermeli. Ayrıca şifreniz en az 4 karakterden oluşmalı.
          </Typography>
        </Box>

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
          disableBackButton={true}
        />
      </Box>
    </Dialog>
  )
}
