import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import SearchBox from '../../../components/SearchBox'
import OrderSummaryCard from '../../../components/Card/OrderSummaryCard'
import OrderInformation from '../../../components/Order/OrderInformation'
import LoadingSpinner from '../../../components/Loading/LoadingSpinner'
import useSWR from 'swr'
import useAuthHeader from '../../../hooks/useAuthHeader'
import useDepoCode from '../../../hooks/useDepoCode'
import RepetableSkeleton from '../../../components/Loading/RepetableSkeleton'

function OrdersToBeDispatchedContainer() {
  const [searchParams] = useSearchParams()
  const [searchText, setSearchText] = useState('')
  const [filteredOrderList, setFilteredOrderList] = useState([])
  const headers = useAuthHeader()

  const navigate = useNavigate()
  let depoCode = useDepoCode()
  let { orderType } = useParams()

  const controlAddressId = searchParams.get('controlAddressId')

  const { data, isLoading } = useSWR([`/api/aur-done-order-user-tmp/${orderType}/${depoCode}/${controlAddressId}`, headers])

  const handleChangeSearch = (search) => {
    setSearchText(search)
  }

  const handleOrderClick = (orderInfo) => {
    navigate(`/d:${depoCode}/${orderType}/${orderInfo}/complete-dispatchment?controlAddressId=${controlAddressId}`)
  }

  useEffect(() => {
    if (!data) return
    if (searchText.length > 0) {
      const search = searchText.toLowerCase()
      setFilteredOrderList(
        data.filter((q) => {
          const byFirmName = q.firmName?.toLowerCase().includes(search)
          const byOrderNo = q.distinctOrderNoList?.some((no) => no?.toLowerCase().includes(search))
          const byStokKodu = q.aurTmpDetailList?.some((detail) => detail.stokKodu?.toLowerCase().includes(search))
          return byFirmName || byOrderNo || byStokKodu
        })
      )
    } else {
      setFilteredOrderList(data)
    }
  }, [searchText, data])

  if (isLoading) {
    return <RepetableSkeleton length={4} />
  }

  return (
    <Box>
      <SearchBox search={searchText} handleChangeSearch={handleChangeSearch} zIndex={true} />
      <Grid container justifyContent="center" direction="row" alignItems="center" spacing={2}>
        {filteredOrderList && filteredOrderList.length > 0 ? (
          filteredOrderList.map((order) => (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <OrderSummaryCard
                header={order.firmName[0]}
                subHeader={order.createdDate.slice(0, 10)}
                title={order.firmName}
                orderCount={order.aurTmpDetailList.length}
                orderDetails={[...new Set(order.aurTmpDetailList.map((q) => q.siparisNo))]}
                notCountingItem={order.aurTmpDetailList.filter((q) => q.observerAmount === 0).length}
                orderNo={order.orderInfo}
                handleClick={() => handleOrderClick(order.orderInfo)}
              />
            </Grid>
          ))
        ) : filteredOrderList && filteredOrderList.length === 0 ? (
          <OrderInformation />
        ) : (
          <LoadingSpinner />
        )}
      </Grid>
    </Box>
  )
}

export default OrdersToBeDispatchedContainer
