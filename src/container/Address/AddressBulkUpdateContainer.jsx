import { Alert, Box, Card, Typography } from '@mui/material'

const AddressBulkUpdateContainer = ({ data }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      {Object.keys(data).length > 0 &&
        data.successList.map((address) => (
          <Card sx={{ display: 'flex', flexDirection: 'column', p: 1 }} key={address.adres}>
            <Typography variant="h6" component="div">
              {address.adres}
            </Typography>
            <Alert severity="success" sx={{ width: '100%' }}>
              {'Başarılı'}
            </Alert>
          </Card>
        ))}

      {Object.keys(data).length > 0 &&
        data.errorList.map((error) => {
          const errorMessage = Object.keys(error)[0]
          const errorData = error[errorMessage]
          return (
            <Card sx={{ display: 'flex', flexDirection: 'column', p: 1 }} key={errorData.adres}>
              <Typography variant="h6" component="div">
                {errorData.adres}
              </Typography>
              <Alert severity="error" sx={{ width: '100%' }}>
                {errorMessage}
              </Alert>
            </Card>
          )
        })}
    </Box>
  )
}

export default AddressBulkUpdateContainer
