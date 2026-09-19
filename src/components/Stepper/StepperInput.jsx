import { Box, TextField, useTheme } from '@mui/material'

const StepperInput = ({ value, label, disabled, type = 'text', handleChange }) => {
  const theme = useTheme()
  return (
    <Box
      sx={{
        padding: 2,
        margin: 2,
        borderRadius: theme.shape.borderRadius,
        bgcolor: theme.palette.secondary.main,
        display: 'flex',
        flexGrow: 1,
        justifyContent: 'center',
      }}
    >
      <TextField label={label} value={value} onChange={handleChange} disabled={disabled || false} type={type} />
    </Box>
  )
}

export default StepperInput
