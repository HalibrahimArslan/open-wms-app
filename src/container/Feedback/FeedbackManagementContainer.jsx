import { useEffect, useMemo, useState } from 'react'
import { useContainer } from 'unstated-next'
import { DataStore } from '../../store/DataStore'
import { getPreviousDate, modifyStatus } from '../../utils/Utils'
import useAuthHeader from '../../hooks/useAuthHeader'
import { getFeedbacks, updateFeedback } from '../../services/FeedbackService'
import { notify, notifyError } from '../../layout/Layout'
import { Box, CircularProgress, Collapse } from '@mui/material'
import SupportAgentIcon from '@mui/icons-material/SupportAgent'
import FeedbackFilterContainer from './FeedbackFilterContainer'
import FeedbackStatusBlock from '../../components/Card/FeedbackStatusBlock'
import ActionHeader from '../../shared/components/ActionHeader'
import FilterToggleButton from '../../shared/components/FilterToggleButton'
import EmptyState from '../../shared/components/EmptyState/EmptyState'
import { produce } from 'immer'

const STATUS_ORDER = ['CREATED', 'IN_PROGRESS', 'COMPLETED']

/**
 * Pano yuksekligi.
 *
 * Yuzde tabanli yukseklik burada cozulmuyor: panoyu saran Itemv2 yalnizca
 * minHeight tanimliyor, yani yuksekligi icerige bagli. Bu yuzden gorunur
 * alandan hesaplanir. Sayi bir kez verilir; baslik ve filtre panelinin payi
 * flex ile dagitilir. Onceden iki ayri sabit vardi (250 ve 185) ve
 * aralarindaki secim her zaman ayni tarafa dusen bir kosula bagliydi.
 */
const BOARD_HEIGHT = 'calc(100dvh - 150px)'

function FeedbackManagementContainer() {
  const [feedbacks, setFeedbacks] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [checkedFilter, setCheckedFilter] = useState([])
  const [startDate, setStartDate] = useState(getPreviousDate(30))
  const [endDate, setEndDate] = useState(new Date())
  const headers = useAuthHeader()

  const { account } = useContainer(DataStore)
  const authorities = account?.authorities

  let query = useMemo(() => {
    let query = ''
    if (startDate != null) {
      query = query + `createdDate.greaterThanOrEqual=${startDate?.toISOString()}&`
    }
    if (endDate != null) {
      query = query + `createdDate.lessThanOrEqual=${endDate?.toISOString()}&`
    }
    if (checkedFilter.length > 0) {
      query = query + `title.in=${checkedFilter.join(',')}&`
    }
    query = query + 'sort=id,desc'
    return query
  }, [startDate, endDate, checkedFilter])

  const fetchFeedbacks = async () => {
    try {
      setLoading(true)
      let scopedQuery = query
      if (!authorities?.includes('ROLE_ADMIN')) {
        scopedQuery = `${scopedQuery}&createdBy.equals=${account?.login}`
      }
      const res = await getFeedbacks(headers, scopedQuery)
      setFeedbacks(Array.isArray(res) ? res : [])
    } catch (error) {
      notifyError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleStartDate = (date) => {
    setStartDate(date)
  }

  const handleEndDate = (date) => {
    setEndDate(date)
  }

  const handleForward = async (id, status) => {
    try {
      let desiredStatus = modifyStatus(status)
      const updatePayload = {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify({
          id,
          status: desiredStatus,
        }),
      }

      const res = await updateFeedback(updatePayload)
      res && notify('Güncelleme Başarılı')
      setFeedbacks(
        produce((draft) => {
          let searchFeedback = draft.find((feedback) => feedback.id === id)
          if (searchFeedback) {
            searchFeedback.status = desiredStatus
          }
        })
      )
    } catch (e) {
      notifyError(e.message)
    } finally {
    }
  }

  useEffect(() => {
    fetchFeedbacks()
  }, [query])

  const renderBoard = () => {
    if (loading) {
      return (
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      )
    }

    if (feedbacks.length === 0) {
      return (
        <EmptyState
          icon={<SupportAgentIcon />}
          title="Geri bildirim yok"
          description="Seçili tarih aralığında kayıt bulunamadı. Filtreleri genişleterek tekrar deneyebilirsiniz."
          sx={{ flexGrow: 1, justifyContent: 'center' }}
        />
      )
    }

    return (
      <Box sx={{ flexGrow: 1, minHeight: 0, display: 'flex', gap: 2, overflowX: 'auto', paddingBottom: 0.5 }}>
        {STATUS_ORDER.map((status) => (
          <FeedbackStatusBlock key={status} status={status} feedbacks={feedbacks.filter((feedback) => feedback.status === status)} handleForward={handleForward} />
        ))}
      </Box>
    )
  }

  // Itemv2 paneli icerigi ortaliyor (textAlign: center); kart metinleri ve
  // sutun basliklari sola yaslansin diye asagida geri alinir.
  return (
    <Box sx={{ height: BOARD_HEIGHT, minHeight: 420, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
      <Box sx={{ flexShrink: 0 }}>
        <ActionHeader title={'Geri Bildirimler'} hide={true} actions={<FilterToggleButton open={filtersOpen} onToggle={() => setFiltersOpen((prev) => !prev)} />} />
        <Collapse in={filtersOpen} timeout="auto" unmountOnExit>
          <Box sx={{ paddingBottom: 2 }}>
            <FeedbackFilterContainer
              checkedFilter={checkedFilter}
              setCheckedFilter={setCheckedFilter}
              startDate={startDate}
              handleStartDate={handleStartDate}
              endDate={endDate}
              handleEndDate={handleEndDate}
            />
          </Box>
        </Collapse>
      </Box>

      {renderBoard()}
    </Box>
  )
}

export default FeedbackManagementContainer
