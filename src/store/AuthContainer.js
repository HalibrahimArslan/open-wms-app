import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { createContainer } from 'unstated-next'

const publicPaths = ['/login', '/forget-password', '/reset-password']

export function isPublicPath(path) {
  return publicPaths.some((publicPath) => path.startsWith(publicPath))
}

export const useStore = () => {
  const [auth, setAuth] = useState(false)
  const [token, setToken] = useState('')
  const [exp, setExp] = useState(null)
  const nav = useNavigate()

  function getExp(token) {
    var base64Url = token.split('.')[1]
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    var jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        })
        .join('')
    )
    return JSON.parse(jsonPayload)['exp']
  }

  useEffect(() => {
    if (isPublicPath(window.location.pathname)) {
      return
    }
    const tokenData = localStorage.getItem('hwms_token')
    if (tokenData) {
      setExp(new Date(getExp(tokenData) * 1000))
      setToken(tokenData)
      setAuth(true)
    }
    if (!tokenData) {
      nav('/login')
    }
  }, [])

  const handleToken = (index) => {
    setToken(index)
  }

  const handleAuth = (index) => {
    setAuth(index)
  }

  const clearExp = () => {
    setExp('')
  }

  return {
    auth,
    handleAuth,
    token,
    exp,
    handleToken,
    clearExp,
  }
}

export const AuthContainer = createContainer(useStore)
