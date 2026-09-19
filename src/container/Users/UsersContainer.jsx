import React, { useEffect, useMemo, useState } from 'react'
import { Box, Button, CircularProgress, Divider, TextField, Typography, useTheme } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useNavigate } from 'react-router'
import { notify, notifyError } from '../../layout/Layout'
import { updateUser, getUsers, getAdminUsers } from '../../services/UserService'
import useAuthHeader from '../../hooks/useAuthHeader'
import NotFound from '../../shared/components/NotFound/NotFound'
import UserList from '../../components/List/UserList'

function UsersContainer() {
  const [users, setUsers] = useState([])
  const [page, setPage] = useState(0)
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(true)

  const headers = useAuthHeader()
  const theme = useTheme()
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
    if (name === '') return users
    return users.filter((user) => user.login.toLowerCase().includes(name.toLowerCase()))
  }, [users, name])

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="h4"
          sx={{
            textAlign: 'start',
            fontWeight: theme.typography.fontWeightMedium,

            fontSize: {
              xs: '18px',
              sm: '20px',
              md: '24px',
              lg: '30px',
              xl: '36px',
            },
          }}
        >
          Kullanıcılar
        </Typography>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreateUser}
            sx={{
              minWidth: {
                xs: '100px',
                sm: '180px',
                md: '200px',
                lg: '220px',
                xl: '240px',
              },
              fontSize: {
                xs: '12px',
                sm: '12px',
                md: '12px',
                lg: '14px',
                xl: '14px',
              },
            }}
          >
            Kullanıcı Oluştur
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          background: theme.palette.action.hover,
          borderRadius: theme.shape.borderRadius,
        }}
      >
        <TextField
          placeholder="Ara..."
          value={name}
          size="small"
          onChange={handleChange}
          sx={{
            width: {
              xs: '100px',
              sm: '125px',
              md: '150px',
              lg: '200px',
              xl: '300px',
            },
            maxWidth: '100%',
            fontSize: {
              xs: '14px',
              sm: '16px',
              md: '18px',
              lg: '20px',
              xl: '22px',
            },
          }}
        />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderRadius: theme.shape.borderRadius,
          }}
        >
          <Typography
            sx={{
              fontSize: {
                xs: '12px',
                sm: '16px',
                md: '16px',
                lg: '20px',
                xl: '24px',
              },
            }}
          >
            {users.length} Kullanıcı Bulundu
          </Typography>
        </Box>
      </Box>
      <Divider />

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
        <NotFound msg="Kullanıcı Bulunamadı" />
      ) : (
        <UserList onEdit={handleEditUser} users={filteredUsers} onClick={handleUpdateUser} onResetPassword={handleResetPassword} />
      )}
    </Box>
  )
}

export default UsersContainer
