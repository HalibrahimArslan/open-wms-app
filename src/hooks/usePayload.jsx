import { AuthContainer } from '../store/AuthContainer'

const usePayload = (body) => {
  const token = AuthContainer.useContainer().token

  const requestOptions = {
    method: 'POST',
    headers: {
      Authorization: (token && 'Bearer ' + token) || '',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }
  return requestOptions
}

export default usePayload
