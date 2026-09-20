import { Box, Card, CardActionArea, Chip, Stack, Typography, useTheme } from '@mui/material'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { useNavigate } from 'react-router'
import dayjs from 'dayjs'
import MoreVertButton from '../MenuWrapper/MoreVertButton'
import BRAND from '../../config/brand'
import { FeedbackTitle } from '../../utils/Utils'

/**
 * Panodaki tek geri bildirim karti.
 *
 * Kartin sol kenarindaki renkli serit DURUMU degil TIPI gosterir: durum zaten
 * kartin hangi sutunda durdugundan belli, tipi ise baska hicbir yerden belli
 * degil. Yalnizca hatalar renkle isaretlenir, destek talepleri notr kalir;
 * boylece pano tarandiginda goze once hatalar carpar.
 *
 * Kartin govdesi tiklanabilir ve detaya gider. Onceden detaya gitmenin tek
 * yolu ucnokta menusunu acmakti.
 */
const FeedbackCard = ({ feedback, handleForward }) => {
  const theme = useTheme()
  const nav = useNavigate()

  const isError = feedback.title === 'ERROR'
  const attachmentCount = feedback.uploads?.length ?? 0
  const createdDate = feedback.createdDate ? dayjs(feedback.createdDate).format('DD.MM.YYYY') : null

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <Card
        variant="outlined"
        sx={{
          borderRadius: theme.radius.card,
          borderLeft: `3px solid ${isError ? theme.palette.error.main : theme.palette.border.rest}`,
          backgroundColor: 'background.paper',
        }}
      >
        <CardActionArea onClick={() => nav(`${feedback.id}`)} sx={{ display: 'block', padding: 1.5, borderRadius: theme.radius.card }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, paddingRight: 4 }}>
            {BRAND.ticketPrefix}-{feedback.id}
          </Typography>

          {/* Uc satirdan sonra kirpilir: kirpilmazsa uzun aciklamali bir kart
              sutunun tamamini kaplayip panoyu taranamaz hale getiriyor. */}
          <Typography
            variant="body2"
            sx={{
              marginTop: 0.75,
              color: 'text.secondary',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: 40,
            }}
          >
            {feedback.description}
          </Typography>

          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', marginTop: 1.5 }}>
            <Chip
              size="small"
              label={FeedbackTitle[feedback.title] ?? feedback.title}
              color={isError ? 'error' : 'default'}
              variant={isError ? 'filled' : 'outlined'}
              sx={{ borderRadius: theme.radius.control, fontSize: 11 }}
            />
            {attachmentCount > 0 && (
              <Stack direction="row" spacing={0.25} sx={{ alignItems: 'center', color: 'text.secondary' }}>
                <AttachFileIcon sx={{ fontSize: 14 }} />
                <Typography variant="caption">{attachmentCount}</Typography>
              </Stack>
            )}
            <Box sx={{ flexGrow: 1 }} />
            {createdDate && (
              <Typography variant="caption" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
                {createdDate}
              </Typography>
            )}
          </Stack>
        </CardActionArea>
      </Card>

      {/* Ucnokta menusu tiklanabilir govdenin disinda durur; icinde olsaydi
          menuyu acan tiklama ayni zamanda detaya da giderdi. */}
      <Box sx={{ position: 'absolute', top: 2, right: 2, width: 36, height: 36, zIndex: 1 }}>
        <MoreVertButton
          btnList={[
            {
              id: feedback.id,
              icon: <ArrowForwardIcon fontSize="small" />,
              name: 'İlerlet',
              onClick: (id) => handleForward(id, feedback.status),
              disabled: feedback.status === 'COMPLETED',
            },
            {
              id: feedback.id,
              icon: <OpenInNewIcon fontSize="small" />,
              name: 'Detay gör',
              onClick: (id) => nav(`${id}`),
            },
          ]}
        />
      </Box>
    </Box>
  )
}

export default FeedbackCard
