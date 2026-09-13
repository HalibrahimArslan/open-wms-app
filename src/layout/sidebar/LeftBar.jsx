import { Box, ClickAwayListener, List, ListItem, ListItemButton, ListItemText, styled, Typography, useTheme, alpha } from '@mui/material'
import { useState } from 'react'
import Iconify from '../../components/Iconify'
import { useNavigate } from 'react-router-dom'
import useDepoCode from '../../hooks/useDepoCode'
import useIsMobile from '../../hooks/useIsMobile'
import BrandLogo from '../../components/Brand/BrandLogo'
import { useContainer } from 'unstated-next'
import { DataStore } from '../../store/DataStore'
import { notifyError } from '../Layout'

const StyledBox = styled(Box)(({ theme }) => ({
  flexShrink: 0,
  width: '100px',
  height: '100vh',
  backgroundColor: theme.palette.secondary.main,
  boxSizing: 'border-box',
  padding: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  flexDirection: 'column',
  zIndex: 1000,
  overflowY: 'auto',
  overflowX: 'hidden',
}))

const LeftBar = ({ menus }) => {
  // Menu servisi beklenmedik bir sey dondurdugunde (ornegin dizi yerine hata
  // govdesi) menus.find cagrisi tum uygulamayi cokertiyordu; sol menunun bos
  // kalmasi, beyaz ekrana dusmekten iyidir.
  const menuList = Array.isArray(menus) ? menus : []
  const [open, setOpen] = useState(false)
  const [selectedMenu, setSelectedMenu] = useState(null)
  const [selectedSubMenu, setSelectedSubMenu] = useState(null)
  const nav = useNavigate()
  const depoCode = useDepoCode()
  const isMobile = useIsMobile()
  const theme = useTheme()
  const { dock, handleChangeDock } = useContainer(DataStore)

  const selectedMenuData = menuList.find((menu) => menu.id === selectedMenu)?.children || []
  const selectedMenuName = menuList.find((menu) => menu.id === selectedMenu)?.name || ''

  const handleClickAway = () => {
    if (open && !dock) {
      setOpen(false)
    }
  }

  const handlePressMenu = (menu) => {
    if (menu.children && menu.children.length === 0) {
      nav(`/d:${depoCode}/${menu.path}`)
      if (!dock) setOpen(false)
      return
    }

    if (selectedMenu === menu.id) {
      if (!dock) {
        setOpen(!open)
      }
    } else {
      setSelectedMenu(menu.id)
      setOpen(true)
    }
  }

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box sx={{ flexShrink: 0, width: isMobile ? 0 : '96px', position: 'relative' }}>
        {!isMobile && (
          <StyledBox>
            <Box
              sx={{
                cursor: 'pointer',
                lineHeight: 0,
              }}
              onClick={() => {
                if (depoCode === 1) {
                  notifyError('Depo Seçiniz')
                  return
                }
                if (isMobile) {
                  nav(`/d:${depoCode}`)
                } else {
                  nav(`/d:${depoCode}/dashboard`)
                }
              }}
            >
              <BrandLogo variant="stacked" size={36} />
            </Box>
            <Box
              sx={{
                marginTop: 4,
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
              }}
            >
              {menuList.map((menu) => {
                const isSelected = selectedMenu === menu.id
                return (
                  <Box
                    key={menu.id}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      cursor: 'pointer',
                      color: isSelected ? 'primary.main' : (theme) => theme.palette.secondary.contrastText,
                      position: 'relative',
                      gap: 0.5,
                      '&:hover': {
                        color: 'primary.main',
                        '& .menu-icon-bg': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.12),
                        },
                      },
                      '& .menu-icon-bg': {
                        backgroundColor: isSelected ? alpha(theme.palette.primary.main, 0.16) : 'transparent',
                        transition: 'background-color 0.2s ease',
                      },
                    }}
                    onClick={() => handlePressMenu(menu)}
                  >
                    <Box
                      className="menu-icon-bg"
                      sx={{
                        width: 50,
                        height: 35,
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Iconify icon={menu.icon} width={24} />
                    </Box>
                    <Typography
                      textAlign={'center'}
                      variant="subtitle2"
                      sx={{
                        fontWeight: isSelected ? 800 : 600,
                      }}
                    >
                      {menu.name}
                    </Typography>
                    {isSelected && (
                      <Box
                        sx={{
                          position: 'absolute',
                          left: -16,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: 3,
                          height: 40,
                          backgroundColor: 'primary.main',
                          borderRadius: '0 4px 4px 0',
                        }}
                      />
                    )}
                  </Box>
                )
              })}
            </Box>
          </StyledBox>
        )}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 96,
            width: open ? '240px' : '0px',
            height: '100dvh',
            backgroundColor: 'background.paper',
            boxSizing: 'border-box',
            transition: 'width 0.3s ease',
            overflow: 'hidden',
            borderRight: open ? `1px solid ${theme.palette.divider}` : 'none',
            zIndex: (theme) => theme.zIndex.drawer + 2,
          }}
        >
          <Box
            sx={{
              opacity: open ? 1 : 0,
              transition: 'opacity 0.3s ease 0.1s',
              height: '100%',
              overflowY: 'auto',
            }}
          >
            <Box
              sx={{
                padding: '20px 20px',
                borderBottom: `1px solid ${theme.palette.divider}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
              }}
              onClick={handleChangeDock}
            >
              <Typography variant="subtitle1" fontWeight={600}>
                {selectedMenuName}
              </Typography>
              <Iconify icon={dock ? 'mdi:chevron-double-left' : 'mdi:chevron-double-right'} width={20} style={{ color: theme.palette.text.secondary }} />
            </Box>

            <List sx={{ padding: '8px 0' }}>
              {selectedMenuData.map((menu) => (
                <ListItem key={menu.id} disablePadding>
                  <ListItemButton
                    sx={{
                      px: 3,
                      py: 1,
                      '&:hover': {
                        backgroundColor: (theme) => theme.palette.action.hover,
                      },
                    }}
                    onClick={() => {
                      let status = dock ? true : false
                      setSelectedSubMenu(menu.id)
                      if (menu.index) {
                        nav(`/d:${depoCode}/${menu.id}/${menu.path}`)
                        setOpen(status)
                        return
                      }
                      nav(`/d:${depoCode}/${menu.path}`)
                      setOpen(status)
                    }}
                    selected={selectedSubMenu === menu.id}
                  >
                    <ListItemText
                      primary={menu.name}
                      primaryTypographyProps={{
                        variant: 'body2',
                        noWrap: true,
                        fontWeight: 500,
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </Box>
    </ClickAwayListener>
  )
}

export default LeftBar
