import { Box, Button, Checkbox, Chip, Paper, TablePagination, useMediaQuery, useTheme } from '@mui/material'
import useAuthHeader from '../../hooks/useAuthHeader'
import useDepoCode from '../../hooks/useDepoCode'
import { useContainer } from 'unstated-next'
import { DataStore } from '../../store/DataStore'
import { AddressFieldType, enumToCustomList, generatePatchPayload, generatePayload, getTransferDepoCode } from '../../utils/Utils'
import { useSearchParams } from 'react-router'
import { notify, notifyError } from '../../layout/Layout'
import { useEffect, useMemo, useRef, useState } from 'react'
import useSWR from 'swr'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteIcon from '@mui/icons-material/Delete'
import { createAddressBulk, deleteAddress, updateBulkUrunAdres, getCountAddresses, updateUrunAdres } from '../../services/AdressService'
import { getAddressDepartments, getAddressFlats, getAddressHalls, getAddressRooms, getAddressTypes, getAddressUnits } from '../../services/AddressComponentService'
import NotFound from '../../shared/components/NotFound/NotFound'
import DynamicTable from '../../shared/components/Table/DynamicTable'
import ExtendedDialog from '../../shared/components/Dialog/ExtendedDialog'
import AddressCreateContainer from './AddressCreateContainer'
import AddressForm from '../../components/Form/AddressForm'
import AddressBulkUpdateContainer from './AddressBulkUpdateContainer'
import useDebounce from '../../hooks/useDebounce'
import BooleanFilter from '../../components/Filter/BooleanFilter'
import AddressFilterContainer from './AddressFilterContainer'
import AddIcon from '@mui/icons-material/Add'
import { produce } from 'immer'
import { DepoContainer } from '../../store/DepoContainer'
export default function AddressContainer() {
  const depoCode = useDepoCode()
  const { allDepoList } = useContainer(DepoContainer)
  const headers = useAuthHeader()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
  const { account } = useContainer(DataStore)
  const transferDepoCode = getTransferDepoCode(depoCode, allDepoList)

  let gridHeight = isMobile ? 'calc(100dvh)' : 'calc(100dvh - 550px)'

  const [open, setOpen] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [count, setCount] = useState(0)
  const [selectedAddress, setSelectedAddress] = useState({})
  const [createDialog, setCreateDialog] = useState(false)
  const [addressModel, setAddressModel] = useState(enumToCustomList(AddressFieldType))
  const [componentsLoading, setComponentsLoading] = useState(false)
  const [modifiedData, setModifiedData] = useState([])
  const [bulkUpdateResponse, setBulkUpdateResponse] = useState({})
  const [components, setComponents] = useState({
    departments: [],
    halls: [],
    units: [],
    flats: [],
    rooms: [],
    addressTypes: [],
  })
  const [dialogUpdate, setDialogUpdate] = useState(false)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)

  let query = useMemo(() => {
    let parameters = `${searchParams.toString()}&page=${page}&size=${rowsPerPage}&depoNo.equals=${transferDepoCode}&companyCode.equals=${account?.companyCode}&sort=adres,asc`
    if (debouncedSearch) {
      parameters += `&adres.contains=${debouncedSearch}`
    }
    return parameters
  }, [searchParams, page, rowsPerPage, debouncedSearch, depoCode, account?.companyCode])

  const { data, error, isLoading, mutate } = useSWR([`/api/address-list?${query}`, headers])

  const prevData = useRef([])
  const firstUpdate = useRef(true)

  const hasRole = (account) => {
    if (account.includes('ROLE_ADMIN')) {
      return false
    } else if (!account || !Array.isArray(account)) {
      return true
    }
    return true
  }

  const getAddressTypeDescription = (code) => {
    let searchAddressType = components.addressTypes.find((type) => type.code === code)
    return searchAddressType ? searchAddressType.description : ''
  }

  const handleChangeSearch = (value) => {
    setSearch(value)
  }

  const handleChangeColumn = (field, value) => {
    if (firstUpdate.current) {
      prevData.current = data
      firstUpdate.current = false
    }
    let editableField = columns.find((column) => column.field === field)
    if (!editableField) {
      return
    }
    let newData = data.map((item) => {
      return { ...item, [field]: value }
    })

    setModifiedData(newData)
    mutate(newData, false)
  }

  const columns = [
    {
      field: 'urunAdresId',
      headerName: 'id',
      visible: false,
      fallbackField: 'id',
    },
    {
      field: 'adresTipi',
      headerName: 'Adres Tipi',
      visible: false,
      render: (value, row) => getAddressTypeDescription(row.adresTipi),
    },
    {
      field: 'adres',
      headerName: 'Adres',
      visible: true,
    },
    {
      field: 'geciciAdres',
      headerName: 'Geçici Adres',
      visible: true,
      type: 'boolean',
      render: (value, row) => <Checkbox checked={value} disabled sx={{ color: value ? 'success.main' : 'action.disabled' }} />,
    },
    {
      field: 'toplamaGozu',
      headerName: 'Toplama Gözü',
      visible: true,
      type: 'boolean',
      render: (value, row) => <Checkbox checked={value} disabled sx={{ color: value ? 'success.main' : 'action.disabled' }} />,
    },
    {
      field: 'kontrolAdres',
      headerName: 'Kontrol Adres',
      visible: true,
      type: 'boolean',
      render: (value, row) => <Checkbox checked={value} disabled sx={{ color: value ? 'success.main' : 'action.disabled' }} />,
    },
    {
      field: 'status',
      headerName: 'Aktif',
      visible: true,
      type: 'boolean',
      render: (value, row) => <Checkbox checked={value} disabled sx={{ color: value ? 'success.main' : 'action.disabled' }} />,
    },
    {
      field: 'countable',
      headerName: 'Sayım Aktif',
      visible: true,
      type: 'boolean',
      render: (value, row) => <Checkbox checked={value} disabled sx={{ color: value ? 'success.main' : 'action.disabled' }} />,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Aksiyonlar',
      visible: true,
      hide: hasRole(account?.authorities || []),
      getActions: (row) => [
        {
          id: row.urunAdresId,
          name: 'Düzenle',
          onClick: (row) => {
            handleModify(row)
          },
          icon: <EditOutlinedIcon />,
        },
        // {
        //   id: row.urunAdresId,
        //   name: 'Sil',
        //   onClick: (row) => {
        //     handleDelete(row.urunAdresId)
        //   },
        //   icon: <DeleteIcon />,
        // },
      ],
    },
  ]

  const handleCreateAddress = (values) => {
    let selectedAddressType = components.addressTypes.find((addressType) => addressType.id === values.addressType)
    if (selectedAddressType) {
      fetchCreateAddressBulk(
        generatePayload({
          ...values,
          addressType: selectedAddressType,
          companyCode: account?.companyCode,
          warehouseCode: depoCode,
        })
      )
    }
  }

  const handleDelete = (id) => {
    fetchDeleteAddress(id)
  }

  const handleModify = (address) => {
    setSelectedAddress(address)
    setOpen(true)
  }

  const handleOpenCreateDialog = () => {
    setCreateDialog(true)
    fetchComponents()
  }

  const handleCloseCreateDialog = () => {
    setCreateDialog(false)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
    setOpen(false)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleUpdateAddressBulk = async () => {
    try {
      const response = await updateBulkUrunAdres(generatePatchPayload(modifiedData))
      if (response) {
        notify('İşlem Sonucuna Dikkat Ediniz !!!', 'warning')
        mutate(
          produce((draft) => {
            response.successList.forEach((modifiedAddress) => {
              const index = draft.findIndex((address) => address.urunAdresId === modifiedAddress.urunAdresId)
              if (index !== -1) {
                draft[index] = modifiedAddress
              }
            })
          }),
          false
        )
        setBulkUpdateResponse(response)
        setModifiedData([])
      }
    } catch (error) {
      notifyError(error)
    }
  }

  const handleUpdateAddress = async (modifiedAddress) => {
    try {
      const response = await updateUrunAdres(
        generatePatchPayload({
          urunAdresId: modifiedAddress.urunAdresId,
          geciciAdres: modifiedAddress.geciciAdres,
          toplamaGozu: modifiedAddress.toplamaGozu,
          kontrolAdres: modifiedAddress.kontrolAdres,
          countable: modifiedAddress.countable,
        }),
        modifiedAddress.urunAdresId
      )

      response && notify('Güncelleme Tamamlandı')
      mutate(
        produce((draft) => {
          const modifiedAddress = draft.find((t) => t.urunAdresId === response.urunAdresId)
          if (modifiedAddress) {
            modifiedAddress.geciciAdres = response.geciciAdres
            modifiedAddress.toplamaGozu = response.toplamaGozu
            modifiedAddress.kontrolAdres = response.kontrolAdres
            modifiedAddress.countable = response.countable
          }
        })
      )
    } catch (error) {
      notifyError(error.message)
    }
  }

  const getCountList = async () => {
    try {
      const response = await getCountAddresses(headers, query)
      setCount(response)
    } catch (error) {
      notifyError(error)
    }
  }

  const fetchCreateAddressBulk = async (payload) => {
    try {
      const res = await createAddressBulk(payload)
      res && handleCloseCreateDialog()
    } catch (error) {
      notifyError(error)
    }
  }

  const fetchDeleteAddress = async (id) => {
    try {
      await deleteAddress(id, headers)

      data &&
        mutate(
          produce((draft) => {
            const index = draft.findIndex((address) => address.urunAdresId === id)
            if (index !== -1) {
              draft.splice(index, 1)
            }
          }),
          false
        )
    } catch (error) {
      notifyError(error)
    }
  }

  /**
   * Adres bilesenlerini (bolum, koridor, unite, kat, oda, adres tipi) yukler.
   *
   * Eskiden sekmeye girilir girilmez calisiyordu, yani adres olusturmayacak
   * kullanici icin de alti istek atiliyordu. Artik yalnizca olusturma diyalogu
   * acilinca cagriliyor.
   *
   * Istekler birbirinden bagimsiz oldugu icin sirayla degil paralel atiliyor;
   * sirali hali diyalogun acilisini alti gidis-donus kadar bekletiyordu.
   */
  const fetchComponents = async () => {
    if (!account?.companyCode || !depoCode) {
      return
    }
    try {
      setComponentsLoading(true)
      const [departments, halls, units, flats, rooms, addressTypes] = await Promise.all([
        getAddressDepartments(headers, account.companyCode, depoCode),
        getAddressHalls(headers, account.companyCode, depoCode),
        getAddressUnits(headers, account.companyCode, depoCode),
        getAddressFlats(headers, account.companyCode, depoCode),
        getAddressRooms(headers, account.companyCode, depoCode),
        getAddressTypes(headers, account.companyCode, depoCode),
      ])

      setComponents({ departments, halls, units, flats, rooms, addressTypes })
    } catch (error) {
      notifyError(error)
    } finally {
      setComponentsLoading(false)
    }
  }

  useEffect(() => {
    getCountList()
  }, [query])

  if (error) {
    return <NotFound msg={error.toString()} />
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(1),
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <AddressFilterContainer />
        <Button startIcon={<AddIcon />} variant="contained" onClick={handleOpenCreateDialog} sx={{ whiteSpace: 'nowrap', flexShrink: 0 }}>
          Adres Ekle
        </Button>
      </Box>
      <Box
        sx={{
          display: 'flex',
          gap: 1,
        }}
      >
        <Chip
          label="Değişiklikleri Kaydet"
          variant="filled"
          color="primary"
          onDelete={() => {
            setModifiedData([])
            mutate(prevData.current, false)
          }}
          onClick={() => {
            setDialogUpdate(true)
            handleUpdateAddressBulk()
          }}
          sx={{ display: modifiedData.length > 0 ? 'flex' : 'none' }}
        />
      </Box>
      <Paper>
        <DynamicTable
          data={data}
          columns={columns}
          loading={isLoading}
          handleChangeColumn={handleChangeColumn}
          tableSx={{ height: gridHeight }}
          search={search}
          handleChangeSearch={handleChangeSearch}
        />
        <TablePagination component="div" count={count} page={page} onPageChange={handleChangePage} rowsPerPage={rowsPerPage} onRowsPerPageChange={handleChangeRowsPerPage} />
      </Paper>

      <ExtendedDialog
        open={open}
        handleClose={() => setOpen(false)}
        dialogHeader={`Adres Düzenleme`}
        subHeader={`${selectedAddress.adres || ''}`}
        dialogContent={<AddressForm address={selectedAddress} handleUpdateAddress={handleUpdateAddress} />}
      />

      <ExtendedDialog
        open={dialogUpdate}
        handleClose={() => setDialogUpdate(false)}
        dialogHeader="Adres Güncelleme"
        dialogContent={<AddressBulkUpdateContainer data={bulkUpdateResponse} />}
      />

      <AddressCreateContainer
        addressModel={addressModel}
        setAddressModel={setAddressModel}
        createDialog={createDialog}
        handleCloseCreateDialog={handleCloseCreateDialog}
        data={components}
        loading={componentsLoading}
        handleSubmit={handleCreateAddress}
      />
    </Box>
  )
}
