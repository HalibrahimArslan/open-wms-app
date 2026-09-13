import EmptyState from '../EmptyState/EmptyState'

/**
 * Geriye donuk uyumluluk icin duran ince sarmalayici: cagri yerleri msg/sx
 * prop'lariyla kullanmaya devam ediyor, gorunum ortak EmptyState'ten geliyor.
 */
export default function NotFound({ msg, sx }) {
  return <EmptyState title={msg} dense sx={sx} />
}
