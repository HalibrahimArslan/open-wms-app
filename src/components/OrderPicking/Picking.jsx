import React, { useEffect, useMemo, useState } from 'react'
import groupBy from '../../utils/Utils'
import PickingItem from './PickingItem'
import PickingCard from './PickingCard'
import { Box, Grid, useTheme } from '@mui/material'

export default function Picking({ list, adresList, opType }) {
  const theme = useTheme()
  const [enable, setEnable] = useState(true)
  const excelDataArray = useMemo(() => {
    return []
  }, [])

  let partialList = groupBy(list, (criteria) => criteria.isPiece).get(true)
  let notPartialList = groupBy(list, (criteria) => criteria.isPiece).get(false)

  let distinctPartialItems = partialList && partialList.length > 0 ? [...new Set(partialList.map((item) => item.pieceMaster.stokKodu))] : []

  function generateExcelBody(address, stokKodu, stokAdi, siparisMiktar, teslimMiktar, onay) {
    let dto = {
      address: address,
      stokKodu: stokKodu,
      stokAdi: stokAdi,
      siparisMiktar: siparisMiktar,
      teslimMiktar: teslimMiktar,
      onay: onay,
    }
    return dto
  }

  useEffect(() => {
    if (opType === 'MSK') {
      if (adresList.length > 0 && list.length > 0) {
        list.forEach((todo) => {
          let adressesList = adresList.filter((row) => row.stockCode === todo.stokKodu)
          adressesList.forEach((cycle) => {
            let response = false

            if (excelDataArray.length > 0) {
              excelDataArray.forEach((excelData) => {
                if (excelData.stokKodu === todo.stokKodu && excelData.address === cycle.address) {
                  response = true
                }
              })
            }

            if (response === false) {
              excelDataArray.push(generateExcelBody(cycle.address, todo.stokKodu, todo.stokAdi, todo.siparisMiktar, todo.teslimMiktar, ''))
            }
          })
        })
        setEnable(false)
      }
    }
  }, [adresList, list, opType, excelDataArray])

  const handleOnExport = () => {
    var wb = utils.book_new()
    var ws = utils.json_to_sheet(excelDataArray)
    utils.book_append_sheet(wb, ws, 'AdresListesi')
    writeFile(wb, 'adresler.xlsx')
  }
  return (
    <Box>
      {distinctPartialItems &&
        distinctPartialItems.length > 0 &&
        distinctPartialItems.map((item) => <PickingItem key={item} master={item} list={partialList} adresList={adresList} />)}
      <Grid container spacing={2}>
        {notPartialList &&
          notPartialList.length > 0 &&
          notPartialList.map((item) => (
            <Grid key={item.id} item xs={12} sm={6} md={4} lg={3}>
              <PickingCard key={item.id} item={item} opType={opType} enable={enable} adresList={adresList} />
            </Grid>
          ))}
      </Grid>
    </Box>
  )
}
