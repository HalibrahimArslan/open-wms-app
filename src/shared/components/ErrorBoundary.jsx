import React from 'react'
import { Box, Typography, Paper, Accordion, AccordionSummary, AccordionDetails, Alert, AlertTitle, Button, Container } from '@mui/material'
import { ExpandMore as ExpandMoreIcon, ErrorOutline as ErrorIcon, Refresh as RefreshIcon, BugReport as BugIcon } from '@mui/icons-material'

class ErrorBoundary extends React.Component {
  state = {
    error: undefined,
    errorInfo: undefined,
    hasError: false,
  }

  static getDerivedStateFromError(error) {
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

    if (hasError && errorInfo) {
      const isDevelopment = process.env.NODE_ENV === 'development'

      return (
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)',
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <ErrorIcon
                sx={{
                  fontSize: 64,
                  color: 'error.main',
                  mb: 2,
                  animation: 'pulse 2s infinite',
                }}
              />

              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{
                  color: 'error.main',
                  fontWeight: 'bold',
                  mb: 1,
                }}
              >
                Oops! Bir Hata Oluştu
              </Typography>

              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                UI tarafında beklenmeyen bir problem meydana geldi. Lütfen sayfayı yenilemeyi deneyin.
              </Typography>

              <Button
                variant="contained"
                color="primary"
                startIcon={<RefreshIcon />}
                onClick={this.handleRetry}
                sx={{
                  mr: 2,
                  borderRadius: 2,
                  textTransform: 'none',
                  px: 3,
                }}
              >
                Tekrar Dene
              </Button>

              <Button
                variant="contained"
                color="secondary"
                onClick={() => window.location.reload()}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  px: 3,
                }}
              >
                Sayfayı Yenile
              </Button>
            </Box>

            {isDevelopment && (
              <Alert
                severity="warning"
                icon={<BugIcon />}
                sx={{
                  mb: 2,
                  borderRadius: 2,
                  '& .MuiAlert-message': {
                    width: '100%',
                  },
                }}
              >
                <AlertTitle sx={{ fontWeight: 'bold' }}>Geliştirici Modu</AlertTitle>
                Aşağıda hata detaylarını görebilirsiniz.
              </Alert>
            )}

            {isDevelopment && (
              <Accordion
                sx={{
                  borderRadius: 2,
                  '&:before': {
                    display: 'none',
                  },
                  boxShadow: 'none',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    backgroundColor: 'grey.50',
                    borderRadius: '8px 8px 0 0',
                    '&.Mui-expanded': {
                      borderRadius: '8px 8px 0 0',
                    },
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 'medium',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <BugIcon fontSize="small" />
                    Hata Detayları
                  </Typography>
                </AccordionSummary>

                <AccordionDetails sx={{ p: 3 }}>
                  <Box
                    component="pre"
                    sx={{
                      backgroundColor: 'grey.900',
                      color: 'common.white',
                      p: 2,
                      borderRadius: 1,
                      fontSize: '0.875rem',
                      fontFamily: 'monospace',
                      overflow: 'auto',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      mb: 2,
                    }}
                  >
                    {error && error.toString()}
                  </Box>

                  <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Component Stack:
                  </Typography>

                  <Box
                    component="pre"
                    sx={{
                      backgroundColor: 'grey.100',
                      color: 'text.primary',
                      p: 2,
                      borderRadius: 1,
                      fontSize: '0.75rem',
                      fontFamily: 'monospace',
                      overflow: 'auto',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    {errorInfo.componentStack}
                  </Box>
                </AccordionDetails>
              </Accordion>
            )}
          </Paper>

          <style jsx>{`
            @keyframes pulse {
              0% {
                opacity: 1;
              }
              50% {
                opacity: 0.7;
              }
              100% {
                opacity: 1;
              }
            }
          `}</style>
        </Container>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
