import { Box, Button, TextField, useTheme } from '@mui/material'
import React, { useState, FocusEvent } from 'react'

const FeedbackCommentField = ({ comment, inputRef, handleChangeComment, handleAddComment, handleCancel }) => {
  const theme = useTheme()
  const [showButtons, setShowButtons] = useState(false)

  const handleFocus = () => {
    setShowButtons(true)
  }

  const handleBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setTimeout(() => {
        setShowButtons(false)
      }, 150)
    }
  }

  const handleCancelWrapper = () => {
    handleCancel()
    document.getElementById('commentfield').value = ''
  }

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <TextField
        id="commentfield"
        inputRef={inputRef}
        value={comment}
        onChange={handleChangeComment}
        variant="outlined"
        onFocus={handleFocus}
        onBlur={handleBlur}
        label="Yorum Ekle"
        multiline
        minRows={3}
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: theme.shape.borderRadius,
          },
        }}
        onKeyUp={(e) => {
          if (e.key === 'Enter') {
            handleAddComment()
          }
        }}
      />
      {showButtons && (
        <Box
          sx={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            borderRadius: theme.shape.borderRadius,
            transform: 'translate(-10%,-40%)',
            display: 'flex',
            gap: 1,
          }}
        >
          <Button variant="contained" color="primary" size="small" sx={{ borderRadius: theme.shape.borderRadius }} onClick={handleCancelWrapper}>
            İptal
          </Button>
          <Button variant="contained" color="primary" size="small" sx={{ borderRadius: theme.shape.borderRadius }} onClick={handleAddComment} disabled={comment.length === 0}>
            Gönder
          </Button>
        </Box>
      )}
    </Box>
  )
}

export default FeedbackCommentField
