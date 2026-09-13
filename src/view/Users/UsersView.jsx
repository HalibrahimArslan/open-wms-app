import React from 'react'
import Seo from '../../shared/components/Seo'
import UsersContainer from '../../container/Users/UsersContainer'

function UsersView() {
  return (
    <>
      <Seo title="Kullanıcılar" />
      <UsersContainer />
    </>
  )
}

export default UsersView
