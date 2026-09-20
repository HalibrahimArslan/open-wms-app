/**
 * Urunun marka isareti: solda bir tam raf bayi, sagda iki bolmeli goz.
 * Ustteki goz doludur, digerleri bostur; yani isaret "adreslenmis raf ve
 * icindeki birim" anlatir. Depo yonetiminin tarif ettigi sey tam olarak budur.
 *
 * Isaret marka adindan TURETILMEZ. Onceden altigen rozetin icine marka adinin
 * bas harfi yaziliyordu; urun beyaz etiketli calistigi icin bu her kurulumda
 * farkli bir harf demekti ve isaret sablondan cikmis gibi duruyordu. Ayrica
 * favicon'daki isaret (izometrik kup) ile uygulamadaki isaret (altigen +
 * harf) bambaska iki seydi. Artik tek bir isaret var ve her yerde ayni.
 *
 * Derinlik ikinci bir renkle degil ayni rengin opaklik basamaklariyla verilir;
 * boylece isaret tek renk baskida, kargo etiketinde ve faturada da bozulmaz.
 *
 * Renk temadan gelir: acik temada marka bordosu, koyu temada zemine karsi
 * okunur kalmasi icin acik kontrast rengi. `color` verilirse o kazanir.
 *
 * public/brand-mark.svg ve public/logo*.png ayni geometriyi tasir; burada
 * olculer degisirse onlar da guncellenmelidir.
 */
import { useTheme } from '@mui/material'

/** Ikincil parcalarin opakligi. 16 pikselde kaybolmayacak kadar koyu. */
const MUTED = 0.45

const BrandMark = ({ size = 40, color }) => {
  const theme = useTheme()
  const fill = color || (theme.palette.mode === 'dark' ? theme.palette.secondary.contrastText : theme.palette.primary.main)

  return (
    <svg width={size} height={size} viewBox="0 0 48 48" role="img" aria-hidden="true" focusable="false" style={{ display: 'block' }}>
      {/* Sol: tam boy raf bayi */}
      <rect x="5" y="5" width="16" height="38" rx="4" fill={fill} fillOpacity={MUTED} />
      {/* Sag ust: dolu goz */}
      <rect x="25" y="5" width="18" height="17" rx="4" fill={fill} />
      {/* Sag alt: bos goz */}
      <rect x="25" y="26" width="18" height="17" rx="4" fill={fill} fillOpacity={MUTED} />
    </svg>
  )
}

export default BrandMark
