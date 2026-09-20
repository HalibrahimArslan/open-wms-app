import { Box, InputAdornment, TextField } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { QuickFilter, QuickFilterControl, Toolbar } from '@mui/x-data-grid'

/**
 * Tablolarin kendi seridindeki arama kutusu.
 *
 * Arama alani cercevesiz ve genislik verilmemis halde ciziliyordu: serit
 * boyunca yayiliyor, buyutec ikonu seridin en saginda tek basina kaliyor ve
 * alanin bir arama kutusu oldugu anlasilmiyordu. Artik ekranin geri kalaniyla
 * ayni cerceveli girdi.
 *
 * Kutunun kendisini biz ciziyoruz: eski GridToolbarQuickFilter yalnizca
 * slotProps.root uzerinden ayarlaniyor ve izgaranin taban girdi slotu ile
 * geliyordu, yani gorunumu ekranin diger girdilerinden bagimsizdi.
 *
 * Basligin karsisinda arama isteyen ekranlar bunun yerine TableSearchField'i
 * ActionHeader'in actions alaninda kullanir.
 */
const CustomToolbar = () => {
  return (
    <Toolbar
      render={
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            paddingX: 0,
            paddingY: 1,
          }}
        />
      }
    >
      <QuickFilter debounceMs={500}>
        <QuickFilterControl
          render={
            <TextField
              size="small"
              variant="outlined"
              placeholder="Tabloda ara"
              sx={{ width: { xs: '100%', sm: 260 } }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                },
              }}
            />
          }
        />
      </QuickFilter>
    </Toolbar>
  )
}

export default CustomToolbar
