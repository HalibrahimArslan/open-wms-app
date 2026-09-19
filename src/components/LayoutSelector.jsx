import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import Itemv2 from './Layout/Itemv2'
import Itemv1 from './Layout/Itemv1'

const pathNames = ['dashboard', 'partial-item', 'mails', 'feedbacks', 'csv-upload', 'address-tanim', 'placementhistory', 'report']

export default function LayoutSelector(props) {
  const [layoutVersion, setLayoutVersion] = useState(1)
  const location = useLocation()

  useEffect(() => {
    const matchedPath = pathNames.some((path) => location.pathname.includes(path))
    if (matchedPath) {
      setLayoutVersion(2)
    } else {
      setLayoutVersion(1)
    }
  }, [location.pathname])

  if (layoutVersion === 2) {
    return <Itemv2>{props.children}</Itemv2>
  }
  return <Itemv1>{props.children}</Itemv1>
}
