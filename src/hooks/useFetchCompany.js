import useSWR from 'swr'
import LoadingSpinner from '../components/Loading/LoadingSpinner'
import useAuthHeader from './useAuthHeader'

function useFetchCompany() {
  const headers = useAuthHeader()

  const { data, error, isLoading, mutate } = useSWR(['/api/users/company', headers])

  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>

  return (
    <>
      {isLoading ? (
        <>
          <LoadingSpinner />
        </>
      ) : (
        <div>{data}</div>
      )}
    </>
  )
}

export default useFetchCompany
