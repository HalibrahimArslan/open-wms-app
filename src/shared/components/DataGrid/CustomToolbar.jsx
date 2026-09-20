import { Box } from '@mui/material'
import { GridToolbarQuickFilter, Toolbar } from '@mui/x-data-grid'

/**
 * Tablolarin ustundeki arama seridi.
 *
 * Arama kutusu genislik verilmedigi icin seridin tamamina yayiliyor, boylece
 * tablo ile arasinda bos bir bant olusuyor ve buyutec simgesi ekranin en
 * saginda tek basina kaliyordu. Kutu artik sabit genislikte ve serit tablodan
 * ince bir cizgiyle ayriliyor.
 *
 * GridToolbarQuickFilter MUI X 9'da kullanimdan kaldirildi ama hala calisiyor;
 * yeni QuickFilter bilesenine gecis bu tablolarin hepsini birlikte etkiledigi
 * icin ayri yapilmali.
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
            paddingX: 1.5,
            paddingY: 1,
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        />
      }
    >
      <GridToolbarQuickFilter
        debounceMs={500}
        slotProps={{
          root: {
            placeholder: 'Tabloda ara',
            size: 'small',
            style: { width: 260, maxWidth: '100%' },
          },
        }}
      />
    </Toolbar>
  )
}

export default CustomToolbar
