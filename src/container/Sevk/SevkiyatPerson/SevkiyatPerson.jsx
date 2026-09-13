import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import useFetch from '../../../hooks/useFetch'

export default function SevkiyatPerson({ person, handlePerson }) {
  const [receivingPerson, setReceivigPerson] = useState([])
  const [data] = useFetch('/api/users/2')

  const handleChange = (event) => {
    handlePerson(event.target.value)
  }

  useEffect(() => {
    setReceivigPerson(data)
  }, [data])

  return (
    <Box sx={{ display: 'flex' }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Sevkiyat Elemanları</InputLabel>
        <Select labelId="demo-simple-select-label" id="demo-simple-select" value={person} label="Sevkiyat Elemanları" onChange={handleChange}>
          {receivingPerson && receivingPerson.length > 0 ? (
            receivingPerson.map((todo) => (
              <MenuItem key={todo.id} value={todo.id}>
                {todo.login}
              </MenuItem>
            ))
          ) : (
            <></>
          )}
        </Select>
      </FormControl>
    </Box>
  )
}
