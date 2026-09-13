import LoginContainer from '../../container/Auth/LoginContainer'
import Seo from '../../shared/components/Seo'
import AuthView from './AuthView'

const LoginView = () => {
  return (
    <AuthView>
      <Seo title={'Giriş Yap'} />
      <LoginContainer />
    </AuthView>
  )
}

export default LoginView
