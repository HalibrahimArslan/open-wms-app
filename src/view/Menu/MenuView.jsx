import React from 'react'
import Seo from '../../shared/components/Seo'
import MenuTreeContainer from '../../container/MenuTree/MenuTreeContainer'

const MenuView = () => {
  return (
    <>
      <Seo title="Menü Listesi" />
      <MenuTreeContainer />
    </>
  )
}

export default MenuView
