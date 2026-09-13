import { Box, useMediaQuery, useTheme } from '@mui/material'
import LayoutSelector from '../../components/LayoutSelector'
import AppWithState from '../../routes/AppWithState'
import ErrorBoundary from '../../shared/components/ErrorBoundary'
import { useContainer } from 'unstated-next'
import { DataStore } from '../../store/DataStore'

const Home = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
  const { dock } = useContainer(DataStore)
  return (
    <Box
      component="main"
      flex={1}
      sx={{
        flexGrow: 1,
        marginTop: '65px',
        marginRight: '8px',
        marginBottom: '8px',
        marginLeft: isMobile ? '4px' : dock ? '241px' : '4px',
        backgroundColor: theme.palette.background.default,
        borderRadius: '24px',
        height: 'calc(100vh - 70px)',
        overflowY: 'auto',
        overflowX: 'hidden',
        padding: {
          md: theme.spacing(1.5),
          sm: 0,
        },
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: 'none',
      }}
    >
      <LayoutSelector>
        <ErrorBoundary>
          <AppWithState />
        </ErrorBoundary>
      </LayoutSelector>
    </Box>
  )
}

export default Home
