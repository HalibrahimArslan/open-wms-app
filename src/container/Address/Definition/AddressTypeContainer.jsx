import { useEffect, useState } from 'react'
import useAuthHeader from '../../../hooks/useAuthHeader'
import { useContainer } from 'unstated-next'
import { DataStore } from '../../../store/DataStore'
import useDepoCode from '../../../hooks/useDepoCode'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import * as yup from 'yup'
import { produce } from 'immer'
import Iconify from '../../../components/Iconify'
import { Chip } from '@mui/material'
import { deleteAddressType, getAddressTypes, saveAddressType, updateAddressType } from '../../../services/AddressComponentService'
import { generatePayload } from '../../../utils/Utils'
import AddressComponentForm from '../../../components/Form/AddressComponentForm'
import { notifyError } from '../../../layout/Layout'
import ExtendedDialog from '../../../shared/components/Dialog/ExtendedDialog'
import DynamicTable from '../../../shared/components/Table/DynamicTable'
import ActionHeader from '../../../shared/components/ActionHeader'

const validationSchema = yup.object({
  code: yup.string().max(2).required('Adres Tipi boş bırakılamaz'),
  description: yup.string().required('Açıklama boş bırakılamaz'),
})

const AddressTypeContainer = () => {
  const [addressTypes, setAddressTypes] = useState([])
  const headers = useAuthHeader()
  const { account } = useContainer(DataStore)
  const depoCode = useDepoCode()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const [selectedAddressType, setSelectedAddressType] = useState({})

  const columns = [
    {
      field: 'code',
      headerName: 'Adres Tipi',
      visible: true,
    },
    {
      field: 'description',
      headerName: 'Açıklama',
      visible: true,
    },
    {
      field: 'status',
      headerName: 'Durum',
      visible: true,
      render: (value, row) => <Chip sx={{ borderRadius: 1 }} label={row.status ? 'Aktif' : 'Pasif'} color={row.status ? 'success' : 'error'} />,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Aksiyonlar',
      visible: true,
      getActions: (row) => [
        {
          id: row,
          name: 'Hareketler',
          onClick: (row) => {
            setOpen(true)
            setSelectedAddressType(row)
          },
          icon: <EditOutlinedIcon />,
        },
        {
          id: row,
          name: 'Delete',
          onClick: (row) => {
            fetchDeleteAddressType(row.id)
          },
          icon: <Iconify icon={'ic:baseline-delete'} />,
        },
      ],
    },
  ]

  const fetchDeleteAddressType = async (id) => {
    try {
      await deleteAddressType(id, headers)
      setAddressTypes((prevAddressTypes) => [...prevAddressTypes.filter((addressType) => addressType.id !== id)])
    } catch (error) {
      notifyError(error.message)
    }
  }

  const fetchAddressTypes = async () => {
    try {
      setLoading(true)
      if (account && depoCode) {
        const res = await getAddressTypes(headers, account.companyCode, depoCode)
        res && setAddressTypes(res)
      }
    } catch (error) {
      notifyError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchSaveAddressType = async (payload) => {
    try {
      const res = await saveAddressType(payload)
      res && setAddressTypes((prevAddressTypes) => [...prevAddressTypes, res])
      res && setOpen(false)
    } catch (error) {
      notifyError(error.message)
    }
  }

  const fetchUpdateAddressType = async (payload) => {
    try {
      const res = await updateAddressType(headers, payload)
      res &&
        setAddressTypes(
          produce((draft) => {
            let currentAddressType = draft.find((addressType) => addressType.id === res.id)
            if (currentAddressType) {
              currentAddressType.code = res.code
              currentAddressType.description = res.description
              currentAddressType.status = res.status
            }
          })
        )
      res && setSelectedAddressType({})
      res && setOpen(false)
    } catch (error) {
      notifyError(error.message)
    }
  }

  const handleSubmit = (values) => {
    if (Object.keys(selectedAddressType).length > 0) {
      fetchUpdateAddressType({ ...values, depoCode: Number(depoCode), companyCode: account?.companyCode })
      return
    }
    fetchSaveAddressType(generatePayload({ ...values, depoCode, companyCode: account?.companyCode }))
  }

  useEffect(() => {
    fetchAddressTypes()
  }, [account, depoCode])

  return (
    <>
      <ActionHeader title="Adres Tipleri" handleClick={() => setOpen(true)} />
      <DynamicTable data={addressTypes} columns={columns} loading={loading} />
      <ExtendedDialog
        open={open}
        handleClose={() => setOpen(false)}
        dialogContent={<AddressComponentForm handleSubmit={handleSubmit} initialValues={selectedAddressType} validationSchema={validationSchema} />}
        dialogHeader={'Adres Tipi Oluşturma'}
      />
    </>
  )
}

export default AddressTypeContainer
