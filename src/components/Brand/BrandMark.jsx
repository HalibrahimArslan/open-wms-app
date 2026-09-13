import { useTheme } from '@mui/material'

/**
 * Urunun vektorel marka isareti: bir depo birimini (koli/palet) temsil eden
 * izometrik kup. Tek renkle calisir, sadece yuz opakliklari degisir; bu yuzden
 * favicon boyutunda da, kurumsal evrakta da bozulmadan kullanilabilir.
 *
 * Renk temadan gelir: acik temada marka rengi, koyu temada zemine karsi okunur
 * kalmasi icin acik kontrast rengi kullanilir. `color` verilirse o kazanir.
 */
const BrandMark = ({ size = 40, color }) => {
  const theme = useTheme()
  const fill = color || (theme.palette.mode === 'dark' ? theme.palette.secondary.contrastText : theme.palette.primary.main)

  return (
    <svg width={size} height={size} viewBox="0 0 48 48" role="img" aria-hidden="true" focusable="false" style={{ display: 'block' }}>
      {/* ust yuz */}
      <path d="M24 5 L41 15 L24 25 L7 15 Z" fill={fill} opacity="0.55" />
      {/* sol yuz */}
      <path d="M7 15 L24 25 L24 43 L7 33 Z" fill={fill} />
      {/* sag yuz */}
      <path d="M41 15 L41 33 L24 43 L24 25 Z" fill={fill} opacity="0.78" />
    </svg>
  )
}

export default BrandMark
