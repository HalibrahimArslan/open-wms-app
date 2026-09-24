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
import { getCompanies } from '../../services/CompanyService'

const UserEditContainer = () => {
  const [searchParams] = useSearchParams()
  const login = searchParams.get('login')
  const headers = useAuthHeader()
  const { account } = useContainer(DataStore)

  const [user, setUser] = useState(null)
  const [auth, setAuth] = useState([])
  const [roles, setRoles] = useState([])
  const [depoList, setDepoList] = useState([])
  const [companies, setCompanies] = useState([])
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
    if (account.companyCode == null) return
    try {
      const res = await getRoleList(headers, `companyCode=${account.companyCode}`)
      setRoles(res || [])
    } catch (error) {
      notifyError(error)
    }
  }, [headers, account.companyCode])

  const fetchDepoList = useCallback(async () => {
    try {
      const res = await getDepoListFromErp(headers)
      setDepoList(res || [])
    } catch (error) {
      notifyError(error.message)
    }
  }, [headers])

  const fetchCompanies = useCallback(async () => {
    try {
      const res = await getCompanies(headers)
      setCompanies(res || [])
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
    [headers]
  )

  useEffect(() => {
    fetchUserByLogin()
    fetchAllRoles()
    fetchAllAuth()
    fetchDepoList()
    fetchCompanies()
  }, [fetchUserByLogin, fetchAllRoles, fetchAllAuth, fetchDepoList, fetchCompanies])

  useEffect(() => {
    if (user?.id) fetchUserDepoRels(user.id)
  }, [user?.id, fetchUserDepoRels])

  const handleClickUpdateUser = async ({ depots, companyCode, ...values }) => {
    try {
      const currentUser = user
      const updatedUser = {
        ...(currentUser || {}),
        ...values,
        companyCode: companyCode === '' ? null : companyCode,
      }
      await updateUser(headers, updatedUser)
      setUser(updatedUser)

      if (companyCode !== '' && companyCode !== account.companyCode) {
        notify('Güncellendi')
        return
      }

      const selectedCodes = depots || []
      const existingCodes = userDepoRels.map((rel) => rel.warehouse.code)
      const addedCodes = selectedCodes.filter((code) => !existingCodes.includes(code))
      const removedRels = userDepoRels.filter((rel) => !selectedCodes.includes(rel.warehouse.code))

      if (addedCodes.length > 0) {
        const warehouseList = addedCodes.map((depoNo) => {
          const depo = depoList.find((item) => String(item.depoNo) === depoNo)
          return { code: depoNo, name: depo?.depoIsmi, companyCode: String(account.companyCode) }
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
            companyCode: user.companyCode ?? '',
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
          companies={companies}
          adminCompanyCode={account.companyCode}
          userAuthorities={account.authorities || []}
        />
      )}
    </Box>
  )
}

export default UserEditContainer
