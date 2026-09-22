import { useState, useEffect } from 'react'
import { AuthContainer } from '../store/AuthContainer'
import { useLocation } from 'react-router'

const useFetch = (url) => {
  const location = useLocation()
  const [data, setData] = useState(null)
  const tokenString = AuthContainer.useContainer().token
  const requestOptions = {
    headers: {
      Authorization: 'Bearer ' + tokenString,
    },
  }

  useEffect(() => {
    // Adres henuz hazir degilse (orn. depo kodu yuklenmediyse) istek atilmaz.
    if (!url) return
    fetch(url, requestOptions)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => data !== null && setData(data))
  }, [url, location])

  return [data]
}

export default useFetch
