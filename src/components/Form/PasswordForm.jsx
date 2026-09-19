import { Box, Button, IconButton, InputAdornment, TextField } from '@mui/material'
import { Form, Formik } from 'formik'
import React, { useState } from 'react'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined'
import SaveAsOutlinedIcon from '@mui/icons-material/SaveAsOutlined'
import { useNavigate } from 'react-router'
import { notifyError } from '../../layout/Layout'

let UserFormFields = {
  newPasswordConfirm: 'Parola Onayı',
  newPassword: 'Yeni Parola',
  currentPassword: 'Mevcut Parola',
}

const PasswordForm = ({ initialValues = {}, validationSchema, onSubmit, backButtonLabel, saveButtonLabel, disableBackButton }) => {
  const [showPassword, setShowPassword] = useState(false)
  const toggleShowPassword = () => setShowPassword(!showPassword)

  const nav = useNavigate()

  const handleSubmit = async (values) => {
    try {
      if (values.newPassword !== values.newPasswordConfirm) {
        throw new Error('Yeni parola ve onay parolası eşleşmiyor.')
      }
      await onSubmit(values)
    } catch (error) {
      notifyError(error.message)
    }
  }

  return (
    <Box>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
          <Form onSubmit={handleSubmit}>
            {Object.keys(initialValues).map((fieldName) => (
              <Box
                key={fieldName}
                sx={{
                  mt: 2,
                }}
              >
                <TextField
                  fullWidth
                  type={fieldName.includes('Password') ? (showPassword ? 'text' : 'password') : 'text'}
                  label={UserFormFields[fieldName]}
                  name={fieldName}
                  value={values[fieldName] || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  slotProps={{
                    input: {
                      endAdornment: fieldName.includes('Password') ? (
                        <InputAdornment position="end">
                          <IconButton onClick={toggleShowPassword} edge="end">
                            {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                          </IconButton>
                        </InputAdornment>
                      ) : null,
                    },
                  }}
                />
              </Box>
            ))}
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                mt: 2,
              }}
            >
              <Button startIcon={<ArrowBackOutlinedIcon />} variant="contained" color="primary" onClick={() => nav(-1)} disabled={disableBackButton}>
                {backButtonLabel}
              </Button>
              <Button
                startIcon={<SaveAsOutlinedIcon />}
                type="submit"
                variant="contained"
                color="primary"
                disabled={values.newPassword !== '' ? (values.newPassword === values.newPasswordConfirm ? false : true) : true}
              >
                {saveButtonLabel}
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  )
}

export default PasswordForm
