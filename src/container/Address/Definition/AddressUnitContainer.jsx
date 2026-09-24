import { useEffect, useState } from 'react'
import useAuthHeader from '../../../hooks/useAuthHeader'
import useDepoCode from '../../../hooks/useDepoCode'
import useDepoScope from '../../../hooks/useDepoScope'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { produce } from 'immer'
import Iconify from '../../../components/Iconify'
import { Chip } from '@mui/material'
import { deleteAddressUnit, getAddressUnits, saveAddressUnit, updateAddressUnit } from '../../../services/AddressComponentService'
import { generatePayload } from '../../../utils/Utils'
import AddressComponentForm from '../../../components/Form/AddressComponentForm'
import { notify, notifyError } from '../../../layout/Layout'
import ExtendedDialog from '../../../shared/components/Dialog/ExtendedDialog'
import DynamicTable from '../../../shared/components/Table/DynamicTable'
import ActionHeader from '../../../shared/components/ActionHeader'
import { addressComponentSchema } from '../../../schemas/schemas'

const validationSchema = addressComponentSchema('Ünite')

const AddressUnitContainer = () => {
  const [units, setUnits] = useState([])
  const headers = useAuthHeader()
  const depoCode = useDepoCode()
  const { companyCode, withDepoScope } = useDepoScope()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const [selectedUnit, setSelectedUnit] = useState({})

  const columns = [
    {
      field: 'code',
      headerName: 'Ünite',
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
            setSelectedUnit(row)
          },
          icon: <EditOutlinedIcon />,
        },
        {
          id: row,
          name: 'Delete',
          onClick: (row) => {
            fetchDeleteUnit(row.id)
          },
          icon: <Iconify icon={'ic:baseline-delete'} />,
        },
      ],
    },
  ]

  const fetchDeleteUnit = async (id) => {
    try {
      await deleteAddressUnit(id, headers)
      setUnits((prevUnits) => [...prevUnits.filter((unit) => unit.id !== id)])
      notify('Ünite başarıyla silindi.')
    } catch (error) {
      notifyError(error.message)
    }
  }

  const fetchUnits = async () => {
    try {
      if (companyCode != null && depoCode) {
        setLoading(true)
        const res = await getAddressUnits(headers, companyCode, depoCode)
        res && setUnits(res)
      }
    } catch (error) {
      notifyError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchSaveUnit = async (payload) => {
    try {
      const res = await saveAddressUnit(payload)
      res && setUnits((prevUnits) => [...prevUnits, res])
      res && setOpen(false)
      res && notify('Ünite başarıyla oluşturuldu.')
    } catch (error) {
      notifyError(error.message)
    }
  }

  const fetchUpdateUnit = async (payload) => {
    try {
      const res = await updateAddressUnit(headers, payload)
      res &&
        setUnits(
          produce((draft) => {
            let currentUnit = draft.find((unit) => unit.id === res.id)
            if (currentUnit) {
              currentUnit.code = res.code
              currentUnit.description = res.description
              currentUnit.status = res.status
            }
          })
        )
      res && setSelectedUnit({})
      res && setOpen(false)
      res && notify('Ünite başarıyla güncellendi.')
    } catch (error) {
      notifyError(error.message)
    }
  }

  const handleSubmit = (values) => {
    if (Object.keys(selectedUnit).length > 0) {
      return fetchUpdateUnit(withDepoScope(values))
    }
    return fetchSaveUnit(generatePayload(withDepoScope(values)))
  }

  useEffect(() => {
    fetchUnits()
  }, [companyCode, depoCode])

  return (
    <>
      <ActionHeader
        title="Üniteler"
        handleClick={() => {
          setSelectedUnit({})
          setOpen(true)
        }}
      />
      <DynamicTable data={units} columns={columns} loading={loading} />
      <ExtendedDialog
        open={open}
        handleClose={() => setOpen(false)}
        dialogContent={<AddressComponentForm handleSubmit={handleSubmit} initialValues={selectedUnit} validationSchema={validationSchema} />}
        dialogHeader={'Ünite Oluşturma'}
      />
    </>
  )
}

export default AddressUnitContainer
