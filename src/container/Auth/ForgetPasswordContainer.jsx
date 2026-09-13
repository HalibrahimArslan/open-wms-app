import { useState } from 'react'
import ForgetPasswordForm from '../../components/Form/ForgetPasswordForm'
import { notify, notifyError } from '../../layout/Layout'
import { resetPasswordInit } from '../../services/AccountService'
import { generatePayload } from '../../utils/Utils'
import useAuthHeader from '../../hooks/useAuthHeader'

export default function ForgetPasswordContainer() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const headers = useAuthHeader()

  const handleFormSubmit = async (values) => {
    try {
      setIsSubmitting(true)

      await resetPasswordInit(headers, values.email)
      notify('Şifre sıfırlama talimatları email adresinize gönderilmiştir.')
    } catch (e) {
      notifyError(e.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return <ForgetPasswordForm onSubmit={handleFormSubmit} isSubmitting={isSubmitting} />
}
