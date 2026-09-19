import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router'
import { notify, notifyError } from '../../layout/Layout'
import ResetPasswordForm from '../../components/Form/ResetPasswordForm'
import { resetPasswordFinish } from '../../services/AccountService'
import { generatePayload } from '../../utils/Utils'

export default function ResetPasswordContainer() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const key = searchParams.get('key')

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFormSubmit = async (values) => {
    try {
      setIsSubmitting(true)
      await resetPasswordFinish(
        generatePayload({
          key: key,
          newPassword: values.password,
        })
      )
      notify('Şifreniz başarıyla sıfırlanmıştır.')
      navigate('/login')
    } catch (e) {
      notifyError(e.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return <ResetPasswordForm onSubmit={handleFormSubmit} isSubmitting={isSubmitting} />
}
