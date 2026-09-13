function Download(arrayBuffer, type, fileName) {
  var blob = new Blob([arrayBuffer], { type: type })
  const a = document.createElement('a')
  a.href = window.URL.createObjectURL(blob)
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

export async function generatePdf(headers, aurOrderId) {
  const response = await fetch(`/api/generate-pdf/${aurOrderId}`, {
    headers: headers,
  })
  if (!response.ok) {
    const message = `An error has occured: ${response.status}`
    throw new Error(message)
  }
  const menuList = await response.arrayBuffer()
  const fileName = ''.concat(aurOrderId).concat(new Date().getFullYear())
  Download(menuList, 'application/pdf', fileName)

  return 'success'
}
