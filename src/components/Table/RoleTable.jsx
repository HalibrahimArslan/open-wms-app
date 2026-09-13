import { IconButton, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

const RoleTable = ({ roles, handleDelete }) => {
  return (
    <>
      <TableHead>
        <TableRow>
          <TableCell align="left">Rol Adı</TableCell>
          <TableCell align="center">Sil</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {roles.length > 0 &&
          roles.map((role) => (
            <TableRow key={role.id}>
              <TableCell component="th" scope="row">
                {role.roleName}
              </TableCell>
              <TableCell align="center">
                <IconButton onClick={() => handleDelete(role.id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </>
  )
}

export default RoleTable
