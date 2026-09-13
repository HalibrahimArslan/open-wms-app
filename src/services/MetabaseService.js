import { getErrorMessage } from '../utils/Utils'

export async function getMetabaseUrl(headers) {
  const response = await fetch(`/api/generate-metabase-url`, {
    headers: headers,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const metabaseUrl = await response.text()

  return metabaseUrl
}
