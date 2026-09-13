import ResetPasswordContainer from '../../container/Auth/ResetPasswordContainer'
import Seo from '../../shared/components/Seo'
import AuthView from './AuthView'

const ResetPasswordView = () => {
  return (
    <AuthView>
      <Seo title={'Şifre Sıfırla'} />
      <ResetPasswordContainer />
    </AuthView>
  )
}

export default ResetPasswordView
