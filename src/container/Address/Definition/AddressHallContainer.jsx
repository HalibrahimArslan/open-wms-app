import { useEffect, useState } from 'react'
import useAuthHeader from '../../../hooks/useAuthHeader'
import { useContainer } from 'unstated-next'
import { DataStore } from '../../../store/DataStore'
import useDepoCode from '../../../hooks/useDepoCode'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { produce } from 'immer'
import Iconify from '../../../components/Iconify'
import { Chip } from '@mui/material'
import { deleteAddressHall, getAddressHalls, saveAddressHall, updateAddressHall } from '../../../services/AddressComponentService'
import AddressComponentForm from '../../../components/Form/AddressComponentForm'
import { generatePayload } from '../../../utils/Utils'
import { notify, notifyError } from '../../../layout/Layout'
import ExtendedDialog from '../../../shared/components/Dialog/ExtendedDialog'
import DynamicTable from '../../../shared/components/Table/DynamicTable'
import ActionHeader from '../../../shared/components/ActionHeader'
import { addressComponentSchema } from '../../../schemas/schemas'

const validationSchema = addressComponentSchema('Koridor')

const AddressHallContainer = () => {
  const [halls, setHalls] = useState([])
  const headers = useAuthHeader()
  const { account } = useContainer(DataStore)
  const depoCode = useDepoCode()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedHall, setSelectedHall] = useState({})

  const columns = [
    {
      field: 'code',
      headerName: 'Koridor',
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
            setSelectedHall(row)
          },
          icon: <EditOutlinedIcon />,
        },
        {
          id: row,
          name: 'Delete',
          onClick: (row) => {
            fetchDeleteHall(row.id)
          },
          icon: <Iconify icon={'ic:baseline-delete'} />,
        },
      ],
    },
  ]

  const fetchDeleteHall = async (id) => {
    try {
      await deleteAddressHall(id, headers)
      setHalls((prevHalls) => [...prevHalls.filter((hall) => hall.id !== id)])
      notify('Koridor başarıyla silindi.')
    } catch (error) {
      notifyError(error.message)
    }
  }

  const fetchHalls = async () => {
    try {
      if (account && depoCode) {
        setLoading(true)
        const res = await getAddressHalls(headers, account.companyCode, depoCode)
        res && setHalls(res)
      }
    } catch (error) {
      notifyError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchSaveHall = async (payload) => {
    try {
      const res = await saveAddressHall(payload)
      res && setHalls((prevHalls) => [...prevHalls, res])
      res && setOpen(false)
      res && notify('Koridor başarıyla oluşturuldu.')
    } catch (error) {
      notifyError(error.message)
    }
  }

  const fetchUpdateHall = async (payload) => {
    try {
      const res = await updateAddressHall(headers, payload)
      res &&
        setHalls(
          produce((draft) => {
            let currentDepartment = draft.find((hall) => hall.id === res.id)
            if (currentDepartment) {
              currentDepartment.code = res.code
              currentDepartment.description = res.description
              currentDepartment.status = res.status
            }
          })
        )
      res && setSelectedHall({})
      res && setOpen(false)
      res && notify('Koridor başarıyla güncellendi.')
    } catch (error) {
      notifyError(error.message)
    }
  }

  const handleSubmit = (values) => {
    if (Object.keys(selectedHall).length > 0) {
      return fetchUpdateHall({ ...values, depoCode, companyCode: account?.companyCode })
    }
    return fetchSaveHall(generatePayload({ ...values, depoCode, companyCode: account?.companyCode }))
  }

  useEffect(() => {
    fetchHalls()
  }, [account, depoCode])

  return (
    <>
      <ActionHeader
        title="Koridorlar"
        handleClick={() => {
          setSelectedHall({})
          setOpen(true)
        }}
      />
      <DynamicTable data={halls} columns={columns} loading={loading} />
      <ExtendedDialog
        open={open}
        handleClose={() => setOpen(false)}
        dialogContent={<AddressComponentForm handleSubmit={handleSubmit} initialValues={selectedHall} validationSchema={validationSchema} />}
        dialogHeader={'Koridor Oluşturma'}
      />
    </>
  )
}

export default AddressHallContainer
