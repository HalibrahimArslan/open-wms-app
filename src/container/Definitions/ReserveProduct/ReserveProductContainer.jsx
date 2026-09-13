import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { DataGrid, trTR } from '@mui/x-data-grid'
import { Box, Chip } from '@mui/material'
import ActionHeader from '../../../shared/components/ActionHeader'
import CustomToolbar from '../../../shared/components/DataGrid/CustomToolbar'
import excelimg from '../../../assets/images/cards/excel.png'
import { utils, writeFile } from 'xlsx'
import { getResereveProducts, updateReserveProduct } from '../../../services/ReserveService'
import useAuthHeader from '../../../hooks/useAuthHeader'
import { notify, notifyError } from '../../../layout/Layout'
import { useContainer } from 'unstated-next'
import { DataStore } from '../../../store/DataStore'

const statusOptions = [
  { value: 'RESERVED', label: 'Rezerve Edildi', color: 'info' },
  { value: 'CANCELLED', label: 'İptal Edildi', color: 'error' },
  { value: 'DISPATCHED', label: 'Sevk Edildi', color: 'success' },
]

const renderStatusChip = (status) => {
  const option = statusOptions.find((opt) => opt.value === status)
  if (!option) return <Chip label={status} size="small" />

  return <Chip sx={{ minWidth: '100px' }} label={option.label} color={option.color} size="small" />
}

const ReserveProductContainer = () => {
  const [reserveProducts, setReserveProducts] = useState([])
  const headers = useAuthHeader()
  const { account } = useContainer(DataStore)

  const columns = [
    { field: 'orderNo', headerName: 'Sipariş Numarası', flex: 1 },
    { field: 'stokKodu', headerName: 'Stok Kodu', flex: 1 },
    { field: 'barcode', headerName: 'Barkod', flex: 1 },
    { field: 'description', headerName: 'Açıklama', flex: 1 },
    { field: 'createdBy', headerName: 'Oluşturan Kullanıcı', flex: 1 },
    {
      field: 'createdDate',
      headerName: 'Oluşturma Tarihi',
      flex: 1,
      renderCell: (params) => {
        const date = new Date(params.value)
        return isNaN(date.getTime()) ? '' : date.toLocaleDateString('tr-TR')
      },
    },
    { field: 'lastModifiedBy', headerName: 'Son Güncelleyen', flex: 1 },
    {
      field: 'status',
      headerName: 'Durum',
      flex: 1,
      editable: true,
      type: 'singleSelect',
      valueOptions: statusOptions.map(({ value, label }) => ({ value, label })),
      renderCell: (params) => renderStatusChip(params.value),
    },
  ]

  const excelDataArray = useMemo(() => {
    return reserveProducts.map((row) => {
      const statusLabel = statusOptions.find((opt) => opt.value === row.status)?.label || row.status
      return {
        'Sipariş Numarası': row.orderNo,
        'Stok Kodu': row.stokKodu,
        Barkod: row.barcode,
        'Oluşturan Kullanıcı': row.createdBy,
        'Oluşturma Tarihi': row.createdDate,
        'Son Güncelleyen': row.lastModifiedBy,
        Açıklama: row.description,
        Durum: statusLabel,
      }
    })
  }, [reserveProducts])

  const handleExport = useCallback(() => {
    const wb = utils.book_new()
    const ws = utils.json_to_sheet(excelDataArray)
    utils.book_append_sheet(wb, ws, 'Reserve Ürünler')
    writeFile(wb, 'reserve-urunler.xlsx')
  }, [excelDataArray])

  const handleRowUpdate = async (newRow, oldRow) => {
    if (newRow.status === oldRow.status) return oldRow

    try {
      const updated = await updateReserveProduct(headers, newRow)

      setReserveProducts((prev) => prev.map((item) => (item.id === updated.id ? { ...item, status: updated.status } : item)))
      notify('Güncelleme Başarılı')

      return updated
    } catch (error) {
      notifyError(error.message)
      return oldRow
    }
  }

  const getReserveProducts = async () => {
    try {
      const response = await getResereveProducts(headers, account?.companyCode)
      if (response) setReserveProducts(response)
    } catch (error) {
      notifyError(error.message)
    }
  }

  useEffect(() => {
    getReserveProducts()
  }, [account?.companyCode])

  return (
    <Box>
      <ActionHeader title="Reserve Ürünler" handleClick={handleExport} Icon={<img src={excelimg} alt="Excel indir" width={40} height={40} />} />
      <DataGrid
        autoHeight
        rows={reserveProducts}
        columns={columns}
        pageSize={20}
        rowsPerPageOptions={[20, 50, 100]}
        localeText={trTR.components.MuiDataGrid.defaultProps.localeText}
        getRowId={(row) => row.id || `${row.orderNo}-${row.productCode}`}
        processRowUpdate={handleRowUpdate}
        components={{ Toolbar: CustomToolbar }}
        componentsProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
      />
    </Box>
  )
}

export default ReserveProductContainer
