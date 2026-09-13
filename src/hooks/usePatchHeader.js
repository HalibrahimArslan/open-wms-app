import { useMemo } from 'react'
import { AuthContainer } from '../store/AuthContainer'

export default function usePatchHeader() {
  const token = AuthContainer.useContainer().token

  const headers = useMemo(() => {
    return {
      'content-type': 'application/merge-patch+json',
      Authorization: (token && 'Bearer ' + token) || '',
    }
  }, [token])

  return headers
}
