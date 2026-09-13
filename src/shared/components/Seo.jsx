import React from 'react'
import { Helmet } from 'react-helmet-async'
import BRAND from '../../config/brand'

/** Sayfa basligini marka adiyla birlestirir: "Dashboard · WMS" */
export default function Seo({ title }) {
  return (
    <Helmet>
      <title>{title ? `${title} · ${BRAND.shortName}` : BRAND.productName}</title>
    </Helmet>
  )
}
