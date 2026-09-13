import { useContext, useEffect, useMemo, useState } from 'react'
import { Box, Typography, Paper, CircularProgress, useTheme, Autocomplete, TextField, Alert, Button } from '@mui/material'
import { alpha } from '@mui/material/styles'
import useAuthHeader from '../../../hooks/useAuthHeader'
import { useContainer } from 'unstated-next'
import { DataStore } from '../../../store/DataStore'
import useDepoCode from '../../../hooks/useDepoCode'
import { getAddressList } from '../../../services/AdressService'
import { getAdminUsers } from '../../../services/UserService'
import { notifyError } from '../../../layout/Layout'
import { deleteCountingUserAddressRel, getCountingUserAddressRel, saveCountingUserAddressRel } from '../../../services/CountingUserAddressRelService'
import { generateDeletePayload, generatePayload } from '../../../utils/Utils'
import { CountingContext } from '../../../context/CountingContext'

const page = 0
const rowsPerPage = 2000

const HallMapContainer = ({ hall, loading }) => {
  const theme = useTheme()
  const headers = useAuthHeader()
  const depoCode = useDepoCode()
  const { account } = useContainer(DataStore)
  const { selectedCounting } = useContext(CountingContext)

  const [addressData, setAddressData] = useState([])
  const [flats, setFlats] = useState([])
  const [assignedData, setAssignedData] = useState([])
  const [user, setUser] = useState(null)
  const [activeUsers, setActiveUsers] = useState([])
  const [isLoading, setIsLoading] = useState(loading)
  const [error, setError] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const [pendingAddAddressIds, setPendingAddAddressIds] = useState([])
  const [pendingDeleteAddressIds, setPendingDeleteAddressIds] = useState([])

  const visibilityAuthorities = selectedCounting?.visibilityAuthorities || []

  const assignedByAddressId = useMemo(() => {
    const map = new Map()
    for (const row of assignedData) {
      map.set(row.addressId, row)
    }
    return map
  }, [assignedData])

  const totalChanges = pendingAddAddressIds.length + pendingDeleteAddressIds.length
  const hasPendingChanges = totalChanges > 0

  const isAddressAssignedOnServer = (addressId) => assignedByAddressId.has(addressId)

  const isCellLockedByCount = (addressId) => assignedByAddressId.get(addressId)?.counted === true

  const isAddressSelected = (addressId) => {
    const assignedOnServer = isAddressAssignedOnServer(addressId)
    const pendingAdd = pendingAddAddressIds.includes(addressId)
    const pendingDelete = pendingDeleteAddressIds.includes(addressId)

    if (assignedOnServer && !pendingDelete) return true
    if (!assignedOnServer && pendingAdd) return true
    return false
  }

  const handleToggleAddress = (address) => {
    const addressId = address.urunAdresId
    if (isCellLockedByCount(addressId)) {
      return
    }
    const assignedOnServer = isAddressAssignedOnServer(addressId)

    if (assignedOnServer) {
      setPendingDeleteAddressIds((prev) => (prev.includes(addressId) ? prev.filter((id) => id !== addressId) : [...prev, addressId]))
      return
    }

    setPendingAddAddressIds((prev) => (prev.includes(addressId) ? prev.filter((id) => id !== addressId) : [...prev, addressId]))
  }

  const handleToggleFlat = (flat) => {
    const addresses = addressData.filter((address) => address.kat === flat)
    const interactive = addresses.filter((address) => !isCellLockedByCount(address.urunAdresId))
    if (interactive.length === 0) {
      return
    }

    const allSelected = interactive.every((address) => isAddressSelected(address.urunAdresId))

    const addressIds = interactive.map((a) => a.urunAdresId)
    const assignedOnServerIds = addressIds.filter((id) => isAddressAssignedOnServer(id))
    const unassignedOnServerIds = addressIds.filter((id) => !isAddressAssignedOnServer(id))

    if (allSelected) {
      setPendingDeleteAddressIds((prev) => [...new Set([...prev, ...assignedOnServerIds])])
      setPendingAddAddressIds((prev) => prev.filter((id) => !unassignedOnServerIds.includes(id)))
      return
    }

    setPendingDeleteAddressIds((prev) => prev.filter((id) => !assignedOnServerIds.includes(id)))
    setPendingAddAddressIds((prev) => [...new Set([...prev, ...unassignedOnServerIds])])
  }

  const handleResetChanges = () => {
    setPendingAddAddressIds([])
    setPendingDeleteAddressIds([])
    setSuccessMessage('')
  }

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      const query = 'page=0&size=300'
      const res = await getAdminUsers(headers, query)

      if (res) {
        const activatedUsers = res.filter((q) => {
          if (!q.activated) return false

          const authorities = q.authorities || []

          for (let i = 0; i < visibilityAuthorities.length; i++) {
            const instantAuthority = visibilityAuthorities[i]
            if (authorities.includes(instantAuthority)) {
              return true
            }
          }

          return false
        })

        setActiveUsers(activatedUsers)
        setUser(activatedUsers.length > 0 ? activatedUsers[0] : null)
      }
    } catch (e) {
      notifyError(e.message)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCountingUserAddresses = async (addresses) => {
    try {
      const payload = {
        countingDefinitionId: selectedCounting.id,
        addresses,
      }

      const res = await getCountingUserAddressRel(generatePayload(payload))
      if (res) {
        setAssignedData(res)
      }
    } catch (e) {
      notifyError(e.message)
    }
  }

  const fetchAddressList = async (hallCode) => {
    try {
      setIsLoading(true)
      const query = `koridor.equals=${hallCode}&page=${page}&size=${rowsPerPage}&depoNo.equals=${depoCode}&companyCode.equals=${account?.companyCode}&status.equals=true&sort=adres,asc`
      const res = await getAddressList(headers, query)

      if (res) {
        setFlats([...new Set(res.map((q) => q.kat))])
        setAddressData(res)
        await fetchCountingUserAddresses(res)
      }
    } catch (e) {
      notifyError(e.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveChanges = async () => {
    try {
      if (user === null) {
        setError(true)
        return
      }

      setIsLoading(true)
      setSuccessMessage('')

      let addedCount = 0
      let deletedCount = 0

      if (pendingAddAddressIds.length > 0) {
        const savePayload = pendingAddAddressIds.map((addressId) => {
          const addrRow = addressData.find((a) => a.urunAdresId === addressId)
          return {
            addressId,
            countingAddress: addrRow?.adres ?? '',
            countingDefinitionId: selectedCounting.id,
            userId: user.id,
            login: user.login,
          }
        })

        const saveRes = await saveCountingUserAddressRel(generatePayload(savePayload))

        if (saveRes) {
          addedCount = saveRes.length
          setAssignedData((prev) => [...prev, ...saveRes])
        }
      }

      if (pendingDeleteAddressIds.length > 0) {
        const deletePayload = assignedData.filter((item) => pendingDeleteAddressIds.includes(item.addressId))

        if (deletePayload.length > 0) {
          await deleteCountingUserAddressRel(generateDeletePayload(deletePayload))
          deletedCount = deletePayload.length

          setAssignedData((prev) => prev.filter((item) => !pendingDeleteAddressIds.includes(item.addressId)))
        }
      }

      setPendingAddAddressIds([])
      setPendingDeleteAddressIds([])

      if (addedCount > 0 || deletedCount > 0) {
        setSuccessMessage(`${addedCount} adres eklendi, ${deletedCount} adres kaldırıldı.`)
      }
    } catch (e) {
      notifyError(e.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (hall != null) {
      fetchAddressList(hall.code)
      fetchUsers()
      handleResetChanges()
    }
  }, [hall])

  useEffect(() => {
    const clearError = setTimeout(() => setError(false), 1000)
    return () => clearTimeout(clearError)
  }, [error])

  useEffect(() => {
    if (!successMessage) return
    const timer = setTimeout(() => setSuccessMessage(''), 2500)
    return () => clearTimeout(timer)
  }, [successMessage])

  if (isLoading) {
    return <CircularProgress />
  }

  return (
    <Box display="flex" flexDirection="column" gap={4}>
      <Box display="flex" justifyContent="space-between" alignItems="center" gap={2} flexWrap="wrap">
        <Typography fontWeight="bold" sx={{ textTransform: 'uppercase', fontSize: '1.5rem', mb: 2 }}>
          {hall.code}
        </Typography>

        <Box display="flex" gap={1.5} flexWrap="wrap" alignItems="center">
          <Autocomplete
            value={user}
            onChange={(event, newValue) => {
              setUser(newValue)
            }}
            options={activeUsers}
            renderInput={(params) => <TextField {...params} label="Kullanıcılar" />}
            getOptionLabel={(option) => option?.login || ''}
            isOptionEqualToValue={(option, value) => option?.id === value?.id}
            sx={{ width: 180 }}
            size="small"
          />

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 1.2,
              py: 0.8,
              borderRadius: '14px',
              minHeight: 40,
            }}
          >
            <Box
              sx={{
                px: 1.5,
                py: 0.4,
                borderRadius: theme.shape.borderRadius,
                fontSize: '0.75rem',
                fontWeight: theme.typography.fontWeightMedium,
                whiteSpace: 'nowrap',

                backgroundColor: hasPendingChanges
                  ? theme.palette.mode === 'dark'
                    ? theme.palette.warning.dark
                    : theme.palette.warning.light
                  : theme.palette.mode === 'dark'
                    ? theme.palette.grey[800]
                    : theme.palette.grey[200],

                color: hasPendingChanges ? theme.palette.common.white : theme.palette.mode === 'dark' ? theme.palette.grey[100] : theme.palette.text.primary,
              }}
            >
              {hasPendingChanges ? 'Değişiklik var' : 'Değişiklik yok'}
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.8,
                px: 1,
                py: 0.45,
                borderRadius: '10px',

                border: `1px solid ${theme.palette.mode === 'dark' ? theme.palette.success.light : theme.palette.success.main}`,

                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(76, 175, 80, 0.1)' : 'transparent',
              }}
            >
              <Typography
                sx={{
                  fontSize: '0.75rem',
                  color: theme.palette.text.primary,
                  fontWeight: theme.typography.fontWeightBold,
                }}
              >
                Eklenecek
              </Typography>

              <Box
                sx={{
                  minWidth: 22,
                  height: 22,
                  px: 0.6,
                  borderRadius: `${theme.shape.borderRadius + 10}px`,
                  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.success.main : theme.palette.success.main,

                  color: theme.palette.common.white,

                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',

                  fontSize: '0.75rem',
                  fontWeight: theme.typography.fontWeightBold,
                }}
              >
                {pendingAddAddressIds.length}
              </Box>
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.8,
                px: 1,
                py: 0.45,
                borderRadius: '10px',

                border: `1px solid ${theme.palette.mode === 'dark' ? theme.palette.error.light : theme.palette.error.main}`,

                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(244, 67, 54, 0.1)' : 'transparent',
              }}
            >
              <Typography
                sx={{
                  fontSize: '0.75rem',
                  color: theme.palette.text.primary,
                  fontWeight: theme.typography.fontWeightBold,
                }}
              >
                Silinecek
              </Typography>

              <Box
                sx={{
                  minWidth: 22,
                  height: 22,
                  px: 0.6,
                  borderRadius: `${theme.shape.borderRadius + 10}px`,

                  backgroundColor: theme.palette.error.main,

                  color: theme.palette.common.white,

                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',

                  fontSize: '0.75rem',
                  fontWeight: theme.typography.fontWeightBold,
                }}
              >
                {pendingDeleteAddressIds.length}
              </Box>
            </Box>
          </Box>

          <Button size="small" variant="contained" onClick={handleSaveChanges} disabled={!hasPendingChanges}>
            Kaydet ({totalChanges})
          </Button>

          <Button size="small" variant="outlined" onClick={handleResetChanges} disabled={!hasPendingChanges}>
            Vazgeç
          </Button>
        </Box>
      </Box>

      <Alert severity="error" sx={{ display: error ? 'flex' : 'none' }}>
        Kullanıcı Seçiniz
      </Alert>

      <Alert severity="success" sx={{ display: successMessage ? 'flex' : 'none' }}>
        {successMessage}
      </Alert>

      <Box display="flex" flexDirection="row" gap={2} overflow="auto">
        {flats.map((flat) => {
          const addresses = addressData.filter((address) => address.kat === flat)
          const allAssigned = addresses.every((address) => isAddressSelected(address.urunAdresId))

          return (
            <Box key={flat} flex={1}>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                mb={1}
                sx={{
                  cursor: addresses.some((a) => !isCellLockedByCount(a.urunAdresId)) ? 'pointer' : 'default',
                  userSelect: 'none',
                }}
                onClick={() => handleToggleFlat(flat)}
              >
                <Paper
                  sx={{
                    p: 1,
                    mb: 1,
                    textAlign: 'center',
                    borderRadius: 2,
                    fontSize: '1.1em',
                    cursor: addresses.some((a) => !isCellLockedByCount(a.urunAdresId)) ? 'pointer' : 'default',
                    bgcolor: allAssigned ? 'primary.main' : 'background.paper',
                    color: allAssigned ? 'primary.contrastText' : 'text.primary',
                    transition: 'all 0.15s',
                    fontFamily: theme.typography.fontFamily,
                  }}
                >
                  Kat {flat}
                </Paper>
              </Box>

              {addresses.map((adres) => {
                const assigned = assignedData.find((a) => a.addressId === adres.urunAdresId)
                const isLocked = isCellLockedByCount(adres.urunAdresId)
                const isSelected = isAddressSelected(adres.urunAdresId)
                const isPendingDelete = pendingDeleteAddressIds.includes(adres.urunAdresId)
                const isPendingAdd = pendingAddAddressIds.includes(adres.urunAdresId)

                return (
                  <Paper
                    key={adres.urunAdresId}
                    sx={{
                      p: 1,
                      mb: 1,
                      textAlign: 'center',
                      borderRadius: 2,
                      fontSize: '1.1em',
                      cursor: isLocked ? 'not-allowed' : 'pointer',
                      pointerEvents: isLocked ? 'none' : 'auto',
                      bgcolor: isLocked
                        ? isSelected
                          ? alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.42 : 0.38)
                          : theme.palette.mode === 'dark'
                            ? theme.palette.grey[800]
                            : theme.palette.grey[200]
                        : isSelected
                          ? 'primary.main'
                          : 'background.paper',
                      color: isLocked ? (isSelected ? theme.palette.primary.contrastText : theme.palette.text.secondary) : isSelected ? 'primary.contrastText' : 'text.primary',
                      transition: 'all 0.3s',
                      fontFamily: theme.typography.fontFamily,
                      height: 75,
                      alignContent: 'center',
                      border: '2px solid',
                      borderColor: isLocked ? theme.palette.divider : isPendingDelete ? 'error.main' : isPendingAdd ? 'success.main' : theme.palette.primary.main,
                      opacity: isPendingDelete ? 0.65 : isLocked ? 0.88 : 1,
                    }}
                    onClick={() => handleToggleAddress(adres)}
                    elevation={isSelected ? 6 : 1}
                  >
                    {adres.adres}

                    {assigned && assigned.login && !isPendingDelete && (
                      <Box
                        mt={0.5}
                        fontSize="0.85em"
                        sx={{ color: isLocked ? 'text.disabled' : theme.palette.secondary.light }}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        gap={1}
                        height={50}
                      >
                        {assigned.login}
                      </Box>
                    )}
                  </Paper>
                )
              })}
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}

export default HallMapContainer
