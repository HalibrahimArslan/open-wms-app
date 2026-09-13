import { useState, useEffect } from 'react'
import { AuthContainer } from '../store/AuthContainer'
import { useLocation } from 'react-router-dom'

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
    fetch(url, requestOptions)
      .then((res) => res.json())
      .then((data) => setData(data))
  }, [url, location])

  return [data]
}

export default useFetch
