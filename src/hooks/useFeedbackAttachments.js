import { useEffect, useState } from 'react'
import useAuthHeader from './useAuthHeader'
import { downloadFile } from '../services/MinioService'

const IMAGE_EXTENSIONS = /\.(png|jpe?g|gif|webp|bmp|svg)$/i

const toAttachment = (upload) => {
  const fileName = decodeURIComponent(upload.url.split('/').pop())
  return {
    id: upload.id,
    fileName,
    name: fileName.replace(/^\d+-/, ''),
    isImage: IMAGE_EXTENSIONS.test(fileName),
    src: null,
    error: null,
  }
}

export default function useFeedbackAttachments(uploads) {
  const headers = useAuthHeader()
  const [attachments, setAttachments] = useState([])

  useEffect(() => {
    const items = (uploads || []).map(toAttachment)
    setAttachments(items)

    let active = true
    const objectUrls = []
    const patch = (index, values) => active && setAttachments((prev) => prev.map((item, i) => (i === index ? { ...item, ...values } : item)))

    items.forEach((item, index) => {
      downloadFile(headers, item.fileName)
        .then((blob) => {
          const src = URL.createObjectURL(blob)
          objectUrls.push(src)
          patch(index, { src })
        })
        .catch((error) => patch(index, { error: error.message }))
    })

    return () => {
      active = false
      objectUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [uploads, headers])

  return attachments
}
