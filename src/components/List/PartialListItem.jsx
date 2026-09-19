import { ListItemButton, ListItemText, Typography, useTheme } from '@mui/material'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'

const PartialListItem = ({ partialItem, getPartialDetails }) => {
  const theme = useTheme()
  return (
    <ListItemButton sx={{ bgcolor: partialItem.status ? theme.palette.success.main : theme.palette.error.main, borderRadius: 3 }} onClick={() => getPartialDetails(partialItem)}>
      <ListItemText
        primary={partialItem.packageName}
        secondary={
          <>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
              }}
            >
              {partialItem.packageBarcode}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
              }}
            >
              {partialItem.packageCode}
            </Typography>
          </>
        }
      />
      <NavigateNextIcon />
    </ListItemButton>
  )
}

export default PartialListItem
