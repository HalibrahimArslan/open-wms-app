import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import TableWithPagination from '../../../components/Table/TableWithPagination'
import useAuthHeader from '../../../hooks/useAuthHeader'
import CreateNewDefinition from '../../../components/Definitions/CreateNewDefinition'
import { notifyError } from '../../../layout/Layout'
import { deleteMenu, getCountOfMenuList, getMenuList, updateMenu } from '../../../services/MenuService'
import MenuTable from '../../../components/Table/MenuTable'
import produce from 'immer'
import CreateMenuForm from '../../../components/Form/CreateMenuForm'
import { getCompanies } from '../../../services/CompanyService'
import ExtendedDialog from '../../../shared/components/Dialog/ExtendedDialog'
import ConfirmDialog from '../../../components/Dialog/ConfirmDialog'

const title = 'Menü Tanımlama'

const MenuDefinitionContainer = () => {
  const [menuList, setMenuList] = useState([])
  const [menus, setMenus] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [count, setCount] = useState(10)
  const [open, setOpen] = useState(false)
  const [companies, setCompanies] = useState([])
  const [updateDialog, setUpdateDialog] = useState(false)
  const [selectedMenu, setSelectedMenu] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedDeleteId, setSelectedDeleteId] = useState(null)

  const headers = useAuthHeader()
  const nav = useNavigate()

  const handleUpdateDialogOpen = () => {
    setUpdateDialog(true)
  }

  const handleUpdateDialogClose = () => {
    setUpdateDialog(false)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleDelete = async (id) => {
    try {
      await deleteMenu(id, headers)
      setMenus((prev) => prev.filter((menu) => menu.id !== id))
      setMenuList((prev) => prev.filter((menu) => menu.id !== id))
      setCount((prev) => Math.max(prev - 1, 0))
    } catch (error) {
      notifyError(error.message)
    }
  }

  const handleDeleteDialogOpen = (id) => {
    setSelectedDeleteId(id)
    setDeleteDialogOpen(true)
  }

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false)
    setSelectedDeleteId(null)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedDeleteId) return
    await handleDelete(selectedDeleteId)
    handleDeleteDialogClose()
  }

  const handleUpdate = (menu) => {
    setSelectedMenu(menu)
    handleUpdateDialogOpen()
  }

  const handleUpdateMenu = (values) => {
    fetchUpdateMenu(values)
  }

  const handleClick = () => {
    nav(`new`)
    setOpen(true)
  }

  const fetchCompanyList = async () => {
    try {
      const res = await getCompanies(headers)
      res && setCompanies(res)
    } catch (error) {
      notifyError(error.message)
    }
  }

  const fetchMenuList = async () => {
    try {
      let query = 'page=0&size=100'
      const res = await getMenuList(headers, query)
      res && setMenuList(res)
    } catch (error) {
      notifyError(error.message)
    }
  }

  const fetchMenuListByPage = async () => {
    try {
      let query = `page=${page}&size=${rowsPerPage}&sort=id,asc`
      const res = await getMenuList(headers, query)
      res && setMenus(res)
    } catch (error) {
      notifyError(error.message)
    }
  }

  const fetchCountOfMenuList = async () => {
    try {
      const res = await getCountOfMenuList(headers)
      res && setCount(res)
    } catch (error) {
      notifyError(error.message)
    }
  }

  const fetchUpdateMenu = async (payload) => {
    try {
      const res = await updateMenu(headers, payload)
      res &&
        setMenus(
          produce((draft) => {
            let selectedMenu = draft.find((menu) => menu.id === res.id)
            if (selectedMenu) {
              selectedMenu.menuName = res.menuName
              selectedMenu.parentMenuId = res.parentMenuId
              selectedMenu.path = res.path
              selectedMenu.index = res.index
              selectedMenu.icon = res.icon
              selectedMenu.companyCode = res.companyCode
            }
          })
        )
      res && handleUpdateDialogClose()
    } catch (error) {
      notifyError(error.message)
    }
  }

  useEffect(() => {
    fetchMenuListByPage()
    fetchCountOfMenuList()
  }, [nav, page, rowsPerPage])

  useEffect(() => {
    fetchMenuList()
    fetchCompanyList()
  }, [])

  return (
    <React.Fragment>
      <CreateNewDefinition title={title} handleClick={handleClick} open={open} />
      <TableWithPagination
        children={<MenuTable handleUpdate={handleUpdate} handleDelete={handleDeleteDialogOpen} menus={menus} menuList={menuList} />}
        page={page}
        rowsPerPage={rowsPerPage}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        count={count}
        colSpan={6}
      />
      <ExtendedDialog
        open={updateDialog}
        handleClose={handleUpdateDialogClose}
        dialogHeader={'Menü Güncelleme'}
        dialogContent={<CreateMenuForm menuItem={selectedMenu} menuList={menuList} handleCreateMenu={handleUpdateMenu} companyList={companies} />}
      />
      <ConfirmDialog
        dialogStatus={deleteDialogOpen}
        handleClose={handleDeleteDialogClose}
        dialogTitle="Menü Sil"
        dialogContentText="Seçili menüyü silmek istediğinize emin misiniz?"
        handleOperate={handleDeleteConfirm}
      />
      <Outlet />
    </React.Fragment>
  )
}

export default MenuDefinitionContainer
