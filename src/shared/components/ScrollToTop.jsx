import { Button } from '@mui/material'
import { useEffect, useState } from 'react'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'

export default function ScrollToTop() {
  const [showTopBtn, setShowTopBtn] = useState(false)

  useEffect(() => {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        setShowTopBtn(true)
      } else {
        setShowTopBtn(false)
      }
    })
  }, [])

  const handleMoveTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }

  return (
    <div>
      {showTopBtn && (
        <Button
          onClick={handleMoveTop}
          sx={{
            position: 'fixed',
            padding: '1rem 1rem',
            fontSize: '10px',
            bottom: '40px',
            right: '40px',
            textAlign: 'center',
            zIndex: '99',
          }}
          variant="contained"
        >
          <ArrowUpwardIcon />
        </Button>
      )}
    </div>
  )
}
