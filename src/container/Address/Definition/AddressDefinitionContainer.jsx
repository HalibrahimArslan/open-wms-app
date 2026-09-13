import Grid from '@mui/material/Grid'
import { Outlet, useNavigate } from 'react-router'
import { Box, Divider, IconButton, List, ListItemButton, ListItemText, useTheme } from '@mui/material'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import FitItem from '../../../components/Layout/FitItem'

let definitionList = [
  {
    page: 'Adres Tipi',
    path: 'address-type',
  },
  {
    page: 'Bölüm',
    path: 'department',
  },
  {
    page: 'Koridor',
    path: 'hall',
  },
  {
    page: 'Unite',
    path: 'unit',
  },
  {
    page: 'Kat',
    path: 'flat',
  },
  {
    page: 'Oda',
    path: 'room',
  },
]
export default function AddressDefinitionContainer() {
  const theme = useTheme()
  const nav = useNavigate()

  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={4} position={'relative'}>
          <FitItem>
            <List sx={{ display: 'flex', flexDirection: 'column', gap: 1, pl: 1, pr: 1 }}>
              {definitionList.map((item) => (
                <ListItemButton
                  sx={{ bgcolor: theme.palette.action.hover, borderRadius: 3, cursor: 'pointer' }}
                  onClick={() => {
                    nav(`${item.path}`)
                  }}
                >
                  <ListItemText primary={item.page} />
                  <IconButton disableRipple>
                    <ChevronRightIcon />
                  </IconButton>
                </ListItemButton>
              ))}
            </List>
          </FitItem>
        </Grid>
        <Grid item xs={8}>
          <FitItem>
            <Box sx={{ p: 1 }}>
              <Outlet />
            </Box>
          </FitItem>
        </Grid>
      </Grid>
    </>
  )
}
