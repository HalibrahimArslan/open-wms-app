import { getErrorMessage } from '../utils/Utils'

export async function depolarArasiTransfer(payload) {
  const response = await fetch('/api/depolar-arasi-transfer', payload)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }
  return 'success'
}
