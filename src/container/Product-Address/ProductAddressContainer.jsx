import { useEffect, useMemo } from 'react'
import { useContainer } from 'unstated-next'
import { DataGrid, GridToolbarQuickFilter } from '@mui/x-data-grid'
import { Box, Button, CircularProgress } from '@mui/material'
import { DepoContainer } from '../../store/DepoContainer'
import * as XLSX from 'xlsx'
import { getDepoStockAddresses } from '../../services/AdressService'
import useAuthHeader from '../../hooks/useAuthHeader'
import excelimg from '../../assets/images/cards/excel.png'
import { useState } from 'react'
import { notifyError } from '../../layout/Layout'
import CustomNoRowsOverlay from '../../shared/components/DataGrid/CustomNoRowsOverlay'
import TableSearchField from '../../shared/components/Table/TableSearchField'
import useIsMobile from '../../hooks/useIsMobile'
import ActionHeader from '../../shared/components/ActionHeader'

export default function ProductAddressContainer() {
  const [addressList, setAddressList] = useState([])
  const [loading, setLoading] = useState(false)
  // Arama kutusu tablonun ustundeki ayri bir seritteydi; serit bos kaldigi ve
  // kutunun cercevesi olmadigi icin tablo ile baslik arasinda amacsiz bir bant
  // gibi duruyordu. Arama artik baslik satirinda, tablonun hizli filtresine
  // bagli. Sutun filtreleri de ayni modeli kullandigi icin model state'te
  // tutulur.
  const [filterModel, setFilterModel] = useState({ items: [], quickFilterValues: [] })
  const isMobile = useIsMobile()
  const gridHeight = isMobile ? 'calc(100dvh - 260px)' : 'calc(100dvh - 400px)'

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
    // Ciplak spinner sol uste yapisiyordu; tablonun kaplayacagi alan kadar
    // yer tutulup ortalaniyor ki yukleme sirasinda sayfa ziplamasin.
    return (
      <Box sx={{ height: gridHeight, minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    )
  }

  const searchValue = (filterModel.quickFilterValues ?? []).join(' ')

  const handleSearchChange = (event) => {
    const text = event.target.value
    setFilterModel((prev) => ({ ...prev, quickFilterValues: text.trim() ? text.trim().split(/\s+/) : [] }))
  }

  return (
    <>
      <ActionHeader
        title="Ürün Adres Gözlem"
        hide
        actions={
          <>
            <TableSearchField placeholder="Stok, barkod ya da adres ara" value={searchValue} onChange={handleSearchChange} />
            <Button variant="outlined" startIcon={<img src={excelimg} alt="" width={20} height={20} />} onClick={handleExport} disabled={addressList.length === 0}>
              Excel
            </Button>
          </>
        }
      />
      <DataGrid
        rows={addressList.filter((item) => item.status === true)}
        columns={columns}
        disableRowSelectionOnClick
        filterModel={filterModel}
        onFilterModelChange={setFilterModel}
        slots={{ noRowsOverlay: CustomNoRowsOverlay }}
        sx={{
          // minHeight verildiginde tablo satir sayisindan bagimsiz uzuyor ve
          // son satirin altinda genis bir bosluk kaliyordu.
          height: gridHeight,
          minHeight: 400,
          border: 'none',
          // Ilk ve son sutunun dis kenar boslugu kaldirilir; aksi halde baslik
          // ile ilk sutun basligi birbirinden 10 piksel kayiyor.
          '& .MuiDataGrid-columnHeader:first-of-type, & .MuiDataGrid-cell:first-of-type': { paddingLeft: 0 },
          '& .MuiDataGrid-columnHeader:last-of-type, & .MuiDataGrid-cell:last-of-type': { paddingRight: 0 },
        }}
      />
    </>
  )
}
