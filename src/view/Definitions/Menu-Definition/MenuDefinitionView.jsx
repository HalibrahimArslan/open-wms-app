import React from 'react'
import Seo from '../../../shared/components/Seo'
import MenuDefinitionContainer from '../../../container/Definitions/MenuDefinition/MenuDefinitionContainer'

const MenuDefinitionView = () => {
  return (
    <>
      <Seo title={'Menü Tanımlama'} />
      <MenuDefinitionContainer />
    </>
  )
}

export default MenuDefinitionView
