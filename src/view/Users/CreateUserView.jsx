import React from 'react'
import Seo from '../../shared/components/Seo'
import UserCreateContainer from '../../container/Users/UsersCreateContainer'

function CreateUserView() {
  return (
    <>
      <Seo title="Kullanıcı Oluştur" />
      <UserCreateContainer />
    </>
  )
}

export default CreateUserView
