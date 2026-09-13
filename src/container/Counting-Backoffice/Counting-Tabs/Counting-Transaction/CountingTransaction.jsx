import React, { useContext, useEffect, useState } from 'react'
import useAuthHeader from '../../../../hooks/useAuthHeader'
import { getCountingListCount, getCountingDetailList } from '../../../../services/CountingDetailService'
import CountingDataTable from './CountingDataTable'
import { Box, Button, CircularProgress, Paper, Stack, Typography } from '@mui/material'
import useDebounce from '../../../../hooks/useDebounce'
import { notifyError } from '../../../../layout/Layout'
import SearchBox from '../../../../components/SearchBox'
import useIsMobile from '../../../../hooks/useIsMobile'
import { CountingContext } from '../../../../context/CountingContext'
import * as XLSX from 'xlsx'
import SearchOffOutlinedIcon from '@mui/icons-material/SearchOffOutlined'
import FilterListIcon from '@mui/icons-material/FilterList'

const filterKeyList = [
  { label: 'Stok Kodu', value: 'stokKod' },
  { label: 'Barkod', value: 'barkod' },
]

export default function CountingTransaction() {
  const isMobile = useIsMobile()
  const headers = useAuthHeader()
  const { selectedCountingId, addresses } = useContext(CountingContext)

  const [list, setList] = useState([])
  const [page, setPage] = useState(0)
  const [count, setCount] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [value, setValue] = useState('stokKod')
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const debbouncedSearchTerm = useDebounce(search, 350)

  const excelDataArray = list.map((row) => ({
    'Stok Kodu': row.stokKod,
    Adres: row.address.adres,
    Barkod: row.product.barcode,
    Miktar: row.miktar,
    'Sayım Durumu': row.status,
    'Oluşturulma Tarihi': String(row.createdDate).slice(0, 10).replace('T', ' '),
    'Oluşturulma Saati': String(row.createdDate).slice(11, 16),
    'İlk Kayıt Yapan': row.createdBy,
    'Son Kayıt Güncelleyen': row.lastModifiedBy,
    'Güncelleme Tarihi': String(row.lastModifiedDate).slice(0, 10).replace('T', ' '),
    'Güncelleme Saati': String(row.lastModifiedDate).slice(11, 16),
  }))

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(excelDataArray)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sayım Hareketleri')
    XLSX.writeFile(workbook, 'sayim_hareketleri.xlsx')
  }

  const handleSearch = (search) => {
    setSearch(search)
  }

  const handleChange = (event) => {
    setValue(event.target.value)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const fetchCountingListData = async (selectedCountingId) => {
    try {
      const res = await getCountingListCount(headers, selectedCountingId)
      res && setCount(parseInt(res))
    } catch (e) {
      notifyError(e.message)
    }
  }

  const fetchAllSayimUrunData = async (page, size, selectedCountingId) => {
    try {
      setIsLoading(true)
      let query = `page=${page}&size=${size}&aurSayimTanimId.equals=${selectedCountingId}&${value}.contains=${debbouncedSearchTerm}`
      const res = await getCountingDetailList(headers, query)
      res && setList(res)
    } catch (e) {
      notifyError(e.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAllSayimUrunData(page, rowsPerPage, selectedCountingId)
    fetchCountingListData(selectedCountingId)
  }, [page, rowsPerPage, selectedCountingId, debbouncedSearchTerm, value])

  if (isLoading)
    return (
      <Box sx={{ minHeight: 420, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Box>
    )

  return (
    <React.Fragment>
      <Paper variant="outlined" sx={{ p: 1.25, borderRadius: 1.5, mb: 2 }}>
        <Stack direction={isMobile ? 'column' : 'row'} justifyContent="flex-end" alignItems={isMobile ? 'stretch' : 'center'} gap={1.25}>
          <SearchBox
            zIndex={false}
            search={search}
            handleChangeSearch={handleSearch}
            data={filterKeyList}
            value={value}
            handleChange={handleChange}
            drawerHeaderTitle={'Filtrele'}
            actionIcon={FilterListIcon}
          />
          {count > 0 && (
            <Button variant={'contained'} color={'primary'} onClick={handleExport}>
              Dışa Aktar
            </Button>
          )}
        </Stack>
      </Paper>
      {list && list.length === 0 ? (
        <Paper
          variant="outlined"
          sx={{
            p: 4,
            borderRadius: 1.5,
            textAlign: 'center',
            minHeight: 420,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box>
            <SearchOffOutlinedIcon color="disabled" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Sayım hareketi bulunamadı
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Filtreleri temizleyerek veya farklı bir sayım seçerek tekrar deneyin.
            </Typography>
          </Box>
        </Paper>
      ) : (
        <CountingDataTable
          list={list}
          page={page}
          handleChangePage={handleChangePage}
          rowsPerPage={rowsPerPage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          count={count}
          addresses={addresses}
        />
      )}
    </React.Fragment>
  )
}
