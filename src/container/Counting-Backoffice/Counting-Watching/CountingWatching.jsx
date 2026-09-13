import { Box, CircularProgress, IconButton, Paper, Stack, Typography } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import useAuthHeader from '../../../hooks/useAuthHeader'
import { getCountingListCount, getDistinctAddressList } from '../../../services/CountingDetailService'
import RefreshIcon from '@mui/icons-material/Refresh'
import { notifyError } from '../../../layout/Layout'
import { getCountAddressList, getNotCountedAddressList } from '../../../services/AdressService'
import CountingReportContainer from './CountingReportContainer'
import { CountingContext } from '../../../context/CountingContext'

export default function CountingWatching() {
  const { selectedCountingId } = useContext(CountingContext)
  const headers = useAuthHeader()

  const [distinctList, setDistinctList] = useState([])
  const [count, setCount] = useState(0)
  const [notCountedAddress, setNotCountedAddress] = useState([])
  const [loading, setLoading] = useState(false)

  const stats = [
    {
      title: 'Toplam Sayım Adedi',
      value: count,
      subtitle: 'Seçili sayımın toplam satır adedi',
    },
    {
      title: 'İşlem Gören Adres Sayısı',
      value: distinctList.length,
      subtitle: 'Sayım hareketi işlenen adresler',
    },
    {
      title: 'İşlem Görmeyen Adres Sayısı',
      value: notCountedAddress.length,
      subtitle: 'Henüz işlem görmemiş adresler',
    },
  ]

  const handleClick = () => {
    fetchCountingDistinctAddressListData(selectedCountingId)
    fetchCountingListData(selectedCountingId)
  }

  const fetchCountingDistinctAddressListData = async (selectedCountingId) => {
    try {
      setLoading(true)
      const res = await getDistinctAddressList(headers, selectedCountingId)
      res && setDistinctList(res)
    } catch (e) {
      notifyError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchCountingListData = async (selectedCountingId) => {
    try {
      setLoading(true)
      const res = await getCountingListCount(headers, selectedCountingId)
      res && setCount(parseInt(res))
    } catch (e) {
      notifyError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchNotCountedListData = async (countingDefinitionId) => {
    try {
      setLoading(true)
      const res = await getNotCountedAddressList(headers, countingDefinitionId)
      res && setNotCountedAddress(res)
    } catch (e) {
      notifyError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (selectedCountingId > 0) {
      fetchCountingDistinctAddressListData(selectedCountingId)
      fetchCountingListData(selectedCountingId)
      fetchNotCountedListData(selectedCountingId)
    }
  }, [selectedCountingId])

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Sayım Raporları
        </Typography>
        <IconButton onClick={handleClick} disabled={loading}>
          {loading ? <CircularProgress size={20} /> : <RefreshIcon />}
        </IconButton>
      </Box>

      <Stack spacing={1} sx={{ flexGrow: 1 }}>
        {stats.map((stat) => (
          <Paper
            key={stat.title}
            variant="outlined"
            sx={{
              borderRadius: 1.5,
              p: 2.25,
              minHeight: 140,
              borderLeft: 3,
              borderLeftColor: 'primary.main',
              backgroundColor: 'background.default',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Typography variant="subtitle2" color="text.secondary">
              {stat.title}
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 700, lineHeight: 1.1, my: 0.25 }}>
              {stat.value}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {stat.subtitle}
            </Typography>
          </Paper>
        ))}
      </Stack>

      <Box sx={{ mt: 'auto', pt: 1.5 }}>
        <CountingReportContainer />
      </Box>
    </Box>
  )
}
