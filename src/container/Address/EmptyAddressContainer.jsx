import { useEffect, useState } from 'react'
import { getEmptyAddressList } from '../../services/AdressService'
import useAuthHeader from '../../hooks/useAuthHeader'
import useDepoCode from '../../hooks/useDepoCode'
import { notifyError } from '../../layout/Layout'
import { Box, Checkbox, Paper, Skeleton } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import CustomToolbar from '../../shared/components/DataGrid/CustomToolbar'
import useIsMobile from '../../hooks/useIsMobile'

const EmptyAddressContainer = () => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const isMobile = useIsMobile()
  const gridHeight = isMobile ? 'calc(100dvh)' : 'calc(100dvh - 375px)'

  const headers = useAuthHeader()
  const depoCode = useDepoCode()

  const columns = [
    {
      field: 'adres',
      headerName: 'Adres',
      align: 'start',
      headerAlign: 'start',
      flex: 1,
      minWidth: 100,
    },
    {
      field: 'geciciAdres',
      headerName: 'Geçici Adres',
      flex: 1,
      minWidth: 100,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => <Checkbox checked={!!params.value} disabled />,
    },
    {
      field: 'toplamaGozu',
      headerName: 'Toplama Gözü',
      flex: 1,
      minWidth: 100,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => <Checkbox checked={!!params.value} disabled />,
    },
    {
      field: 'kontrolAdres',
      headerName: 'Kontrol Adresi',
      flex: 1,
      minWidth: 100,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => <Checkbox checked={!!params.value} disabled />,
    },
    {
      field: 'status',
      headerName: 'Aktif',
      flex: 1,
      minWidth: 100,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => <Checkbox checked={!!params.value} disabled />,
    },
  ]

  const fetchEmptyAddressList = async () => {
    try {
      setLoading(true)
      const res = await getEmptyAddressList(headers, depoCode)
      res && setData(res.emptyAddresses)
    } catch (e) {
      notifyError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const renderSkeleton = () => (
    <Box sx={{ padding: 2 }}>
      {[...Array(10)].map((_, i) => (
        <Skeleton key={i} height={50} sx={{ mb: 1 }} variant="rectangular" />
      ))}
    </Box>
  )

  useEffect(() => {
    fetchEmptyAddressList()
  }, [headers, depoCode])

  return (
    <Paper>
      {loading ? (
        renderSkeleton()
      ) : (
        <DataGrid
          rows={data}
          columns={columns}
          loading={loading}
          disableColumnMenu
          disableSelectionOnClick
          getRowId={(row) => row.urunAdresId}
          components={{ Toolbar: CustomToolbar }}
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          style={{ minHeight: gridHeight }}
        />
      )}
    </Paper>
  )
}

export default EmptyAddressContainer
