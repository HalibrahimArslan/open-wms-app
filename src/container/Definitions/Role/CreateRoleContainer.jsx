import { TextField } from '@mui/material'
import { useNavigate } from 'react-router'
import { useState } from 'react'
import { notify, notifyError } from '../../../layout/Layout'
import { saveRole } from '../../../services/RoleService'
import usePayload from '../../../hooks/usePayload'
import ExtendedDialog from '../../../shared/components/Dialog/ExtendedDialog'
import { useContainer } from 'unstated-next'
import { DataStore } from '../../../store/DataStore'

const CreateRoleContainer = () => {
  const [roleName, setRoleName] = useState('')
  const [saving, setSaving] = useState(false)
  const { account } = useContainer(DataStore)
  const payload = usePayload({ roleName, companyCode: account?.companyCode })
  const nav = useNavigate()

  const fetchSaveRole = async () => {
    try {
      setSaving(true)
      const res = await saveRole(payload)
      if (!res) return
      notify('Rol başarıyla oluşturuldu.')
      handleClose()
    } catch (err) {
      notifyError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleSave = () => {
    fetchSaveRole()
  }

  const handleClose = () => {
    nav(-1)
  }

  return (
    <ExtendedDialog
      open={true}
      handleClose={handleClose}
      handleSave={handleSave}
      dialogHeader={'Rol Tanımlama'}
      actionButtonName={'Kaydet'}
      actionButtonDisaled={saving || !roleName.trim()}
      dialogContent={<TextField value={roleName} onChange={(e) => setRoleName(e.target.value)} placeholder="Rol Adı" fullWidth />}
    />
  )
}

export default CreateRoleContainer
