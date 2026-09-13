import React from 'react'
import CountingProcessContainer from '../../container/Counting-Terminal/CountingProcessContainer'
import Seo from '../../shared/components/Seo'

export default function CountingProcessView() {
  return (
    <>
      <Seo title="Sayım Operasyon" />
      <CountingProcessContainer />
    </>
  )
}
