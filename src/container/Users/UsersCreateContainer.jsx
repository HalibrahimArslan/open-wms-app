import React, { useEffect, useState } from 'react'
import { Box, Typography, Divider, useTheme } from '@mui/material'
import { getAuthorities } from '../../services/AccountService'
import { createUser } from '../../services/UserService'
import { getDepoListFromErp } from '../../services/MikroService'
import { assignUserDepos } from '../../services/UserDepoRelService'
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
  const [depoList, setDepoList] = useState([])
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

  const fetchDepoList = async () => {
    try {
      const res = await getDepoListFromErp(headers)
      setDepoList(res || [])
    } catch (error) {
      notifyError(error.message)
    }
  }

  const handleCreateUser = async ({ depots, ...values }) => {
    try {
      const createdUser = await createUser(headers, values)
      if (createdUser?.id && depots?.length > 0) {
        const warehouseList = depots.map((depoNo) => {
          const depo = depoList.find((item) => String(item.depoNo) === depoNo)
          return { code: depoNo, name: depo?.depoIsmi, companyCode: String(account.companyCode) }
        })
        await assignUserDepos(headers, { warehouseList, userList: [{ id: createdUser.id }] })
      }
      createdUser && notify('Oluşturuldu')
    } catch (error) {
      notifyError(error.message)
    }
  }

  useEffect(() => {
    fetchAllAuth()
    fetchAllRoles()
    fetchDepoList()
  }, [])

  return (
    <Box>
      <Typography
        variant="h4"
        sx={{
          textAlign: 'start',
          fontWeight: theme.typography.fontWeightMedium,
        }}
      >
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
          depots: [],
        }}
        validationSchema={null}
        onSubmit={handleCreateUser}
        backButtonLabel="Geri"
        saveButtonLabel="Kaydet"
        authorities={auth}
        roles={roles}
        depoList={depoList}
        userAuthorities={account.authorities || []}
      />
    </Box>
  )
}

export default UserCreateContainer
