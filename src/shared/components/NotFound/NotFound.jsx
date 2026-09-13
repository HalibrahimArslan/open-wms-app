import { Box, Typography, useTheme } from '@mui/material'

export default function NotFound({ msg, sx }) {
  const theme = useTheme()
  return (
    <Box
      sx={{
        backgroundColor: theme.palette.secondary.main,
        width: '100%',
        height: 100,
        display: 'flex',
        justifyContent: 'center',
        borderRadius: theme.shape.borderRadius,
        marginTop: 2,
        alignItems: 'center',
        marginBottom: 2,
        border: '2px solid',
        borderColor: theme.palette.secondary.main,
      }}
    >
      <Typography variant="body1" fontWeight={theme.typography.fontWeightMedium}>
        {msg}
      </Typography>
    </Box>
  )
}
