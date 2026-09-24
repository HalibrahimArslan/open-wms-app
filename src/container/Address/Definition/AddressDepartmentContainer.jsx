import { useEffect, useState } from 'react'
import useAuthHeader from '../../../hooks/useAuthHeader'
import useDepoCode from '../../../hooks/useDepoCode'
import useDepoScope from '../../../hooks/useDepoScope'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { produce } from 'immer'
import Iconify from '../../../components/Iconify'
import { Chip } from '@mui/material'
import { deleteAddressDepartment, getAddressDepartments, saveAddressDepartment, updateAddressDepartment } from '../../../services/AddressComponentService'
import AddressComponentForm from '../../../components/Form/AddressComponentForm'
import { notify, notifyError } from '../../../layout/Layout'
import { generatePayload } from '../../../utils/Utils'
import ExtendedDialog from '../../../shared/components/Dialog/ExtendedDialog'
import DynamicTable from '../../../shared/components/Table/DynamicTable'
import ActionHeader from '../../../shared/components/ActionHeader'
import { addressComponentSchema } from '../../../schemas/schemas'

const validationSchema = addressComponentSchema('Bölüm')

const AddressDepartmentContainer = () => {
  const [departments, setDepartments] = useState([])
  const headers = useAuthHeader()
  const depoCode = useDepoCode()
  const { companyCode, withDepoScope } = useDepoScope()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const [selectedDepartment, setSelectedDepartment] = useState({})

  const columns = [
    {
      field: 'code',
      headerName: 'Bölüm',
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
          name: 'Edit',
          onClick: (row) => {
            setOpen(true)
            setSelectedDepartment(row)
          },
          icon: <EditOutlinedIcon />,
        },
        {
          id: row,
          name: 'Delete',
          onClick: (row) => {
            fetchDeleteDepartment(row.id)
          },
          icon: <Iconify icon={'ic:baseline-delete'} />,
        },
      ],
    },
  ]

  const fetchDeleteDepartment = async (id) => {
    try {
      await deleteAddressDepartment(id, headers)
      setDepartments((prevDepartments) => [...prevDepartments.filter((department) => department.id !== id)])
      notify('Bölüm başarıyla silindi.')
    } catch (error) {
      notifyError(error.message)
    }
  }

  const fetchDepartments = async () => {
    try {
      setLoading(true)
      if (companyCode != null && depoCode) {
        const res = await getAddressDepartments(headers, companyCode, depoCode)
        res && setDepartments(res)
      }
    } catch (error) {
      notifyError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchSaveDepartment = async (payload) => {
    try {
      const res = await saveAddressDepartment(payload)
      res && setDepartments((prevDepartments) => [...prevDepartments, res])
      res && setOpen(false)
      res && notify('Bölüm başarıyla oluşturuldu.')
    } catch (error) {
      notifyError(error.message)
    }
  }

  const fetchUpdateDepartment = async (payload) => {
    try {
      const res = await updateAddressDepartment(headers, payload)
      res &&
        setDepartments(
          produce((draft) => {
            let currentDepartment = draft.find((department) => department.id === res.id)
            if (currentDepartment) {
              currentDepartment.code = res.code
              currentDepartment.description = res.description
              currentDepartment.status = res.status
            }
          })
        )
      res && setSelectedDepartment({})
      res && setOpen(false)
      res && notify('Bölüm başarıyla güncellendi.')
    } catch (error) {
      notifyError(error.message)
    }
  }

  const handleSubmit = (values) => {
    if (Object.keys(selectedDepartment).length > 0) {
      return fetchUpdateDepartment(withDepoScope(values))
    }
    return fetchSaveDepartment(generatePayload(withDepoScope(values)))
  }

  useEffect(() => {
    fetchDepartments()
  }, [companyCode, depoCode])

  return (
    <>
      <ActionHeader
        title="Bölümler"
        handleClick={() => {
          setSelectedDepartment({})
          setOpen(true)
        }}
      />
      <DynamicTable data={departments} columns={columns} loading={loading} size="medium" />
      <ExtendedDialog
        open={open}
        handleClose={() => setOpen(false)}
        dialogContent={<AddressComponentForm handleSubmit={handleSubmit} initialValues={selectedDepartment} validationSchema={validationSchema} />}
        dialogHeader={'Bölüm Oluşturma'}
      />
    </>
  )
}

export default AddressDepartmentContainer
