import React from 'react'
import Seo from '../../../shared/components/Seo'
import CreateMenuDefinitionContainer from '../../../container/Definitions/MenuDefinition/CreateMenuDefinitionContainer'

const CreateMenuView = () => {
  return (
    <>
      <Seo title={'Menü Oluşturma'} />
      <CreateMenuDefinitionContainer />
    </>
  )
}

export default CreateMenuView
