export async function generateDocument(payload) {
  const response = await fetch(`/api/print`, payload)

  if (!response.ok) {
    throw new Error('Print servisinde hata meydana geldi.')
  }

  const blob = await response.blob()

  return new Promise((resolve, _) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.readAsDataURL(blob)
  })
}
