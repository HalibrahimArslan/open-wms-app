import React, { useEffect, useState } from 'react'
import CreateNewDefinition from '../../../components/Definitions/CreateNewDefinition'
import TableWithPagination from '../../../components/Table/TableWithPagination'
import { Outlet, useNavigate } from 'react-router'
import useAuthHeader from '../../../hooks/useAuthHeader'
import { getUserRoleList } from '../../../services/UserRoleService'
import { notifyError } from '../../../layout/Layout'
import UserRoleTable from '../../../components/Table/UserRoleTable'

const title = 'Kullanıcı Rollerini Düzenleme'

const UserRolesContainer = () => {
  const [userRoles, setUserRoles] = useState([])
  const [open, setOpen] = useState(false)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [count, setCount] = useState(30)

  const headers = useAuthHeader()
  const nav = useNavigate()

  const handleDelete = () => {}

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleClick = () => {
    nav(`new`)
    setOpen(true)
  }

  const fetchUserRoles = async () => {
    try {
      let query = `page=${page}&size=${rowsPerPage}&sort=user.login`
      const response = await getUserRoleList(headers, query)
      if (response) {
        setUserRoles(response.data)
        setCount(response.totalCount)
      }
    } catch (error) {
      notifyError(error.message)
    }
  }

  useEffect(() => {
    fetchUserRoles()
  }, [nav, page, rowsPerPage])

  return (
    <React.Fragment>
      <CreateNewDefinition title={title} handleClick={handleClick} open={open} />
      <TableWithPagination
        children={<UserRoleTable handleDelete={handleDelete} data={userRoles} />}
        page={page}
        rowsPerPage={rowsPerPage}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        count={count}
        colSpan={4}
      />
      <Outlet />
    </React.Fragment>
  )
}

export default UserRolesContainer
