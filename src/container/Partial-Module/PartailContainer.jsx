import React, { useEffect, useState } from 'react'
import { Fab, Grid } from '@mui/material'
import useDebounce from '../../hooks/useDebounce'
import {
  getPartialItemDetailsById,
  getPartialItemList,
  partialUpdateAurPartialItem,
  transferPartialItemFromMicro,
  updatePartialItemFromMicro,
} from '../../services/PartialItemService'
import useAuthHeader from '../../hooks/useAuthHeader'
import NotFound from '../../shared/components/NotFound/NotFound'
import { generatePatchPayload, generatePayload } from '../../utils/Utils'
import SearchBox from '../../components/SearchBox'
import FitItem from '../../components/Layout/FitItem'
import useIsMobile from '../../hooks/useIsMobile'
import { notify, notifyError } from '../../layout/Layout'
import PartialDetailContainer from './PartialDetailContainer'
import UpdateIcon from '@mui/icons-material/Update'
import { produce } from 'immer'
import PartialItemContainer from './PartialItemContainer'

const PartailContainer = () => {
  const headers = useAuthHeader()
  const isMobile = useIsMobile()

  const [partialItemList, setPartialItemList] = useState([])
  const [search, setSearch] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)
  const [loading, setLoading] = useState(false)
  const [childLoading, setChildLoading] = useState(false)
  const [partialDetailList, setPartialDetailList] = useState([])

  const debouncedSearch = useDebounce(search)

  const fetchPartialItemFromMicro = async () => {
    try {
      setLoading(true)
      const res = await transferPartialItemFromMicro(headers, search)
      res &&
        setPartialItemList(
          produce((draft) => {
            let searchPartialItem = draft.find((item) => item.id === res.id)
            if (searchPartialItem) {
              searchPartialItem.status = res.status
              searchPartialItem.packageCode = res.packageCode
              searchPartialItem.packageName = res.packageName
              searchPartialItem.packageBarcode = res.packageBarcode
            }
          })
        )
      res &&
        setPartialDetailList([
          {
            id: res.id,
            packageCode: res.packageCode,
            packageName: res.packageName,
            packageBarcode: res.packageBarcode,
            packageDetail: res.aurPartialDetails.map((item) => ({
              id: item.id,
              stockCode: item.stockCode,
              stockName: item.stockName,
              barcode: item.barcode,
              quantity: item.quantity,
            })),
          },
        ])
      res && setSearch('')
      notify("ERP'den Aktarım Başarılı")
    } catch (error) {
      notifyError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchPartialItemList = async () => {
    try {
      setLoading(true)
      let query = `size=${100}&page=${0}`
      const response = await getPartialItemList(headers, query)
      response && setSearch('')
      setPartialItemList(response)
    } catch (error) {
      notifyError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchUpdatePartialItem = async (id, status) => {
    try {
      setChildLoading(true)
      let payload = {
        id,
        status,
      }
      const res = await partialUpdateAurPartialItem(id, generatePatchPayload(payload))
      res &&
        setPartialItemList(
          produce((draft) => {
            let searchPartialItem = draft.find((item) => item.id === res.id)
            if (searchPartialItem) {
              searchPartialItem.status = res.status
            }
          })
        )
      res && setSelectedItem({ ...selectedItem, status: res.status })
    } catch (error) {
      notifyError(error.message)
    } finally {
      setChildLoading(false)
    }
  }

  const fetchUpdatePartialItemFromMicro = async (id) => {
    try {
      setChildLoading(true)
      const res = await updatePartialItemFromMicro(headers, id)
      res &&
        setPartialItemList(
          produce((draft) => {
            let searchPartialItem = draft.find((item) => item.id === res.id)
            if (searchPartialItem) {
              searchPartialItem.status = res.status
              searchPartialItem.packageCode = res.packageCode
              searchPartialItem.packageName = res.packageName
              searchPartialItem.packageBarcode = res.packageBarcode
            }
          })
        )
      res &&
        setPartialDetailList(
          produce((draft) => {
            let packageDetail = draft.find((item) => item.id === res.id).packageDetail
            let partialDetails = res.aurPartialDetails
            packageDetail.forEach((packageItem) => {
              let partialItem = partialDetails.find((partialItem) => partialItem.id === packageItem.id)
              if (partialItem) {
                packageItem.quantity = partialItem.quantity
                packageItem.stockCode = partialItem.stockCode
                packageItem.stockName = partialItem.stockName
                packageItem.barcode = partialItem.barcode
              }
            })
          })
        )
    } catch (error) {
      notifyError(error.message)
    } finally {
      setChildLoading(false)
    }
  }

  const getPartialDetails = async (item) => {
    try {
      setChildLoading(true)
      setSelectedItem(item)
      const response = await getPartialItemDetailsById(generatePayload([item.id]))
      response && setPartialDetailList(response)
    } catch (error) {
      notifyError(error)
    } finally {
      setChildLoading(false)
    }
  }

  const fetchPartialItemListWithQuery = async (search) => {
    try {
      setLoading(true)
      let query = `packageCode.contains=${search}`
      const response = await getPartialItemList(headers, query)
      response && setPartialItemList(response)
    } catch (error) {
      notifyError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPartialItemListWithQuery(debouncedSearch)
  }, [debouncedSearch])

  useEffect(() => {
    setSelectedItem(null)
    fetchPartialItemList()
  }, [])

  const handleUpdate = (id) => {
    fetchUpdatePartialItemFromMicro(id)
  }

  const handleUpdateStatus = (id, status) => {
    fetchUpdatePartialItem(id, status)
  }

  const handleChangeFilter = (search) => {
    setSearch(search)
  }

  const handleTransferFromMicro = () => {
    fetchPartialItemFromMicro()
  }

  if (isMobile) {
    return <NotFound msg="Mobil cihazlarda kullanılamaz. Talep Geçiniz" />
  }

  return (
    <Grid container spacing={1}>
      <Grid
        size={4}
        sx={{
          position: 'relative',
        }}
      >
        <FitItem>
          <SearchBox search={search} handleChangeSearch={handleChangeFilter} zIndex={true} top={5} searchLabel={'Stok Kodu Giriniz'} />
          <PartialItemContainer
            loading={loading}
            search={search}
            partialItemList={partialItemList}
            handleTransferFromMicro={handleTransferFromMicro}
            getPartialDetails={getPartialDetails}
          />
        </FitItem>
      </Grid>
      <Grid
        size={8}
        sx={{
          position: 'relative',
        }}
      >
        <FitItem>
          <PartialDetailContainer selectedPartialItem={selectedItem} partialDetailList={partialDetailList} childLoading={childLoading} handleUpdateStatus={handleUpdateStatus} />
        </FitItem>
        {selectedItem && (
          <Fab sx={{ position: 'absolute', right: 10, bottom: 10 }} onClick={() => handleUpdate(selectedItem.id)} color="primary">
            <UpdateIcon />
          </Fab>
        )}
      </Grid>
    </Grid>
  )
}

export default PartailContainer
