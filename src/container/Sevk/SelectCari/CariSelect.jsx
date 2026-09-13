import { useState, useEffect } from 'react'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import BusinessIcon from '@mui/icons-material/Business'
import { useNavigate, useParams } from 'react-router-dom'
import { executeServiceMikro } from '../../../services/MikroService'
import SearchBox from '../../../components/SearchBox'
import { Chip, useTheme, Stack, Box, Button, Menu, MenuItem } from '@mui/material'
import LoadingSpinner from '../../../components/Loading/LoadingSpinner'
import { useSWRConfig } from 'swr'
import useDepoCode from '../../../hooks/useDepoCode'
import NotFound from '../../../shared/components/NotFound/NotFound'
import { notifyError } from '../../../layout/Layout'
import usePayload from '../../../hooks/usePayload'
import SwapVertIcon from '@mui/icons-material/SwapVert'

function CariSelect() {
  const navigate = useNavigate()
  const theme = useTheme()
  const depoCode = useDepoCode()
  const { cache } = useSWRConfig()
  const { menuId } = useParams()

  const [firmList, setFirmList] = useState([])
  const [filteredList, setFilteredList] = useState([])
  const [loading, setLoading] = useState(false)
  const [inputText, setInputText] = useState('')
  const [sortKey, setSortKey] = useState('cariUnvan')
  const [anchorEl, setAnchorEl] = useState(null)

  const openMenu = Boolean(anchorEl)

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const sortOptions = [
    { label: 'Cari Ünvan', value: 'cariUnvan' },
    { label: 'Bölge Adı', value: 'bolgeAdi' },
  ]

  const payload = usePayload({
    serviceName: 'depoService.getFirmListOrderExists',
    data: {
      sipTip: 0,
      depoNo: depoCode,
      cbt: 2,
      cariKod: 'ALL',
    },
  })

  const handleChangeSearch = (search) => {
    setInputText(search)
  }

  const handleChangeSort = (value) => {
    setSortKey(value)
    handleMenuClose()
  }

  const fetchFirmListData = async () => {
    try {
      setLoading(true)
      const res = await executeServiceMikro(payload)
      if (res) {
        setFirmList(res)
        setFilteredList(res)
        cache.set('cariSelect', res)
      }
      setLoading(false)
    } catch (err) {
      setLoading(false)
      notifyError(err.message)
    }
  }

  const handleListItemClick = (firmCode) => {
    navigate(`/d:${depoCode}/${menuId}/${firmCode}/orderprogresssevkiyat`)
  }

  useEffect(() => {
    fetchFirmListData()
  }, [])

  useEffect(() => {
    const normalizedSearch = inputText.trim().toLowerCase()

    const filtered = firmList.filter((item) => {
      if (!item?.cariUnvan) return false
      return item.cariUnvan.toLowerCase().includes(normalizedSearch)
    })

    const sorted = filtered.slice().sort((a, b) => {
      const aValue = (a?.[sortKey] || '').toString().toLowerCase()
      const bValue = (b?.[sortKey] || '').toString().toLowerCase()
      return aValue.localeCompare(bValue, 'tr', { sensitivity: 'base' })
    })

    setFilteredList(sorted)
  }, [inputText, firmList, sortKey])

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <>
      <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'stretch', sm: 'center' }} justifyContent="space-between" spacing={2} sx={{ mb: 2 }}>
        <Box sx={{ flex: 1, minWidth: 230 }}>
          <SearchBox search={inputText} handleChangeSearch={handleChangeSearch} searchLabel="Cari Ünvan Ara" zIndex={false} />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-end', sm: 'auto' } }}>
          <Button
            onClick={handleMenuClick}
            variant="outlined"
            endIcon={<SwapVertIcon color="primary" />}
            sx={{
              borderRadius: '20px',
              textTransform: 'none',
              color: 'text.primary',
              borderColor: theme.palette.divider,
              backgroundColor: theme.palette.background.paper,
              '&:hover': {
                borderColor: theme.palette.primary.main,
                backgroundColor: theme.palette.action.hover,
              },
              fontWeight: 500,
              px: 2,
              py: 1,
              boxShadow: theme.shadows[1],
            }}
          >
            {sortOptions.find((opt) => opt.value === sortKey)?.label || 'Sıralama'}
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleMenuClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
            PaperProps={{
              elevation: 3,
              sx: {
                borderRadius: 2,
                mt: 1.5,
                minWidth: 180,
                '& .MuiMenuItem-root': {
                  px: 2,
                  py: 1,
                  typography: 'body2',
                  fontWeight: 500,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            {sortOptions.map((option) => (
              <MenuItem
                key={option.value}
                selected={option.value === sortKey}
                onClick={() => handleChangeSort(option.value)}
                sx={{
                  color: option.value === sortKey ? theme.palette.primary.main : 'text.primary',
                  backgroundColor: option.value === sortKey ? theme.palette.action.selected : 'transparent',
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.action.selected,
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                    },
                  },
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                {option.label}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Stack>

      <List
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: 0.5,
        }}
        aria-labelledby="nested-list-subheader"
      >
        {filteredList && filteredList.length > 0 ? (
          filteredList.map((item) => (
            <ListItemButton
              key={item.cariKod}
              onClick={() => handleListItemClick(item.cariKod, item.cariUnvan)}
              sx={{
                bgcolor: theme.palette.secondary.main,
                mb: 1,
                borderRadius: theme.shape.borderRadius,
                py: 1.25,
                px: 2,
                boxShadow: 1,
                transition: 'box-shadow 200ms',
                '&:hover': { boxShadow: 3 },
              }}
            >
              <ListItemIcon>
                <BusinessIcon />
              </ListItemIcon>
              <ListItemText
                sx={{ wordWrap: 'break-word' }}
                primary={item.cariUnvan}
                secondary={item.cariKod}
                primaryTypographyProps={{ variant: 'subtitle1', fontWeight: 600, color: 'text.primary' }}
                secondaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
              />
              <Chip label={item.bolgeAdi} />
            </ListItemButton>
          ))
        ) : filteredList && filteredList.length === 0 && inputText.length > 0 ? (
          <NotFound msg={'Eşleşme Bulunamadı'} />
        ) : filteredList && filteredList.length === 0 && inputText.length === 0 ? (
          <NotFound msg={'Firma Bulunamadı'} />
        ) : (
          <LoadingSpinner />
        )}
      </List>
    </>
  )
}

export default CariSelect
