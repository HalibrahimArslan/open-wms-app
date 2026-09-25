import { useEffect, useMemo, useState } from 'react'
import { getMenuList } from '../../../services/MenuService'
import useAuthHeader from '../../../hooks/useAuthHeader'
import { alpha, Box, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography } from '@mui/material'
import {
  Add as AddIcon,
  Check as CheckIcon,
  ChevronRight as ChevronRightIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  UnfoldLess as UnfoldLessIcon,
  UnfoldMore as UnfoldMoreIcon,
} from '@mui/icons-material'
import { produce } from 'immer'
import { notify, notifyError } from '../../../layout/Layout'
import { deleteMenuRole, getMenuRoleList, saveMenuRole } from '../../../services/MenuRoleRelService'
import { getRoleList } from '../../../services/RoleService'
import { generatePayload } from '../../../utils/Utils'
import { useContainer } from 'unstated-next'
import { DataStore } from '../../../store/DataStore'
import RepetableSkeleton from '../../../components/Loading/RepetableSkeleton'
import ActionHeader from '../../../shared/components/ActionHeader'
import TablePanel, { tableHeadSx } from '../../../shared/components/Table/TablePanel'

const cellActionSx = {
  position: 'absolute',
  right: 0,
  top: '50%',
  transform: 'translateY(-50%)',
}

const MenuRoleRelationItem = ({ menuRoleList, roleList, hoveredCell, setHoveredCell, menu, handleAddRole, handleDeleteRole }) => {
  return (
    <>
      {menuRoleList &&
        roleList &&
        roleList.map((role) => {
          const hovered = hoveredCell && hoveredCell.menuId === menu.id && hoveredCell.roleId === role.id
          const assigned = menuRoleList.some((menuRole) => menuRole.menu.id === menu.id && menuRole.role.id === role.id)
          return (
            <TableCell
              key={role.id}
              align="center"
              onMouseEnter={() => setHoveredCell({ menuId: menu.id, roleId: role.id })}
              onMouseLeave={() => setHoveredCell(null)}
              sx={{
                cursor: 'pointer',
                position: 'relative',
                '&:hover': {
                  backgroundColor: 'surface.hover',
                  outline: (theme) => `1px dashed ${theme.palette.border.focus}`,
                  outlineOffset: '-1px',
                },
              }}
            >
              {assigned && <CheckIcon fontSize="small" color="primary" sx={{ verticalAlign: 'middle' }} />}
              {hovered && (
                <Box component="span" sx={cellActionSx}>
                  {assigned ? (
                    <Tooltip title="Rolden çıkar">
                      <IconButton size="small" aria-label="Rolden çıkar" onClick={() => handleDeleteRole(menu.id, role.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Role ekle">
                      <IconButton size="small" aria-label="Role ekle" onClick={() => handleAddRole(menu.id, role.id)}>
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              )}
            </TableCell>
          )
        })}
    </>
  )
}

const stickyColumnSx = (scrolledX) => ({
  position: 'sticky',
  left: 0,
  borderRight: 1,
  borderRightColor: 'divider',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: (theme) => `calc(-1 * ${theme.spacing(1)})`,
    width: (theme) => theme.spacing(1),
    pointerEvents: 'none',
    background: (theme) => `linear-gradient(to right, ${alpha(theme.palette.common.black, 0.16)}, transparent)`,
    opacity: scrolledX ? 1 : 0,
    transition: (theme) => theme.transitions.create('opacity', { duration: theme.transitions.duration.shorter }),
  },
})

const buildMenuTree = (menuList) => {
  const ids = new Set(menuList.map((menu) => menu.id))
  const childrenOf = new Map()
  const roots = []
  ;[...menuList]
    .sort((a, b) => a.id - b.id)
    .forEach((menu) => {
      if (menu.parentMenuId && ids.has(menu.parentMenuId)) {
        if (!childrenOf.has(menu.parentMenuId)) childrenOf.set(menu.parentMenuId, [])
        childrenOf.get(menu.parentMenuId).push(menu)
      } else {
        roots.push(menu)
      }
    })
  return { roots, childrenOf }
}

export default function RoleMenuRelationContainer() {
  const [menuList, setMenuList] = useState()
  const [roleList, setRoleList] = useState()
  const [menuRoleList, setMenuRoleList] = useState([])
  const [hoveredCell, setHoveredCell] = useState(null)
  const [collapsed, setCollapsed] = useState(() => new Set())
  const [scrolledX, setScrolledX] = useState(false)

  const headers = useAuthHeader()
  const { account } = useContainer(DataStore)

  const fetchMenuList = async () => {
    try {
      let query = 'page=0&size=100&sort=id,desc'
      const res = await getMenuList(headers, query)
      res && setMenuList(res)
    } catch (error) {
      setMenuList([])
      notifyError(error.message)
    }
  }

  const fetchRoleList = async () => {
    try {
      const res = await getRoleList(headers, `companyCode=${account.companyCode}`)
      res && setRoleList(res)
    } catch (error) {
      setRoleList([])
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

  const menuTree = useMemo(() => buildMenuTree(menuList ?? []), [menuList])
  const groupIds = [...menuTree.childrenOf.keys()]
  const allCollapsed = groupIds.length > 0 && groupIds.every((id) => collapsed.has(id))

  const toggleGroup = (menuId) => {
    setCollapsed((prev) => {
      const next = new Set(prev)
      next.has(menuId) ? next.delete(menuId) : next.add(menuId)
      return next
    })
  }

  const toggleAll = () => {
    setCollapsed(allCollapsed ? new Set() : new Set(groupIds))
  }

  const renderMenuRows = (menu, depth) => {
    const children = menuTree.childrenOf.get(menu.id) ?? []
    const isGroup = children.length > 0
    const isOpen = !collapsed.has(menu.id)
    const rowBg = depth === 0 && isGroup ? 'surface.subtle' : 'surface.panel'

    return [
      <TableRow key={menu.id} sx={{ bgcolor: rowBg }}>
        <TableCell sx={{ ...stickyColumnSx(scrolledX), zIndex: 1, bgcolor: rowBg, whiteSpace: 'nowrap', paddingLeft: 1 + depth * 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {isGroup ? (
              <Tooltip title={isOpen ? 'Daralt' : 'Genişlet'}>
                <IconButton size="small" aria-label={isOpen ? 'Daralt' : 'Genişlet'} onClick={() => toggleGroup(menu.id)}>
                  {isOpen ? <ExpandMoreIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />}
                </IconButton>
              </Tooltip>
            ) : (
              <IconButton size="small" disabled aria-hidden sx={{ visibility: 'hidden' }}>
                <ChevronRightIcon fontSize="small" />
              </IconButton>
            )}
            <Typography variant="body2" sx={{ fontWeight: isGroup ? 'fontWeightMedium' : 'fontWeightRegular' }}>
              {menu.menuName}
            </Typography>
            {isGroup && (
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                ({children.length})
              </Typography>
            )}
          </Box>
        </TableCell>
        <MenuRoleRelationItem
          menuRoleList={menuRoleList}
          roleList={roleList}
          hoveredCell={hoveredCell}
          setHoveredCell={setHoveredCell}
          menu={menu}
          handleAddRole={handleAddRole}
          handleDeleteRole={handleDeleteRole}
        />
      </TableRow>,
      ...(isGroup && isOpen ? children.flatMap((child) => renderMenuRows(child, depth + 1)) : []),
    ]
  }

  return (
    <Box>
      <ActionHeader
        title="Menü Rol Yönetimi"
        hide
        subtitle={menuList && roleList ? `${menuTree.roots.length} ana menü altında ${menuList.length} menü, ${roleList.length} rol` : undefined}
        divider={false}
        actions={
          groupIds.length > 0 && (
            <Tooltip title={allCollapsed ? 'Tümünü genişlet' : 'Tümünü daralt'}>
              <IconButton aria-label={allCollapsed ? 'Tümünü genişlet' : 'Tümünü daralt'} onClick={toggleAll}>
                {allCollapsed ? <UnfoldMoreIcon /> : <UnfoldLessIcon />}
              </IconButton>
            </Tooltip>
          )
        }
      />
      {!menuList || !roleList ? (
        <RepetableSkeleton length={5} />
      ) : (
        <TablePanel>
          <Box sx={{ overflow: 'auto', maxWidth: '100%' }} onScroll={(e) => setScrolledX(e.currentTarget.scrollLeft > 0)}>
            <Table size="small" sx={{ '& tbody tr:last-of-type td': { borderBottom: 0 } }}>
              <TableHead sx={tableHeadSx}>
                <TableRow>
                  <TableCell sx={{ ...stickyColumnSx(scrolledX), zIndex: 2 }}>Menüler</TableCell>
                  {roleList.map((role) => (
                    <TableCell align="center" key={role.id} sx={{ whiteSpace: 'nowrap' }}>
                      {role.roleName}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>{menuTree.roots.flatMap((menu) => renderMenuRows(menu, 0))}</TableBody>
            </Table>
          </Box>
        </TablePanel>
      )}
    </Box>
  )
}
