import { Box, Button, TextField, ToggleButton, ToggleButtonGroup, Typography, useTheme } from '@mui/material'
import InputFileUpload from '../Button/InputFileUpload'

const FeedbackForm = ({ feedbackTitle, loading, handleChange, handleSend, feedbackDescription, handleChangeFeedback, file, handleFileChange, handleClose, handleDelete }) => {
  const theme = useTheme()

  return (
    <Box display={'flex'} flexDirection={'column'} gap={2} maxHeight={'80dvh'} overflow={'auto'} p={1}>
      <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} bgcolor={theme.palette.grey[300]} p={2} borderRadius={2}>
        <Typography>Tip Seçiniz</Typography>
        <ToggleButtonGroup value={feedbackTitle} exclusive onChange={handleChange} aria-label="Feedback Type" color="primary">
          <ToggleButton value="FEEDBACK">DESTEK</ToggleButton>
          <ToggleButton value="ERROR">HATA</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Box>
        <TextField label="Açıklama Giriniz" multiline rows={10} value={feedbackDescription} onChange={handleChangeFeedback} variant="outlined" fullWidth />
      </Box>
      <Box>
        <InputFileUpload file={file} handleFileChange={handleFileChange} handleDelete={handleDelete} />
      </Box>

      <Box
        display={'flex'}
        justifyContent={'space-between'}
        sx={{
          position: 'sticky',
          bottom: 0,
          left: 0,
          right: 0,
          bgcolor: '#f2f2f2',
        }}
      >
        <Button variant="outlined" onClick={handleClose}>
          Kapat
        </Button>
        <Button disabled={loading} variant="contained" onClick={handleSend}>
          Gönder
        </Button>
      </Box>
    </Box>
  )
}

export default FeedbackForm
