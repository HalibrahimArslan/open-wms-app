import { Box, Divider, IconButton, Typography, useTheme } from '@mui/material'
import AddCircleIcon from '@mui/icons-material/AddCircle'

function CreateNewDefinition({ handleClick, title }) {
  const theme = useTheme()
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: theme.typography.fontWeightMedium,
          }}
        >
          {title}
        </Typography>
        <IconButton onClick={handleClick}>
          <AddCircleIcon sx={{ fontSize: 40 }} />
        </IconButton>
      </Box>
      <Divider flexItem />
      <br />
    </>
  )
}

export default CreateNewDefinition
