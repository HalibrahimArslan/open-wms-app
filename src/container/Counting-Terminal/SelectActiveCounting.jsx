import { useTheme } from '@mui/system'
import Box from '@mui/material/Box'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import Chip from '@mui/material/Chip'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}

function getStyles(countingDefinitionList, countingDefinition, theme) {
  return {
    fontWeight: countingDefinition.indexOf(countingDefinitionList) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium,
  }
}

export default function SelectActiveCounting({ countingDefinitionList, countingDefinition, handleCountingDefinition, label }) {
  const theme = useTheme()

  const handleChange = (event) => {
    const {
      target: { value },
    } = event
    handleCountingDefinition(typeof value === 'string' ? value.split(',') : value)
  }
  return (
    <Box>
      <FormControl sx={{ m: 2, display: 'flex', flexGrow: 1 }}>
        <InputLabel id="counting-multiple-chip-label">{label}</InputLabel>
        <Select
          labelId="counting-multiple-chip-label"
          id="counting-multiple-chip"
          value={countingDefinition}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
          sx={{ borderRadius: 5 }}
        >
          {countingDefinitionList.map((countingItem) => (
            <MenuItem key={countingItem.id} value={countingItem.sayimAdi} style={getStyles(countingItem, countingDefinition, theme)}>
              {countingItem.sayimAdi}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  )
}
