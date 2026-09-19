import { useLocation, useNavigate } from 'react-router'
import { AuthContainer } from '../../store/AuthContainer'
import { useEffect } from 'react'

export default function Guard(props) {
  const nav = useNavigate()
  const loc = useLocation()
  const { auth, exp } = AuthContainer.useContainer()

  useEffect(() => {
    if (exp && exp < new Date()) {
      nav('/login')
    }
  }, [loc.pathname, exp, nav])

  if (!auth) {
    return null
  }

  return <div>{props.children}</div>
}
