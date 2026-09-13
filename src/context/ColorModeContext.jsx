import { createContext, useMemo, useState } from 'react'

export default function ToggleColorMode() {
  const [mode, setMode] = useState('light')
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'))
      },
    }),
    []
  )

  return {
    colorMode,
    mode,
  }
}

export const ColorModeContext = createContext(ToggleColorMode())
