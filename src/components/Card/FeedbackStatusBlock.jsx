import React from 'react'
import { Box, Typography, useTheme } from '@mui/material'
import FeedbackCard from './FeedbackCard'
import { BsHourglass, BsHourglassBottom, BsHourglassSplit } from 'react-icons/bs'

const FeedbackStatusBlock = ({ status, feedbacks, hasFilter, handleForward }) => {
  const theme = useTheme()

  const statusTextMap = {
    CREATED: 'OLUŞTURULDU',
    IN_PROGRESS: 'BAŞLANILDI',
    COMPLETED: 'TAMAMLANDI',
  }

  const statusIconMap = {
    CREATED: <BsHourglass style={{ color: theme.palette.primary.main }} />,
    IN_PROGRESS: <BsHourglassBottom style={{ color: theme.palette.primary.main }} />,
    COMPLETED: <BsHourglassSplit style={{ color: theme.palette.primary.main }} />,
  }

  const statusText = statusTextMap[status] || 'Bilinmeyen Durum'
  const statusIcon = statusIconMap[status] || null

  return (
    <Box
      sx={{
        borderRadius: theme.shape.borderRadius,
        backgroundColor: theme.palette.grey[100],
        position: 'relative',
        minWidth: '375px',
        overflow: 'overlay',
        height: hasFilter ? 'calc(100dvh - 250px)' : 'calc(100dvh - 185px)',
        padding: 1,
      }}
    >
      <Box
        sx={{
          background: '#FFFFFF',
          border: `2px solid ${theme.palette.grey[200]}`,
          borderRadius: `${theme.shape.borderRadius}px ${theme.shape.borderRadius}px  0 0`,
          padding: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 1,
          left: 0,
          right: 0,
          mb: 2,
        }}
      >
        {statusIcon}
        <Typography variant="subtitle1" sx={{ marginLeft: 1 }}>
          {statusText}
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}
      >
        {feedbacks.map((feedback, index) => (
          <FeedbackCard status={status} key={index} feedback={feedback} handleForward={handleForward} />
        ))}
      </Box>
    </Box>
  )
}

export default FeedbackStatusBlock
