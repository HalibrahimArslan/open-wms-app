import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router'
import { Box } from '@mui/material'
import useAuthHeader from '../../hooks/useAuthHeader'
import { updateUser, getUserByLogin } from '../../services/UserService'
import { getDepoListFromErp } from '../../services/MikroService'
import { getUserDepoRels, assignUserDepos, deleteUserDepoRel } from '../../services/UserDepoRelService'
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
  const [depoList, setDepoList] = useState([])
  const [userDepoRels, setUserDepoRels] = useState([])
  const [depoRelsLoaded, setDepoRelsLoaded] = useState(false)

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

  const fetchDepoList = useCallback(async () => {
    try {
      const res = await getDepoListFromErp(headers)
      setDepoList(res || [])
    } catch (error) {
      notifyError(error.message)
    }
  }, [headers])

  const fetchUserDepoRels = useCallback(
    async (userId) => {
      try {
        const res = await getUserDepoRels(headers, `userId.equals=${userId}`)
        setUserDepoRels(res || [])
      } catch (error) {
        notifyError(error.message)
      } finally {
        setDepoRelsLoaded(true)
      }
    },
    [headers],
  )

  useEffect(() => {
    fetchUserByLogin()
    fetchAllRoles()
    fetchAllAuth()
    fetchDepoList()
  }, [fetchUserByLogin, fetchAllRoles, fetchAllAuth, fetchDepoList])

  useEffect(() => {
    if (user?.id) fetchUserDepoRels(user.id)
  }, [user?.id, fetchUserDepoRels])

  const handleClickUpdateUser = async ({ depots, ...values }) => {
    try {
      const currentUser = user
      const updatedUser = {
        ...(currentUser || {}),
        ...values,
      }
      await updateUser(headers, updatedUser)

      const selectedCodes = depots || []
      const existingCodes = userDepoRels.map((rel) => rel.warehouse.code)
      const addedCodes = selectedCodes.filter((code) => !existingCodes.includes(code))
      const removedRels = userDepoRels.filter((rel) => !selectedCodes.includes(rel.warehouse.code))

      if (addedCodes.length > 0) {
        const warehouseList = addedCodes.map((code) => {
          const depo = depoList.find((item) => item.code === code)
          return { code, name: depo?.name, companyCode: String(account.companyCode) }
        })
        await assignUserDepos(headers, { warehouseList, userList: [{ id: currentUser.id }] })
      }
      await Promise.all(removedRels.map((rel) => deleteUserDepoRel(headers, rel.id)))

      await fetchUserDepoRels(currentUser.id)
      notify('Güncellendi')
    } catch (error) {
      notifyError(error?.message || error)
    }
  }

  return (
    <Box>
      {user && depoRelsLoaded && (
        <UserForm
          initialValues={{
            login: user.login || '',
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            authorities: user.authorities || [],
            roles: user.roles || [],
            depots: userDepoRels.map((rel) => rel.warehouse.code),
          }}
          validationSchema={userEditSchema}
          onSubmit={handleClickUpdateUser}
          backButtonLabel="Geri"
          saveButtonLabel="Kaydet"
          authorities={auth}
          roles={roles}
          depoList={depoList}
          userAuthorities={account.authorities || []}
        />
      )}
    </Box>
  )
}

export default UserEditContainer
