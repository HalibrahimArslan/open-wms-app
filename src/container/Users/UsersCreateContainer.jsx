import React, { useEffect, useState } from 'react'
import { Box, Typography, Divider, useTheme } from '@mui/material'
import { getAuthorities } from '../../services/AccountService'
import { createUser } from '../../services/UserService'
import { notify, notifyError } from '../../layout/Layout'
import UserForm from '../../components/Form/UserForm'
import useAuthHeader from '../../hooks/useAuthHeader'
import { useContainer } from 'unstated-next'
import { DataStore } from '../../store/DataStore'
import { getRoleList } from '../../services/RoleService'

const UserCreateContainer = () => {
  const theme = useTheme()
  const headers = useAuthHeader()
  const [auth, setAuth] = useState([])
  const [roles, setRoles] = useState([])
  const { account } = useContainer(DataStore)

  const fetchAllAuth = async () => {
    try {
      const res = await getAuthorities(headers)
      setAuth(res || [])
    } catch (error) {
      notifyError(error)
    }
  }

  const fetchAllRoles = async () => {
    try {
      const res = await getRoleList(headers, `companyCode=${account.companyCode}`)
      res && setRoles(res)
    } catch (error) {
      notifyError(error)
    }
  }

  const handleCreateUser = async (values) => {
    try {
      const res = await createUser(headers, values)
      res && notify('Oluşturuldu')
    } catch (error) {
      notifyError(error.message)
    }
  }

  useEffect(() => {
    fetchAllAuth()
    fetchAllRoles()
  }, [])

  return (
    <Box>
      <Typography textAlign="start" fontWeight={theme.typography.fontWeightMedium} variant="h4">
        Kullanıcı Oluştur
      </Typography>
      <Divider />
      <UserForm
        initialValues={{
          login: '',
          firstName: '',
          lastName: '',
          email: '',
          authorities: [],
          roles: [],
        }}
        validationSchema={null}
        onSubmit={handleCreateUser}
        backButtonLabel="Geri"
        saveButtonLabel="Kaydet"
        authorities={auth}
        roles={roles}
        userAuthorities={account.authorities || []}
      />
    </Box>
  )
}

export default UserCreateContainer
