import React, { useEffect, useState, useCallback } from 'react'
import { Box, Button, Stack, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import ActionHeader from '../../shared/components/ActionHeader'
import excelimg from '../../assets/images/cards/excel.png'
import useAutheaders from '../../hooks/useAuthHeader'
import CustomToolbar from '../../shared/components/DataGrid/CustomToolbar'
import { getPerformanceList } from '../../services/OrderPickingTransactionService'
import { getUsers } from '../../services/UserService'
import Filter from '../../components/Filter/Filter'
import * as XLSX from 'xlsx'
import { useContainer } from 'unstated-next'
import { DataStore } from '../../store/DataStore'

const columns = [
  { field: 'kullanici', headerName: 'Kullanıcı', flex: 1 },
  { field: 'siparisNo', headerName: 'Sipariş No', flex: 1 },
  { field: 'adet', headerName: 'Adet', flex: 1 },
  { field: 'baslangic', headerName: 'Başlangıç', flex: 1 },
  { field: 'bitis', headerName: 'Bitiş', flex: 1 },
  { field: 'sure', headerName: 'Süre', flex: 1 },
]

const PerformanceControlContainer = () => {
  const [performanceList, setPerformanceList] = useState([])
  const [users, setUsers] = useState([])

  const { account } = useContainer(DataStore)
  const headers = useAutheaders()

  const [performanceFilter, setPerformanceFilter] = useState({
    start: '',
    end: '',
    user: '',
  })

  useEffect(() => {
    if (account?.login) {
      setPerformanceFilter((prev) => ({ ...prev, user: account.login }))
    }
  }, [account?.login])

  const fetchAllUsers = useCallback(async () => {
    try {
      const res = await getUsers(headers, 'page=0&size=1000')
      if (res) {
        const activeUsers = Array.isArray(res) ? res.filter((u) => u?.activated) : []
        setUsers(activeUsers)
      }
    } catch (error) {
      notifyError(error)
      setUsers([])
    }
  }, [headers])

  useEffect(() => {
    fetchAllUsers()
  }, [fetchAllUsers])

  const getPerformanceData = useCallback(async () => {
    try {
      const response = await getPerformanceList(headers, `start=${performanceFilter.start}&end=${performanceFilter.end}&user=${performanceFilter.user}&companyCode=2`)

      const rows =
        Array.isArray(response) && response.length > 0
          ? (response[0]?.detaylar ?? []).map((row, index) => ({
              ...row,
              id: row.id ?? `${response[0]?.id || 'row'}-${index}`,
            }))
          : []

      setPerformanceList(Array.isArray(rows) ? rows : [])
    } catch (error) {
      console.error('Performans verileri alınırken hata oluştu:', error)
      setPerformanceList([])
    }
  }, [headers, performanceFilter.start, performanceFilter.end, performanceFilter.user])

  useEffect(() => {
    if (performanceFilter.user) {
      getPerformanceData()
    }
  }, [getPerformanceData, performanceFilter.user])

  const handleExportExcel = useCallback(() => {
    const sheetData = performanceList.map((row) => ({
      Kullanıcı: row.kullanici ?? '',
      'Sipariş No': row.siparisNo ?? '',
      Adet: row.adet ?? '',
      Başlangıç: row.baslangic ?? '',
      Bitiş: row.bitis ?? '',
      Süre: row.sure ?? '',
    }))

    const ws = XLSX.utils.json_to_sheet(
      sheetData.length
        ? sheetData
        : [
            {
              Kullanıcı: '',
              'Sipariş No': '',
              Adet: '',
              Başlangıç: '',
              Bitiş: '',
              Süre: '',
            },
          ]
    )

    const excelHeaders = ['Kullanıcı', 'Sipariş No', 'Adet', 'Başlangıç', 'Bitiş', 'Süre']
    ws['!cols'] = excelHeaders.map((h) => ({ wch: Math.max(h.length + 2, 14) }))

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Performans')

    const start = performanceFilter.start || 'tumu'
    const end = performanceFilter.end || 'tumu'
    const user = performanceFilter.user || 'kullanici'
    const fileName = `performans_${user}_${start}_${end}.xlsx`

    XLSX.writeFile(wb, fileName)
  }, [performanceList, performanceFilter])

  const handleClearFilter = () => {
    setPerformanceFilter({
      start: '',
      end: '',
      user: account?.login || '',
    })
  }

  return (
    <Box sx={{ padding: 2 }}>
      <ActionHeader title="Performans Kontrolü" handleClick={handleExportExcel} Icon={<img src={excelimg} alt="Excel indir" width={40} height={40} />} />

      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Filter
          type="Date"
          label="Başlangıç Tarihi"
          filter={performanceFilter.start ? new Date(performanceFilter.start) : null}
          handleFilter={(val) =>
            setPerformanceFilter((prev) => ({
              ...prev,
              start: val instanceof Date && !isNaN(val) ? val.toISOString().slice(0, 10) : '',
            }))
          }
        />

        <Filter
          type="Date"
          label="Bitiş Tarihi"
          filter={performanceFilter.end ? new Date(performanceFilter.end) : null}
          handleFilter={(val) =>
            setPerformanceFilter((prev) => ({
              ...prev,
              end: val instanceof Date && !isNaN(val) ? val.toISOString().slice(0, 10) : '',
            }))
          }
        />

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Kullanıcı</InputLabel>
          <Select
            value={performanceFilter.user || ''}
            onChange={(e) =>
              setPerformanceFilter((prev) => ({
                ...prev,
                user: e.target.value,
              }))
            }
          >
            {users.length === 0 ? (
              <MenuItem value="">Kullanıcılar yükleniyor...</MenuItem>
            ) : (
              users.map((u) => {
                const fullName = [u.firstName, u.lastName].filter(Boolean).join(' ')
                return (
                  <MenuItem key={u.id} value={u.login}>
                    {fullName ? `${fullName} (${u.login})` : u.login}
                  </MenuItem>
                )
              })
            )}
          </Select>
        </FormControl>

        <Button variant="outlined" onClick={handleClearFilter}>
          Temizle
        </Button>
      </Stack>

      <DataGrid
        rows={performanceList}
        columns={columns}
        pageSize={20}
        rowsPerPageOptions={[20, 50, 100]}
        autoHeight
        components={{ Toolbar: CustomToolbar }}
        componentsProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
        getRowId={(row) => row.id}
      />
    </Box>
  )
}

export default PerformanceControlContainer
