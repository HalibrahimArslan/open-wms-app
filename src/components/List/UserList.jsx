import * as React from 'react'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import LockResetIcon from '@mui/icons-material/LockReset'
import PersonOutlineIcon from '@mui/icons-material/PersonOutlineOutlined'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import { Avatar, Box, Chip, Grid, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material'
import MoreVertButton from '../MenuWrapper/MoreVertButton'
import ToggleOnIcon from '@mui/icons-material/ToggleOn'
import ToggleOffIcon from '@mui/icons-material/ToggleOff'
import SplitButton from '../Button/SplitButton'
import { alpha } from '@mui/material/styles'

function UserStatus({ activated }) {
  const theme = useTheme()
  const statusColor = activated ? theme.palette.success.main : theme.palette.error.main
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.75,
        px: 1,
        py: 0.25,
        borderRadius: theme.radius.control,
        bgcolor: alpha(statusColor, 0.16),
        color: 'text.primary',
        typography: 'caption',
        fontWeight: theme.typography.fontWeightMedium,
        width: 'fit-content',
      }}
    >
      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: statusColor }} />
      {activated ? 'Aktif' : 'Pasif'}
    </Box>
  )
}

function UserAvatar({ user }) {
  const theme = useTheme()
  return (
    <Avatar
      sx={{
        width: 40,
        height: 40,
        bgcolor: user.activated ? theme.palette.primary.main : theme.palette.action.disabled,
        color: theme.palette.primary.contrastText,
      }}
    >
      {user.login.charAt(0).toUpperCase()}
    </Avatar>
  )
}

export default function UserList({ onEdit, users, onClick, onResetPassword }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const formatLastModifiedDate = (isoString) => {
    if (!isoString) return '-'
    const date = new Date(isoString)
    if (Number.isNaN(date.getTime())) return '-'

    const pad2 = (n) => String(n).padStart(2, '0')
    const yyyy = date.getFullYear()
    const mm = pad2(date.getMonth() + 1)
    const dd = pad2(date.getDate())
    const hh = pad2(date.getHours())
    const min = pad2(date.getMinutes())
    return `${yyyy}-${mm}-${dd} ${hh}:${min}`
  }

  if (isMobile) {
    return (
      <Grid container spacing={2}>
        {users.map((user, index) => (
          <Grid
            key={user.id || index}
            size={{
              xs: 12,
              sm: 6,
            }}
          >
            <Box
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: theme.palette.surface.card,
                gap: 1.5,
                borderRadius: theme.radius.card,
                border: `1px solid ${theme.palette.border.subtle}`,
                height: 260,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
                <Box sx={{ display: 'flex', gap: 1.25, alignItems: 'center', minWidth: 0 }}>
                  <UserAvatar user={user} />
                  <Box sx={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography variant="subtitle2" noWrap sx={{ fontWeight: theme.typography.fontWeightMedium }}>
                      {user.login}
                    </Typography>
                    <UserStatus activated={user.activated} />
                  </Box>
                </Box>

                <MoreVertButton
                  btnList={[
                    {
                      id: Number(user.id),
                      icon: user.activated ? (
                        <ToggleOffIcon sx={{ fontSize: '20px', color: theme.palette.error.main }} />
                      ) : (
                        <ToggleOnIcon sx={{ fontSize: '20px', color: theme.palette.success.main }} />
                      ),
                      name: user.activated ? 'Pasife Çek' : 'Aktife Çek',
                      onClick: () => onClick(user),
                    },
                    {
                      id: Number(user.id),
                      name: 'Düzenle',
                      icon: <EditOutlinedIcon sx={{ fontSize: '20px' }} />,
                      onClick: () => onEdit(user),
                    },
                    {
                      id: Number(user.id),
                      name: 'Şifre Sıfırla',
                      icon: <LockResetIcon sx={{ fontSize: '20px' }} />,
                      onClick: () => onResetPassword(user),
                    },
                    { type: 'divider' },
                    {
                      id: Number(user.id),
                      name: `Güncelleyen: ${user.lastModifiedBy || '-'}`,
                      icon: <PersonOutlineIcon sx={{ fontSize: '18px' }} />,
                      disabled: true,
                      variant: 'info',
                    },
                    {
                      id: Number(user.id),
                      name: `Tarih: ${formatLastModifiedDate(user.lastModifiedDate)}`,
                      icon: <AccessTimeIcon sx={{ fontSize: '18px' }} />,
                      disabled: true,
                      variant: 'info',
                    },
                  ]}
                />
              </Box>

              <Box
                sx={{
                  backgroundColor: theme.palette.surface.subtle,
                  borderRadius: theme.radius.control,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  minWidth: 0,
                  p: 1.5,
                  flex: 1,
                  textAlign: 'left',
                }}
              >
                <Typography variant="body2" noWrap sx={{ color: 'text.secondary' }}>
                  {user.email || '-'}
                </Typography>

                <Box
                  sx={{
                    flex: 1,
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 0.75,
                    alignItems: 'flex-start',
                    overflowY: 'auto',
                    pr: 0.5,
                    '&::-webkit-scrollbar': { width: 0, height: 0 },
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                  }}
                >
                  {(Array.isArray(user.authorities) ? user.authorities : []).map((authority) => (
                    <Tooltip title={authority} key={authority}>
                      <Chip size="small" label={authority} color="default" />
                    </Tooltip>
                  ))}
                </Box>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {users.map((user) => (
        <Box
          sx={{
            backgroundColor: theme.palette.surface.subtle,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            borderRadius: theme.radius.card,
            px: 2,
            py: 1.5,
            transition: theme.transitions.create('background-color', { duration: theme.transitions.duration.shortest }),
            '&:hover': { backgroundColor: theme.palette.surface.hover },
          }}
          key={user.id}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, minWidth: 0 }}>
            <UserAvatar user={user} />
            <Box sx={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography variant="subtitle2" noWrap sx={{ fontWeight: theme.typography.fontWeightMedium }}>
                {user.login}
              </Typography>
              <UserStatus activated={user.activated} />
            </Box>
          </Box>

          <Box sx={{ flex: 1.25, minWidth: 0 }}>
            <Tooltip title={user.email || ''}>
              <Typography variant="body2" noWrap sx={{ color: 'text.secondary' }}>
                {user.email || '-'}
              </Typography>
            </Tooltip>
          </Box>

          <Box
            sx={{
              display: 'flex',
              gap: 0.5,
              flex: 1.5,
              minWidth: 0,
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            {(Array.isArray(user.authorities) ? user.authorities : []).map((authority) => (
              <Tooltip title={authority} key={authority}>
                <Chip sx={{ maxWidth: '140px' }} label={authority} size="small" color="default" />
              </Tooltip>
            ))}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', flexShrink: 0 }}>
            <SplitButton
              ariaLabel="kullanıcı işlemleri"
              variant="outlined"
              color="primary"
              size="small"
              primary={{
                label: 'Düzenle',
                icon: <EditOutlinedIcon />,
                onClick: () => onEdit(user),
              }}
              options={[
                {
                  label: user.activated ? 'Pasife Çek' : 'Aktife Çek',
                  icon: user.activated ? <ToggleOffIcon sx={{ color: theme.palette.error.main }} /> : <ToggleOnIcon sx={{ color: theme.palette.success.main }} />,
                  onClick: () => onClick(user),
                },
                {
                  label: 'Şifre Sıfırla',
                  icon: <LockResetIcon />,
                  onClick: () => onResetPassword(user),
                },
                { type: 'divider' },
                {
                  label: `Güncelleyen: ${user.lastModifiedBy || '-'}`,
                  icon: <PersonOutlineIcon />,
                  disabled: true,
                  variant: 'info',
                },
                {
                  label: `Tarih: ${formatLastModifiedDate(user.lastModifiedDate)}`,
                  icon: <AccessTimeIcon />,
                  disabled: true,
                  variant: 'info',
                },
              ]}
            />
          </Box>
        </Box>
      ))}
    </Box>
  )
}
