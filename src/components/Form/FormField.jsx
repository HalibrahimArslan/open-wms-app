import { Box, Typography, TextField, Stack, Button, useTheme } from '@mui/material'

export default function FormField({ handleSubmit, handleChange, mainTxt, btnTxt, label, id }) {
  const theme = useTheme()
  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      onChange={handleChange}
      noValidate
      sx={{
        borderRadius: 2,
        mt: 1,
        backgroundColor: theme.palette.secondary.main,
        p: 1,
      }}
    >
      <Typography align="center">{mainTxt}</Typography>
      <TextField margin="normal" required fullWidth id={id} label={label} name={id} autoComplete="text" autoFocus />
      <Stack
        direction={'row'}
        spacing={2}
        sx={{
          my: 2,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Button onClick={handleSubmit} variant="contained">
          {btnTxt}
        </Button>
      </Stack>
    </Box>
  )
}
