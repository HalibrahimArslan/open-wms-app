import * as React from 'react'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'

const ControlledRadioGroup = ({ data, value, handleChange, formTitle }) => {
  return (
    <FormControl sx={{ width: '100%' }}>
      <FormLabel id="controlled-radio-buttons-group">{formTitle}</FormLabel>
      <RadioGroup aria-labelledby="controlled-radio-buttons-group" name="wm-controlled-radio-buttons-group" value={value} onChange={handleChange}>
        {data.map((item, index) => (
          <FormControlLabel key={index} value={item.value} control={<Radio />} label={item.label} />
        ))}
      </RadioGroup>
    </FormControl>
  )
}

export default ControlledRadioGroup
