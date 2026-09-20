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
  control: '10px', // buton, input, select, chip
}

const typography = {
  fontSize: 12,
  letterSpacing: 0.25,
  fontWeightLight: 100,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 700,
}

const shape = {
  borderRadius: 5,
}

/**
 * Acik tema paleti.
 *
 * Uygulamanin yuzey duzeni: en altta background.default, uzerinde sayfa govdesi
 * (secondary.main), en ustte kartlar (surface.card). Bilesenlerde sabit renk
 * yazilmaz; asagidaki surface/border token'lari kullanilir ki tema degisince
 * renkler de degissin.
 */
const lightPalette = {
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

  /** Yuzeyler: sayfa paneli, kart, ikincil kutu ve filtre paneli zeminleri. */
  surface: {
    panel: '#FFFFFF',
    card: '#FFFFFF',
    subtle: '#F5F5F5',
    filter: '#F2F5FF',
    hover: '#F2E4E6',
  },

  /** Kenarliklar: input cerceveleri ve kart sinirlari. */
  border: {
    rest: '#D9C0C3',
    hover: '#7A3D47',
    focus: '#582931',
    subtle: 'rgba(0, 0, 0, 0.08)',
  },
}

/**
 * Karanlik tema paleti.
 *
 * Yuzeyler notr gri basamaklardan olusur (#121212 -> #1E1E1E -> #2D2D2D);
 * marka bordosu genis zeminlerde degil yalnizca vurgu olarak kullanilir. Eski
 * palette her yuzey ayni koyu bordo tonundaydi ve kart/zemin kontrasti 1.10'da
 * kaliyordu, yani kartlar ve butonlar zeminde kayboluyordu.
 *
 * Bordo karanlikta aciltilir (#9F606A): gri zeminde secilir (3.6) ve uzerindeki
 * beyaz yazi okunur kalir (4.8, WCAG AA). Metin olarak kullanilan yerlerde
 * (outlined/text buton, ikon) daha acik ton (#C58791, 5.2-6.0) kullanilir.
 */
const darkPalette = {
  mode: 'dark',
  primary: {
    main: '#9F606A',
    light: '#C58791',
    dark: '#7A4750',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#1E1E1E',
    light: '#2D2D2D',
    dark: '#171717',
    contrastText: '#EDEDED',
  },
  warning: {
    main: '#E0A170',
  },
  success: {
    main: '#A5C9A1',
    light: '#BBD8B8',
  },
  error: {
    main: '#E98D86',
    light: '#F2A9A3',
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
    default: '#121212',
    paper: '#2D2D2D',
  },

  text: {
    primary: '#EDEDED',
    secondary: '#A6A6A6',
  },

  divider: 'rgba(255, 255, 255, 0.12)',

  surface: {
    // Sayfa paneli zemindir, kartlar onun uzerinde bir basamak yukaridadir.
    panel: '#1E1E1E',
    card: '#2D2D2D',
    subtle: '#262626',
    filter: '#262626',
    hover: 'rgba(255, 255, 255, 0.08)',
  },

  border: {
    rest: 'rgba(255, 255, 255, 0.18)',
    hover: '#C58791',
    focus: '#9F606A',
    subtle: 'rgba(255, 255, 255, 0.10)',
  },
}

/**
 * Bilesen ayarlari her iki temada da aynidir; renkler paletten okunur. Once
 * yalnizca acik temada tanimliydi, bu yuzden karanlik temada input yariçaplari
 * ve sayfalama etiketi gibi ayarlar uygulanmiyordu.
 */
const buildComponents = (theme) => {
  const { palette } = theme
  const isDark = palette.mode === 'dark'
  // Bilesen yariçaplari olcekten okunur. Once her biri kendi sabitini
  // tasiyordu (buton 15, input/select/alert 10) ve hicbiri yukaridaki
  // olcege uymuyordu; ayni ekranda uc dort farkli yariçap yan yana geliyordu.
  const { control, card } = theme.radius

  return {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: control,
            '& fieldset': {
              borderColor: palette.border.rest,
            },
            '&:hover fieldset': {
              borderColor: palette.border.hover,
            },
            '&.Mui-focused fieldset': {
              borderColor: palette.border.focus,
            },
          },
        },
      },
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: palette.surface.hover,
            borderRadius: control,
          },
        },
      },
    },

    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: card,
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: control,
          textTransform: 'capitalize',
        },
        containedSecondary: {
          backgroundColor: palette.secondary.main,
          color: palette.secondary.contrastText,
          '&:hover': {
            backgroundColor: palette.secondary.dark,
          },
        },
        // Karanlikta dolgusuz butonlarin yazisi primary.main ile okunakli
        // degil (3.1); acik ton kullanilir.
        ...(isDark && {
          textPrimary: {
            color: palette.primary.light,
          },
          outlinedPrimary: {
            color: palette.primary.light,
            borderColor: palette.border.rest,
          },
        }),
      },
    },

    ...(isDark && {
      MuiIconButton: {
        styleOverrides: {
          colorPrimary: {
            color: palette.primary.light,
          },
        },
      },

      // Karanlikta yuzey basamaklari arasindaki fark kucuktur; kartlar ince
      // bir kenarlikla ayrilir. MUI'nin elevation overlay'i kapatilir ki
      // yuzey renkleri paletten geldigi gibi kalsin.
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            border: `1px solid ${palette.border.subtle}`,
          },
        },
      },
    }),

    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: control,
        },
      },
    },

    MuiTablePagination: {
      defaultProps: {
        labelRowsPerPage: 'Sayfa Başına Satır',
      },
    },
  }
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

/** Palet disindaki her sey iki temada ortaktir. */
const buildTheme = (palette) => {
  const base = createTheme({ palette, typography, shape, radius })
  return createTheme(base, { components: buildComponents(base) }, trTR, dataGridTrTR, dataGridLocaleCompat, listItemIconCompat)
}

const lightMode = buildTheme(lightPalette)
const darkMode = buildTheme(darkPalette)

export default lightMode
export { darkMode }
