import useAuthHeader from './useAuthHeader'
import useSWR from 'swr'

export default function useOrderDetailById(id) {
  const headers = useAuthHeader()
  const { data, error, isLoading } = useSWR([`/api/aur-tmp-detail/${id}`, headers])

  return {
    orderDetail: data,
    isLoading,
    isError: error,
  }
}
