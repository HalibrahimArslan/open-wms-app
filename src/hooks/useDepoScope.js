import { useCallback } from 'react'
import { useContainer } from 'unstated-next'
import { DataStore } from '../store/DataStore'
import useDepoCode from './useDepoCode'

export default function useDepoScope() {
  const depoCode = useDepoCode()
  const { account } = useContainer(DataStore)
  const companyCode = account?.companyCode

  const withDepoScope = useCallback((values) => ({ ...values, depoCode: depoCode ?? null, companyCode }), [depoCode, companyCode])

  return { depoCode, companyCode, withDepoScope }
}
