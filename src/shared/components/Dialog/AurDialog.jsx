import React, { useEffect, useRef } from 'react'
import Dialog from '@mui/material/Dialog'
import { Box, IconButton, useTheme } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

const AurDialog = ({ open, handleClose, children, scroll, disabled, paperProps }) => {
  const descriptionElementRef = useRef(null)
  const theme = useTheme()

  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef
      if (descriptionElement !== null) {
        descriptionElement.focus()
      }
    }
  }, [open])

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      scroll={scroll}
      slotProps={{
        paper: paperProps,
      }}
    >
      <Box sx={{ background: theme.palette.background.paper }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton
            onClick={handleClose}
            disabled={disabled ? disabled : false}
            sx={{
              '&:hover': {
                color: theme.palette.primary.main,
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        {children}
      </Box>
    </Dialog>
  )
}

export default AurDialog
