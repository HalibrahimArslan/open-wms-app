import { useEffect, useState } from 'react'
import useAuthHeader from '../../../hooks/useAuthHeader'
import useDepoCode from '../../../hooks/useDepoCode'
import useDepoScope from '../../../hooks/useDepoScope'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { produce } from 'immer'
import Iconify from '../../../components/Iconify'
import { Chip } from '@mui/material'
import { deleteAddressFlat, getAddressFlats, saveAddressFlat, updateAddressFlat } from '../../../services/AddressComponentService'
import AddressComponentForm from '../../../components/Form/AddressComponentForm'
import { notify, notifyError } from '../../../layout/Layout'
import { generatePayload } from '../../../utils/Utils'
import ExtendedDialog from '../../../shared/components/Dialog/ExtendedDialog'
import DynamicTable from '../../../shared/components/Table/DynamicTable'
import ActionHeader from '../../../shared/components/ActionHeader'
import { addressComponentSchema } from '../../../schemas/schemas'

const validationSchema = addressComponentSchema('Kat')

const AddressFlatContainer = () => {
  const [flats, setFlats] = useState([])
  const headers = useAuthHeader()
  const depoCode = useDepoCode()
  const { companyCode, withDepoScope } = useDepoScope()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const [selectedFlat, setSelectedFlat] = useState({})

  const columns = [
    {
      field: 'code',
      headerName: 'Kat',
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
            setSelectedFlat(row)
          },
          icon: <EditOutlinedIcon />,
        },
        {
          id: row,
          name: 'Delete',
          onClick: (row) => {
            fetchDeleteFlat(row.id)
          },
          icon: <Iconify icon={'ic:baseline-delete'} />,
        },
      ],
    },
  ]

  const fetchDeleteFlat = async (id) => {
    try {
      await deleteAddressFlat(id, headers)
      setFlats((prevFlats) => [...prevFlats.filter((flat) => flat.id !== id)])
      notify('Kat başarıyla silindi.')
    } catch (error) {
      notifyError(error.message)
    }
  }

  const fetchFlats = async () => {
    try {
      if (companyCode != null && depoCode) {
        setLoading(true)
        const res = await getAddressFlats(headers, companyCode, depoCode)
        res && setFlats(res)
      }
    } catch (error) {
      notifyError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchSaveFlat = async (payload) => {
    try {
      const res = await saveAddressFlat(payload)
      res && setFlats((prevFlats) => [...prevFlats, res])
      res && setOpen(false)
      res && notify('Kat başarıyla oluşturuldu.')
    } catch (error) {
      notifyError(error.message)
    }
  }

  const fetchUpdateFlat = async (payload) => {
    try {
      const res = await updateAddressFlat(headers, payload)
      res &&
        setFlats(
          produce((draft) => {
            let currentFlat = draft.find((flat) => flat.id === res.id)
            if (currentFlat) {
              currentFlat.code = res.code
              currentFlat.description = res.description
              currentFlat.status = res.status
            }
          })
        )
      res && setSelectedFlat({})
      res && setOpen(false)
      res && notify('Kat başarıyla güncellendi.')
    } catch (error) {
      notifyError(error.message)
    }
  }

  const handleSubmit = (values) => {
    if (Object.keys(selectedFlat).length > 0) {
      return fetchUpdateFlat(withDepoScope(values))
    }
    return fetchSaveFlat(generatePayload(withDepoScope(values)))
  }

  useEffect(() => {
    fetchFlats()
  }, [companyCode, depoCode])

  return (
    <>
      <ActionHeader
        title="Katlar"
        handleClick={() => {
          setSelectedFlat({})
          setOpen(true)
        }}
      />
      <DynamicTable data={flats} columns={columns} loading={loading} />
      <ExtendedDialog
        open={open}
        handleClose={() => setOpen(false)}
        dialogContent={<AddressComponentForm handleSubmit={handleSubmit} initialValues={selectedFlat} validationSchema={validationSchema} />}
        dialogHeader={'Kat Oluşturma'}
      />
    </>
  )
}

export default AddressFlatContainer
