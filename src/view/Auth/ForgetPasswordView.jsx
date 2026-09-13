import ForgetPasswordContainer from '../../container/Auth/ForgetPasswordContainer'
import Seo from '../../shared/components/Seo'
import AuthView from './AuthView'

const ForgetPasswordView = () => {
  return (
    <AuthView>
      <Seo title={'Şifremi Unuttum'} />
      <ForgetPasswordContainer />
    </AuthView>
  )
}

export default ForgetPasswordView
