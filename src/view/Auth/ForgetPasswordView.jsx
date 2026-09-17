import ForgetPasswordContainer from '../../container/Auth/ForgetPasswordContainer'
import Seo from '../../shared/components/Seo'
import AuthView from './AuthView'

const ForgetPasswordView = () => {
  return (
    <AuthView title="Şifremi unuttum" subtitle="Sıfırlama bağlantısı için e-posta adresinizi girin.">
      <Seo title={'Şifremi Unuttum'} />
      <ForgetPasswordContainer />
    </AuthView>
  )
}

export default ForgetPasswordView
