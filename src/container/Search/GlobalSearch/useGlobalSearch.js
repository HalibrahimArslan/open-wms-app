import { useEffect, useRef, useState } from 'react'
import { useContainer } from 'unstated-next'
import useAuthHeader from '../../../hooks/useAuthHeader'
import useDebounce from '../../../hooks/useDebounce'
import useDepoCode from '../../../hooks/useDepoCode'
import { DataStore } from '../../../store/DataStore'
import { DepoContainer } from '../../../store/DepoContainer'
import { getOrderByOrderNo, getProductInfo } from '../../../services/MikroService'
import { getProductAddresses } from '../../../services/ProductAddressService'
import { getPalletBarcodeOrderDetail } from '../../../services/PalletBarcodeOrderRelService'
import { generatePayload, getTransferDepoCode } from '../../../utils/Utils'
import { detectSearchType, SearchType } from './detectSearchType'

const emptyState = { loading: false, error: null, type: null, data: null, detected: null }

export default function useGlobalSearch() {
  const headers = useAuthHeader()
  const depoCode = useDepoCode()
  const { account } = useContainer(DataStore)
  const { allDepoList } = useContainer(DepoContainer)

  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 350)
  const [state, setState] = useState(emptyState)
  const reqIdRef = useRef(0)

  const buildProductInfoPayload = (field, value) => ({
    stokKodu: '',
    stokAdi: '',
    barkod: '',
    barkodList: [''],
    depoNo: depoCode,
    [field]: value,
  })

  const fetchProductAddressesByQuery = async (queryValue) => {
    if (!queryValue || !account?.companyCode) return []
    const transferDepoCode = getTransferDepoCode(depoCode, allDepoList)
    const query = `companyCode.equals=${account.companyCode}&depoCode.equals=${transferDepoCode}&multiSearch.equals=${queryValue}&status.equals=true&size=500`
    const res = await getProductAddresses(headers, query)
    if (!Array.isArray(res)) return []
    return res
      .filter((q) => q.miktar > 0)
      .map((q) => ({
        ...q,
        barcode: q?.product?.id?.barkod ?? null,
        stokAdi: (q?.product?.stokAdi ?? '').trim(),
      }))
  }

  const runFetch = async (detected) => {
    if (detected.type === SearchType.SIPARIS) {
      const payload = generatePayload({
        depoNo: depoCode,
        evrakSeri: detected.evrakSeri,
        evrakSira: detected.evrakSira,
        sipTip: 0,
      })
      const res = await getOrderByOrderNo(payload)
      return { type: SearchType.SIPARIS, data: { order: Array.isArray(res) && res.length > 0 ? res[0] : null } }
    }

    if (detected.type === SearchType.PALET) {
      const res = await getPalletBarcodeOrderDetail(headers, detected.value)
      return { type: SearchType.PALET, data: { items: Array.isArray(res) ? res : [] } }
    }

    if (detected.type === SearchType.BARKOD) {
      const mikroRes = await getProductInfo(generatePayload(buildProductInfoPayload('barkod', detected.value)))
      const products = Array.isArray(mikroRes) ? mikroRes : []
      let addresses = []
      if (products.length > 0) {
        addresses = await fetchProductAddressesByQuery(products[0].barkod || detected.value)
      }
      return { type: SearchType.BARKOD, data: { products, addresses } }
    }

    if (detected.type === SearchType.STOK) {
      let products = []
      let mikroError = null
      try {
        const mikroRes = await getProductInfo(generatePayload(buildProductInfoPayload('stokKodu', detected.value)))
        products = Array.isArray(mikroRes) ? mikroRes : []
      } catch (e) {
        mikroError = e?.message || 'Stok detayı sorgulanamadı.'
      }
      let addresses = []
      if (products.length > 0 && products[0].barkod) {
        addresses = await fetchProductAddressesByQuery(products[0].barkod)
      }
      return { type: SearchType.STOK, data: { products, addresses, mikroError } }
    }

    if (detected.type === SearchType.ADRES) {
      const items = await fetchProductAddressesByQuery(detected.value)
      let mikroByBarcode = new Map()
      if (items.length > 0) {
        const barkodList = [...new Set(items.map((it) => it.barcode).filter(Boolean))]
        if (barkodList.length > 0) {
          const mikroRes = await getProductInfo(generatePayload({ stokKodu: '', stokAdi: '', barkod: '', barkodList, depoNo: depoCode }))
          if (Array.isArray(mikroRes)) {
            for (const row of mikroRes) {
              const bc = row?.barkod ?? row?.barcode
              if (bc != null && String(bc).trim() !== '') {
                mikroByBarcode.set(String(bc), (row?.stokAdi ?? '').trim())
              }
            }
          }
        }
      }
      return { type: SearchType.ADRES, data: { items, mikroByBarcode, address: detected.value } }
    }

    return null
  }

  useEffect(() => {
    if (!debouncedQuery) {
      setState(emptyState)
      return
    }
    const detected = detectSearchType(debouncedQuery)
    if (!detected) {
      setState(emptyState)
      return
    }
    if (detected.type === SearchType.INVALID || detected.type === SearchType.UNKNOWN) {
      setState({ loading: false, error: null, type: detected.type, data: null, detected })
      return
    }

    const reqId = ++reqIdRef.current
    setState({ loading: true, error: null, type: detected.type, data: null, detected })

    runFetch(detected)
      .then((result) => {
        if (reqId !== reqIdRef.current) return
        if (!result) {
          setState({ loading: false, error: null, type: detected.type, data: null, detected })
          return
        }
        setState({ loading: false, error: null, type: result.type, data: result.data, detected })
      })
      .catch((err) => {
        if (reqId !== reqIdRef.current) return
        setState({ loading: false, error: err?.message || 'Beklenmeyen bir hata oluştu', type: detected.type, data: null, detected })
      })
  }, [debouncedQuery, depoCode, account?.companyCode])

  const reset = () => {
    setQuery('')
    setState(emptyState)
    reqIdRef.current++
  }

  return { query, setQuery, reset, ...state }
}
