import { IconButton, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

function UserRoleTable({ data, handleDelete }) {
  return (
    <>
      <TableHead>
        <TableRow>
          <TableCell align="left">Kullanıcı Adı</TableCell>
          <TableCell align="center">Rol</TableCell>
          <TableCell align="center">Sil</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.length > 0 &&
          data.map((row) => (
            <TableRow>
              <TableCell component="th" scope="row">
                {row.user.login}
              </TableCell>
              <TableCell align="center">{row.role.roleName}</TableCell>

              <TableCell align="center">
                <IconButton onClick={() => {}}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </>
  )
}

export default UserRoleTable
