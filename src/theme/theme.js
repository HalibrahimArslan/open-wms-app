import { green, red } from '@mui/material/colors'
import { trTR } from '@mui/material/locale'
import { trTR as dataGridTrTR } from '@mui/x-data-grid/locales'
import { createTheme } from '@mui/material/styles'

/**
 * Kose yariçapi olcegi.
 *
 * Degerler string ("12px") olarak tutulur, cunku MUI'nin sx prop'u
 * borderRadius'a verilen SAYIYI theme.shape.borderRadius ile carpar:
 * `borderRadius: theme.shape.borderRadius` yazmak 5 degil 25 piksel verir ve
 * ic kutular dis kutulardan daha oval gorunur. String deger oldugu gibi
 * gectigi icin ayni token hem sx hem styled() icinde ayni sonucu uretir.
 *
 * Ic ice kutularda yariçap disaridan iceri dogru azalmali; esit ya da artan
 * yariçap koseleri orantisiz gosterir.
 */
const radius = {
  panel: '24px', // sayfa govdesi (en distaki cerceve)
  section: '16px', // govde icindeki panel
  card: '12px', // panel icindeki kart
  control: '8px', // buton, input, chip
}

// MUI v9 ListItemIcon varsayilan genisligini 56px'ten 36px'e indirdi; menu
// listelerindeki hizalama bozulmasin diye eski deger korunur.
const listItemIconCompat = {
  components: {
    MuiListItemIcon: {
      styleOverrides: {
        root: { minWidth: 56 },
      },
    },
  },
}

// MUI X'in Turkce locale'inde sayfa araligi metni cevrilmemis; MUI v5'teki
// "0–10 / 25" bicimi korunur.
const dataGridLocaleCompat = {
  components: {
    MuiDataGrid: {
      defaultProps: {
        localeText: {
          paginationDisplayedRows: ({ from, to, count }) => `${from}–${to} / ${count !== -1 ? count : `${to} üzeri`}`,
        },
      },
    },
  },
}

const lightMode = createTheme(
  {
    palette: {
      mode: 'light',
      primary: {
        main: '#582931',
        light: '#7A3D47',
        dark: '#3D1B22',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#F2E4E6',
        light: '#FAF0F1',
        dark: '#D9C0C3',
        contrastText: '#3D1B22',
      },
      warning: {
        main: '#D4845A',
      },
      success: {
        main: '#CAD8BE',
        light: '#B8CEB3',
      },
      error: {
        main: '#F88379',
        light: '#E57373',
      },

      button: {
        success: {
          main: green[100],
          hover: green[200],
        },
        error: {
          main: red[100],
          hover: red[200],
        },
      },
      order: {
        primary: {
          successful: green[100],
          error: red[100],
        },
      },

      background: {
        default: '#FBF5F6',
        paper: '#FFFFFF',
      },

      text: {
        primary: '#2A1519',
        secondary: '#6B4047',
      },
    },

    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 10,
              '& fieldset': {
                borderColor: '#D9C0C3',
              },
              '&:hover fieldset': {
                borderColor: '#7A3D47',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#582931',
              },
            },
          },
        },
      },

      MuiListItemButton: {
        styleOverrides: {
          root: {
            '&:hover': {
              backgroundColor: '#F2E4E6',
              borderRadius: 10,
            },
          },
        },
      },

      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: 10,
          },
        },
      },

      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 15,
            textTransform: 'capitalize',
          },
          containedSecondary: {
            backgroundColor: '#F2E4E6',
            color: '#3D1B22',
            '&:hover': {
              backgroundColor: '#D9C0C3',
            },
          },
        },
      },

      MuiSelect: {
        styleOverrides: {
          root: {
            borderRadius: 10,
          },
        },
      },

      MuiTablePagination: {
        defaultProps: {
          labelRowsPerPage: 'Sayfa Başına Satır',
        },
      },
    },

    typography: {
      fontSize: 12,
      letterSpacing: 0.25,
      fontWeightLight: 100,
      fontWeightRegular: 400,
      fontWeightMedium: 500,
      fontWeightBold: 700,
    },

    shape: {
      borderRadius: 5,
    },

    radius,
  },
  trTR,
  dataGridTrTR,
  dataGridLocaleCompat,
  listItemIconCompat
)

const darkMode = createTheme(
  {
    palette: {
      mode: 'dark',
      primary: {
        main: '#582931',
        light: '#7A3D47',
        dark: '#3D1B22',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#3D2428',
        light: '#4F2F34',
        dark: '#2A1519',
        contrastText: '#F2E4E6',
      },
      background: {
        default: '#1E1215',
        paper: '#2A1A1D',
      },

      text: {
        primary: '#F2E4E6',
        secondary: '#C4999F',
      },

      button: {
        success: {
          main: green[100],
          hover: green[200],
        },
        error: {
          main: red[100],
          hover: red[200],
        },
      },

      order: {
        primary: {
          successful: green[100],
          error: red[100],
        },
      },
    },

    typography: {
      fontSize: 12,
      letterSpacing: 0.25,
      fontWeightLight: 100,
      fontWeightRegular: 400,
      fontWeightMedium: 500,
      fontWeightBold: 700,
    },

    shape: {
      borderRadius: 6,
    },

    radius,
  },
  dataGridTrTR,
  dataGridLocaleCompat,
  listItemIconCompat
)

export default lightMode
export { darkMode }
