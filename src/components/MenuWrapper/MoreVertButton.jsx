import { useState } from 'react'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import { Box, IconButton, useTheme } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'

export default function MoreVertButton({ btnList, top }) {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const theme = useTheme()

  return (
    <Box sx={{ position: 'relative' }}>
      <IconButton
        id="demo-positioned-button"
        aria-controls={open ? 'demo-positioned-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={{ position: 'absolute', right: 0, top: top || 0 }}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{ borderRadius: theme.shape.borderRadius }}
      >
        {btnList.map((item, index) =>
          item?.type === 'divider' ? (
            <Divider key={`divider-${index}`} />
          ) : (
            <MenuItem
              key={index}
              disabled={Boolean(item.disabled)}
              onClick={() => {
                handleClose()
                if (item.disabled) return
                item.onClick?.(item.id)
              }}
              sx={{
                gap: 1,
                ...(item.variant === 'info'
                  ? {
                      opacity: 0.9,
                      fontSize: '12px',
                      '&.Mui-disabled': { opacity: 1 },
                    }
                  : {}),
              }}
            >
              {item.icon}
              {item.name}
            </MenuItem>
          )
        )}
      </Menu>
    </Box>
  )
}
