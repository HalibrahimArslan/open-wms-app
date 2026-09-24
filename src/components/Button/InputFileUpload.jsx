import * as React from 'react'
import { Box, Chip, Typography } from '@mui/material'
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined'
import AttachFileIcon from '@mui/icons-material/AttachFile'

const InputFileUpload = ({ file, handleFileChange, handleDelete }) => {
  const ref = React.useRef(null)
  const [dragStart, setDragStart] = React.useState(false)

  const handleSelectFileClick = () => {
    if (ref.current) {
      ref.current.click()
    }
  }

  const handleSelect = (e) => {
    handleFileChange(e)
    e.target.value = ''
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

  const stopDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragStart(false)
  }

  const startDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragStart(true)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Box
        role="button"
        tabIndex={0}
        onClick={handleSelectFileClick}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleSelectFileClick()}
        onDragOver={startDrag}
        onDragEnter={startDrag}
        onDragLeave={stopDrag}
        onDragEnd={stopDrag}
        onDrop={onDrop}
        sx={(theme) => ({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0.5,
          py: 3,
          px: 2,
          cursor: 'pointer',
          textAlign: 'center',
          borderRadius: theme.radius.card,
          border: `1px dashed ${dragStart ? theme.palette.border.focus : theme.palette.border.rest}`,
          backgroundColor: dragStart ? theme.palette.surface.hover : theme.palette.surface.subtle,
          transition: theme.transitions.create(['border-color', 'background-color']),
          '&:hover, &:focus-visible': {
            borderColor: theme.palette.border.hover,
            backgroundColor: theme.palette.surface.hover,
            outline: 'none',
          },
        })}
      >
        <input multiple ref={ref} type="file" hidden onChange={handleSelect} />
        <CloudUploadOutlinedIcon color="primary" />
        <Typography variant="body2" sx={{ fontWeight: 'fontWeightMedium' }}>
          {dragStart ? 'Dosyaları bırakın' : 'Dosya seçin veya buraya sürükleyin'}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Ekran görüntüsü veya belge ekleyebilirsiniz
        </Typography>
      </Box>

      {file && file.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {[...file].map((f, index) => (
            <Chip
              key={`${f.name}-${index}`}
              icon={<AttachFileIcon />}
              label={f.name}
              onDelete={() => handleDelete(f.name)}
              variant="outlined"
              sx={(theme) => ({ borderRadius: theme.radius.control, maxWidth: '100%' })}
            />
          ))}
        </Box>
      )}
    </Box>
  )
}

export default InputFileUpload
