import * as React from 'react'
import { Box, Button, Chip, useTheme } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'

const InputFileUpload = ({ file, handleFileChange, handleDelete }) => {
  const theme = useTheme()
  const ref = React.useRef(null)
  const [dragStart, setDragStart] = React.useState(false)

  const handleSelectFileClick = () => {
    if (ref.current) {
      ref.current.click()
    }
  }

  const handleSelect = (e) => {
    handleFileChange(e)
  }

  const onDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.dataTransfer.files) {
      handleFileChange({
        target: { files: e.dataTransfer.files },
      })
    }
    setDragStart(false)
  }
  return (
    <>
      {file && file.length > 0 && (
        <Box
          sx={{
            display: 'flex',
            overflow: 'auto',
            gap: 1,
            padding: 1,
          }}
        >
          {[...file].map((f, index) => (
            <Chip key={index} label={f.name} onDelete={() => handleDelete(f.name)} />
          ))}
        </Box>
      )}

      <Box
        onDragOver={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setDragStart(true)
        }}
        onDragEnter={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setDragStart(true)
        }}
        onDragLeave={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setDragStart(false)
        }}
        onDragEnd={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setDragStart(false)
        }}
        onDrop={onDrop}
        sx={{
          backgroundColor: !dragStart ? (theme) => theme.palette.surface.subtle : 'transparent',
          border: dragStart ? `2px dashed ${theme.palette.primary.main}` : `2px dashed ${theme.palette.grey[300]}`,
          width: '100%',
          height: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 2,
          '&:hover': {
            backgroundColor: theme.palette.surface.subtle,
          },
          position: 'relative',
        }}
      >
        <input multiple ref={ref} type="file" id="file" style={{ display: 'none' }} onChange={handleSelect} />
        {!dragStart && (
          <Button
            onClick={handleSelectFileClick}
            startIcon={<CloudUploadIcon />}
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%,-50%)',
            }}
          >
            Dosya Seçiniz veya Sürükleyiniz
          </Button>
        )}
      </Box>
    </>
  )
}

export default InputFileUpload
