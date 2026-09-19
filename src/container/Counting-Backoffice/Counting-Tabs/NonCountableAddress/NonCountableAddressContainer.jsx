import { useContext, useEffect, useState } from 'react'
import {
  deleteCountingAddressException,
  getCountingAddressExceptionList,
  getCountOfCountingAddressExceptions,
  saveCountingAddressExceptionList,
} from '../../../../services/CountingAddressExceptionService'
import useAuthHeader from '../../../../hooks/useAuthHeader'
import { notify, notifyError } from '../../../../layout/Layout'
import { Button, Card, CardActionArea, CardContent, CircularProgress, Divider, Grid, IconButton, Skeleton, Typography, useTheme } from '@mui/material'
import { DeleteForeverOutlined } from '@mui/icons-material'
import CheckedListItem from '../../../../components/List/CheckedListItem'
import { getAddressList } from '../../../../services/AdressService'
import useDepoCode from '../../../../hooks/useDepoCode'
import { generatePayload } from '../../../../utils/Utils'
import AurPagination from '../../../../components/Table/AurPagination'
import useDebounce from '../../../../hooks/useDebounce'
import SwipeableDrawerWrapper, { SwipeableDrawerHeader } from '../../../../shared/components/Slider/SwipeableDrawerWrapper'
import { CountingContext } from '../../../../context/CountingContext'

const rowsPerPageList = [5, 25, 50]

const NonCountableAddressContainer = () => {
  const { selectedCountingId } = useContext(CountingContext)
  const headers = useAuthHeader()
  const theme = useTheme()
  const [page, setPage] = useState(0)
  const [count, setCount] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [addressList, setAddressList] = useState([])
  const [addressExceptionList, setAddressExceptionList] = useState([])
  const [checkedList, setCheckedList] = useState([])
  const [loading, setLoading] = useState(false)
  const [addressLoading, setAddressLoading] = useState(false)
  const [addressSearch, setAddressSearch] = useState('')
  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  })
  const depoCode = useDepoCode()
  const debouncedSearch = useDebounce(addressSearch)

  const handleDecrease = () => {
    setPage((prevPage) => prevPage - 1)
  }

  const handleIncrease = () => {
    setPage((prevPage) => prevPage + 1)
  }

  const toggleDrawer = (anchor, open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return
    }

    setState({ ...state, [anchor]: open })
  }

  const handleCheckedList = (newCheckedList) => {
    setCheckedList(newCheckedList)
  }

  const fetchCountingAddressExceptionList = async () => {
    try {
      setLoading(true)
      const response = await getCountingAddressExceptionList(headers, `countingDefinitionId.equals=${selectedCountingId}&page=${page}&size=${rowsPerPage}`)
      const count = await getCountOfCountingAddressExceptions(headers, `countingDefinitionId.equals=${selectedCountingId}`)
      count && setCount(count)
      response && setAddressExceptionList(response)
    } catch (error) {
      notifyError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchDeleteOne = async (id) => {
    try {
      await deleteCountingAddressException(headers, id)
      setAddressExceptionList(addressExceptionList.filter((item) => item.id !== id))
      setCount((prevCount) => prevCount - 1)
      notify('Adres sayımdan çıkarıldı')
    } catch (error) {
      notifyError(error.message)
    }
  }

  const fetchAddressList = async (addressSearch) => {
    try {
      setAddressLoading(true)
      let query = `depoNo.equals=${depoCode}&page=0&size=100&sort=adres,asc`
      if (addressSearch.length > 0) {
        query += `&adres.contains=${addressSearch}`
      }
      const response = await getAddressList(headers, query)
      response && setAddressList(response)
    } catch (error) {
      notifyError(error.message)
    } finally {
      setAddressLoading(false)
    }
  }

  const fetchSaveCountingAddressExceptionList = async () => {
    try {
      let payload = checkedList.map((item) => {
        return {
          countingDefinitionId: selectedCountingId,
          addressId: item,
          status: true,
        }
      })
      const res = await saveCountingAddressExceptionList(generatePayload(payload))
      res && setAddressExceptionList([...addressExceptionList, ...res])
      res && notify('Adresler listeye eklendi')
    } catch (error) {
      notifyError(error.message)
    }
  }

  const handleDelete = (id) => {
    fetchDeleteOne(id)
  }

  useEffect(() => {
    fetchCountingAddressExceptionList()
  }, [selectedCountingId, page, rowsPerPage, state.bottom])

  useEffect(() => {
    fetchAddressList(debouncedSearch)
  }, [debouncedSearch])

  if (loading) {
    return <CircularProgress />
  }

  return (
    <>
      <Grid container spacing={2}>
        <Grid size={12}>
          <AurPagination
            defaultValue={5}
            rowsPerPage={rowsPerPage}
            rowsPerPageList={rowsPerPageList}
            handleChange={(event) => {
              setRowsPerPage(event.target.value)
            }}
            page={page + 1}
            handleIncrease={handleIncrease}
            handleDecrease={handleDecrease}
            count={count}
          />
        </Grid>
        <Grid sx={{ display: 'flex', justifyContent: 'flex-end' }} size={12}>
          <Button sx={{ boxShadow: 0, borderRadius: 20 }} onClick={() => setState({ ...state, bottom: true })} variant="contained">
            Adres Ekle
          </Button>
        </Grid>
        {addressExceptionList.map((addressException) => (
          <Grid
            key={addressException.id}
            size={{
              xs: 6,
              sm: 4,
              md: 4,
              lg: 3,
              xl: 2,
            }}
          >
            <Card sx={{ boxShadow: theme.shadows[0], bgcolor: theme.palette.action.hover, border: 1, borderColor: theme.palette.primary.main + '2A' }}>
              <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                <Typography variant="h5" component="h2">
                  {addressException.address.adres}
                </Typography>
                <IconButton size="small" color="primary" onClick={() => handleDelete(addressException.id)}>
                  <DeleteForeverOutlined />
                </IconButton>
              </CardContent>
              <CardActionArea sx={{ display: 'flex', justifyContent: 'space-around', borderTop: `1px ${theme.palette.primary.dark} solid` }}>
                <Typography color="textSecondary">{addressException.address.bolum}</Typography>
                <Divider orientation="vertical" flexItem />
                <Typography color="textSecondary">{addressException.address.unite}</Typography>
                <Divider orientation="vertical" flexItem />
                <Typography color="textSecondary">{addressException.address.kat}</Typography>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
      <SwipeableDrawerWrapper anchor={'bottom'} state={state} toggleDrawer={toggleDrawer}>
        <SwipeableDrawerHeader
          title={'Adres Ekleme'}
          searchable={true}
          search={addressSearch}
          handleChangeSearch={(newSearch) => setAddressSearch(newSearch)}
          buttonLabel={'Adres Ekle'}
          handleOperate={() => fetchSaveCountingAddressExceptionList()}
        />
        {addressLoading ? (
          <Skeleton variant="rectangular" height={300} />
        ) : (
          <CheckedListItem
            data={addressList}
            checkedList={checkedList}
            handleCheckedList={handleCheckedList}
            displayField={'adres'}
            keyField={'urunAdresId'}
            multiple
            maxWidth={'100%'}
          />
        )}
      </SwipeableDrawerWrapper>
    </>
  )
}
export default NonCountableAddressContainer
