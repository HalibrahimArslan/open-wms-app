import { Box, TextField, useTheme } from '@mui/material'

const StepperInput = ({ value, label, disabled, type = 'text', handleChange }) => {
  const theme = useTheme()
  return (
    <Box
      sx={{
        display: 'flex',
        flexGrow: 1,
        justifyContent: 'center',
      }}
      padding={2}
      margin={2}
      borderRadius={theme.shape.borderRadius}
      bgcolor={theme.palette.secondary.main}
    >
      <TextField label={label} value={value} onChange={handleChange} disabled={disabled || false} type={type} />
    </Box>
  )
}

export default StepperInput
