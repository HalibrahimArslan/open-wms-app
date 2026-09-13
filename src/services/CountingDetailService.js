import { getErrorMessage } from '../utils/Utils'

export async function getCountingDefinitionList(headers, query) {
  const response = await fetch(`/api/aur-sayim-tanims?${query}`, { headers })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const definitionList = await response.json()
  return definitionList
}

export async function getEnableCountingDetails(headers, urunAdresId, barcode, sayimTanimId, companyCode) {
  const response = await fetch(
    `/api/aur-sayim-uruns?aurSayimTanimId.equals=${sayimTanimId}&barkod.equals=${barcode}&status.specified=true&sayimUrunId.equals=${urunAdresId}&checkPartialItem.equals=true&companyCode.equals
=${companyCode}`,
    {
      headers: headers,
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const countingDetailList = await response.json()

  return countingDetailList
}

export async function saveCountingDetail(body) {
  const response = await fetch(`/api/aur-sayim-uruns`, body)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const newCountingDetail = await response.json()

  return newCountingDetail
}

export async function updateCountingDetail(id, body) {
  const response = await fetch(`/api/aur-sayim-uruns/${id}`, body)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const updatedDetails = await response.json()

  return updatedDetails
}

export async function getActiveAurSayimTanim(depoCode, headers) {
  const response = await fetch(`/api/aur-sayim-tanims?depoNo.equals=${depoCode}&sayimDurumu.equals=ACTIVE&status.equals=true`, {
    headers: headers,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const addressList = await response.json()

  return addressList
}

export async function getCountingDetailList(headers, query) {
  const response = await fetch(`/api/aur-sayim-uruns?${query}`, {
    headers: headers,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const sayimUrunList = await response.json()

  return sayimUrunList
}

export async function saveCountingDefinition(payload) {
  const response = await fetch('/api/aur-sayim-tanims', payload)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const sayimTanim = await response.json()

  return sayimTanim
}

export async function getCountingListCount(headers, sayimTanimId) {
  const response = await fetch(`/api/aur-sayim-uruns/count?aurSayimTanimId.equals=${sayimTanimId}`, { headers: headers })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const sayimTanim = await response.text()

  return sayimTanim
}

export async function getCountingResultList(headers, sayimTanimId) {
  const response = await fetch(`/api/aur-sayim-results/${sayimTanimId}`, {
    headers: headers,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const sayimTanim = await response.json()

  return sayimTanim
}

export async function getCountingDetailByStokKodAndBarcode(headers, tanimId, barcode, stokKod) {
  const response = await fetch(`/api/aur-sayim-uruns?aurSayimTanimId.equals=${tanimId}&barkod.equals=${barcode}&stokKod.equals=${stokKod}`, {
    headers: headers,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const sayimUrunList = await response.json()

  return sayimUrunList
}

export async function saveCountingDetailByPalletBarcode(headers, aurSayimTanimId, palletBarcode, urunAdresId) {
  const response = await fetch(`/api/aur-sayim-uruns-with-pallet-barcode/${aurSayimTanimId}/${palletBarcode}/${urunAdresId}`, {
    headers: headers,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  return 'success'
}

export async function getCountingReportById(headers, aurSayimTanimId) {
  const response = await fetch(`/api/counting-report/${aurSayimTanimId}`, {
    headers: headers,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }
  const reportList = await response.json()
  return reportList
}

export async function getCountingReportMicroById(headers, aurSayimTanimId) {
  const response = await fetch(`/api/counting-report-micro/${aurSayimTanimId}`, {
    headers: headers,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const reportList = await response.json()
  return reportList
}

export async function getComparativeCountingReport(headers, countingId, controllingId) {
  const response = await fetch(`/api/comparative-counting-report/${countingId}/${controllingId}`, {
    headers: headers,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const reportList = await response.json()
  return reportList
}

export async function getDistinctAddressList(headers, tanimId) {
  const response = await fetch(`/api/aur-sayim-address/${tanimId}`, {
    headers: headers,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const distinctAddressList = await response.json()

  return distinctAddressList
}
