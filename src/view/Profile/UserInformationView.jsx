import { Box } from '@mui/material'
import UserInfoContainer from '../../container/Profile/UserInfoContainer'

function UserInformationView() {
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'start',
      }}
    >
      <UserInfoContainer />
    </Box>
  )
}

export default UserInformationView
