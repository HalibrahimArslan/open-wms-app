import { useMemo } from 'react'
import { AuthContainer } from '../store/AuthContainer'

export default function useAuthHeader() {
  const token = AuthContainer.useContainer().token

  const headers = useMemo(() => {
    return {
      'content-type': 'application/json',
      Authorization: (token && 'Bearer ' + token) || '',
    }
  }, [token])

  return headers
}

export function getAuthToken() {
  const token = localStorage.getItem('hwms_token')
  return token || ''
}
