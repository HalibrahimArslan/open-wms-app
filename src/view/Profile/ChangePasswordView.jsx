import React from 'react'
import Seo from '../../shared/components/Seo'
import ChangePasswordContainer from '../../container/Profile/ChangePasswordContainer'

const ChangePasswordView = () => {
  return (
    <div>
      <Seo title="Şifre Değiştir" />
      <ChangePasswordContainer />
    </div>
  )
}

export default ChangePasswordView
