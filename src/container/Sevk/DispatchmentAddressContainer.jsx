import { useEffect, useState } from 'react'
import { Box, Chip, Collapse, FormControlLabel, Grid, IconButton, Paper, Switch, Typography, useTheme } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import AddressRecommendationItem from '../../components/Address/AddressRecommendationItem'
import NotFound from '../../shared/components/NotFound/NotFound'
import BasicSlider from '../../shared/components/Slider/BasicSlider'

function DispatchmentAddressContainer({ addressList }) {
  const theme = useTheme()
  const [addresses, setAddresses] = useState([])
  const [selectedStockCodes, setSelectedStockCodes] = useState([])
  const [open, setOpen] = useState(true)

  const handleChange = () => {
    setOpen(!open)
  }

  const toDto = (item, size) => ({
    stockCode: item.stokKod,
    miktar: item.miktar,
    address: item?.urunAdres?.adres ?? '',
    size,
  })

  const sortByAddress = (list) => [...list].sort((a, b) => ((a?.urunAdres?.adres ?? '') > (b?.urunAdres?.adres ?? '') ? 1 : -1))

  const modifyAddresses = () => {
    const addressSorted = sortByAddress(addressList)
    const distinctStockCodes = [...new Set(addressSorted.map((q) => q.stokKod))]

    const response = distinctStockCodes.map((stockCode) => {
      const searchItem = addressSorted.filter((q) => q.stokKod === stockCode)
      return toDto(searchItem[0], searchItem.length)
    })
    setAddresses(response)
  }

  useEffect(() => {
    if (addressList.length > 0) {
      if (selectedStockCodes.length === 0) {
        modifyAddresses()
      } else {
        const addressSorted = sortByAddress(addressList)
        const newList = addressSorted.filter((q) => selectedStockCodes.includes(q.stokKod)).map((q) => toDto(q, 1))
        setAddresses(newList)
      }
    }
  }, [addressList, selectedStockCodes])

  const handleAllAddress = (stockCode) => {
    if (!selectedStockCodes.some((q) => q === stockCode)) {
      setSelectedStockCodes((current) => [...current, stockCode])
    }
  }
  const handleDelete = (item) => {
    let newList = selectedStockCodes.filter((q) => q !== item)
    setSelectedStockCodes(newList)
  }

  const handleAllClear = () => {
    setSelectedStockCodes([])
  }

  if (addressList && addressList.length === 0) {
    return <NotFound msg={'Sipariş ürünleri için adres bulunamadı.'} />
  }

  return (
    <Paper
      elevation={0}
      sx={{
        mb: 2,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        overflow: 'hidden',
        background: theme.palette.background.default,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 2,
          py: 1.5,
          backgroundColor: theme.palette.mode === 'light' ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)',
          borderBottom: open ? `1px solid ${theme.palette.divider}` : 'none',
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 800,
            color: theme.palette.text.primary,
            textTransform: 'uppercase',
            fontSize: '0.75rem',
            letterSpacing: '0.1em',
          }}
        >
          Adres Önerileri
        </Typography>
        <FormControlLabel
          sx={{ m: 0 }}
          control={<Switch size="small" checked={open} />}
          onChange={handleChange}
          label={
            <Typography variant="caption" sx={{ fontWeight: 700, color: open ? theme.palette.primary.main : theme.palette.text.disabled }}>
              {open ? 'ADRESLERİ GİZLE' : 'ADRESLERİ GÖSTER'}
            </Typography>
          }
          labelPlacement="start"
        />
      </Box>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <Grid container direction="column">
          <Grid item>
            {selectedStockCodes.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
                <IconButton size="small" onClick={handleAllClear} sx={{ mr: 1 }}>
                  <CloseIcon fontSize="small" />
                </IconButton>
                {selectedStockCodes.map((item) => (
                  <Chip key={item} label={item} size="small" variant="outlined" onDelete={() => handleDelete(item)} />
                ))}
              </Box>
            )}
          </Grid>

          <Grid item sx={{ p: 2 }}>
            {addressList && theme && (
              <BasicSlider
                bgImage={true}
                children={addresses.map((addressItem, _) => (
                  <AddressRecommendationItem key={`${_}-${addressItem}`} handleAllAddress={handleAllAddress} item={addressItem} theme={theme} />
                ))}
              />
            )}
          </Grid>
        </Grid>
      </Collapse>
    </Paper>
  )
}

export default DispatchmentAddressContainer
