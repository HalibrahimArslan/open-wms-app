import React, { useEffect, useMemo, useState } from 'react'
import { Box, CircularProgress } from '@mui/material'
import PersonSearchOutlinedIcon from '@mui/icons-material/PersonSearchOutlined'
import { useNavigate } from 'react-router'
import { notify, notifyError } from '../../layout/Layout'
import { updateUser, getUsers, getAdminUsers } from '../../services/UserService'
import useAuthHeader from '../../hooks/useAuthHeader'
import ActionHeader from '../../shared/components/ActionHeader'
import TableSearchField from '../../shared/components/Table/TableSearchField'
import EmptyState from '../../shared/components/EmptyState/EmptyState'
import UserList from '../../components/List/UserList'

function UsersContainer() {
  const [users, setUsers] = useState([])
  const [page, setPage] = useState(0)
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(true)

  const headers = useAuthHeader()
  const nav = useNavigate()

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const res = await getAdminUsers(headers, `page=${page}&size=100`)
      setUsers(res || [])
    } catch (error) {
      notifyError(error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateUser = async (user) => {
    try {
      const updatedUser = { ...user, activated: !user.activated }
      const res = await updateUser(headers, updatedUser)
      setUsers((prevUsers) => prevUsers.map((u) => (u.login === user.login ? updatedUser : u)))
      const nextActivated = typeof res?.activated === 'boolean' ? res.activated : updatedUser.activated
      notify(nextActivated ? 'Kullanıcı aktife çekildi' : 'Kullanıcı pasife çekildi')
    } catch (error) {
      notifyError(error.message)
    }
  }

  const handleChange = (event) => {
    setName(event.target.value)
  }

  const handleCreateUser = () => {
    nav('new')
  }

  const handleEditUser = (user) => {
    nav(`edit?login=${user.login}`)
  }

  const handleResetPassword = async (user) => {
    try {
      const updatedUser = { ...user, passwordVersion: 0 }
      const res = await updateUser(headers, updatedUser)
      setUsers((prevUsers) => prevUsers.map((u) => (u.login === user.login ? updatedUser : u)))
      const resetOk = res?.passwordVersion === 0 || updatedUser.passwordVersion === 0
      notify(resetOk ? 'Şifre sıfırlama işlemi başarılı' : 'Şifre sıfırlama isteği işlendi')
    } catch (error) {
      notifyError(error.message)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const filteredUsers = useMemo(() => {
    const query = name.trim().toLowerCase()
    if (query === '') return users
    return users.filter((user) => user.login.toLowerCase().includes(query))
  }, [users, name])

  const isSearching = name.trim() !== ''

  return (
    <Box>
      <ActionHeader
        title="Kullanıcılar"
        subtitle={isSearching ? `${users.length} kullanıcıdan ${filteredUsers.length} tanesi gösteriliyor` : `${users.length} kullanıcı`}
        actions={<TableSearchField placeholder="Kullanıcı adı ara" value={name} onChange={handleChange} />}
        handleClick={handleCreateUser}
      />

      {loading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '200px',
          }}
        >
          <CircularProgress />
        </Box>
      ) : filteredUsers.length === 0 ? (
        <EmptyState
          icon={<PersonSearchOutlinedIcon />}
          title="Kullanıcı bulunamadı"
          description={
            isSearching
              ? `"${name.trim()}" ile eşleşen bir kullanıcı adı yok. Aramayı değiştirerek tekrar deneyin.`
              : 'Henüz kullanıcı eklenmemiş. Sağ üstteki ekle düğmesiyle ilk kullanıcıyı oluşturabilirsiniz.'
          }
        />
      ) : (
        <UserList onEdit={handleEditUser} users={filteredUsers} onClick={handleUpdateUser} onResetPassword={handleResetPassword} />
      )}
    </Box>
  )
}

export default UsersContainer
