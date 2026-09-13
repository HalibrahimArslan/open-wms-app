export const SearchType = {
  SIPARIS: 'siparis',
  PALET: 'palet',
  BARKOD: 'barkod',
  STOK: 'stok',
  ADRES: 'adres',
  INVALID: 'invalid',
  UNKNOWN: 'unknown',
}

export const TypeLabel = {
  [SearchType.SIPARIS]: 'Sipariş',
  [SearchType.PALET]: 'Palet',
  [SearchType.BARKOD]: 'Barkod',
  [SearchType.STOK]: 'Stok Kodu',
  [SearchType.ADRES]: 'Adres',
  [SearchType.INVALID]: 'Geçersiz',
  [SearchType.UNKNOWN]: 'Tanımsız',
}

export function detectSearchType(input) {
  const v = String(input ?? '').trim()
  if (!v) return null

  if (v.includes('-')) {
    const dashIdx = v.lastIndexOf('-')
    const before = v.substring(0, dashIdx)
    const after = v.substring(dashIdx + 1)

    // Stok kodu with dash suffix (e.g., 14.11.012-A): before has at least 2 dots
    if (/^[\d.]+$/.test(before) && (before.match(/\./g) || []).length >= 2 && after) {
      return { type: SearchType.STOK, value: v }
    }

    const [seri, ...rest] = v.split('-')
    const sira = rest.join('-')
    if (seri && sira && /^\d+$/.test(sira)) {
      return { type: SearchType.SIPARIS, value: v, evrakSeri: seri, evrakSira: sira }
    }
    return { type: SearchType.INVALID, value: v, hint: 'Sipariş formatı: SERI-SIRA (örn. A-12345)' }
  }

  if (/^999999\d{7}$/.test(v)) {
    return { type: SearchType.PALET, value: v }
  }

  if (/^\d{13}$/.test(v)) {
    return { type: SearchType.BARKOD, value: v }
  }

  if (/^[\d.]+$/.test(v) && (v.match(/\./g) || []).length >= 2) {
    return { type: SearchType.STOK, value: v }
  }

  if (/^[A-Z0-9]{6}$/i.test(v)) {
    return { type: SearchType.ADRES, value: v.toUpperCase() }
  }

  return { type: SearchType.UNKNOWN, value: v }
}
