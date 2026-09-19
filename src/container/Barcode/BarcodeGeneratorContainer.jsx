import { Dialog, Slide, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/system'
import React, { useEffect, useState } from 'react'
import Barcode from 'react-barcode'
import { useNavigate, useSearchParams } from 'react-router'
import useDepoCode from '../../hooks/useDepoCode'
import './print.css'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

export default function BarcodeGeneratorContainer() {
  const nav = useNavigate()
  const depoCode = useDepoCode()
  const [searchParams, setSearchParams] = useSearchParams()
  const [barcode, setBarcode] = useState(searchParams.get('barcodes').split(','))
  const [print, setPrint] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  useEffect(() => {
    setPrint(true)
  }, [])

  window.onafterprint = function () {
    setPrint(false)
    if (!isMobile) {
      nav(`/d:${depoCode}/palletbarcode`)
    }
  }

  useEffect(() => {
    if (print) {
      setTimeout(() => {
        window.print()
      }, 1000)
    }
  }, [print])

  return (
    <Dialog fullScreen open={true} TransitionComponent={Transition} className="ean13">
      {barcode && barcode.map((item, index) => <Barcode key={index} value={item} />)}
    </Dialog>
  )
}
