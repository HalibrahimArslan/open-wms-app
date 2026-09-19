import { useCallback, useEffect, useState } from 'react'
import { Box, Dialog, IconButton, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ZoomInIcon from '@mui/icons-material/ZoomIn'
import ZoomOutIcon from '@mui/icons-material/ZoomOut'

/**
 * Tam ekran gorsel goruntuleyici.
 *
 * Onceden yet-another-react-lightbox paketi kullaniliyordu; goruntuleyici
 * uygulamanin kendi tema token'larini kullansin ve ayri bir CSS dosyasi
 * yuklenmesin diye MUI Dialog uzerine tasindi.
 *
 * slides: [{ src, caption }]
 */
export default function ImageViewer({ open, onClose, slides = [], startIndex = 0 }) {
  const [index, setIndex] = useState(startIndex)
  const [zoomed, setZoomed] = useState(false)

  const count = slides.length
  const slide = slides[index]

  // Her acilista ilk gorsele ve normal boyuta don.
  useEffect(() => {
    if (open) {
      setIndex(startIndex)
      setZoomed(false)
    }
  }, [open, startIndex])

  const go = useCallback(
    (step) => {
      if (count < 2) return
      setZoomed(false)
      setIndex((prev) => (prev + step + count) % count)
    },
    [count]
  )

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowRight') go(1)
    if (event.key === 'ArrowLeft') go(-1)
  }

  if (!slide) return null

  return (
    <Dialog
      open={open}
      onClose={onClose}
      onKeyDown={handleKeyDown}
      fullScreen
      slotProps={{
        paper: {
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.92)',
            backgroundImage: 'none',
            border: 'none',
          },
        },
      }}
    >
      <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 1, zIndex: 1 }}>
        <IconButton onClick={() => setZoomed((prev) => !prev)} aria-label={zoomed ? 'Uzaklaştır' : 'Yakınlaştır'} sx={{ color: 'common.white' }}>
          {zoomed ? <ZoomOutIcon /> : <ZoomInIcon />}
        </IconButton>
        <IconButton onClick={onClose} aria-label="Kapat" sx={{ color: 'common.white' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {count > 1 && (
        <IconButton onClick={() => go(-1)} aria-label="Önceki görsel" sx={{ position: 'absolute', left: 8, top: '50%', color: 'common.white' }}>
          <ChevronLeftIcon fontSize="large" />
        </IconButton>
      )}

      <Box
        sx={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: zoomed ? 'auto' : 'hidden',
          p: 2,
        }}
      >
        <Box
          component="img"
          src={slide.src}
          alt={slide.caption || ''}
          onClick={() => setZoomed((prev) => !prev)}
          sx={{
            maxWidth: zoomed ? 'none' : '100%',
            maxHeight: zoomed ? 'none' : '100%',
            width: zoomed ? '180%' : 'auto',
            objectFit: 'contain',
            cursor: zoomed ? 'zoom-out' : 'zoom-in',
          }}
        />
      </Box>

      {count > 1 && (
        <IconButton onClick={() => go(1)} aria-label="Sonraki görsel" sx={{ position: 'absolute', right: 8, top: '50%', color: 'common.white' }}>
          <ChevronRightIcon fontSize="large" />
        </IconButton>
      )}

      {(slide.caption || count > 1) && (
        <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, p: 2, textAlign: 'center' }}>
          {slide.caption && (
            <Typography variant="body2" sx={{ color: 'common.white' }}>
              {slide.caption}
            </Typography>
          )}
          {count > 1 && (
            <Typography variant="caption" sx={{ color: 'grey.400' }}>
              {index + 1} / {count}
            </Typography>
          )}
        </Box>
      )}
    </Dialog>
  )
}
