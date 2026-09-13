import React from 'react'
import Seo from '../../../shared/components/Seo'
import UserRolesContainer from '../../../container/Definitions/User-Role-Relation/UserRolesContainer'

const UserRolesView = () => {
  return (
    <React.Fragment>
      <Seo title="Kullanıcı Rol Listesi" />
      <UserRolesContainer />
    </React.Fragment>
  )
}

export default UserRolesView
