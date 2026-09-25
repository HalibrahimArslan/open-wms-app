import { useEffect, useState } from 'react'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import { Grid } from '@mui/material'
import { notify, notifyError } from '../../../layout/Layout'
import { generatePayload } from '../../../utils/Utils'
import { saveUserRoleBulk } from '../../../services/UserRoleService'
import { getRoleList } from '../../../services/RoleService'
import useAuthHeader from '../../../hooks/useAuthHeader'
import { useNavigate, useOutletContext } from 'react-router'
import ExtendedDialog from '../../../shared/components/Dialog/ExtendedDialog'
import { useContainer } from 'unstated-next'
import { DataStore } from '../../../store/DataStore'
import { getUsers } from '../../../services/UserService'

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />
const checkedIcon = <CheckBoxIcon fontSize="small" />

export default function CreateUserRoleContainer() {
  const headers = useAuthHeader()
  const nav = useNavigate()
  const { onSaved } = useOutletContext()
  const { account } = useContainer(DataStore)

  const [userList, setUserList] = useState([])
  const [roleList, setRoleList] = useState([])
  const [roleComboList, setRoleComboList] = useState([])
  const [userComboList, setUserComboList] = useState([])
  const [saving, setSaving] = useState(false)

  const handleClose = () => {
    nav(-1)
  }

  const fetchSaveUserRoleRelation = async () => {
    try {
      setSaving(true)
      let requestList = []
      roleComboList.map((role) => {
        userComboList.map((user) => {
          const payload = {
            role: role,
            user: user,
          }
          requestList.push(payload)
        })
      })

      const response = await saveUserRoleBulk(generatePayload(requestList))
      if (!response) return
      notify('Kullanıcı rolleri başarıyla kaydedildi.')
      onSaved()
      handleClose()
    } catch (e) {
      notifyError(e.message)
    } finally {
      setSaving(false)
    }
  }

  const fetchRoleList = async () => {
    if (account?.companyCode == null) return
    try {
      const response = await getRoleList(headers, `companyCode=${account.companyCode}`)
      response && setRoleList(response)
    } catch (e) {
      notifyError(e.message)
    }
  }

  const fetchUserList = async () => {
    try {
      const response = await getUsers(headers)
      response && setUserList(response)
    } catch (e) {
      notifyError(e.message)
    }
  }

  const handleChangeRoleList = (e, value) => {
    setRoleComboList(value)
  }

  const handleChangeUser = (e, value) => {
    setUserComboList(value)
  }

  const handleSave = () => {
    fetchSaveUserRoleRelation()
  }

  useEffect(() => {
    fetchUserList()
  }, [])

  useEffect(() => {
    fetchRoleList()
  }, [account?.companyCode])

  return (
    <ExtendedDialog
      open={true}
      handleClose={handleClose}
      handleSave={handleSave}
      dialogHeader={'Kullanıcı Rol İlişkilendirme'}
      actionButtonName={'Kaydet'}
      actionButtonDisaled={saving || roleComboList.length === 0 || userComboList.length === 0}
      dialogContent={
        <Grid
          container
          sx={{
            flexDirection: 'column',
            gap: 2,
            mt: 1,
          }}
        >
          <Autocomplete
            multiple
            onChange={handleChangeRoleList}
            id="checkboxes-tags-demo"
            options={roleList}
            disableCloseOnSelect
            getOptionLabel={(option) => option.roleName}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox icon={icon} checkedIcon={checkedIcon} checked={selected} />
                {option.roleName}
              </li>
            )}
            renderInput={(params) => <TextField {...params} label="Roller" placeholder="Rol Seçebilirsiniz..." />}
          />

          <Autocomplete
            multiple
            onChange={handleChangeUser}
            id="checkboxes-tags-demo"
            options={userList}
            disableCloseOnSelect
            getOptionLabel={(option) => option.login}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
                {option.login}
              </li>
            )}
            renderInput={(params) => <TextField {...params} label="Kullanıcılar" placeholder="Kullanıcı Seçebilirsiniz..." />}
          />
        </Grid>
      }
    />
  )
}
