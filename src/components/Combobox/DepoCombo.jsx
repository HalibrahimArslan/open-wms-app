import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { DepoContainer } from '../../store/DepoContainer'
import { useContainer } from 'unstated-next'

export default function DepoCombo() {
  const { depoCombo, handleDepoCombo, allDepoList } = useContainer(DepoContainer)
  const handleChange = (event) => {
    handleDepoCombo(event.target.value)
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Depo Seçiniz</InputLabel>
        <Select labelId="demo-simple-select-label" id="demo-simple-select" value={depoCombo} label="Depo Seciniz" onChange={handleChange}>
          {allDepoList &&
            allDepoList.length > 0 &&
            allDepoList.map((val) => (
              <MenuItem key={val.code} value={val.code}>
                {val.name}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </Box>
  )
}
