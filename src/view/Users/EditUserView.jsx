import React from 'react'
import SEO from '../../shared/components/Seo'
import UserEditContainer from '../../container/Users/UsersEditContainer'

function EditUserView() {
  return (
    <>
      <SEO title="Kullanıcı Düzenle" />
      <UserEditContainer />
    </>
  )
}

export default EditUserView
