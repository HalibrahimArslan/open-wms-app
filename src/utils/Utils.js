export default function groupBy(list, keyGetter) {
  const map = new Map()
  list.forEach((item) => {
    const key = keyGetter(item)
    const collection = map.get(key)
    if (!collection) {
      map.set(key, [item])
    } else {
      collection.push(item)
    }
  })
  return map
}

export const translateToEnglish = (word) => {
  let g = ''
  if (word && word.length > 0) {
    for (const harf of word) {
      g += harf.split('ı').join('i').split('İ').join('I').toLowerCase().replace('ğ', 'g').replace('ç', 'c').replace('ü', 'u').replace('ö', 'o').replace('ş', 's').toUpperCase()
    }
  }

  return g
}

function toArray(maybeJsonOrArray) {
  if (Array.isArray(maybeJsonOrArray)) return maybeJsonOrArray
  if (typeof maybeJsonOrArray === 'string' && maybeJsonOrArray.trim()) {
    try {
      return JSON.parse(maybeJsonOrArray)
    } catch {
      return []
    }
  }
  return []
}

export function getTransGroupCode(cariBaglantiTipi, list, selectedList) {
  if (cariBaglantiTipi !== '4') return ''
  const formattedList = toArray(list)
  if (!formattedList.length || !Array.isArray(selectedList) || !selectedList.length) return ''

  const key = String(selectedList[0])
  const match = formattedList.find((item) => String(item?.orderNo) === key)
  return match?.transGroupCode ?? ''
}

export function getTransGroupName(cariBaglantiTipi, firmName, list, selectedList) {
  if (cariBaglantiTipi !== '4') return firmName
  const formattedList = toArray(list)
  if (!formattedList.length || !Array.isArray(selectedList) || !selectedList.length) return firmName

  const key = String(selectedList[0])
  const match = formattedList.find((item) => String(item?.orderNo) === key)
  const name = match?.transGroupName
  if (!name) return firmName

  return firmName + '-' + translateToEnglish(String(name).replace(/\s/g, ''))
}

export function requestAddPalletBarcode(headers, aurOrderId, palletBarcodeId, palletBarcodeList) {
  let dto = {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({
      aurOrderId,
      palletBarcodeId,
      palletBarcodeList,
    }),
  }

  return dto
}

export const OrderSituation = [
  {
    id: 1,
    status: 'OPEN',
    description: 'Sipariş Açık',
  },
  {
    id: 2,
    status: 'IN_PROGRESS',
    description: 'Sipariş Hazırlanıyor',
  },
  {
    id: 3,
    status: 'OUT_PROGRESS',
    description: 'Sevk Aşamasında',
  },
  {
    id: 4,
    status: 'DONE',
    description: 'Sipariş Tamamlandı',
  },
  {
    id: 5,
    status: 'SUSPENDED',
    description: 'Sipariş Kapatıldı',
  },
]

export const irsaliyeTipi = [
  {
    id: 13,
    name: 'Giriş Irsaliye',
  },
  {
    id: 1,
    name: 'Çıkış Irsaliye',
  },
]

export function getErrorMessage(status, error) {
  if (status === 401) {
    localStorage.clear()
    if (window.location.pathname !== '/login') {
      window.location.href = '/login'
    }
    return error.title
  }
  if (status === 500) {
    return error.detail
  }
  if (status === 400) {
    if (error.fieldErrors) {
      let errorFields = JSON.stringify(error.fieldErrors)
      return errorFields
    }
    return error.detail || error.title
  }
  return error.title
}

export function generatePayload(body) {
  const token = localStorage.getItem('hwms_token')
  const requestOptions = {
    method: 'POST',
    headers: {
      Authorization: (token && 'Bearer ' + token) || '',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }
  return requestOptions
}

export function generateDeletePayload(body) {
  const token = localStorage.getItem('hwms_token')
  const requestOptions = {
    method: 'DELETE',
    headers: {
      Authorization: (token && 'Bearer ' + token) || '',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }
  return requestOptions
}

export function generatePatchPayload(body) {
  const token = localStorage.getItem('hwms_token')
  const requestOptions = {
    method: 'PATCH',
    headers: {
      Authorization: (token && 'Bearer ' + token) || '',
      'content-type': 'application/merge-patch+json',
    },
    body: JSON.stringify(body),
  }
  return requestOptions
}

export function getPreviousDate(previousDay) {
  let today = new Date()
  today.setDate(today.getDate() - previousDay)
  return today
}

export const FeedbackStatus = {
  CREATED: 'Açık',
  IN_PROGRESS: 'Devam Ediyor',
  COMPLETED: 'Tamamlandı',
  CANCELLED: 'İptal Edildi',
}

export const FeedbackTitle = {
  FEEDBACK: 'Geri Bildirim',
  ERROR: 'Hata',
}

export function modifyStatus(status) {
  if (status === 'CREATED') {
    return 'IN_PROGRESS'
  }
  if (status === 'IN_PROGRESS') {
    return 'COMPLETED'
  }

  throw new Error('Statü bulunamadı')
}

export const AddressFieldType = {
  HALL: 'Koridor',
  UNIT: 'Ünite',
  FLAT: 'Kat',
  ROOM: 'Oda',
}

export function enumToCustomList(enumObj) {
  return Object.entries(enumObj).map(([key, value]) => ({
    field: key,
    headerName: value,
    visible: true,
  }))
}

export function getTransferDepoCode(depoCode, depoList) {
  if (!depoCode || !depoList || depoList.length === 0) return ''

  const depo = depoList.find((item) => item.code === depoCode)
  return depo ? depo.transferCode : ''
}
