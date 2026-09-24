import { useState } from 'react'
import { notify, notifyError } from '../../layout/Layout'
import { saveMultipleFile } from '../../services/MinioService'
import { saveFeedback } from '../../services/FeedbackService'
import { generatePayload } from '../../utils/Utils'
import FeedbackForm from '../../components/Feedback/FeedbackForm'
import ExtendedDialog from '../../shared/components/Dialog/ExtendedDialog'
import usePersistedToken from '../../hooks/usePersistedToken'

const FeedbackContainer = ({ open, handleClose }) => {
  const [feedbackTitle, setFeedbackTitle] = useState('FEEDBACK')
  const [feedbackDescription, setFeedbackDescription] = useState('')
  const [descriptionError, setDescriptionError] = useState('')
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
    const description = feedbackDescription.trim()
    if (!description) {
      setDescriptionError('Açıklama zorunludur')
      return
    }
    if (description.length < 3) {
      setDescriptionError('Açıklama en az 3 karakter olmalıdır')
      return
    }
    fetchSaveFeedback()
  }

  const handleChange = (event, newFeedbackTitle) => {
    if (newFeedbackTitle) {
      setFeedbackTitle(newFeedbackTitle)
    }
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
        description: feedbackDescription.trim(),
        uploads: uploadedFiles,
      }
      const res = await saveFeedback(generatePayload(payload))
      res && notify('Destek talebiniz başarıyla alınmıştır. En kısa sürede dönüş yapılacaktır')
      setSelectedFiles([])
      setFeedbackDescription('')
      handleClose()
    } catch (e) {
      notifyError(e.message || e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ExtendedDialog
      open={open}
      handleClose={handleClose}
      fullWidth
      dialogHeader="Destek Talebi"
      dialogContent={
        <FeedbackForm
          feedbackTitle={feedbackTitle}
          loading={loading}
          handleChange={handleChange}
          handleSend={handleSend}
          feedbackDescription={feedbackDescription}
          descriptionError={descriptionError}
          handleChangeFeedback={(e) => {
            setFeedbackDescription(e.target.value)
            setDescriptionError('')
          }}
          file={selectedFiles}
          handleFileChange={handleFileChange}
          handleDelete={handleDelete}
        />
      }
    />
  )
}

export default FeedbackContainer
