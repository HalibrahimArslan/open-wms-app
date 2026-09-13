import { styled, Typography, useTheme, Box, Skeleton, Avatar, Divider } from '@mui/material'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import { getEmptyAddressList } from '../../services/AdressService'
import useAuthHeader from '../../hooks/useAuthHeader'
import useDepoCode from '../../hooks/useDepoCode'
import { notifyError } from '../../layout/Layout'
import { useEffect, useState } from 'react'
import { useContainer } from 'unstated-next'
import { DepoContainer } from '../../store/DepoContainer'
import { getTransferDepoCode } from '../../utils/Utils'
import { tr } from 'date-fns/locale'

ChartJS.register(ArcElement, Tooltip, Legend)

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      display: false,
    },
    tooltip: {
      enabled: true,
    },
  },
  cutout: '50%',
}

const StyledBox = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 550,
  margin: 'auto',
  backgroundColor: theme.palette.secondary.light,
  display: 'flex',
  alignItems: 'center',
  borderRadius: theme.radius.card,
  flexDirection: 'column',
}))

const CustomBox = ({ children, loading, ...props }) => {
  return (
    <StyledBox {...props}>
      {loading ? (
        <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} gap={5} alignContent={'center'} p={1}>
          <Box display={'flex'} justifyContent={'center'}>
            <Skeleton variant="text" width={150} height={20} />
          </Box>
          <Skeleton variant="circular" width={200} height={200} />
        </Box>
      ) : (
        children
      )}
    </StyledBox>
  )
}

const StorageRateContainer = () => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({})

  const headers = useAuthHeader()
  const depoCode = useDepoCode()
  const { allDepoList } = useContainer(DepoContainer)
  const theme = useTheme()

  const transferDepoCode = getTransferDepoCode(depoCode, allDepoList)

  const doughnutData = {
    labels: ['Boş Adres Sayısı', 'Toplam Adres Sayısı'],
    datasets: [
      {
        label: 'Depo Doluluk Oranı',
        data: [data.emptyAddressCount, data.totalAddressCount],
        backgroundColor: [theme.palette.warning.main, theme.palette.error.main],
        borderColor: [theme.palette.warning.main, theme.palette.error.main],
        borderWidth: 1,
      },
    ],
  }

  const fetchEmptyAddressList = async () => {
    try {
      setLoading(true)
      const res = await getEmptyAddressList(headers, transferDepoCode)
      res && setData(res)
    } catch (e) {
      notifyError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (transferDepoCode) {
      fetchEmptyAddressList()
    }
  }, [transferDepoCode])

  return (
    <CustomBox loading={loading}>
      <Typography variant="h6" pt={1}>
        {doughnutData.datasets[0].label}
      </Typography>
      <div style={{ width: '100%', height: 200, margin: 'auto', position: 'relative' }}>
        <Doughnut data={doughnutData} options={options} />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#333',
          }}
        >
          {data.filledRatio}%<div style={{ fontSize: '12px', fontWeight: 'normal', color: '#666' }}>DYS</div>
        </div>
      </div>
    </CustomBox>
  )
}

export default StorageRateContainer
