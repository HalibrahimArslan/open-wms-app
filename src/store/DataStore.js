import { useEffect, useState } from 'react'
import { createContainer } from 'unstated-next'
import usePersistedToken from '../hooks/usePersistedToken'
import useAuthHeader from '../hooks/useAuthHeader'
import { getAccount } from '../services/AccountService'
import { useNavigate } from 'react-router'

export const useStore = () => {
  const [account, setAccount] = useState({})
  const [dock, setDock] = useState(false)

  const token = usePersistedToken()
  const headers = useAuthHeader()

  const nav = useNavigate()

  const handleChangeDock = () => {
    setDock(!dock)
  }

  const fetchAccount = async () => {
    try {
      const res = await getAccount(headers)
      if (res) {
        setAccount(res)
        if (res.passwordVersion === 0) {
          nav('/change-password')
        }
      }
    } catch (error) {}
  }

  useEffect(() => {
    if (token.length > 0) {
      fetchAccount()
    }
  }, [token])

  return {
    account,
    dock,
    handleChangeDock,
  }
}

export const DataStore = createContainer(useStore)
