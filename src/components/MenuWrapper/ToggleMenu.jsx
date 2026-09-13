import { Box, Typography, useTheme } from '@mui/material'

const ToggleMenu = ({ btnList, activeIndex, setActiveIndex }) => {
  const theme = useTheme()

  return (
    <Box
      sx={{
        display: 'inline-flex',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: theme.palette.action.selected,
        borderRadius: theme.shape.borderRadius,
        padding: '2px 2px',
      }}
    >
      {btnList.map((btnItem, index) => (
        <Box
          key={index}
          sx={{
            padding: 2,
            borderRadius: theme.shape.borderRadius,
            bgcolor: index === activeIndex ? theme.palette.background.paper : '',
            cursor: 'pointer',
            transition: 'background-color 0.5s ease-out',
          }}
          onClick={() => setActiveIndex(index)}
        >
          <Typography fontWeight={theme.typography.fontWeightBold}>{btnItem}</Typography>
        </Box>
      ))}
    </Box>
  )
}

export default ToggleMenu
