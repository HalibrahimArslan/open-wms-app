import { Box, Typography } from '@mui/material'

const FeedbackAttachment = ({ upload, theme, index }) => {
  return (
    <Box key={index} display={'flex'} flexDirection={'column'} gap={2} padding={2} bgcolor={theme.palette.action.hover} mb={2} borderRadius={theme.shape.borderRadius}>
      <Typography align="left" variant="h6" fontWeight={theme.typography.fontWeightBold}>
        {`Dosya ${index + 1}`}
      </Typography>
      {upload.url.includes('png') ? (
        <img
          src={upload.url}
          alt={upload.url}
          width={'25%'}
          style={{
            borderRadius: 8,
            boxShadow: theme.shadows[1],
            border: `1px solid ${theme.palette.divider}`,
            marginBottom: theme.spacing(1),
            margin: 'auto',
          }}
        />
      ) : (
        <iframe
          src={upload.url}
          title={upload.url}
          width={'100%'}
          height={200}
          frameBorder={0}
          allowFullScreen={true}
          allow={'autoplay; fullscreen; picture-in-picture'}
          style={{
            borderRadius: 8,
            boxShadow: theme.shadows[1],
            border: `1px solid ${theme.palette.divider}`,
            marginBottom: theme.spacing(1),
          }}
        />
      )}

      <Typography align="left" variant="body1" fontWeight={theme.typography.fontWeightMedium}>
        {upload.name}
      </Typography>
    </Box>
  )
}

export default FeedbackAttachment
