import React from 'react'
import { Box, Chip, Divider, Typography, useTheme } from '@mui/material'
import { CgDetailsMore } from 'react-icons/cg'
import MoreVertButton from '../MenuWrapper/MoreVertButton'
import { useNavigate } from 'react-router-dom'
import { FaForward } from 'react-icons/fa'
import BRAND from '../../config/brand'

const FeedbackCard = ({ feedback, status, handleForward }) => {
  const theme = useTheme()
  const nav = useNavigate()

  return (
    <Box
      sx={{
        backgroundColor: 'background.paper',
        borderTop: '4px solid',
        borderTopColor:
          status === 'CREATED'
            ? `${theme.palette.success.main}`
            : status === 'IN_PROGRESS'
              ? `${theme.palette.warning.main}`
              : status === 'COMPLETED'
                ? `${theme.palette.info.main}`
                : `${theme.palette.primary.main}`,
        borderRadius: 3,
        p: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 0.1,
        maxWidth: '350px',
        width: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6">
          {BRAND.ticketPrefix}-{feedback.id}
        </Typography>
        <MoreVertButton
          btnList={[
            {
              id: feedback.id,
              icon: <FaForward />,
              name: 'İlerlet',
              onClick: (id) => {
                handleForward(id, feedback.status)
              },
              disabled: feedback.status === 'COMPLETED',
            },
            {
              id: feedback.id,
              icon: <CgDetailsMore />,
              name: 'Detay gör',
              onClick: (id) => {
                nav(`${feedback.id}`)
              },
            },
          ]}
          top={-20}
        />
      </Box>
      <Divider sx={{ width: '100%' }} />
      <Box></Box>
      <Typography variant="body2" textAlign={'start'} fontWeight={theme.typography.fontWeightMedium}>
        {feedback.description}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: 2,
        }}
      >
        <Box>
          <Chip
            color={feedback.title === 'ERROR' ? 'error' : 'info'}
            size="small"
            label={`${feedback.title === 'FEEDBACK' ? 'Destek' : 'Hata'}`}
            sx={{ fontSize: 10, borderRadius: 1 }}
          />
        </Box>

        <Box>
          <Chip color="default" size="small" label={`+ ${feedback.uploads.length}`} />
        </Box>
      </Box>
    </Box>
  )
}

export default FeedbackCard
