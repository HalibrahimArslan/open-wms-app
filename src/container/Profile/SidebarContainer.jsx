import { Avatar, Box, Typography, useTheme } from '@mui/material'
import { useNavigate } from 'react-router'
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import ConnectWithoutContactOutlinedIcon from '@mui/icons-material/ConnectWithoutContactOutlined'
import AddReactionOutlinedIcon from '@mui/icons-material/AddReactionOutlined'
import LinkIconButton from '../../components/Button/LinkIconButton'

function SidebarContainer({ account }) {
  const theme = useTheme()
  const nav = useNavigate()

  const handleItemClick = (link) => {
    nav(link)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        background: theme.palette.grey[100],
        borderRadius: theme.shape.borderRadius,
        px: 1.5,
        minHeight: '500px',
        minWidth: '100%',
        py: 2,
        gap: 10,
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar
          sx={{
            width: '100px',
            height: '100px',
            background: theme.palette.primary.main,
            fontSize: '36px',
          }}
        >
          {account?.firstName ? account.firstName[0].toUpperCase() : ''}
        </Avatar>
        <Typography fontWeight={theme.typography.fontWeightMedium} variant="h6">
          {account?.firstName} {account?.lastName}
        </Typography>
      </Box>
      <LinkIconButton
        list={[
          {
            icon: <PersonOutlineOutlinedIcon />,
            text: 'Kullanıcı Bilgilerim',
            onClick: () => handleItemClick('user-informations?free-view=true'),
          },
          {
            icon: <NotificationsActiveOutlinedIcon />,
            text: 'Bildirimler',
            onClick: () => handleItemClick('notifications?free-view=true'),
          },
          {
            icon: <AddReactionOutlinedIcon />,
            text: 'Hareketler',
            onClick: () => handleItemClick('movements?free-view=true'),
          },
          {
            icon: <ConnectWithoutContactOutlinedIcon />,
            text: 'Talepler',
            onClick: () => handleItemClick('demands?free-view=true'),
          },
        ]}
      />
    </Box>
  )
}

export default SidebarContainer
