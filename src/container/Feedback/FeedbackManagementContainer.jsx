import { useEffect, useMemo, useState } from 'react'
import { useContainer } from 'unstated-next'
import { DataStore } from '../../store/DataStore'
import { getPreviousDate, modifyStatus } from '../../utils/Utils'
import useAuthHeader from '../../hooks/useAuthHeader'
import { getFeedbacks, updateFeedback } from '../../services/FeedbackService'
import { notify, notifyError } from '../../layout/Layout'
import { Box } from '@mui/material'
import FeedbackFilterContainer from './FeedbackFilterContainer'
import FeedbackStatusBlock from '../../components/Card/FeedbackStatusBlock'
import { produce } from 'immer'

function FeedbackManagementContainer() {
  const [feedbacks, setFeedbacks] = useState([])
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
      if (!authorities?.includes('ROLE_ADMIN')) {
        query = query + `&createdBy.equals=${account?.login}`
      }
      const res = await getFeedbacks(headers, query)
      setFeedbacks(res)
    } catch (error) {
      notifyError(error.message)
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

  const renderFeedbackStatusCards = () => {
    const statusTypes = ['CREATED', 'IN_PROGRESS', 'COMPLETED']
    return statusTypes.map((status, index) => (
      <FeedbackStatusBlock
        key={index}
        status={status}
        feedbacks={feedbacks.filter((feedback) => feedback.status === status)}
        handleForward={handleForward}
        hasFilter={checkedFilter.length > 0 || startDate != null || endDate != null}
      />
    ))
  }

  return (
    <Box display={'flex'} flexDirection={'column'} gap={0.5}>
      <FeedbackFilterContainer
        checkedFilter={checkedFilter}
        setCheckedFilter={setCheckedFilter}
        startDate={startDate}
        handleStartDate={handleStartDate}
        endDate={endDate}
        handleEndDate={handleEndDate}
      />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          gap: 2,
          overflowX: 'auto',
        }}
      >
        {renderFeedbackStatusCards()}
      </Box>
    </Box>
  )
}

export default FeedbackManagementContainer
