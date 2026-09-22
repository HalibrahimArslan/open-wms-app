import { useNavigate } from 'react-router'
import { useEffect, useState } from 'react'
import { notify, notifyError } from '../../../layout/Layout'
import CreateMenuForm from '../../../components/Form/CreateMenuForm'
import { createMenu, getMenuList } from '../../../services/MenuService'
import useAuthHeader from '../../../hooks/useAuthHeader'
import { useContainer } from 'unstated-next'
import { DataStore } from '../../../store/DataStore'
import { generatePayload } from '../../../utils/Utils'
import { getCompanies } from '../../../services/CompanyService'
import ExtendedDialog from '../../../shared/components/Dialog/ExtendedDialog'

const CreateMenuDefinitionContainer = () => {
  const [open, setOpen] = useState(true)
  const [menuList, setMenuList] = useState([])
  const [companies, setCompanies] = useState([])

  const nav = useNavigate()
  const headers = useAuthHeader()
  const { account } = useContainer(DataStore)

  const fetchCompanyList = async () => {
    try {
      const res = await getCompanies(headers)
      res && setCompanies(res)
    } catch (error) {
      notifyError(error.message)
    }
  }

  const getMenus = async () => {
    try {
      const res = await getMenuList(headers)
      res && setMenuList(res)
    } catch (error) {
      notifyError(error.message)
    }
  }

  const fetchCreateMenu = async (payload) => {
    try {
      const res = await createMenu(payload)
      res && handleClose()
      res && notify('Menü başarıyla oluşturuldu.')
    } catch (error) {
      notifyError(error.message)
    }
  }

  const handleCreateMenu = (values) => {
    let payload = generatePayload({
      ...values,
      companyCode: account.companyCode,
    })
    return fetchCreateMenu(payload)
  }

  const handleClose = () => {
    setOpen(false)
    nav(-1)
  }

  useEffect(() => {
    getMenus()
    fetchCompanyList()
  }, [])

  return (
    <ExtendedDialog
      open={open}
      handleClose={handleClose}
      dialogHeader={'Menü Tanımlama'}
      dialogContent={<CreateMenuForm menuList={menuList} handleCreateMenu={handleCreateMenu} companyList={companies} />}
    />
  )
}

export default CreateMenuDefinitionContainer
