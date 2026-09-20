import { Box, Chip, Stack, Typography, useTheme } from '@mui/material'
import InboxRoundedIcon from '@mui/icons-material/InboxRounded'
import FeedbackCard from './FeedbackCard'
import EmptyState from '../../shared/components/EmptyState/EmptyState'
import { FeedbackStatus } from '../../utils/Utils'

/**
 * Panonun tek durum sutunu.
 *
 * Sutun basligi durumu renkli bir nokta ve kayit sayisiyla anlatir. Onceden
 * uc durumun ucunde de kum saati ikonu vardi (dolu, yarim, bos) ve hangisinin
 * hangi durum oldugu birbirinden ayirt edilemiyordu; ustelik "tamamlandi"
 * durumuna yarim kum saati dusuyordu.
 *
 * Durum etiketleri Utils'teki FeedbackStatus haritasindan okunur. Sutun
 * kendi sozlugunu tutuyordu ("OLUSTURULDU") ve ayni durum detay ekraninda
 * baska turlu ("Acik") yaziyordu.
 *
 * Sutun kendi icinde kayar; yuksekligi disaridan gelen flex alanina uyar.
 */
const STATUS_COLOR = {
  CREATED: 'warning.main',
  IN_PROGRESS: 'primary.main',
  COMPLETED: 'success.main',
}

const FeedbackStatusBlock = ({ status, feedbacks, handleForward }) => {
  const theme = useTheme()

  return (
    <Box
      sx={{
        flex: '1 1 0',
        minWidth: 320,
        maxWidth: 460,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: theme.radius.section,
        backgroundColor: theme.palette.surface.subtle,
        border: `1px solid ${theme.palette.border.subtle}`,
        overflow: 'hidden',
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        sx={{
          alignItems: 'center',
          flexShrink: 0,
          paddingX: 1.75,
          paddingY: 1.25,
          borderBottom: `1px solid ${theme.palette.border.subtle}`,
        }}
      >
        <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: STATUS_COLOR[status] ?? 'text.disabled', flexShrink: 0 }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 700, flexGrow: 1 }}>
          {FeedbackStatus[status] ?? status}
        </Typography>
        <Chip size="small" label={feedbacks.length} sx={{ borderRadius: theme.radius.control, fontWeight: 700 }} />
      </Stack>

      <Box
        sx={{
          flexGrow: 1,
          minHeight: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: 1.25,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.25,
        }}
      >
        {feedbacks.length === 0 ? (
          <EmptyState dense icon={<InboxRoundedIcon />} title="Kayıt yok" description="Bu durumda bekleyen geri bildirim bulunmuyor." />
        ) : (
          feedbacks.map((feedback) => <FeedbackCard key={feedback.id} feedback={feedback} handleForward={handleForward} />)
        )}
      </Box>
    </Box>
  )
}

export default FeedbackStatusBlock
