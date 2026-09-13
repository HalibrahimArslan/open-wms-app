import React from 'react'
import Seo from '../../../shared/components/Seo'
import CsvUploader from '../../../container/Sevk/SevkPlan/SevkPlanCsvUploadContainer'

const CsvUploadView = () => {
  return (
    <>
      <Seo title={'Sevk Planı Yükleme'} />
      <CsvUploader />
    </>
  )
}

export default CsvUploadView
