import { useEffect, useState } from 'react'
import { getMenuList } from '../../../services/MenuService'
import useAuthHeader from '../../../hooks/useAuthHeader'
import { Box, Divider, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Typography, useTheme } from '@mui/material'
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material'
import { produce } from 'immer'
import { notify, notifyError } from '../../../layout/Layout'
import { deleteMenuRole, getMenuRoleList, saveMenuRole } from '../../../services/MenuRoleRelService'
import { getRoleList } from '../../../services/RoleService'
import { generatePayload } from '../../../utils/Utils'
import { useContainer } from 'unstated-next'
import { DataStore } from '../../../store/DataStore'

const MenuRoleRelationItem = ({ menuRoleList, roleList, hoveredCell, setHoveredCell, theme, menu, handleAddRole, handleDeleteRole }) => {
  return (
    <>
      {menuRoleList &&
        roleList &&
        roleList.map((role) => (
          <TableCell
            key={role.id}
            align="center"
            onMouseEnter={() => setHoveredCell({ menuId: menu.id, roleId: role.id })}
            onMouseLeave={() => setHoveredCell(null)}
            sx={{
              cursor: 'pointer',
              position: 'relative',
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
                border: `2px dotted ${theme.palette.primary.main}`,
                borderRadius: '5px',
              },
            }}
          >
            {menuRoleList && menuRoleList.filter((menuRole) => menuRole.menu.id === menu.id && menuRole.role.id === role.id).length > 0 ? (
              <>
                <span>X</span>
                {hoveredCell && hoveredCell.menuId === menu.id && hoveredCell.roleId === role.id && (
                  <span
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: '50%',
                      transform: 'translateY(-50%)',
                    }}
                  >
                    <IconButton size="small" onClick={() => handleDeleteRole(menu.id, role.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </span>
                )}
              </>
            ) : (
              hoveredCell &&
              hoveredCell.menuId === menu.id &&
              hoveredCell.roleId === role.id && (
                <span
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                  }}
                >
                  <IconButton size="small" onClick={() => handleAddRole(menu.id, role.id)}>
                    <AddIcon />
                  </IconButton>
                </span>
              )
            )}
          </TableCell>
        ))}
    </>
  )
}

export default function RoleMenuRelationContainer() {
  const [menuList, setMenuList] = useState()
  const [roleList, setRoleList] = useState()
  const [menuRoleList, setMenuRoleList] = useState([])
  const [hoveredCell, setHoveredCell] = useState(null)

  const headers = useAuthHeader()
  const theme = useTheme()
  const { account } = useContainer(DataStore)

  const fetchMenuList = async () => {
    try {
      let query = 'page=0&size=100&sort=id,desc'
      const res = await getMenuList(headers, query)
      res && setMenuList(res)
    } catch (error) {
      notifyError(error.message)
    }
  }

  const fetchRoleList = async () => {
    try {
      const res = await getRoleList(headers, `companyCode=${account.companyCode}`)
      res && setRoleList(res)
    } catch (error) {
      notifyError(error.message)
    }
  }

  const fetchMenuRoleList = async () => {
    try {
      const res = await getMenuRoleList(headers)
      res && setMenuRoleList(res)
    } catch (error) {
      notifyError(error.message)
    }
  }

  const fetchSaveRoleMenu = async (payload) => {
    try {
      const res = await saveMenuRole(payload)
      res && notify('Menü Rol ilişkisi başarıyla eklendi')
      res && setMenuRoleList([...menuRoleList, ...res])
    } catch (error) {
      notifyError(error.message)
    }
  }

  const fetchDeleteRoleMenu = async (payload, menuId, roleId) => {
    try {
      await deleteMenuRole(headers, payload)
      notify('Menü Rol ilişkisi başarıyla silindi')
      setMenuRoleList(
        produce(menuRoleList, (draft) => {
          return draft.filter((menuRole) => (menuRole.menu.id !== menuId && menuRole.menu.parentMenuId !== menuId) || menuRole.role.id !== roleId)
        })
      )
    } catch (error) {
      notifyError(error.message)
    }
  }

  useEffect(() => {
    fetchMenuList()
    fetchMenuRoleList()
  }, [])

  useEffect(() => {
    if (account && account.companyCode) {
      fetchRoleList()
    }
  }, [account])

  const handleAddRole = (menuId, roleId) => {
    let selectedMenu = menuList?.find((menu) => menu.id === menuId)
    let selectedRole = roleList?.find((role) => role.id === roleId)
    let payload = {
      menu: selectedMenu,
      role: selectedRole,
    }
    fetchSaveRoleMenu(generatePayload(payload))
  }

  const handleDeleteRole = (menuId, roleId) => {
    let selectedMenu = menuList?.find((menu) => menu.id === menuId)
    let selectedRole = roleList?.find((role) => role.id === roleId)
    let payload = {
      menu: selectedMenu,
      role: selectedRole,
    }
    fetchDeleteRoleMenu(payload, menuId, roleId)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Typography align="left" variant="h5">
          Menü Rol Yönetimi
        </Typography>
      </Box>
      <Divider flexItem />
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          maxWidth: '100vw',
        }}
      >
        <Table size="small" sx={{ padding: 1 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ position: 'sticky', left: 0, bgcolor: theme.palette.secondary.main, zIndex: 2 }}>Menüler</TableCell>
              {roleList &&
                roleList.map((role) => (
                  <TableCell align="center" key={role.id}>
                    {role.roleName}
                  </TableCell>
                ))}
            </TableRow>
          </TableHead>

          <TableBody sx={{ backgroundColor: theme.palette.action.hover }}>
            {menuList &&
              menuList.map((menu) => (
                <TableRow key={menu.id}>
                  <TableCell sx={{ position: 'sticky', left: 0, bgcolor: theme.palette.secondary.main, zIndex: 2 }}>{menu.menuName}</TableCell>
                  <MenuRoleRelationItem
                    menuRoleList={menuRoleList}
                    roleList={roleList}
                    hoveredCell={hoveredCell}
                    setHoveredCell={setHoveredCell}
                    theme={theme}
                    menu={menu}
                    handleAddRole={handleAddRole}
                    handleDeleteRole={handleDeleteRole}
                  />
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Box>
    </Box>
  )
}
