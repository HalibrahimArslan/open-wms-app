import { useEffect, useState } from 'react'
import { createContainer } from 'unstated-next'

const STORAGE_KEY = 'wms-color-mode'

/**
 * Secilen tema tarayicida saklanir; aksi halde her sayfa yenilemesinde acik
 * temaya donuluyordu. localStorage gizli sekmede ya da site verileri kapaliyken
 * hata firlatabildigi icin okuma ve yazma try/catch icindedir.
 */
const readStoredMode = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === 'dark' || stored === 'light' ? stored : 'light'
  } catch {
    return 'light'
  }
}

export const useStore = () => {
  const [colorMode, setColorMode] = useState(readStoredMode)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, colorMode)
    } catch {
      // Tema yine de bu oturum boyunca calisir, saklanamamasi engel degil.
    }
  }, [colorMode])

  const handleChangeMode = () => {
    setColorMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'))
  }

  return {
    colorMode,
    handleChangeMode,
  }
}

export const ThemeContainer = createContainer(useStore)
