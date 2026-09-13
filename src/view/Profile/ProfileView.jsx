import { useContainer } from 'unstated-next'
import { Box, useTheme } from '@mui/material'
import { Outlet } from 'react-router'
import SidebarContainer from '../../container/Profile/SidebarContainer'
import { DataStore } from '../../store/DataStore'
import useIsMobile from '../../hooks/useIsMobile'
function ProfileView() {
  const { account } = useContainer(DataStore)
  const theme = useTheme()
  const isMobile = useIsMobile()

  return (
    <Box
      sx={{
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        gap: 5,
        flexDirection: isMobile ? 'column' : 'row',
      }}
    >
      <Box sx={{ display: 'flex', flex: 1 }}>{account && <SidebarContainer account={account} />}</Box>
      <Box
        sx={{
          display: 'flex',
          flex: 4,
          backgroundColor: 'background.paper',
          padding: 2,
          borderRadius: theme.shape.borderRadius,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  )
}

export default ProfileView
