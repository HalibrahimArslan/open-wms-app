import Done from '../../assets/images/cards/done.png'
import EmptyState from '../../shared/components/EmptyState/EmptyState'

/**
 * Sevkiyat ekranlarinin bos durumu. Eskiden kendi Avatar + Typography
 * duzenini kuruyordu ve metni buyuk harfle basiyordu; artik gorunum ortak
 * EmptyState'ten geliyor, cizim de image prop'u ile korunuyor.
 */
export default function OrderInformation({ src, info }) {
  return <EmptyState image={src || Done} imageAlt="" title={info || 'Herhangi bir sipariş kaydı bulunamadı'} />
}
