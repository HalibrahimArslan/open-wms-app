import { AuthContainer } from '../store/AuthContainer'

export default function usePersistedToken() {
  const token = AuthContainer.useContainer().token
  return token
}
