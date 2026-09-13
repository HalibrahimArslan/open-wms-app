import React from 'react'
import Seo from '../../shared/components/Seo'
import AddressOperationsContainer from '../../container/Address/AddressOperationsContainer'

function AddressView() {
  return (
    <>
      <Seo title={'Adresler'} />
      <AddressOperationsContainer />
    </>
  )
}

export default AddressView
