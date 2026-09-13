import React from 'react'
import DepoList from '../../container/Depo/DepoList'
import Seo from '../../shared/components/Seo'

export default function DepoListView() {
  return (
    <>
      <Seo title="Depo Listesi" />
      <DepoList />
    </>
  )
}
