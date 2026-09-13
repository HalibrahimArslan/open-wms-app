import { IconButton, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'

const MenuTable = ({ menus, menuList, handleUpdate, handleDelete }) => {
  const getParentMenuName = (parentMenuId) => {
    let parentMenu = menuList.filter((item) => item.id === parentMenuId)
    if (parentMenu.length > 0) {
      return parentMenu[0].menuName
    }
    return ''
  }

  return (
    <>
      <TableHead>
        <TableRow>
          <TableCell align="left">Id</TableCell>
          <TableCell align="left">Menü Adı</TableCell>
          <TableCell align="left">Üst Menü Adı</TableCell>
          <TableCell align="left">Path</TableCell>
          <TableCell align="left">Icon</TableCell>
          <TableCell align="center">Aksiyonlar</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {menus.length > 0 &&
          menus.map((menu) => (
            <TableRow key={menu.id}>
              <TableCell component="th" scope="row">
                {menu.id}
              </TableCell>
              <TableCell component="th" scope="row">
                {menu.menuName}
              </TableCell>
              <TableCell component="th" scope="row">
                {getParentMenuName(menu.parentMenuId)}
              </TableCell>
              <TableCell component="th" scope="row">
                {menu.path}
              </TableCell>
              <TableCell component="th" scope="row">
                {menu.icon}
              </TableCell>
              <TableCell align="center">
                <IconButton onClick={() => handleUpdate(menu)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(menu.id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </>
  )
}

export default MenuTable
