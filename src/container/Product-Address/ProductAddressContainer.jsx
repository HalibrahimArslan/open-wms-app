import { useEffect } from 'react'
import { DataGrid, GridToolbarQuickFilter } from '@mui/x-data-grid'
import { CircularProgress, Button, Box } from '@mui/material'
import * as XLSX from 'xlsx'
import { getDepoStockAddresses } from '../../services/AdressService'
import useAuthHeader from '../../hooks/useAuthHeader'
import excelimg from '../../assets/images/cards/excel.png'
import { useState } from 'react'
import { notifyError } from '../../layout/Layout'
import CustomNoRowsOverlay from '../../shared/components/DataGrid/CustomNoRowsOverlay'
import CustomToolbar from '../../shared/components/DataGrid/CustomToolbar'
import useIsMobile from '../../hooks/useIsMobile'
import ActionHeader from '../../shared/components/ActionHeader'

export default function ProductAddressContainer() {
  const [addressList, setAddressList] = useState([])
  const [loading, setLoading] = useState(false)
  const isMobile = useIsMobile()
  let gridHeight = isMobile ? 'calc(100dvh)' : 'calc(100dvh - 375px)'

  const headers = useAuthHeader()

  function getDepoName(params) {
    if (params.row.depoCode === '8' || params.row.depoCode === '15') {
      return 'KAYNARCA LOJISTIK DEPO'
    }
    if (params.row.depoCode === '99') {
      return 'İHRACAT DEPO'
    }
    if (params.row.depoCode === '98') {
      return 'HASARLI URUNLER'
    }
  }

  const columns = [
    {
      field: 'depoAdi',
      headerName: 'Depo Adi',
      width: 200,
      editable: true,
      valueGetter: (value, row) => getDepoName({ row }),
    },
    {
      field: 'stokKodu',
      headerName: 'Stok Kodu',
    },
    {
      field: 'stockName',
      headerName: 'Stok Adi',
      flex: 1,
    },
    {
      field: 'lastUpdateDate',
      headerName: 'Güncelleme Tarihi',
      width: 200,
      // MUI X 7 ile valueFormatter'in imzasi (params) yerine (value, row, ...)
      // oldu; govde eski imzadaki params'i okumaya devam ettigi icin sutun
      // cizilirken ReferenceError firlatiyor ve tum sayfa hata ekranina
      // dusuyordu.
      valueFormatter: (value) => {
        if (!value) return ''
        return String(value).slice(0, 16).replace('T', ' ')
      },
    },
    {
      field: 'barkod',
      headerName: 'Ürün Barkodu',
      width: 150,
    },
    {
      field: 'miktar',
      headerName: 'Miktar',
      width: 100,
      align: 'center',
    },
    {
      field: 'adres',
      headerName: 'Urun Adresi',
      width: 200,
      align: 'center',
    },
  ]

  const excelDataArray = addressList.map((row) => ({
    'Depo Adi': getDepoName({ row }),
    'Stok Kodu': row.stokKodu,
    'Stok Adi': row.stockName,
    'Güncelleme Tarihi': String(row.lastUpdateDate).slice(0, 16).replace('T', ' '),
    'Ürün Barkodu': row.barkod,
    Miktar: row.miktar,
    'Urun Adresi': row.adres,
  }))

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(excelDataArray)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Urun Adresleri')
    XLSX.writeFile(workbook, 'urun_adresleri.xlsx')
  }

  const fetchStockData = async () => {
    try {
      setLoading(true)
      const res = await getDepoStockAddresses(headers)
      res && setAddressList(res)
    } catch (err) {
      notifyError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStockData()
  }, [])

  if (loading) {
    return <CircularProgress />
  }

  return (
    <>
      <Box>
        <ActionHeader title="Ürün Adres Gözlem" handleClick={handleExport} Icon={<img src={excelimg} alt="Excel indir" width={40} height={40} />} />
      </Box>
      <DataGrid
        rows={addressList.filter((item) => item.status === true)}
        columns={columns}
        disableSelectionOnClick
        slots={{
          toolbar: CustomToolbar,
          noRowsOverlay: CustomNoRowsOverlay,
        }}
        style={{ minHeight: gridHeight }}
        showToolbar
      />
    </>
  )
}
