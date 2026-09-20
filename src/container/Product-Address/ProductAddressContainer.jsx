import { useEffect, useMemo } from 'react'
import { useContainer } from 'unstated-next'
import { DataGrid, GridToolbarQuickFilter } from '@mui/x-data-grid'
import { CircularProgress, Button, Box } from '@mui/material'
import { DepoContainer } from '../../store/DepoContainer'
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
  const { allDepoList } = useContainer(DepoContainer)

  /**
   * Depo kodu -> depo adi eslemesi.
   *
   * Adlar daha once dogrudan koda gomuluydu ve yalnizca dort kodu taniyordu
   * (8, 15, 98, 99). Ustelik karsilastirma metin uzerinden yapiliyordu
   * (depoCode === '8'); depo kodu servisten sayi olarak geldiginde hicbir
   * kosul tutmuyor ve fonksiyon undefined dondurup sutunu bos birakiyordu.
   * Artik adlar depo listesinden okunuyor ve karsilastirma tip farkina
   * takilmasin diye iki taraf da metne cevriliyor.
   *
   * Satirdaki kod, deponun kendi kodu ya da ERP tarafindaki transfer kodu
   * olabildigi icin ikisi de anahtar olarak yazilir.
   */
  const depoNameByCode = useMemo(() => {
    const map = new Map()
    ;(allDepoList ?? []).forEach((depo) => {
      if (depo?.name === undefined || depo?.name === null) return
      if (depo.code !== undefined && depo.code !== null) map.set(String(depo.code), depo.name)
      if (depo.transferCode !== undefined && depo.transferCode !== null) map.set(String(depo.transferCode), depo.name)
    })
    return map
  }, [allDepoList])

  // Eslesme bulunamazsa hucre bos birakilmaz; en azindan kod gosterilir ki
  // eksik tanim gorunur olsun.
  const getDepoName = (row) => {
    const code = row?.depoCode
    if (code === undefined || code === null || code === '') return ''
    return depoNameByCode.get(String(code)) ?? `Depo ${code}`
  }

  const columns = [
    {
      field: 'depoAdi',
      headerName: 'Depo Adi',
      width: 200,
      // Turetilmis sutun: duzenlenen deger valueGetter tarafindan hemen
      // ezildigi icin editable isaretinin bir karsiligi yoktu.
      valueGetter: (value, row) => getDepoName(row),
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
    'Depo Adi': getDepoName(row),
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
