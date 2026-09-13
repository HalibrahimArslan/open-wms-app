import EmptyState from '../EmptyState/EmptyState'

/**
 * Onceki surum Tailwind sinif adlari kullaniyordu; projede Tailwind bulunmadigi
 * icin bilesen stilsiz basiliyordu. Artik ortak EmptyState'e baglandi.
 */
function GenericNotFound({ title, description }) {
  return <EmptyState title={title} description={description} />
}

export default GenericNotFound
