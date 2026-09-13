import React, { useState } from 'react'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { CountingContext } from '../../context/CountingContext'
import { useContext } from 'react'

export default function PickCounting({ countingList }) {
  const { handleSelectedCounting, handleSelectedCountingId } = useContext(CountingContext)
  const [selectedCounting, setSelectedCounting] = useState(0)

  const handleChange = (event) => {
    let countingId = event.target.value
    setSelectedCounting(countingId)
    handleSelectedCountingId(countingId)
    handleSelectedCounting(countingList.find((counting) => counting.id === Number(countingId)))
  }

  return (
    <FormControl
      size="small"
      sx={{
        minWidth: 180,
        '& .MuiOutlinedInput-root': {
          backgroundColor: 'background.paper',
        },
      }}
    >
      <InputLabel id="active-counting-label">Sayım Seçiniz</InputLabel>
      <Select size="small" labelId="active-counting-label" id="active-counting-select" value={selectedCounting} label="Sayım Seciniz" onChange={handleChange}>
        {countingList &&
          countingList.length > 0 &&
          countingList.map((todo) => (
            <MenuItem key={todo.id} value={todo.id}>
              {todo.sayimAdi}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  )
}
