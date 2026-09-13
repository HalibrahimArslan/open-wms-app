import React from 'react'
import Seo from '../../shared/components/Seo'
import CountingPickingContainer from '../../container/Counting-Terminal/CountingPickingContainer'

const CountingPickingView = () => {
  return (
    <>
      <Seo title={'Açık Sayımlar'} />
      <CountingPickingContainer />
    </>
  )
}

export default CountingPickingView
