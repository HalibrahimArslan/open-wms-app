import { Box, Grid, Paper, Stack, Typography } from '@mui/material'
import { DataGrid, GridActionsCellItem, GridToolbar } from '@mui/x-data-grid'
import { getCountingResultList, getCountingDetailByStokKodAndBarcode } from '../../../../services/CountingDetailService'
import React, { useContext, useState } from 'react'
import useAuthHeader from '../../../../hooks/useAuthHeader'
import { useEffect } from 'react'
import PreviewIcon from '@mui/icons-material/Preview'
import AddressInfo from '../../../../components/Address/AddressInfo'
import ExtendedDialog from '../../../../shared/components/Dialog/ExtendedDialog'
import { CountingContext } from '../../../../context/CountingContext'
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined'

export default function CountingResult() {
  const headers = useAuthHeader()
  const [list, setList] = useState([])
  const [detailList, setDetailList] = useState([])
  const [isPart, setIsPart] = useState(false)
  const [selectedBarcode, setSelectedBarcode] = useState('')
  const [loading, setLoading] = useState(false)
  const { selectedCountingId, addresses } = useContext(CountingContext)

  const fetchCountingResultData = async (selectedCountingId) => {
    try {
      setLoading(true)
      const res = await getCountingResultList(headers, selectedCountingId)
      res && setList(res)
    } finally {
      setLoading(false)
    }
  }

  const fetchCountingResultDataByStokKodAndBarcode = async (selectedCountingId, barcode, stokKod) => {
    const res = await getCountingDetailByStokKodAndBarcode(headers, selectedCountingId, barcode, stokKod)
    res && setDetailList(res)
    res && setIsPart(true)
    res && setSelectedBarcode(barcode)
  }

  function getAddress(params) {
    const address = addresses.find((x) => x.urunAdresId === params)
    return address ? address.adres : ''
  }

  useEffect(() => {
    fetchCountingResultData(selectedCountingId)
  }, [selectedCountingId])

  const columns = [
    {
      field: 'id',
      headerName: 'Sıra No',
      width: 100,
      align: 'center',
      hide: true,
    },
    {
      field: 'stokKod',
      headerName: 'Stok Kodu',
    },
    {
      field: 'stokAdi',
      headerName: 'Stok Adı',
      width: 250,
    },
    {
      field: 'barcode',
      width: 150,
      headerName: 'Barkod',
    },
    {
      field: 'amount',
      headerName: 'Toplam Miktar',
    },
    {
      field: 'addColumn',
      type: 'actions',
      width: 200,
      headerName: 'Kalemlerini Göster',
      getActions: (params) => [
        <GridActionsCellItem
          key="detay-goster"
          icon={<PreviewIcon />}
          label="Detay Göster"
          onClick={() => fetchCountingResultDataByStokKodAndBarcode(selectedCountingId, params.row.barcode, params.row.stokKod)}
        />,
      ],
    },
  ]

  return (
    <React.Fragment>
      {loading || (list && list.length > 0) ? (
        <Grid
          style={{ height: 650, width: '100%' }}
          sx={{
            margin: 2,
          }}
        >
          <DataGrid
            rows={list}
            columns={columns}
            loading={loading}
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
              },
            }}
            showToolbar
          />
        </Grid>
      ) : null}
      {!loading && list && list.length === 0 ? (
        <Paper
          variant="outlined"
          sx={{
            borderRadius: 1.5,
            mx: 2,
            mb: 2,
            minHeight: 420,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Stack
            spacing={1}
            sx={{
              alignItems: 'center',
              textAlign: 'center',
              maxWidth: 460,
              px: 2,
            }}
          >
            <InboxOutlinedIcon color="disabled" sx={{ fontSize: 44 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Sayım sonucu bulunamadı
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
              }}
            >
              Sonuçlar bu sayım için henüz oluşmamış olabilir. Farklı bir sayım seçip tekrar kontrol edin.
            </Typography>
          </Stack>
        </Paper>
      ) : null}

      <ExtendedDialog
        open={isPart}
        handleClose={() => setIsPart(false)}
        dialogHeader={selectedBarcode}
        dialogContent={
          detailList && detailList.length > 0 ? (
            <Box sx={{ display: 'flex', gap: 2 }}>
              {detailList.map((item) => (
                <AddressInfo miktar={item.miktar} address={item.address.adres} />
              ))}
            </Box>
          ) : (
            <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                }}
              >
                Seçili barkod için detay bulunamadı.
              </Typography>
            </Paper>
          )
        }
      />
    </React.Fragment>
  )
}
