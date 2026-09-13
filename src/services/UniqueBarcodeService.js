import { getErrorMessage } from '../utils/Utils'

// POST /api/unique-barcodes/bulk -> body array; adet kadar tekil barkod üretir, List<UniqueBarcodeResponseDTO> döner
export async function createUniqueBarcodes(payload) {
  const response = await fetch('/api/unique-barcodes/bulk', payload)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  return response.json()
}

// GET /api/unique-barcodes?uniqueBarcode=... -> okutulan tekil barkodun quantity/status/stokKodu bilgisini döner.
// Sipariş toplama öncesi çağrılır (bkz. doküman AC-7); response array dönerse ilk elemana indirgenir.
export async function getUniqueBarcodeByCode(headers, uniqueBarcode) {
  const response = await fetch(`/api/unique-barcodes?barcode.equals=${uniqueBarcode}`, {
    headers: headers,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const data = await response.json()
  return Array.isArray(data) ? data[0] : data
}
