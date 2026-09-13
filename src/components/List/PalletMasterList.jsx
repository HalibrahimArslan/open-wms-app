import { IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemSecondaryAction, ListItemText, useTheme } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import PalletImage from '../../assets/images/cards/palet.jpg'
import InfoIcon from '@mui/icons-material/Info'
import { useNavigate } from 'react-router-dom'

const PalletMasterList = ({ palletList, selectedPalletList, handlePalletList }) => {
  const theme = useTheme()
  const nav = useNavigate()
  return (
    <List sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {palletList.length > 0 &&
        palletList.map((pallet) => (
          <ListItemButton
            sx={{ backgroundColor: theme.palette.background.paper, borderRadius: theme.shape.borderRadius }}
            key={pallet.id}
            selected={selectedPalletList.includes(pallet.id)}
            onClick={() => handlePalletList(pallet.id)}
          >
            <ListItemIcon>
              <img src={PalletImage} alt="Pallet" style={{ width: 50, height: 50 }} />
            </ListItemIcon>
            <ListItemText primary={`Pallet Barkodu`} secondary={pallet.barcode} />
            <ListItemSecondaryAction>
              <IconButton edge="start" onClick={() => nav(`${pallet.barcode}/detail`)}>
                <InfoIcon color="primary" />
              </IconButton>
              <IconButton edge="end">{selectedPalletList.includes(pallet.id) ? <CheckCircleIcon color="primary" /> : <RadioButtonUncheckedIcon />}</IconButton>
            </ListItemSecondaryAction>
          </ListItemButton>
        ))}
    </List>
  )
}

export default PalletMasterList
