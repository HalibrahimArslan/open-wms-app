import { useCallback, useEffect, useMemo, useState } from 'react'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { getWaybillList } from '../../services/MikroService'
import usePayload from '../../hooks/usePayload'
import { notifyError } from '../../layout/Layout'
import { Avatar, Box, Divider, Grid, Skeleton, styled, Typography, useTheme } from '@mui/material'
import { useLocation, useNavigate } from 'react-router'
import dayjs from 'dayjs'
import useDepoCode from '../../hooks/useDepoCode'

ChartJS.register(ArcElement, Tooltip, Legend)

const CustomBox = ({ children, loading, ...props }) => {
  return (
    <StyledBox {...props}>
      {loading ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 5,
            alignContent: 'center',
            p: 1,
          }}
        >
          <Skeleton variant="text" width={150} height={20} />
          <Skeleton variant="circular" width={150} height={150}>
            <Avatar />
          </Skeleton>
          <Divider flexItem />
          <Skeleton variant="text" width={150} height={20} />
          <Skeleton variant="circular" width={150} height={150}>
            <Avatar />
          </Skeleton>
        </Box>
      ) : (
        children
      )}
    </StyledBox>
  )
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

const StyledDoughnut = ({ data, dysPercentage, options, onSliceClick }) => {
  const chartOptions = {
    ...options,
    onClick: (_, elements) => {
      if (!elements || elements.length === 0) return
      const source = data.labels?.[elements[0].index]
      if (source) onSliceClick?.(source)
    },
  }

  return (
    <>
      <Typography
        variant="h6"
        sx={{
          pt: 1,
        }}
      >
        {data.datasets[0].label}
      </Typography>
      <div style={{ width: '100%', height: 200, margin: 'auto', position: 'relative' }}>
        <Doughnut data={data} options={chartOptions} />
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
            pointerEvents: 'none',
          }}
        >
          {dysPercentage}%<div style={{ fontSize: '12px', fontWeight: 'normal', color: '#666' }}>DYS</div>
        </div>
      </div>
    </>
  )
}

const WaybillChartContainer = () => {
  let endDate = new Date()
  let startDate = new Date(new Date().setDate(endDate.getDate() - 7))
  const [receivingDocuments, setReceivingDocuments] = useState([])
  const [dispatchmentDocuments, setDispatchmentDocuments] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const depoCode = useDepoCode()

  const theme = useTheme()
  const receivingPayload = usePayload({
    firmCode: '',
    evrakTip: 13,
    beginDate: startDate.toISOString().split('T')[0].concat(' 00:00:00'),
    endDate: endDate.toISOString().split('T')[0].concat(' 23:59:00'),
  })

  const dispatchmentPayload = usePayload({
    firmCode: '',
    evrakTip: 1,
    beginDate: startDate.toISOString().split('T')[0].concat(' 00:00:00'),
    endDate: endDate.toISOString().split('T')[0].concat(' 23:59:00'),
  })

  const fetchExecuteData = async () => {
    try {
      setLoading(true)
      const [receivingRes, dispatcmentRes] = await Promise.all([getWaybillList(receivingPayload), getWaybillList(dispatchmentPayload)])
      if (receivingRes && dispatcmentRes) {
        setReceivingDocuments(receivingRes)
        setDispatchmentDocuments(dispatcmentRes)
      }
      setTimeout(() => {}, 2000)
    } catch (e) {
      notifyError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExecuteData()
  }, [])

  const calculateStats = useCallback((documents) => {
    const erpCount = documents.filter((doc) => doc.kaynak === 'ERP').length
    const dysCount = documents.filter((doc) => doc.kaynak === 'DYS').length
    const total = erpCount + dysCount
    const dysPercentage = total > 0 ? Math.round((dysCount / total) * 100) : 0

    return { erpCount, dysCount, total, dysPercentage }
  }, [])

  const receivingStats = useMemo(() => calculateStats(receivingDocuments), [receivingDocuments, calculateStats])
  const dispatchmentStats = useMemo(() => calculateStats(dispatchmentDocuments), [dispatchmentDocuments, calculateStats])

  const receivingData = {
    labels: ['ERP', 'DYS'],
    datasets: [
      {
        label: 'Giriş İrsaliye',
        data: [receivingStats.erpCount, receivingStats.dysCount],
        backgroundColor: [theme.palette.warning.main, theme.palette.error.main],
        borderColor: [theme.palette.warning.main, theme.palette.error.main],
        borderWidth: 1,
      },
    ],
  }

  const dispatchmentData = {
    labels: ['ERP', 'DYS'],
    datasets: [
      {
        label: 'Çıkış İrsaliye',
        data: [dispatchmentStats.erpCount, dispatchmentStats.dysCount],
        backgroundColor: [theme.palette.warning.main, theme.palette.success.main],
        borderColor: [theme.palette.warning.main, theme.palette.success.main],
        borderWidth: 1,
      },
    ],
  }

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

  const navigateToWaybillControl = useCallback(
    (evrakTip, kaynak) => {
      const basePath = location.pathname.includes('/dashboard') ? `${location.pathname.split('/dashboard')[0]}/waybill-control` : `/d:${depoCode}/waybill-control`

      const beginDate = dayjs().subtract(5, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss')
      const endDate = dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss')

      const searchParams = new URLSearchParams({
        evrakTip: String(evrakTip),
        kaynak: String(kaynak),
        beginDate,
        endDate,
      })

      navigate(`${basePath}?${searchParams.toString()}`)
    },
    [depoCode, location.pathname, navigate]
  )

  return (
    <CustomBox loading={loading}>
      <StyledDoughnut data={receivingData} dysPercentage={receivingStats.dysPercentage} options={options} onSliceClick={(source) => navigateToWaybillControl(13, source)} />
      <Divider flexItem />
      <StyledDoughnut data={dispatchmentData} dysPercentage={dispatchmentStats.dysPercentage} options={options} onSliceClick={(source) => navigateToWaybillControl(1, source)} />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          width: '100%',
        }}
      >
        <Typography
          variant="caption"
          align="center"
          sx={{
            pr: 1,
          }}
        >
          Son 7 Gün Baz Alınmaktadır.
        </Typography>
      </Box>
    </CustomBox>
  )
}

export default WaybillChartContainer
