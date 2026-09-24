import { useEffect, useState } from 'react'
import useAuthHeader from '../../../hooks/useAuthHeader'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { produce } from 'immer'
import Iconify from '../../../components/Iconify'
import { Chip } from '@mui/material'
import { deleteAddressRoom, getAddressRooms, saveAddressRoom, updateAddressRoom } from '../../../services/AddressComponentService'
import { generatePayload } from '../../../utils/Utils'
import AddressComponentForm from '../../../components/Form/AddressComponentForm'
import { notify, notifyError } from '../../../layout/Layout'
import useDepoCode from '../../../hooks/useDepoCode'
import useDepoScope from '../../../hooks/useDepoScope'
import ExtendedDialog from '../../../shared/components/Dialog/ExtendedDialog'
import DynamicTable from '../../../shared/components/Table/DynamicTable'
import ActionHeader from '../../../shared/components/ActionHeader'
import { addressComponentSchema } from '../../../schemas/schemas'

const validationSchema = addressComponentSchema('Oda')

const AddressRoomContainer = () => {
  const [rooms, setRooms] = useState([])
  const headers = useAuthHeader()
  const depoCode = useDepoCode()
  const { companyCode, withDepoScope } = useDepoScope()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const [selectedRoom, setSelectedRoom] = useState({})

  const columns = [
    {
      field: 'code',
      headerName: 'Oda',
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
            setSelectedRoom(row)
          },
          icon: <EditOutlinedIcon />,
        },
        {
          id: row,
          name: 'Delete',
          onClick: (row) => {
            fetchDeleteRoom(row.id)
          },
          icon: <Iconify icon={'ic:baseline-delete'} />,
        },
      ],
    },
  ]

  const fetchDeleteRoom = async (id) => {
    try {
      await deleteAddressRoom(id, headers)
      setRooms((prevRooms) => [...prevRooms.filter((room) => room.id !== id)])
      notify('Oda başarıyla silindi.')
    } catch (error) {
      notifyError(error.message)
    }
  }

  const fetchRooms = async () => {
    try {
      if (companyCode != null && depoCode) {
        setLoading(true)
        const res = await getAddressRooms(headers, companyCode, depoCode)
        res && setRooms(res)
      }
    } catch (error) {
      notifyError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchSaveRoom = async (payload) => {
    try {
      const res = await saveAddressRoom(payload)
      res && setRooms((prevRooms) => [...prevRooms, res])
      res && setOpen(false)
      res && notify('Oda başarıyla oluşturuldu.')
    } catch (error) {
      notifyError(error.message)
    }
  }

  const fetchUpdateRoom = async (payload) => {
    try {
      const res = await updateAddressRoom(headers, payload)
      res &&
        setRooms(
          produce((draft) => {
            let currentRoom = draft.find((room) => room.id === res.id)
            if (currentRoom) {
              currentRoom.code = res.code
              currentRoom.description = res.description
              currentRoom.status = res.status
            }
          })
        )
      res && setSelectedRoom({})
      res && setOpen(false)
      res && notify('Oda başarıyla güncellendi.')
    } catch (error) {
      notifyError(error.message)
    }
  }

  const handleSubmit = (values) => {
    if (Object.keys(selectedRoom).length > 0) {
      return fetchUpdateRoom(withDepoScope(values))
    }
    return fetchSaveRoom(generatePayload(withDepoScope(values)))
  }

  useEffect(() => {
    fetchRooms()
  }, [companyCode, depoCode])

  return (
    <>
      <ActionHeader
        title="Odalar"
        handleClick={() => {
          setSelectedRoom({})
          setOpen(true)
        }}
      />
      <DynamicTable data={rooms} columns={columns} loading={loading} />
      <ExtendedDialog
        open={open}
        handleClose={() => setOpen(false)}
        dialogContent={<AddressComponentForm handleSubmit={handleSubmit} initialValues={selectedRoom} validationSchema={validationSchema} />}
        dialogHeader={'Oda Oluşturma'}
      />
    </>
  )
}

export default AddressRoomContainer
