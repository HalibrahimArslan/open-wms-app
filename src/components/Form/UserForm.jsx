import React, { useState } from 'react'
import { Box, MenuItem, FormControl, InputLabel, Select, TextField, Button, IconButton, InputAdornment, FormHelperText } from '@mui/material'
import { Formik, Form } from 'formik'
import { useNavigate } from 'react-router'
import SaveAsOutlinedIcon from '@mui/icons-material/SaveAsOutlined'
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { notifyError } from '../../layout/Layout'

let UserFormFields = {
  login: 'Kullanıcı Adı',
  firstName: 'Ad',
  lastName: 'Soyad',
  email: 'Email',
  authorities: 'Yetkiler',
  roles: 'Roller',
  newPasswordConfirm: 'Parola Onayı',
  newPassword: 'Yeni Parola',
  currentPassword: 'Mevcut Parola',
}

const UserForm = ({ initialValues = {}, validationSchema, onSubmit, backButtonLabel, saveButtonLabel, authorities = [], roles = [], userAuthorities = [] }) => {
  const nav = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const toggleShowPassword = () => setShowPassword((p) => !p)

  const handleSubmit = async (values) => {
    try {
      await onSubmit(values)
    } catch (error) {
      notifyError(error)
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
                {fieldName === 'authorities' ? (
                  userAuthorities.includes('ROLE_ADMIN') && (
                    <FormControl fullWidth error={touched.authorities && Boolean(errors.authorities)}>
                      <InputLabel id="authorities-label">Yetki</InputLabel>
                      <Select
                        labelId="authorities-label"
                        id="authorities"
                        name="authorities"
                        multiple
                        label="Yetki"
                        value={values.authorities || []}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        renderValue={(selected) => (selected || []).join(', ')}
                      >
                        {(authorities || []).map((authority) => (
                          <MenuItem key={authority} value={authority}>
                            {authority}
                          </MenuItem>
                        ))}
                      </Select>

                      {touched.authorities && errors.authorities ? <FormHelperText>{errors.authorities}</FormHelperText> : null}
                    </FormControl>
                  )
                ) : fieldName === 'roles' ? (
                  userAuthorities.includes('ROLE_ADMIN') && (
                    <FormControl fullWidth error={touched.roles && Boolean(errors.roles)}>
                      <InputLabel id="roles-label">Rol</InputLabel>
                      <Select
                        labelId="roles-label"
                        id="roles"
                        name="roles"
                        multiple
                        label="Rol"
                        value={values.roles || []}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        renderValue={(selected) => (selected || []).join(', ')}
                      >
                        {(roles || []).map((role) => (
                          <MenuItem key={role.id ?? role.roleName} value={role.roleName}>
                            {role.roleName}
                          </MenuItem>
                        ))}
                      </Select>

                      {touched.roles && errors.roles ? <FormHelperText>{errors.roles}</FormHelperText> : null}
                    </FormControl>
                  )
                ) : (
                  <TextField
                    fullWidth
                    type={fieldName.includes('Password') ? (showPassword ? 'text' : 'password') : 'text'}
                    label={UserFormFields[fieldName]}
                    name={fieldName}
                    value={values[fieldName] || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched[fieldName] && Boolean(errors[fieldName])}
                    helperText={touched[fieldName] ? errors[fieldName] : ''}
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
                )}
              </Box>
            ))}

            <Box
              sx={{
                display: 'flex',
                gap: 1,
                mt: 2,
              }}
            >
              <Button startIcon={<ArrowBackOutlinedIcon />} variant="contained" color="primary" onClick={() => nav(-1)}>
                {backButtonLabel}
              </Button>

              <Button startIcon={<SaveAsOutlinedIcon />} type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                {saveButtonLabel}
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  )
}

export default UserForm
