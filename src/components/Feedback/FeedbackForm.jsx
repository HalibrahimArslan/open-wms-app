import { Box, Button, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material'
import InputFileUpload from '../Button/InputFileUpload'

const FeedbackForm = ({ feedbackTitle, loading, handleChange, handleSend, feedbackDescription, descriptionError, handleChangeFeedback, file, handleFileChange, handleDelete }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <ToggleButtonGroup value={feedbackTitle} exclusive onChange={handleChange} aria-label="Talep tipi" color="primary" size="small" fullWidth>
        <ToggleButton value="FEEDBACK">Destek</ToggleButton>
        <ToggleButton value="ERROR">Hata</ToggleButton>
      </ToggleButtonGroup>
      <TextField
        label="Açıklama"
        required
        error={Boolean(descriptionError)}
        helperText={descriptionError || undefined}
        placeholder="Yaşadığınız sorunu veya talebinizi yazınız"
        multiline
        minRows={6}
        value={feedbackDescription}
        onChange={handleChangeFeedback}
        fullWidth
      />
      <InputFileUpload file={file} handleFileChange={handleFileChange} handleDelete={handleDelete} />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" onClick={handleSend} disabled={loading}>
          {loading ? 'Gönderiliyor' : 'Gönder'}
        </Button>
      </Box>
    </Box>
  )
}

export default FeedbackForm
