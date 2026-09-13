import { green, red } from '@mui/material/colors'
import { trTR } from '@mui/material/locale'
import { createTheme } from '@mui/material/styles'

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
  },
  trTR
)

const darkMode = createTheme({
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
})

export default lightMode
export { darkMode }
