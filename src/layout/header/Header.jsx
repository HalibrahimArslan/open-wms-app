import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import MenuIcon from '@mui/icons-material/Menu'
import AccountCircle from '@mui/icons-material/AccountCircle'
import HomeIcon from '@mui/icons-material/Home'
import LogoutIcon from '@mui/icons-material/Logout'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import SupportAgentIcon from '@mui/icons-material/SupportAgent'
import AccountMenu from '../../components/MenuWrapper/AccountMenu'
import { GridSearchIcon } from '@mui/x-data-grid'
import { DepoContainer } from '../../store/DepoContainer'
import { AuthContainer } from '../../store/AuthContainer'
import { useSWRConfig } from 'swr'
import { Avatar, Button, Divider, Stack, useMediaQuery, alpha } from '@mui/material'
import { ThemeContainer } from '../../store/ThemeContainer'
import { useTheme } from '@mui/system'
import { useContainer } from 'unstated-next'
import { DataStore } from '../../store/DataStore'
import './header.css'
import DepoCombo from '../../components/Combobox/DepoCombo'
import FeedbackContainer from '../../container/Feedback/FeedbackContainer'
import { FcCustomerSupport } from 'react-icons/fc'
import { notifyError } from '../Layout'
import GlobalSearchDialog from '../../container/Search/GlobalSearch/GlobalSearchDialog'
import ThemeSwitchButton from '../../components/Switch/ThemeSwitchButton'
import { NotificationProvider } from '../../context/NotificationProvider'
import { NotificationDisplay } from '../../container/Dashboard/NotificationDisplay'

export default function Header() {
  const { depoCode, depoName, depoCombo, allDepoList, handleDepoCode, handleDepoName, handleDepoMenu } = useContainer(DepoContainer)
  const { account, dock, handleChangeDock } = useContainer(DataStore)
  const { cache } = useSWRConfig()
  const { handleChangeMode } = ThemeContainer.useContainer()
  const { auth, handleAuth } = AuthContainer.useContainer()

  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const [scrollDirection, setScrollDirection] = useState('up')
  const [anchorEl, setAnchorEl] = useState(null)
  const [depoAnchorEl, setDepoAnchorEl] = useState(null)
  const [feedbackMenuOpen, setFeedbackMenuOpen] = useState(false)
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false)

  const isMenuOpen = Boolean(anchorEl)
  const isDepoMenuOpen = Boolean(depoAnchorEl)

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleDepoMenuClose = () => {
    setDepoAnchorEl(null)
    handleDepoMenu(false)
  }

  const handleDepoMenuOpen = (event) => {
    setDepoAnchorEl(event.currentTarget)
    handleDepoMenu(true)
  }

  const handleOpenSearch = () => {
    setGlobalSearchOpen(true)
  }

  const handleFeedbackMenuClose = () => {
    setFeedbackMenuOpen(false)
  }

  const handleFeedbackMenuOpen = () => {
    setFeedbackMenuOpen(true)
  }

  function handleProfile() {
    handleMenuClose()
    if (depoCode === 1) {
      notifyError('Depo Seçiniz')
    } else {
      navigate(`/d:${depoCode}/profile/user-informations?free-view=true`)
    }
  }

  const handleChangeDepo = () => {
    let selectedDepo = depoCombo
    let selectedDepoName = allDepoList.filter((depo) => depo.code === selectedDepo)[0]?.name

    handleDepoCode(depoCombo)
    handleDepoName(selectedDepoName)
    navigate(`/d:${selectedDepo}`)
    setDepoAnchorEl(null)
  }

  function handleLogout() {
    handleAuth(false)
    localStorage.clear()
    handleMenuClose()
    cache.clear()
    handleDepoName('')
    navigate('/login')
  }

  useEffect(() => {
    let lastScrollY = 0
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY
      if (currentScrollY > lastScrollY) {
        setScrollDirection('down')
      } else {
        setScrollDirection('up')
      }
      lastScrollY = currentScrollY
    })
  }, [])

  useEffect(() => {
    const handleKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault()
        setGlobalSearchOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  const depoMenuId = 'depo-menu'
  const renderDepoMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      id={depoMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      open={isDepoMenuOpen}
      onClose={handleDepoMenuClose}
      sx={{ padding: '5px' }}
    >
      <Typography align="center"> Depo Seçiniz </Typography>
      <MenuItem onClick={handleDepoMenuOpen} divider={true}>
        <DepoCombo />
      </MenuItem>
      <Stack>
        <Button variant="contained" onClick={handleChangeDepo}>
          DEĞİŞTİR
        </Button>
      </Stack>
    </Menu>
  )

  const menuId = 'account-menu'
  const renderAccoutMenu = (
    <AccountMenu
      children={
        <>
          <MenuItem onClick={handleMenuClose} disableRipple>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
              }}
            >
              <Avatar
                sx={{
                  width: '60px',
                  height: '60px',
                  background: theme.palette.primary.main,
                }}
              >
                {account && Object.keys(account).length > 0 && account.login.charAt(0).toLocaleUpperCase()}
              </Avatar>
              <Typography>
                {account.firstName} {account && Object.keys(account) && account.lastName}
              </Typography>
            </Box>
          </MenuItem>
          <MenuItem
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="subtitle2">Tema</Typography>
            <Button
              sx={{
                '&:hover': {
                  background: 'transparent',
                },
                '&:active': {
                  background: 'transparent',
                },
              }}
              onClick={() => handleChangeMode()}
              aria-controls={menuId}
            >
              <ThemeSwitchButton />
            </Button>
          </MenuItem>
          <MenuItem
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
            onClick={() => {
              handleProfile()
            }}
          >
            <Typography variant="subtitle2">Profil</Typography>
          </MenuItem>
          <Divider sx={{ my: 0.5 }} />
          <MenuItem
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
            onClick={handleLogout}
          >
            <Typography variant="subtitle2">Çıkış</Typography>
            <LogoutIcon />
          </MenuItem>
        </>
      }
      open={isMenuOpen}
      onClose={handleMenuClose}
      anchorEl={anchorEl}
    />
  )

  return (
    <Box sx={{ flexShrink: 0, width: 0 }}>
      <AppBar
        position="fixed"
        sx={{
          display: auth === true ? 'flex' : 'none',
          height: '65px',
          width: isMobile ? '100%' : dock ? 'calc(100% - 330px)' : 'calc(100% - 90px)',
          marginLeft: isMobile ? 0 : dock ? '330px' : '90px',
          left: 'auto',
          right: 0,
          boxShadow: 'none',
          backgroundColor: 'transparent',
          color: (theme) => theme.palette.secondary.contrastText,
        }}
        className={scrollDirection === 'down' && isMobile ? 'hidden' : ''}
      >
        <Toolbar sx={{ gap: 1, px: { xs: 1, md: 2 } }}>
          {/* Mobile hamburger — opens global search */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton size="large" edge="start" color="inherit" aria-label="aramayı aç" onClick={handleOpenSearch}>
              <MenuIcon />
            </IconButton>
          </Box>

          {/* Sol bosluk: aramanin ortalanmasini saglar, yer daralinca once bu kaybolur */}
          <Box sx={{ flex: 1, minWidth: 0, display: { xs: 'none', md: 'block' } }} />

          {/* Arama kutusu akis icinde durur: mutlak konumlandirilirsa dar
              ekranlarda sagdaki butonlarin altina girer. */}
          <Box
            sx={{
              flex: '1 1 560px',
              minWidth: 0,
              maxWidth: '560px',
              display: { xs: 'none', md: 'flex' },
              justifyContent: 'center',
            }}
          >
            <Button
              onClick={handleOpenSearch}
              disableElevation
              sx={{
                textTransform: 'none',
                width: '100%',
                maxWidth: '100%',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderRadius: '10px',
                border: (theme) => `1.5px solid ${theme.palette.divider}`,
                backgroundColor: (theme) => (theme.palette.mode === 'light' ? theme.palette.grey[50] : theme.palette.action.hover),
                color: 'text.disabled',
                px: 2,
                py: 1,
                height: '42px',
                boxShadow: (theme) => (theme.palette.mode === 'light' ? `0 2px 8px ${theme.palette.action.selected}` : 'none'),
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: (theme) => (theme.palette.mode === 'light' ? theme.palette.background.paper : theme.palette.action.selected),
                  boxShadow: (theme) => `0 0 0 3px ${theme.palette.primary.main}1F`,
                  color: 'text.secondary',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
                <GridSearchIcon fontSize="small" />
                <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                  Ara...{' '}
                  <Box component="span" sx={{ opacity: 0.7 }}>
                    (Ctrl+K)
                  </Box>
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                  borderRadius: '6px',
                  px: 1,
                  py: 0.2,
                  fontSize: '11px',
                  color: 'text.disabled',
                  fontFamily: 'monospace',
                  flexShrink: 0,
                }}
              >
                ⌘K
              </Box>
            </Button>
          </Box>

          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1, ml: 'auto', flexShrink: 0 }}>
            <IconButton
              size="medium"
              onClick={() => navigate(`/d:${depoCode}`)}
              color="inherit"
              sx={{
                display: { xs: 'flex', sm: 'none' },
                borderRadius: '12px',
                backgroundColor: (theme) => alpha(theme.palette.secondary.contrastText, 0.05),
                '&:hover': { backgroundColor: (theme) => alpha(theme.palette.secondary.contrastText, 0.12) },
              }}
            >
              <HomeIcon />
            </IconButton>

            <Button
              size="medium"
              onClick={handleDepoMenuOpen}
              startIcon={<LocationOnIcon sx={{ fontSize: '1.2rem !important', opacity: 0.8 }} />}
              endIcon={<KeyboardArrowDownIcon sx={{ fontSize: '1rem !important', opacity: 0.6 }} />}
              sx={{
                textTransform: 'none',
                color: 'inherit',
                fontWeight: 700,
                fontSize: '0.82rem',
                borderRadius: '12px',
                px: 2,
                py: 0.8,
                display: { xs: 'none', sm: 'flex' },
                backgroundColor: (theme) => alpha(theme.palette.secondary.contrastText, 0.08),
                boxShadow: 'none',
                border: (theme) => `1px solid ${alpha(theme.palette.secondary.contrastText, 0.1)}`,
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: (theme) => alpha(theme.palette.secondary.contrastText, 0.15),
                  borderColor: (theme) => alpha(theme.palette.secondary.contrastText, 0.2),
                  transform: 'translateY(-1px)',
                },
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {depoName || 'Depo Seçin'}
              </Typography>
            </Button>

            <IconButton
              size="medium"
              onClick={handleFeedbackMenuOpen}
              color="inherit"
              sx={{
                borderRadius: '12px',
                backgroundColor: (theme) => alpha(theme.palette.secondary.contrastText, 0.05),
                '&:hover': { backgroundColor: (theme) => alpha(theme.palette.secondary.contrastText, 0.12) },
              }}
            >
              <SupportAgentIcon />
            </IconButton>

            <NotificationProvider>
              <NotificationDisplay />
            </NotificationProvider>
            <IconButton
              size="small"
              onClick={handleProfileMenuOpen}
              color="inherit"
              sx={{
                ml: 0.5,
                p: 0.5,
                border: (theme) => `2px solid ${alpha(theme.palette.secondary.contrastText, 0.1)}`,
                '&:hover': {
                  borderColor: (theme) => alpha(theme.palette.secondary.contrastText, 0.3),
                  transform: 'scale(1.05)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: (theme) => theme.palette.primary.main,
                  fontSize: '0.85rem',
                  fontWeight: 700,
                }}
              >
                {account?.login?.charAt(0).toUpperCase() || 'U'}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <FeedbackContainer open={feedbackMenuOpen} handleClose={handleFeedbackMenuClose} />
      <GlobalSearchDialog open={globalSearchOpen} onClose={() => setGlobalSearchOpen(false)} />

      {renderAccoutMenu}
      {renderDepoMenu}
    </Box>
  )
}
