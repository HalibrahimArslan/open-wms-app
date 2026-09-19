import { useEffect, useRef, useState } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { Box, DialogContent, IconButton, Typography } from '@mui/material'
import { useNavigate } from 'react-router'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import useIsMobile from '../../../hooks/useIsMobile'

export default function ExtendedDialog({ open, handleClose, dialogContent, dialogHeader, subHeader, handleSave, actionButtonDisaled, actionButtonName, fullScreen }) {
  const [enable, setEnable] = useState(true)

  const isMobile = useIsMobile()
  const nav = useNavigate()

  const descriptionElementRef = useRef(null)

  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef
      if (descriptionElement !== null) {
        descriptionElement.focus()
      }
    }
  }, [open])

  const handleDisable = () => {
    setEnable(false)
    nav(-1)
  }

  return (
    <Dialog
      fullScreen={fullScreen || isMobile}
      open={open && enable}
      onClose={handleClose}
      scroll={'paper'}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
    >
      {(dialogHeader || subHeader) && (
        <DialogTitle align="center" id="scroll-dialog-title">
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="h5" align="left">
              {dialogHeader}
            </Typography>
            <Typography sx={{ wordBreak: 'break-word' }} variant="h6" align="left">
              {subHeader}
            </Typography>
          </Box>
        </DialogTitle>
      )}
      <DialogContent dividers={scroll === 'paper'} sx={{ position: 'relative', minWidth: '300px' }}>
        <DialogContentText
          id="scroll-dialog-description"
          ref={descriptionElementRef}
          tabIndex={-1}
          sx={{
            mt: 1,
          }}
        >
          {dialogContent}
        </DialogContentText>
      </DialogContent>
      <IconButton onClick={handleClose ? handleClose : handleDisable} sx={{ position: 'absolute', top: 10, right: 0 }}>
        <CloseRoundedIcon />
      </IconButton>

      {actionButtonName && (
        <DialogActions>
          <Button variant="contained" onClick={handleSave} disabled={actionButtonDisaled}>
            {actionButtonName}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  )
}
