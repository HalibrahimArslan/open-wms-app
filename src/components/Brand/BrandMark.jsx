import { useTheme } from '@mui/material'

/**
 * Urunun vektorel marka isareti: raf gozlerine yerlesmis kolileri temsil eden
 * notr bir depo simgesi. Renkleri temadan aldigi icin acik/koyu modda ve
 * musteri temasi degistiginde ayrica bir gorsel uretmek gerekmez.
 */
const BrandMark = ({ size = 40 }) => {
  const theme = useTheme()

  return (
    <svg width={size} height={size} viewBox="0 0 48 48" role="img" aria-hidden="true" focusable="false">
      <rect width="48" height="48" rx="11" fill={theme.palette.primary.main} />
      <g fill={theme.palette.primary.contrastText}>
        <rect x="9" y="10" width="2.4" height="28" rx="1.2" opacity="0.45" />
        <rect x="36.6" y="10" width="2.4" height="28" rx="1.2" opacity="0.45" />
        <rect x="9" y="21.4" width="30" height="2.4" rx="1.2" opacity="0.9" />
        <rect x="9" y="32.6" width="30" height="2.4" rx="1.2" opacity="0.9" />
        <rect x="13" y="13.4" width="9" height="8" rx="1.4" />
        <rect x="24.5" y="15.4" width="10.5" height="6" rx="1.4" opacity="0.7" />
        <rect x="13" y="26.6" width="7" height="6" rx="1.4" opacity="0.7" />
        <rect x="22.5" y="24.6" width="12.5" height="8" rx="1.4" />
      </g>
    </svg>
  )
}

export default BrandMark
