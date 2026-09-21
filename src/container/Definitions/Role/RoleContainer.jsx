import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router'
import { deleteRole, getRoleList } from '../../../services/RoleService'
import TableWithPagination from '../../../components/Table/TableWithPagination'
import RoleTable from '../../../components/Table/RoleTable'
import useAuthHeader from '../../../hooks/useAuthHeader'
import CreateNewDefinition from '../../../components/Definitions/CreateNewDefinition'
import { notify, notifyError } from '../../../layout/Layout'
import { useContainer } from 'unstated-next'
import { DataStore } from '../../../store/DataStore'

const title = 'Rol Tanımlama'

const RoleContainer = () => {
  const [roles, setRoles] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [count, setCount] = useState(30)
  const [open, setOpen] = useState(false)

  const headers = useAuthHeader()
  const nav = useNavigate()
  const { account } = useContainer(DataStore)

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleDelete = async (id) => {
    try {
      await deleteRole(headers, id)
      setRoles(roles.filter((role) => role.id !== id))
      notify('Rol başarıyla silindi')
    } catch (error) {
      notifyError(error.message)
    }
  }

  const handleClick = () => {
    nav(`new`)
    setOpen(true)
  }

  const fetchRoles = async () => {
    try {
      const res = await getRoleList(headers, `companyCode=${account.companyCode}`)
      res && setRoles(res)
    } catch (error) {
      notifyError(error.message)
    }
  }

  useEffect(() => {
    fetchRoles()
  }, [nav])

  return (
    <React.Fragment>
      <CreateNewDefinition title={title} handleClick={handleClick} open={open} />
      <TableWithPagination
        children={<RoleTable handleDelete={handleDelete} roles={roles} />}
        page={page}
        rowsPerPage={rowsPerPage}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        count={count}
        colSpan={2}
      />
      <Outlet />
    </React.Fragment>
  )
}

export default RoleContainer
