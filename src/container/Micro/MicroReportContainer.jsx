import useDepoCode from '../../hooks/useDepoCode'
import { useEffect, useState } from 'react'
import RepetableSkeleton from '../../components/Loading/RepetableSkeleton'
import NotFound from '../../shared/components/NotFound/NotFound'
import { Fade, Paper, Typography } from '@mui/material'
import useAuthHeader from '../../hooks/useAuthHeader'
import { getMetabaseUrl } from '../../services/MetabaseService'
import FitItem from '../../components/Layout/FitItem'
import ActionHeader from '../../shared/components/ActionHeader'
import { notifyError } from '../../layout/Layout'

function isNullOrUndefined(value) {
  return value === null || value === undefined
}

const MicroReportContainer = () => {
  const [iframeUrl, setIframeUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const headers = useAuthHeader()
  let depoCode = useDepoCode()
  const payload = {}

  const fetchMetabaseUrl = async () => {
    try {
      setLoading(true)
      const url = await getMetabaseUrl(headers, payload)
      setIframeUrl(url)
    } catch (error) {
      notifyError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMetabaseUrl()
  }, [])

  if (loading) {
    return <RepetableSkeleton length={4} />
  }

  if (isNullOrUndefined(iframeUrl)) {
    return <NotFound msg="Metabase url bulunamadı" />
  }

  return (
    <>
      <ActionHeader title="Metabase Raporları" hide={true} />
      <Fade in={iframeUrl && iframeUrl.length > 0 ? true : false}>
        <iframe src={iframeUrl} title="Metabase" style={{ height: `calc(100dvh - 200px)`, width: '100%', border: 'none' }} />
      </Fade>
    </>
  )
}

export default MicroReportContainer
