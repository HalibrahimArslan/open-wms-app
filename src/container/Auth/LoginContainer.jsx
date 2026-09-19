import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { authenticate } from '../../services/AuthService'
import { AuthContainer } from '../../store/AuthContainer'
import { useContainer } from 'unstated-next'
import { notifyError } from '../../layout/Layout'
import LoginForm from '../../components/Form/LoginForm'
import { generatePayload } from '../../utils/Utils'

export default function LoginContainer() {
  const { handleAuth, handleToken, clearExp } = useContainer(AuthContainer)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    handleAuth(false)
    handleToken('')
    clearExp()
    localStorage.clear()
  }, [])

  const handleFormSubmit = async (values) => {
    try {
      setIsSubmitting(true)
      let payload = generatePayload({
        username: values.username,
        password: values.password,
        rememberMe: true,
      })
      const res = await authenticate(payload)
      if (res) {
        handleToken(res)
        localStorage.setItem('hwms_token', res)
        handleAuth(true)
        navigate('/')
      }
    } catch (e) {
      notifyError(e.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return <LoginForm onSubmit={handleFormSubmit} isSubmitting={isSubmitting} />
}
