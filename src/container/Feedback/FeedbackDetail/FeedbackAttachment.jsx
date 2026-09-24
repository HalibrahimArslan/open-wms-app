import { Box, Button, CircularProgress, Typography } from '@mui/material'
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined'
import DownloadIcon from '@mui/icons-material/Download'

const FeedbackAttachment = ({ attachment, onPreview }) => {
  const { name, isImage, src, error } = attachment

  return (
    <Box
      sx={(theme) => ({
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        p: 1.5,
        mb: 1.5,
        borderRadius: theme.radius.card,
        border: `1px solid ${theme.palette.border.subtle}`,
        backgroundColor: theme.palette.surface.card,
      })}
    >
      {isImage && src && (
        <Box
          component="img"
          src={src}
          alt={name}
          onClick={onPreview}
          sx={(theme) => ({
            width: '100%',
            maxHeight: 180,
            objectFit: 'contain',
            cursor: 'zoom-in',
            borderRadius: theme.radius.control,
            backgroundColor: theme.palette.surface.subtle,
          })}
        />
      )}

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <InsertDriveFileOutlinedIcon color="primary" fontSize="small" />
        <Typography variant="body2" sx={{ flex: 1, minWidth: 0, textAlign: 'left', wordBreak: 'break-all' }}>
          {name}
        </Typography>
        {!src && !error && <CircularProgress size={16} />}
        {src && (
          <Button size="small" variant="outlined" component="a" href={src} download={name} startIcon={<DownloadIcon />}>
            İndir
          </Button>
        )}
      </Box>

      {error && (
        <Typography variant="caption" color="error" sx={{ textAlign: 'left' }}>
          {error}
        </Typography>
      )}
    </Box>
  )
}

export default FeedbackAttachment
