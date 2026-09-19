import { Paper, Stack, Typography, useTheme } from '@mui/material'

/**
 * Listelerin ortak cercevesi: cerceveli bir Paper, ustunde baslik + sayac
 * rozetleri ve sag tarafta islem alani (arama, Excel gibi), altinda tablo.
 *
 * Mal kabul, sevkiyat ve tekil barkod ekranlari ayni tabloyu farkli
 * cercevelerle gosteriyordu; hepsi buraya baglandi ki liste ekranlari ayni
 * gorunumu paylassin. Icerik olarak hem MUI Table hem DataGrid alabilir.
 */
export default function TablePanel({ title, meta, actions, children, sx }) {
  const theme = useTheme()
  const hasHeader = Boolean(title || meta || actions)

  return (
    <Paper variant="outlined" sx={{ borderRadius: theme.radius.card, overflow: 'hidden', ...sx }}>
      {hasHeader && (
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1.5}
          sx={{
            justifyContent: 'space-between',
            alignItems: { xs: 'stretch', sm: 'center' },
            paddingX: 2,
            paddingY: 1.5,
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            useFlexGap
            sx={{
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            {title && (
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 700,
                }}
              >
                {title}
              </Typography>
            )}
            {meta}
          </Stack>

          {actions && (
            <Stack
              direction="row"
              spacing={1}
              sx={{
                alignItems: 'center',
              }}
            >
              {actions}
            </Stack>
          )}
        </Stack>
      )}

      {children}
    </Paper>
  )
}

/**
 * Tablo basliklarinin ortak gorunumu. MUI Table kullanan ekranlarda
 * <TableHead sx={tableHeadSx}> seklinde uygulanir; DataGrid tarafinda ayni
 * gorunum dataGridSx icinde uretiliyor.
 */
export const tableHeadSx = {
  '& th': {
    backgroundColor: 'secondary.main',
    fontWeight: 700,
    whiteSpace: 'nowrap',
  },
}

/** DataGrid'i MUI Table gorunumune yaklastiran ortak stil. */
export const dataGridSx = (theme) => ({
  border: 0,
  '& .MuiDataGrid-columnHeaders': {
    backgroundColor: theme.palette.secondary.main,
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  '& .MuiDataGrid-columnHeaderTitle': {
    fontWeight: 700,
  },
})
