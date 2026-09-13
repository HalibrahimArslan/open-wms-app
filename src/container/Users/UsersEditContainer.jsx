import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Box } from '@mui/material'
import useAuthHeader from '../../hooks/useAuthHeader'
import { updateUser, getUserByLogin } from '../../services/UserService'
import { notify, notifyError } from '../../layout/Layout'
import { getAuthorities } from '../../services/AccountService'
import UserForm from '../../components/Form/UserForm'
import { userEditSchema } from '../../schemas/schemas'
import { DataStore } from '../../store/DataStore'
import { useContainer } from 'unstated-next'
import { getRoleList } from '../../services/RoleService'

const UserEditContainer = () => {
  const [searchParams] = useSearchParams()
  const login = searchParams.get('login')
  const headers = useAuthHeader()
  const { account } = useContainer(DataStore)

  const [user, setUser] = useState(null)
  const [auth, setAuth] = useState([])
  const [roles, setRoles] = useState([])

  const fetchUserByLogin = useCallback(async () => {
    try {
      if (!login) return
      const res = await getUserByLogin(headers, login)
      if (res) setUser(res)
    } catch (error) {
      notifyError(error?.message || error)
    }
  }, [headers, login])

  const fetchAllAuth = useCallback(async () => {
    try {
      const res = await getAuthorities(headers)
      setAuth(res || [])
    } catch (error) {
      notifyError(error)
    }
  }, [headers])

  const fetchAllRoles = useCallback(async () => {
    try {
      const res = await getRoleList(headers, `companyCode=${account.companyCode}`)
      setRoles(res || [])
    } catch (error) {
      notifyError(error)
    }
  }, [headers])

  useEffect(() => {
    fetchUserByLogin()
    fetchAllRoles()
    fetchAllAuth()
  }, [fetchUserByLogin, fetchAllRoles, fetchAllAuth])

  const handleClickUpdateUser = async (values) => {
    try {
      const currentUser = user
      const updatedUser = {
        ...(currentUser || {}),
        ...values,
      }
      await updateUser(headers, updatedUser)
      notify('Güncellendi')
    } catch (error) {
      notifyError(error?.message || error)
    }
  }

  return (
    <Box>
      {user && (
        <UserForm
          initialValues={{
            login: user.login || '',
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            authorities: user.authorities || [],
            roles: user.roles || [],
          }}
          validationSchema={userEditSchema}
          onSubmit={handleClickUpdateUser}
          backButtonLabel="Geri"
          saveButtonLabel="Kaydet"
          authorities={auth}
          roles={roles}
          userAuthorities={account.authorities || []}
        />
      )}
    </Box>
  )
}

export default UserEditContainer
