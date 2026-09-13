import React from 'react'
import Seo from '../../../shared/components/Seo'
import CreateUserRoleContainer from '../../../container/Definitions/User-Role-Relation/CreateUserRoleContainer'

const CreateUserRoleView = () => {
  return (
    <React.Fragment>
      <Seo title="User Rol İlişkilendirme" />
      <CreateUserRoleContainer />
    </React.Fragment>
  )
}

export default CreateUserRoleView
