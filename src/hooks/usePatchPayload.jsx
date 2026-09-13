import { useMemo } from 'react'
import { AuthContainer } from '../store/AuthContainer'

export default function usePatchPayload(body) {
  const token = AuthContainer.useContainer().token

  const headers = useMemo(() => {
    return {
      method: 'PATCH',
      headers: {
        'content-type': 'application/merge-patch+json',
        Authorization: (token && 'Bearer ' + token) || '',
      },
      body: JSON.stringify(body),
    }
  }, [token, body])

  return headers
}
