import { Avatar, Box, Button, useTheme } from '@mui/material'
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import './Slider.css'

export default function BasicSlider({ children, bgImage }) {
  const theme = useTheme()
  const scrollLeft = () => {
    let elem = document.getElementById('content')
    if (typeof elem !== 'undefined' && elem !== null) {
      elem.scrollLeft -= 400
    }
  }

  const scrollRight = () => {
    let elem = document.getElementById('content')
    if (typeof elem !== 'undefined' && elem !== null) {
      elem.scrollLeft += 400
    }
  }

  return (
    <Box className={'main'}>
      {bgImage && <Box className={'inner'} sx={{ background: theme.palette.secondary.main }}></Box>}
      {/* <Button
        sx={{ position: "absolute", left: -30, top: "50%", zIndex: 15 }}
        onClick={scrollLeft}
        startIcon={
          <Avatar>
            <ArrowBackIosNewRoundedIcon />
          </Avatar>
        }
      /> */}
      {/* <Button
        sx={{
          position: "absolute",
          right: -30,
          top: "50%",
          zIndex: 15,
          opacity: 2,
        }}
        onClick={scrollRight}
        endIcon={
          <Avatar>
            <ArrowForwardIosIcon />
          </Avatar>
        }
      /> */}
      <Box id="content" className={'container'}>
        <Box className={'children'}>{children}</Box>
      </Box>
    </Box>
  )
}
