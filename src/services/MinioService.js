export async function saveMultipleFile(payload) {
  const response = await fetch('/api/multiple-file-upload', payload)
  if (!response.ok) {
    const error = await response.text()
    throw new Error(error)
  }

  const uplodedFiles = await response.json()

  return uplodedFiles
}
