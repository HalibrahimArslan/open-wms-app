import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import useFetch from '../../../hooks/useFetch'

export default function ReceivingPerson({ person, handlePerson }) {
  const [receivingPerson, setReceivigPerson] = useState([])
  const [data] = useFetch('/api/users/by-role/ROLE_KABUL')

  const handleChange = (event) => {
    handlePerson(event.target.value)
  }

  useEffect(() => {
    setReceivigPerson(data)
  }, [data])

  return (
    <Box sx={{ display: 'flex' }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Mal Kabul Elemanları</InputLabel>
        <Select labelId="demo-simple-select-label" id="demo-simple-select" value={person} label="Mal Kabul Elemanları" onChange={handleChange}>
          {receivingPerson && receivingPerson.length > 0 ? (
            receivingPerson.map((todo) => (
              <MenuItem key={todo.id} value={todo.id}>
                {todo.login}
              </MenuItem>
            ))
          ) : (
            <div></div>
          )}
        </Select>
      </FormControl>
    </Box>
  )
}
