import { useState, useRef } from 'react'
import * as XLSX from 'xlsx'
import { Button, Box, Typography, IconButton, Grid, Chip, useTheme } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ClearIcon from '@mui/icons-material/Clear'
import FitItem from '../../../components/Layout/FitItem'
import useIsMobile from '../../../hooks/useIsMobile'
import NotFound from '../../../shared/components/NotFound/NotFound'
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt'
import MoodIcon from '@mui/icons-material/Mood'

const CsvUploader = () => {
  const isMobile = useIsMobile()
  const theme = useTheme()

  const [data, setData] = useState([])
  const [jsonData, setJsonData] = useState(null)
  const [fileName, setFileName] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileUpload = (file) => {
    if (!file) return

    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (event) => {
      const binaryStr = event.target.result
      const workbook = XLSX.read(binaryStr, { type: 'binary' })
      const sheetName = workbook.SheetNames[0]
      const sheet = workbook.Sheets[sheetName]
      const parsedData = XLSX.utils.sheet_to_json(sheet)

      setData(parsedData)
      setJsonData(parsedData)
    }
    reader.readAsBinaryString(file)
  }

  const handleChange = (e) => {
    const file = e.target.files[0]
    handleFileUpload(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    handleFileUpload(file)
  }

  const handleSubmit = async () => {
    if (!jsonData) return
    try {
      const response = await fetch('https://api.yourserver.com/endpoint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jsonData),
      })
      if (response.ok) alert('Veri başarıyla gönderildi!')
      else alert('Gönderim sırasında bir hata oluştu.')
    } catch (error) {
      console.error('API hatası:', error)
    }
  }

  const clearFile = () => {
    setData([])
    setJsonData(null)
    setFileName('')
    fileInputRef.current.value = ''
  }

  const columns = data[0]
    ? Object.keys(data[0]).map((field) => ({
        field,
        headerName: field,
        width: 150,
      }))
    : []

  if (isMobile) {
    return <NotFound msg="Mobil cihazlarda kullanılamaz. Talep Geçiniz" />
  }

  return (
    <Grid container spacing={1}>
      <Grid size={4}>
        <FitItem>
          {fileName && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'space-between', m: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography>Seçilen dosya</Typography>
                <ArrowRightAltIcon />
              </Box>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Chip color="primary" size="small" label={fileName.slice(0, 30)} />
                <IconButton onClick={clearFile}>
                  <ClearIcon />
                </IconButton>
              </Box>
            </Box>
          )}
          <Box
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
            sx={{
              border: isDragging ? '2px dashed #4CAF50' : '2px dashed #ccc',
              borderRadius: 2,
              cursor: 'pointer',
              px: 1,
              minHeight: data.length > 0 ? '93.5%' : '99.5%',
              textAlign: 'center',
              transition: 'border 0.3s ease-in-out',
              bgcolor: isDragging ? '#f0fff4' : 'transparent',
              '&:hover': { border: '2px dashed #4CAF50' },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
            }}
          >
            <input type="file" id="fileInput" accept=".csv, .xlsx" onChange={handleChange} ref={fileInputRef} style={{ display: 'none' }} />
            {data.length === 0 ? (
              <UploadFileIcon
                sx={{
                  fontSize: 40,
                  color: isDragging ? '#4CAF50' : '#ccc',
                  mb: 1,
                  animation: 'pulse 1.5s ease-in-out infinite, colorChange 1s infinite',
                  '@keyframes pulse': {
                    '0%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.1)' },
                    '100%': { transform: 'scale(1)' },
                  },
                  '@keyframes colorChange': {
                    '0%': { color: '#ccc' },
                    '50%': { color: '#4CAF50' },
                    '100%': { color: '#ccc' },
                  },
                }}
              />
            ) : (
              <CheckCircleIcon
                sx={{
                  fontSize: 50,
                  color: '#4CAF50',
                  mb: 1,
                }}
              />
            )}
            <Typography
              variant="h6"
              sx={{
                color: isDragging ? '#4CAF50' : '#666',
                fontWeight: 'bold',
                animation: isDragging ? 'pulseText 1s infinite' : 'none',
                '@keyframes pulseText': {
                  '0%': { opacity: 1 },
                  '50%': { opacity: 0.6 },
                  '100%': { opacity: 1 },
                },
              }}
            >
              {data.length === 0 ? 'Dosyanızı sürükleyip bırakın veya buraya tıklayın' : 'Dosya yüklendi!'}
            </Typography>
          </Box>
        </FitItem>
      </Grid>

      <Grid size={8}>
        <FitItem>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            {data.length > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', gap: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mx: 1 }}>
                  <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ mt: 3 }} disabled={!jsonData}>
                    Kaydet
                  </Button>
                </Box>
                <Box sx={{ height: '100%', width: '100%' }}>
                  <DataGrid rows={data.map((row, id) => ({ id, ...row }))} columns={columns} pageSize={100} />
                </Box>
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', p: 5, borderRadius: theme.shape.borderRadius, width: '100%', mx: 1 }}>
                <MoodIcon
                  sx={{
                    fontSize: 50,
                    color: '#4CAF50',
                    animation: 'bounce 2s infinite',
                  }}
                />
                <Typography variant="h6">Gösterilecek bir veri bulunamadı.</Typography>
                <style>
                  {`
                                        @keyframes bounce {
                                            0%, 20%, 50%, 80%, 100% {
                                                transform: translateY(0);
                                            }
                                            40% {
                                                transform: translateY(-20px);
                                            }
                                            60% {
                                                transform: translateY(-10px);
                                            }
                                        }
                                    `}
                </style>
              </Box>
            )}
          </Box>
        </FitItem>
      </Grid>
    </Grid>
  )
}

export default CsvUploader
