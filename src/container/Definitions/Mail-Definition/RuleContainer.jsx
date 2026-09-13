import { useEffect, useState } from 'react'
import { getRules, updateRule } from '../../../services/RuleService'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import useAuthHeader from '../../../hooks/useAuthHeader'
import RuleForm from '../../../components/Form/RuleForm'
import { notifyError } from '../../../layout/Layout'
import ExtendedDialog from '../../../shared/components/Dialog/ExtendedDialog'
import DynamicTable from '../../../shared/components/Table/DynamicTable'

const RuleContainer = () => {
  const [rules, setRules] = useState([])
  const [selectedRule, setSelectedRule] = useState(null)
  const [open, setOpen] = useState(false)
  const headers = useAuthHeader()

  const handleRule = (rule) => {
    let payload = { ruleName: rule.ruleName, ruleContent: rule.ruleContent }
    fetchUpdateRule(selectedRule.id, payload)
  }

  const handleOpen = (row) => {
    setSelectedRule(row)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const columns = [
    { field: 'ruleName', headerName: 'Kural Adı', visible: true },
    { field: 'ruleContent', headerName: 'Kural İçeriği', visible: true },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Düzenle',
      visible: true,
      getActions: (row) => [
        {
          id: row,
          name: 'Düzenle',
          onClick: (row) => {
            handleOpen(row)
          },
          icon: <EditOutlinedIcon />,
        },
      ],
    },
  ]

  const fetchRules = async () => {
    try {
      const response = await getRules(headers)
      setRules(response)
    } catch (error) {
      notifyError(error.message)
    }
  }

  const fetchUpdateRule = async (id, payload) => {
    try {
      const response = await updateRule(id, headers, payload)
      setRules((prevRules) => prevRules.map((rule) => (rule.id === response.id ? response : rule)))
      handleClose()
    } catch (error) {
      notifyError(error.message)
    }
  }

  useEffect(() => {
    fetchRules()
  }, [])

  return (
    <>
      <DynamicTable data={rules} columns={columns} tableSx={{ height: 600 }} />
      <ExtendedDialog dialogHeader={'Kural Düzenle'} open={open} handleClose={handleClose} dialogContent={<RuleForm rule={selectedRule} handleRule={handleRule} />} />
    </>
  )
}

export default RuleContainer
