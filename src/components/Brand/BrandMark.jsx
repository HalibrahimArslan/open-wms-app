import { useTheme } from '@mui/material'
import BRAND from '../../config/brand'

/**
 * Urunun vektorel marka isareti: altigen rozet icinde marka adinin monogrami.
 * Urun beyaz etiketli oldugu icin isaret marka adindan turetilir; kurulum
 * adini degistirdiginde harf de kendiliginden degisir.
 *
 * Tek renkle calisir, sadece rozet dolgusunun opakligi degisir; bu yuzden
 * favicon boyutunda da, kurumsal evrakta da bozulmadan kullanilabilir.
 *
 * Renk temadan gelir: acik temada marka rengi, koyu temada zemine karsi okunur
 * kalmasi icin acik kontrast rengi kullanilir. `color` verilirse o kazanir.
 */
const BrandMark = ({ size = 40, color }) => {
  const theme = useTheme()
  const fill = color || (theme.palette.mode === 'dark' ? theme.palette.secondary.contrastText : theme.palette.primary.main)

  // Turkce yerel ayar: "istif" gibi adlarda bas harf "I" degil "İ" olmali.
  const monogram = (BRAND.name || '').trim().charAt(0).toLocaleUpperCase('tr-TR') || 'W'

  return (
    <svg width={size} height={size} viewBox="0 0 48 48" role="img" aria-hidden="true" focusable="false" style={{ display: 'block' }}>
      <path d="M24 2.5 L42.5 13 L42.5 35 L24 45.5 L5.5 35 L5.5 13 Z" fill={fill} fillOpacity="0.14" stroke={fill} strokeWidth="2.75" strokeLinejoin="round" />
      <text x="24" y="24" fill={fill} fontSize="20" fontWeight="700" letterSpacing="0.5" textAnchor="middle" dominantBaseline="central" fontFamily="inherit">
        {monogram}
      </text>
    </svg>
  )
}

export default BrandMark
