import React from 'react'
import { Accordion, AccordionDetails, AccordionSummary, Alert, AlertTitle, Box, Button, Container, Paper, Stack, Typography } from '@mui/material'
import { BugReport as BugIcon, ErrorOutlineOutlined as ErrorIcon, ExpandMore as ExpandMoreIcon, Refresh as RefreshIcon } from '@mui/icons-material'

/**
 * Beklenmeyen bir render hatasinda tum uygulama yerine bu ekrani gosterir.
 *
 * Ekranin tamami sabit aciklarla boyanmisti: panel beyaz bir gradyandi,
 * acilir bolumun basligi grey.50, bilesen yigini grey.100 zemin uzerine
 * text.primary ile yaziliyordu. Karanlik temada panel beyaz kaliyor, yigin ise
 * acik zemin uzerine acik metin dustugu icin hic okunmuyordu. Butun renkler
 * palet token'larina baglandi.
 *
 * Bu bir sinif bileseni oldugu icin useTheme kullanilamaz; sx'e verilen
 * fonksiyonlar temayi baglamdan aldigi icin ayni isi goruyor.
 */
class ErrorBoundary extends React.Component {
  state = {
    error: undefined,
    errorInfo: undefined,
    hasError: false,
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo,
      hasError: true,
    })

    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleRetry = () => {
    this.setState({
      error: undefined,
      errorInfo: undefined,
      hasError: false,
    })
  }

  render() {
    const { error, errorInfo, hasError } = this.state

    // Yalnizca hasError'a bakilir. Once "hasError && errorInfo" araniyordu;
    // errorInfo componentDidCatch'te bir adim sonra geldigi icin arada cocuklar
    // yeniden ciziliyor ve ayni hata tekrar firlatilabiliyordu.
    if (!hasError) {
      return this.props.children
    }

    const isDevelopment = import.meta.env.DEV

    return (
      <Container maxWidth="md" sx={{ paddingY: 4 }}>
        <Paper
          variant="outlined"
          sx={{
            padding: { xs: 3, sm: 4 },
            borderRadius: (theme) => theme.radius.section,
            backgroundColor: 'surface.card',
            textAlign: 'left',
          }}
        >
          <Box sx={{ textAlign: 'center', marginBottom: 3 }}>
            <ErrorIcon
              sx={{
                fontSize: 64,
                color: 'error.main',
                marginBottom: 2,
                '@keyframes errorPulse': {
                  '0%': { opacity: 1 },
                  '50%': { opacity: 0.6 },
                  '100%': { opacity: 1 },
                },
                animation: 'errorPulse 2s infinite',
              }}
            />

            {/* Baslik daha once error.main ile yaziliyordu; acik temada bu ton
                beyaz zeminde 2.3 kontrasta dusup okunmuyordu. Renk vurgusu
                ikonda kaldi, baslik normal metin rengini kullaniyor. */}
            <Typography variant="h5" component="h1" sx={{ fontWeight: 700, marginBottom: 1 }}>
              Beklenmeyen bir hata oluştu
            </Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary', marginBottom: 3 }}>
              Arayüzde beklenmeyen bir sorun çıktı. Tekrar deneyebilir ya da sayfayı yenileyebilirsiniz.
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ justifyContent: 'center' }}>
              <Button variant="contained" startIcon={<RefreshIcon />} onClick={this.handleRetry}>
                Tekrar dene
              </Button>
              <Button variant="outlined" onClick={() => window.location.reload()}>
                Sayfayı yenile
              </Button>
            </Stack>
          </Box>

          {isDevelopment && (
            <>
              <Alert severity="warning" icon={<BugIcon />} sx={{ marginBottom: 2, borderRadius: (theme) => theme.radius.card }}>
                <AlertTitle sx={{ fontWeight: 700 }}>Geliştirici modu</AlertTitle>
                Hata detayları yalnızca geliştirme ortamında gösterilir.
              </Alert>

              <Accordion
                defaultExpanded
                disableGutters
                sx={{
                  borderRadius: (theme) => theme.radius.card,
                  boxShadow: 'none',
                  border: '1px solid',
                  borderColor: 'border.subtle',
                  '&:before': { display: 'none' },
                }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: 'surface.subtle' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BugIcon fontSize="small" />
                    Hata detayları
                  </Typography>
                </AccordionSummary>

                <AccordionDetails sx={{ padding: 2.5 }}>
                  {/* Hata metni Alert ile ciziliyor: her iki temada da dogru
                      zemin ve kontrasti MUI'nin kendisi hesapliyor. */}
                  <Alert
                    severity="error"
                    variant="outlined"
                    icon={false}
                    sx={{
                      marginBottom: 2,
                      borderRadius: (theme) => theme.radius.control,
                      fontFamily: 'monospace',
                      fontSize: '0.8125rem',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}
                  >
                    {error ? error.toString() : 'Hata bilgisi alınamadı.'}
                  </Alert>

                  <Typography variant="caption" sx={{ display: 'block', fontWeight: 700, marginBottom: 0.75, color: 'text.secondary' }}>
                    Bileşen yığını
                  </Typography>

                  <Box
                    component="pre"
                    sx={{
                      margin: 0,
                      maxHeight: 320,
                      padding: 2,
                      borderRadius: (theme) => theme.radius.control,
                      backgroundColor: 'surface.subtle',
                      color: 'text.secondary',
                      border: '1px solid',
                      borderColor: 'border.subtle',
                      fontSize: '0.75rem',
                      fontFamily: 'monospace',
                      overflow: 'auto',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}
                  >
                    {errorInfo?.componentStack ?? 'Bileşen yığını alınamadı.'}
                  </Box>
                </AccordionDetails>
              </Accordion>
            </>
          )}
        </Paper>
      </Container>
    )
  }
}

export default ErrorBoundary
