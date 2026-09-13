import { Box, Card, CardActionArea, CardContent, CardHeader, Collapse, IconButton, Stack, Typography, styled, useMediaQuery, useTheme } from '@mui/material'
import React from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress'

const ExpandMore = styled((props) => {
  const { expand, ...other } = props
  return <IconButton {...other} />
})(({ theme, expand }) => ({
  position: 'absolute',
  top: 0,
  right: 0,
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}))

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
  },
}))

export default function PickingCard({ item, adresList }) {
  const [expanded, setExpanded] = React.useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const handleExpandClick = () => {
    setExpanded(!expanded)
  }
  return (
    <Card
      sx={{
        border: '1px solid',
        borderRadius: 2,
        position: 'relative',
        p: isMobile && 2,
      }}
    >
      <CardHeader title={item.stokKodu} subheader={item.barkod} />
      <CardContent>
        <Box
          sx={{
            bgcolor: theme.palette.secondary.main,
            p: 0.25,
            borderRadius: theme.shape.borderRadius,
            m: 'auto',
          }}
        >
          <BorderLinearProgress variant="determinate" value={(item.teslimMiktar / item.siparisMiktar) * 100} />
          <Typography variant="h6" fontWeight={theme.typography.fontWeightBold}>
            {item.siparisMiktar} / {item.teslimMiktar}
          </Typography>
        </Box>
      </CardContent>
      <CardContent>
        <Box display={'flex'}>
          <Box>{item.stokAdi.slice(0, 40) + '..'}</Box>
        </Box>
        <ExpandMore expand={expanded} onClick={handleExpandClick} aria-expanded={expanded} aria-label="show more">
          <ExpandMoreIcon />
        </ExpandMore>
      </CardContent>
      <CardActionArea>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Stack direction={'column'} maxHeight={100} overflow={'auto'} bgcolor={theme.palette.action.hover}>
            {adresList && adresList.length > 0 && adresList.filter((todo) => todo.stockCode === item.stokKodu).map((t) => <Typography variant="h6">{t.address}</Typography>)}
          </Stack>
        </Collapse>
      </CardActionArea>
    </Card>
  )
}
