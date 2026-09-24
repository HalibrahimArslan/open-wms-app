import { useMemo } from 'react'
import { useLocation } from 'react-router'

const MISSING_DEPO_CODES = ['', 'undefined', 'null']

export default function useDepoCode() {
  const location = useLocation()

  const depoCode = useMemo(() => {
    let depo = location.pathname.split('/').filter((todo) => todo.includes('d:'))
    if (depo.length > 0 && !MISSING_DEPO_CODES.includes(depo[0].slice(2))) {
      return depo[0].slice(2)
    }
  }, [location])

  return depoCode
}
