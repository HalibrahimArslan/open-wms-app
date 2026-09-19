import React, { Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter } from 'react-router'
import { ThemeContainer } from './store/ThemeContainer'
import { CircularProgress } from '@mui/material'

const root = createRoot(document.getElementById('root'))

root.render(
  <BrowserRouter>
    <ThemeContainer.Provider>
      <Suspense fallback={<CircularProgress />}>
        <App />
      </Suspense>
    </ThemeContainer.Provider>
  </BrowserRouter>
)
