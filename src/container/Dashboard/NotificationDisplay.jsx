import React, { useState, useEffect, useRef } from 'react'
import {
  Box,
  IconButton,
  Badge,
  Popover,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Chip,
  Button,
  Tooltip,
  Divider,
  Stack,
  Fade,
  alpha,
  useTheme,
} from '@mui/material'
import {
  Notifications as NotificationsIcon,
  NotificationsNone as NotificationsNoneIcon,
  Message as MessageIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Circle as CircleIcon,
} from '@mui/icons-material'
import { useNotifications } from '../../hooks/useNotifications'

export const NotificationDisplay = () => {
  const { messages, isConnected, clearMessages, removeMessage, reconnect } = useNotifications()
  const [anchorEl, setAnchorEl] = useState(null)
  const [lastMessageCount, setLastMessageCount] = useState(0)
  const iconButtonRef = useRef(null)
  const autoCloseTimeoutRef = useRef(null)
  const theme = useTheme()

  useEffect(() => {
    return () => {
      if (autoCloseTimeoutRef.current) {
        clearTimeout(autoCloseTimeoutRef.current)
      }
    }
  }, [])

  const handleClick = (event) => {
    if (autoCloseTimeoutRef.current) {
      clearTimeout(autoCloseTimeoutRef.current)
    }
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    if (autoCloseTimeoutRef.current) {
      clearTimeout(autoCloseTimeoutRef.current)
    }
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)

  return (
    <>
      <Tooltip title={`${messages.length} bildirim${messages.length !== 1 ? '' : ''} - ${isConnected ? 'Bağlı' : 'Bağlantı Kesildi'}`}>
        <IconButton
          ref={iconButtonRef}
          onClick={handleClick}
          sx={{
            position: 'relative',
            color: 'inherit',
            borderRadius: '12px',
            backgroundColor: alpha(theme.palette.secondary.contrastText, 0.05),
            '&:hover': {
              backgroundColor: alpha(theme.palette.secondary.contrastText, 0.12),
            },
            transition: 'all 0.2s ease',
          }}
        >
          <Badge
            badgeContent={messages.length}
            color="error"
            max={99}
            sx={{
              '& .MuiBadge-badge': {
                fontSize: '0.75rem',
                minWidth: 18,
                height: 18,
              },
            }}
          >
            <NotificationsIcon />
          </Badge>

          <Box
            sx={{
              position: 'absolute',
              bottom: 2,
              right: 2,
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: isConnected ? theme.palette.success.main : theme.palette.error.main,
              border: `2px solid ${theme.palette.background.paper}`,
              boxShadow: `0 0 4px ${isConnected ? theme.palette.success.main : theme.palette.error.main}`,
            }}
          />
        </IconButton>
      </Tooltip>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{
          '& .MuiPopover-paper': {
            width: 400,
            maxHeight: 500,
            borderRadius: 2,
            boxShadow: theme.shadows[8],
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            mt: 1,
          },
        }}
      >
        <Box
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: 'white',
            p: 2,
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <NotificationsIcon sx={{ fontSize: 20 }} />
              <Typography variant="h6" fontWeight="600">
                Bildirimler
              </Typography>
              <Chip
                icon={<CircleIcon sx={{ fontSize: 8 }} />}
                label={isConnected ? 'Aktif' : 'Pasif'}
                size="small"
                sx={{
                  bgcolor: alpha(theme.palette.common.white, 0.2),
                  color: 'white',
                  fontSize: '0.7rem',
                  height: 20,
                  '& .MuiChip-icon': {
                    color: isConnected ? theme.palette.success.main : theme.palette.error.main,
                  },
                }}
              />
            </Stack>

            <Stack direction="row" spacing={0.5}>
              {!isConnected && (
                <Tooltip title="Yeniden Bağlan">
                  <IconButton
                    onClick={reconnect}
                    size="small"
                    sx={{
                      color: 'white',
                      bgcolor: alpha(theme.palette.warning.main, 0.3),
                      '&:hover': { bgcolor: alpha(theme.palette.warning.main, 0.5) },
                    }}
                  >
                    <RefreshIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}

              <Tooltip title="Tümünü Temizle">
                <IconButton
                  onClick={clearMessages}
                  disabled={messages.length === 0}
                  size="small"
                  sx={{
                    color: 'white',
                    bgcolor: alpha(theme.palette.error.main, 0.3),
                    '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.5) },
                    '&:disabled': { opacity: 0.3 },
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        </Box>

        <Box sx={{ maxHeight: 350, overflow: 'auto' }}>
          {messages.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                py: 4,
                px: 3,
                textAlign: 'center',
              }}
            >
              <Box
                sx={{
                  p: 2,
                  borderRadius: '50%',
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  mb: 2,
                }}
              >
                <NotificationsNoneIcon
                  sx={{
                    fontSize: 32,
                    color: alpha(theme.palette.text.secondary, 0.5),
                  }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                Henüz bildirim yok
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.7 }}>
                Yeni bildirimler burada görünecek
              </Typography>
            </Box>
          ) : (
            <List sx={{ py: 0 }}>
              {messages
                .slice(-10)
                .reverse()
                .map((msg, index) => (
                  <Fade in key={msg.id} timeout={200}>
                    <Box>
                      <ListItem
                        sx={{
                          py: 1.5,
                          px: 2,
                          '&:hover': {
                            bgcolor: alpha(theme.palette.action.hover, 0.1),
                            '& .delete-btn': {
                              opacity: 1,
                            },
                          },
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar
                            sx={{
                              bgcolor: theme.palette.primary.main,
                              width: 32,
                              height: 32,
                            }}
                          >
                            <MessageIcon fontSize="small" />
                          </Avatar>
                        </ListItemAvatar>

                        <ListItemText
                          primary={
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 500,
                                fontSize: '0.875rem',
                                lineHeight: 1.3,
                                pr: 1,
                              }}
                            >
                              {msg.message}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                              {msg.timestamp.toLocaleDateString('tr-TR')} • {msg.timestamp.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                            </Typography>
                          }
                        />

                        <Tooltip title="Sil">
                          <IconButton
                            className="delete-btn"
                            onClick={(e) => {
                              e.stopPropagation()
                              removeMessage(msg.id)
                            }}
                            size="small"
                            sx={{
                              opacity: 0,
                              transition: 'opacity 0.2s ease',
                              color: theme.palette.error.main,
                              '&:hover': {
                                bgcolor: alpha(theme.palette.error.main, 0.1),
                              },
                            }}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </ListItem>
                      {index < Math.min(messages.length, 10) - 1 && <Divider sx={{ mx: 2 }} />}
                    </Box>
                  </Fade>
                ))}
            </List>
          )}
        </Box>

        {messages.length > 0 && (
          <Box
            sx={{
              px: 2,
              py: 1.5,
              bgcolor: alpha(theme.palette.background.default, 0.5),
              borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="caption" color="text.secondary">
                {messages.length > 10 ? `Son 10 bildirim (Toplam ${messages.length})` : `${messages.length} bildirim`}
              </Typography>

              <Button
                size="small"
                onClick={() => {
                  clearMessages()
                  handleClose()
                }}
                color="error"
                sx={{
                  fontSize: '0.75rem',
                  textTransform: 'none',
                  minWidth: 'auto',
                  px: 1.5,
                  py: 0.5,
                }}
              >
                Tümünü Sil
              </Button>
            </Stack>
          </Box>
        )}
      </Popover>
    </>
  )
}
