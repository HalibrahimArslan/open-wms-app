import { useState } from 'react'
import { createContainer } from 'unstated-next'

export const useStore = () => {
  const [colorMode, setColorMode] = useState('light')

  const handleChangeMode = () => {
    setColorMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'))
  }

  return {
    colorMode,
    handleChangeMode,
  }
}

export const ThemeContainer = createContainer(useStore)
