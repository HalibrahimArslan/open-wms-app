import { Button, styled } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'

const ButtonWithSpinner = styled(Button)(() => ({
  position: 'relative',
  borderRadius: 20,
  '& .MuiCircularProgress-root': {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: '-12px',
    marginLeft: '-12px',
  },
}))

const LoadingButton = ({ loading, onClick, text, variant, endIcon, disabled }) => {
  return (
    <ButtonWithSpinner variant={variant || 'contained'} color="primary" onClick={onClick} disabled={loading || disabled} endIcon={endIcon}>
      {loading && <CircularProgress size={24} color="inherit" />}
      {loading ? 'Bekleyiniz' : text}
    </ButtonWithSpinner>
  )
}

export default LoadingButton
