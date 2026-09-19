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
                backgroundColor: theme.palette.background.paper,
                gap: 1.5,
                borderRadius: theme.shape.borderRadius * 2,
                boxShadow: 3,
                border: `1px solid ${theme.palette.divider}`,
                height: 260,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
                <Box sx={{ display: 'flex', gap: 1.25, alignItems: 'center', minWidth: 0 }}>
                  <Avatar
                    sx={{
                      width: '40px',
                      height: '40px',
                      background: theme.palette.primary.main,
                    }}
                  >
                    {user.login.charAt(0).toLocaleUpperCase()}
                  </Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: theme.typography.fontWeightMedium }}>
                      {user.login}
                    </Typography>
                    {(() => {
                      const statusColor = user.activated ? theme.palette.success.main : theme.palette.error.main
                      return (
                        <Box
                          sx={{
                            mt: 0.5,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 0.75,
                            px: 1,
                            py: '2px',
                            borderRadius: 999,
                            bgcolor: alpha(statusColor, 0.16),
                            color: statusColor,
                            fontSize: '11px',
                            fontWeight: theme.typography.fontWeightMedium,
                            width: 'fit-content',
                          }}
                        >
                          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: statusColor }} />
                          {user.activated ? 'Aktif' : 'Pasif'}
                        </Box>
                      )
                    })()}
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
                  background: theme.palette.action.hover,
                  borderRadius: theme.shape.borderRadius,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  p: 1.5,
                  flex: 1,
                  textAlign: 'left',
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.primary,
                  }}
                >
                  {user.email}
                </Typography>

                <Box
                  sx={{
                    mt: 1,
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
                      <Chip size="small" label={authority} color="default" sx={{ borderRadius: 1, fontSize: '10px' }} />
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
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {users.map((user) => (
        <Box
          sx={{
            background: theme.palette.action.hover,
            display: 'flex',
            alignItems: 'center',
            borderRadius: theme.shape.borderRadius,
            flex: 1,
            p: 1,
            px: 2,
            flexDirection: { xs: 'column', md: 'row' },
          }}
          key={user.id}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              flex: 0.5,
            }}
          >
            <Avatar
              sx={{
                width: '50px',
                height: '50px',
                background: theme.palette.primary.main,
              }}
            >
              {user.login.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="subtitle2"> {user.login} </Typography>
          </Box>

          <Box
            sx={{
              flex: 1,
            }}
          >
            <Typography variant="subtitle2"> {user.email} </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: 0.5,
              flex: 0.25,
              flexWrap: 'wrap',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
            }}
          >
            {(Array.isArray(user.authorities) ? user.authorities : []).map((authority) => (
              <Tooltip title={authority} key={authority}>
                <Chip sx={{ maxWidth: '140px' }} label={authority} size="small" color="default" />
              </Tooltip>
            ))}
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
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
