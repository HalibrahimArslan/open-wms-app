import { Box, Card, CardContent, Chip, Divider, Stack, Typography, useTheme } from '@mui/material'

export default function GlobalSearchResultCard({ icon, typeLabel, title, subtitle, headerChip, rows, extra, footer }) {
  const theme = useTheme()

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
        transition: 'border-color .15s ease, box-shadow .15s ease',
        '&:hover': {
          borderColor: theme.palette.primary.light,
          boxShadow: '0 6px 18px rgba(0,0,0,0.07)',
        },
      }}
    >
      <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" gap={1} sx={{ flexWrap: 'wrap', rowGap: 1 }}>
          <Stack direction="row" alignItems="flex-start" gap={1.2} sx={{ minWidth: 0, flex: '1 1 200px' }}>
            {icon && (
              <Box
                sx={{
                  flexShrink: 0,
                  width: 36,
                  height: 36,
                  borderRadius: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: (theme) => theme.palette.action.hover,
                  color: 'primary.main',
                }}
              >
                {icon}
              </Box>
            )}
            <Stack sx={{ minWidth: 0 }}>
              {typeLabel && (
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase' }}>
                  {typeLabel}
                </Typography>
              )}
              <Typography variant="subtitle1" sx={{ fontWeight: 700, wordBreak: 'break-word' }}>
                {title}
              </Typography>
              {subtitle && (
                <Typography variant="body2" sx={{ color: 'text.secondary', wordBreak: 'break-word' }}>
                  {subtitle}
                </Typography>
              )}
            </Stack>
          </Stack>
          {headerChip && <Box sx={{ flexShrink: 0, maxWidth: '100%' }}>{headerChip}</Box>}
        </Stack>

        {rows && rows.length > 0 && (
          <>
            <Divider sx={{ my: 1.5 }} />
            <Stack spacing={1}>
              {rows.map((row, i) => (
                <Stack key={i} direction="row" alignItems="center" justifyContent="space-between" gap={1} sx={{ flexWrap: 'wrap', rowGap: 0.5 }}>
                  <Stack direction="row" alignItems="center" gap={0.8} sx={{ color: 'text.secondary', minWidth: 0 }}>
                    {row.icon}
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {row.label}
                    </Typography>
                  </Stack>
                  <Box sx={{ minWidth: 0, maxWidth: '100%', textAlign: 'right' }}>
                    {typeof row.value === 'string' || typeof row.value === 'number' ? (
                      <Typography variant="body2" sx={{ fontWeight: 600, wordBreak: 'break-word' }}>
                        {row.value}
                      </Typography>
                    ) : (
                      row.value
                    )}
                  </Box>
                </Stack>
              ))}
            </Stack>
          </>
        )}

        {extra && <Box sx={{ mt: 1.5 }}>{extra}</Box>}

        {footer && (
          <>
            <Divider sx={{ my: 1.5 }} />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, flexWrap: 'wrap' }}>{footer}</Box>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export function ResultChip(props) {
  const { sx, ...rest } = props
  return (
    <Chip
      size="small"
      sx={{
        fontWeight: 700,
        maxWidth: '100%',
        '& .MuiChip-label': {
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        },
        ...sx,
      }}
      {...rest}
    />
  )
}
