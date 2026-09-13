import React from 'react'
import Seo from '../../../shared/components/Seo'
import CreateRoleContainer from '../../../container/Definitions/Role/CreateRoleContainer'

const RoleView = () => {
  return (
    <React.Fragment>
      <Seo title="Rol Oluştur" />
      <CreateRoleContainer />
    </React.Fragment>
  )
}

export default RoleView
