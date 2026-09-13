import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

export default function ConfirmDialog({ dialogStatus, dialogTitle, dialogContentText, handleClose, handleOperate }) {
  return (
    <React.Fragment>
      <Dialog open={dialogStatus} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{dialogContentText}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Vazgeç</Button>
          <Button onClick={handleOperate} autoFocus variant="contained">
            Onayla
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}
