export async function saveMultipleFile(payload) {
  const response = await fetch('/api/multiple-file-upload', payload)
  if (!response.ok) {
    if (response.status === 403) {
      throw new Error('Dosya yükleme yetkiniz bulunmuyor')
    }
    if (response.status === 413) {
      throw new Error('Dosya boyutu çok büyük')
    }
    throw new Error('Dosya yüklenemedi')
  }

  const uplodedFiles = await response.json()

  return uplodedFiles
}

export async function downloadFile(headers, fileName) {
  const response = await fetch(`/api/download/${encodeURIComponent(fileName)}`, { headers })
  if (!response.ok) {
    if (response.status === 403) {
      throw new Error('Bu eki görüntüleme yetkiniz bulunmuyor')
    }
    throw new Error('Ek yüklenemedi')
  }
  return response.blob()
}
