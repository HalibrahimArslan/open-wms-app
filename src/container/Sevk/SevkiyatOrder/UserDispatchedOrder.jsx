import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import useFetch from '../../../hooks/useFetch'
import Grid from '@mui/material/Grid'
import { useLocation, useNavigate } from 'react-router'
import LoadingSpinner from '../../../components/Loading/LoadingSpinner'
import OrderInformation from '../../../components/Order/OrderInformation'
import OrderSummaryCard from '../../../components/Card/OrderSummaryCard'
import SearchBox from '../../../components/SearchBox'
import { useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/system'
import useDepoCode from '../../../hooks/useDepoCode'
import { useContainer } from 'unstated-next'
import { DepoContainer } from '../../../store/DepoContainer'
import { getTransferDepoCode } from '../../../utils/Utils'
import Seo from '../../../shared/components/Seo'

function DispatchingOrder() {
  const navigate = useNavigate()
  const { allDepoList } = useContainer(DepoContainer)

  let depoCode = useDepoCode()
  const transferDepoCode = getTransferDepoCode(depoCode, allDepoList)

  const [searchText, setSearchText] = useState('')
  const [orders, setOrders] = useState([])
  const [data] = useFetch(transferDepoCode ? `/api/aur-tmp-detail/MSK/${transferDepoCode}` : null)

  useEffect(() => {
    if (searchText === '') {
      setOrders(data)
    } else {
      setOrders(data.filter((q) => q.firmName.toUpperCase().includes(searchText)))
    }
  }, [data, searchText])

  const handleOrderClick = (orderInfo) => {
    let type = 'MSK'
    navigate(`/d:${depoCode}/${type}/${orderInfo}/assigned-dispatchment`)
  }

  const handleChangeSearch = (search) => {
    setSearchText(search)
  }

  return (
    <>
      <Seo title={'Atamnmış Siparişler'} />
      <SearchBox search={searchText} handleChangeSearch={handleChangeSearch} />
      <Grid
        container
        spacing={2}
        sx={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {orders && orders.length > 0 ? (
          orders.map((order) => (
            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 4,
                lg: 3,
                xl: 2,
              }}
            >
              <OrderSummaryCard
                header={order.firmName[0]}
                title={order.firmName}
                subHeader={order.createdDate.slice(0, 10)}
                orderCount={order.aurTmpDetailList.length}
                orderDetails={[...new Set(order.aurTmpDetailList.map((item) => item.siparisNo))]}
                notCountingItem={order.aurTmpDetailList.filter((q) => q.teslimMiktar === 0).length}
                orderNo={order.orderInfo}
                handleClick={() => handleOrderClick(order.orderInfo, order.firmCode)}
              />
            </Grid>
          ))
        ) : orders && orders.length === 0 ? (
          <OrderInformation />
        ) : (
          <LoadingSpinner />
        )}
      </Grid>
    </>
  )
}

export default DispatchingOrder
