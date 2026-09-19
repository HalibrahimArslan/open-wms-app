import { AuthContainer } from '../store/AuthContainer'
import { SWRConfig } from 'swr'
import { Bounce, toast, Zoom } from 'react-toastify'
import ScrollToTop from '../shared/components/ScrollToTop'
import React from 'react'
import Header from './header/Header'
import './layout.css'
import Home from './home/Home'
import Sidebar from './sidebar/Sidebar'
import { useContainer } from 'unstated-next'
import { Box } from '@mui/material'

export const notify = (text) => {
  toast.success(text, {
    position: 'top-right',
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: 'colored',
    transition: Bounce,
  })
}

export const notifyError = (text) => {
  toast.error(text, {
    position: 'top-right',
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: 'colored',
    transition: Zoom,
  })
}

// SWR 2 dizi anahtarini ([url, headers]) fetcher'a tek arguman olarak verir.
export async function fetchWithToken([url, headers]) {
  const res = await fetch(url, { headers: headers })
  return res.json()
}

function Layout() {
  const { auth } = useContainer(AuthContainer)

  return (
    <React.Fragment>
      {auth && (
        <SWRConfig value={{ fetcher: fetchWithToken }}>
          <Box
            sx={{
              backgroundColor: (theme) => theme.palette.secondary.main,
              height: '100vh',
              overflow: 'hidden',
              display: 'flex',
            }}
          >
            <Header />
            <Sidebar />
            <Home />
            <ScrollToTop />
          </Box>
        </SWRConfig>
      )}
    </React.Fragment>
  )
}

export default Layout
