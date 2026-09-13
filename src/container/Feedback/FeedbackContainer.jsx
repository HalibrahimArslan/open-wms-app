import { Box, Modal, useMediaQuery } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useState } from 'react'
import { notify, notifyError } from '../../layout/Layout'
import { saveMultipleFile } from '../../services/MinioService'
import { saveFeedback } from '../../services/FeedbackService'
import { generatePayload } from '../../utils/Utils'
import FeedbackForm from '../../components/Feedback/FeedbackForm'
import AurTabs from '../../components/Tabs/AurTabs'
import usePersistedToken from '../../hooks/usePersistedToken'

const StyledBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: useMediaQuery(theme.breakpoints.down('lg')) ? '90%' : '40%',
  background: '#f2f2f2',
  borderRadius: theme.shape.borderRadius,
}))

const FeedbackContainer = ({ open, handleClose }) => {
  const [feedbackTitle, setFeedbackTitle] = useState('FEEDBACK')
  const [feedbackDescription, setFeedbackDescription] = useState('')
  const [selectedFiles, setSelectedFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const token = usePersistedToken()

  const handleFileChange = (e) => {
    if (e.target.files) {
      setSelectedFiles([...selectedFiles, ...Array.from(e.target.files)])
    }
  }

  const handleDelete = (fileName) => {
    const newFiles = selectedFiles.filter((file) => file.name !== fileName)
    setSelectedFiles(newFiles)
  }

  const handleSend = () => {
    if (feedbackDescription.length < 3) {
      notifyError('Açıklama kısmını doldurunuz')
      return
    }
    fetchSaveFeedback()
  }

  const handleChange = (event, newFeedbackTitle) => {
    setFeedbackTitle(newFeedbackTitle)
  }

  const fetchSaveFeedback = async () => {
    try {
      setLoading(true)
      let uploadedFiles = []
      const formData = new FormData()
      selectedFiles.forEach((file) => {
        formData.append('files', file)
      })

      let fileUpload = {
        method: 'POST',
        headers: {
          Authorization: token ? 'Bearer ' + token : '',
        },
        body: formData,
      }

      if (selectedFiles.length !== 0) {
        uploadedFiles = await saveMultipleFile(fileUpload)
      }

      const payload = {
        id: null,
        title: feedbackTitle,
        status: 'CREATED',
        description: feedbackDescription,
        uploads: uploadedFiles,
      }
      const res = await saveFeedback(generatePayload(payload))
      res && notify('Destek talebiniz başarıyla alınmıştır. En kısa sürede dönüş yapılacaktır')
      setSelectedFiles([])
      setFeedbackDescription('')
    } catch (e) {
      notifyError(e.message || e)
    } finally {
      setLoading(false)
    }
  }
  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <StyledBox>
        <AurTabs
          section={[
            {
              label: 'Destek',
              value: '1',
            },
          ]}
          sectionPanel={[
            {
              label: 'Destek',
              value: '1',
              component: (
                <FeedbackForm
                  feedbackTitle={feedbackTitle}
                  loading={loading}
                  handleChange={handleChange}
                  handleSend={handleSend}
                  feedbackDescription={feedbackDescription}
                  handleChangeFeedback={(e) => setFeedbackDescription(e.target.value)}
                  file={selectedFiles}
                  handleFileChange={handleFileChange}
                  handleClose={handleClose}
                  handleDelete={handleDelete}
                />
              ),
            },
          ]}
          scrollButtonEnable={false}
        />
      </StyledBox>
    </Modal>
  )
}

export default FeedbackContainer
