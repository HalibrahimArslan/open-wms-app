import { useContext, useEffect, useState } from 'react'
import useAuthHeader from '../../../../hooks/useAuthHeader'
import { getNonCountableSayimTransaction, getNonCountableSayimTransactionCount } from '../../../../services/OrderPickingTransactionService'
import NonCountableData from './NonCountableData'
import { CountingContext } from '../../../../context/CountingContext'

export default function NonCountableBarcodeContainer() {
  const { selectedCountingId, addresses } = useContext(CountingContext)

  const headers = useAuthHeader()
  const [list, setList] = useState()
  const [page, setPage] = useState(0)
  const [count, setCount] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const fetchCountingListData = async (selectedCountingId) => {
    const res = await getNonCountableSayimTransactionCount(headers, selectedCountingId, 'NONE_COUNTABLE_ITEM')
    res && setCount(parseInt(res))
  }

  const fetchAllSayimUrunData = async (selectedCountingId, page, size) => {
    const res = await getNonCountableSayimTransaction(headers, selectedCountingId, page, size, 'NONE_COUNTABLE_ITEM')
    res && setList(res)
  }

  useEffect(() => {
    fetchAllSayimUrunData(selectedCountingId, page, rowsPerPage)
    fetchCountingListData(selectedCountingId)
  }, [page, rowsPerPage, selectedCountingId])

  return (
    <>
      {list && (
        <NonCountableData
          list={list}
          page={page}
          handleChangePage={handleChangePage}
          rowsPerPage={rowsPerPage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          count={count}
          addresses={addresses}
        />
      )}
    </>
  )
}
