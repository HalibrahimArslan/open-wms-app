import { useEffect, useMemo, useState } from 'react'
import { useContainer } from 'unstated-next'
import { DataStore } from '../../store/DataStore'
import { FeedbackTitle, getPreviousDate, modifyStatus } from '../../utils/Utils'
import useAuthHeader from '../../hooks/useAuthHeader'
import { getFeedbacks, updateFeedback } from '../../services/FeedbackService'
import { notify, notifyError } from '../../layout/Layout'
import { Box, CircularProgress, Collapse, IconButton, Tooltip } from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'
import SupportAgentIcon from '@mui/icons-material/SupportAgent'
import FeedbackFilterContainer from './FeedbackFilterContainer'
import FeedbackStatusBlock from '../../components/Card/FeedbackStatusBlock'
import ActionHeader from '../../shared/components/ActionHeader'
import FilterToggleButton from '../../shared/components/FilterToggleButton'
import EmptyState from '../../shared/components/EmptyState/EmptyState'
import { produce } from 'immer'

const STATUS_ORDER = ['CREATED', 'IN_PROGRESS', 'COMPLETED']

const canMove = (fromStatus, toStatus) => STATUS_ORDER.indexOf(toStatus) > STATUS_ORDER.indexOf(fromStatus)

const isValidDate = (date) => date instanceof Date && !Number.isNaN(date.getTime())

const atTime = (date, hours, minutes, seconds, ms) => {
  const result = new Date(date)
  result.setHours(hours, minutes, seconds, ms)
  return result
}

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
  const [refreshing, setRefreshing] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [draggedFeedback, setDraggedFeedback] = useState(null)
  const [checkedFilter, setCheckedFilter] = useState([])
  const [startDate, setStartDate] = useState(getPreviousDate(30))
  const [endDate, setEndDate] = useState(new Date())
  const headers = useAuthHeader()

  const { account } = useContainer(DataStore)
  const authorities = account?.authorities

  let query = useMemo(() => {
    let query = ''
    if (isValidDate(startDate)) {
      query = query + `createdDate.greaterThanOrEqual=${atTime(startDate, 0, 0, 0, 0).toISOString()}&`
    }
    if (isValidDate(endDate)) {
      query = query + `createdDate.lessThanOrEqual=${atTime(endDate, 23, 59, 59, 999).toISOString()}&`
    }
    if (checkedFilter.length > 0) {
      query = query + `title.in=${checkedFilter.join(',')}&`
    }
    query = query + 'sort=id,desc'
    return query
  }, [startDate, endDate, checkedFilter])

  const fetchFeedbacks = async ({ silent = false } = {}) => {
    const setBusy = silent ? setRefreshing : setLoading
    try {
      setBusy(true)
      let scopedQuery = query
      if (!authorities?.includes('ROLE_ADMIN')) {
        scopedQuery = `${scopedQuery}&createdBy.equals=${account?.login}`
      }
      const res = await getFeedbacks(headers, scopedQuery)
      setFeedbacks(Array.isArray(res) ? res : [])
    } catch (error) {
      notifyError(error.message)
    } finally {
      setBusy(false)
    }
  }

  const handleStartDate = (date) => {
    setStartDate(date)
  }

  const handleEndDate = (date) => {
    setEndDate(date)
  }

  const setFeedbackStatus = (id, status) => {
    setFeedbacks(
      produce((draft) => {
        const searchFeedback = draft.find((feedback) => feedback.id === id)
        if (searchFeedback) {
          searchFeedback.status = status
        }
      })
    )
  }

  const handleMove = async (id, fromStatus, toStatus) => {
    if (!canMove(fromStatus, toStatus)) return
    setFeedbackStatus(id, toStatus)
    try {
      const res = await updateFeedback({
        method: 'PUT',
        headers: headers,
        body: JSON.stringify({ id, status: toStatus }),
      })
      res && notify('Güncelleme Başarılı')
    } catch (e) {
      setFeedbackStatus(id, fromStatus)
      notifyError(e.message)
    }
  }

  const handleForward = (id, status) => handleMove(id, status, modifyStatus(status))

  const handleDrop = (status) => {
    if (draggedFeedback) {
      handleMove(draggedFeedback.id, draggedFeedback.status, status)
    }
  }

  useEffect(() => {
    if (!account?.login) return
    fetchFeedbacks()
  }, [query, account?.login])

  const filterSummary = [
    isValidDate(startDate) || isValidDate(endDate)
      ? `${isValidDate(startDate) ? startDate.toLocaleDateString('tr-TR') : '…'} – ${isValidDate(endDate) ? endDate.toLocaleDateString('tr-TR') : '…'}`
      : 'Tüm tarihler',
    checkedFilter.length > 0 ? checkedFilter.map((title) => FeedbackTitle[title] ?? title).join(', ') : 'Tüm tipler',
    loading ? null : `${feedbacks.length} talep`,
  ]
    .filter(Boolean)
    .join(' · ')

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
          <FeedbackStatusBlock
            key={status}
            status={status}
            feedbacks={feedbacks.filter((feedback) => feedback.status === status)}
            handleForward={handleForward}
            isDragging={draggedFeedback != null}
            canDrop={draggedFeedback != null && canMove(draggedFeedback.status, status)}
            draggedId={draggedFeedback?.id}
            onDragStartFeedback={setDraggedFeedback}
            onDragEndFeedback={() => setDraggedFeedback(null)}
            onDropFeedback={() => handleDrop(status)}
          />
        ))}
      </Box>
    )
  }

  // Itemv2 paneli icerigi ortaliyor (textAlign: center); kart metinleri ve
  // sutun basliklari sola yaslansin diye asagida geri alinir.
  return (
    <Box sx={{ height: BOARD_HEIGHT, minHeight: 420, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
      <Box sx={{ flexShrink: 0 }}>
        <ActionHeader
          title={'Geri Bildirimler'}
          subtitle={filterSummary}
          hide={true}
          actions={
            <>
              <Tooltip title="Yenile">
                <span>
                  <IconButton size="small" onClick={() => fetchFeedbacks({ silent: true })} disabled={loading || refreshing} aria-label="Yenile">
                    {refreshing ? <CircularProgress size={20} /> : <RefreshIcon />}
                  </IconButton>
                </span>
              </Tooltip>
              <FilterToggleButton open={filtersOpen} onToggle={() => setFiltersOpen((prev) => !prev)} />
            </>
          }
        />
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
