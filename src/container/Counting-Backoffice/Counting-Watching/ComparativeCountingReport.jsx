import React, { useEffect, useState } from 'react'
import useAuthHeader from '../../../hooks/useAuthHeader'
import useDepoCode from '../../../hooks/useDepoCode'
import { notifyError } from '../../../layout/Layout'
import { getComparativeCountingReport, getCountingDefinitionList } from '../../../services/CountingDetailService'
import { Box, Button, Grid } from '@mui/material'
import CheckedListItem from '../../../components/List/CheckedListItem'
import LoadingButton from '../../../components/Button/LoadingButton'
import { utils, writeFile } from 'xlsx'

export default function ComparativeCountingReport() {
  const headers = useAuthHeader()
  const depoCode = useDepoCode()

  const [checkedCounting, setCheckedCounting] = useState([])
  const [checkedChecker, setCheckedChecker] = useState([])
  const [activeCountingList, setActiveCountingList] = useState([])
  const [comparativeCountingReport, setComparativeCountingReport] = useState([])
  const [loading, setLoading] = useState(false)
  const date = new Date().toLocaleDateString()
  const time = new Date().toLocaleTimeString()

  const countingListAsCounter = activeCountingList.filter((counting) => counting.visibilityAuthorities.includes('COUNTER'))
  const countingListAsChecker = activeCountingList.filter((counting) => counting.visibilityAuthorities.includes('CHECKER'))

  const columnOrder = [
    'kategoriAdi',
    'anaGrup',
    'barkod',
    'stokKodu',
    'anaParca',
    'stokAdi',
    'bolum',
    'unite',
    'kat',
    'sayimAdresi',
    'kontrolAdresi',
    'sayimMiktar',
    'sayimSonGuncelleyen',
    'kontrolMiktar',
    'kontrolSonGuncelleyen',
    'fark',
    'mikroMiktar',
    'description',
  ]

  const handleOnExport = () => {
    let wb = utils.book_new()
    const reorderedData = comparativeCountingReport.map((item) => {
      const reorderedItem = {}
      columnOrder.forEach((col) => {
        reorderedItem[col] = item[col]
      })
      return reorderedItem
    })
    let ws = utils.json_to_sheet(reorderedData)
    utils.book_append_sheet(wb, ws, 'karşılaştırmalı sayım raporu')
    writeFile(wb, `sayim-${date}-${time}.xlsx`)
  }

  const handleCheckedCounting = (value) => {
    setCheckedCounting(value)
  }

  const handleCheckedCountingChecker = (value) => {
    setCheckedChecker(value)
  }

  const handleReport = () => {
    if (checkedCounting.length === 0) {
      notifyError('Sayım seçiniz.')
      return
    }
    if (checkedChecker.length === 0) {
      notifyError('Kontrol seçiniz.')
      return
    }
    fetchComparativeCountingReport(checkedCounting[0], checkedChecker[0])
  }

  const fetchActiveCounting = async () => {
    try {
      setLoading(true)
      let query = `depoNo.equals=${depoCode}&status.equals=true&sayimDurumu.in=ACTIVE,PARKING`
      const res = await getCountingDefinitionList(headers, query)
      res && setActiveCountingList(res)
    } catch (e) {
      notifyError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchComparativeCountingReport = async (countingId, checkedCountingId) => {
    try {
      setLoading(true)
      const res = await getComparativeCountingReport(headers, countingId, checkedCountingId)
      res && setComparativeCountingReport(res)
    } catch (e) {
      notifyError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchActiveCounting()
  }, [depoCode])

  return (
    <Grid
      container
      spacing={2}
      sx={{
        justifyContent: 'flex-start',
      }}
    >
      <Grid size={4.5}>
        <CheckedListItem
          data={countingListAsCounter}
          keyField={'id'}
          displayField={'sayimAdi'}
          multiple={false}
          checkedList={checkedCounting}
          handleCheckedList={handleCheckedCounting}
          header={'Sayım Listesi'}
        />
      </Grid>
      <Grid size={4.5}>
        <CheckedListItem
          data={countingListAsChecker}
          keyField={'id'}
          displayField={'sayimAdi'}
          multiple={false}
          checkedList={checkedChecker}
          handleCheckedList={handleCheckedCountingChecker}
          header={'Kontrol Listesi'}
        />
      </Grid>
      <Grid size={3}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            alignItems: 'center',
          }}
        >
          <LoadingButton text={'Karşılaştır'} loading={loading} onClick={handleReport} />
          {comparativeCountingReport.length > 0 && (
            <Button variant="outlined" onClick={handleOnExport}>
              İndir
            </Button>
          )}
        </Box>
      </Grid>
    </Grid>
  )
}
