import { Autocomplete, Button, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import usePayload from '../../hooks/usePayload'
import useAuthHeader from '../../hooks/useAuthHeader'
import { notify } from '../../layout/Layout'
import { getLogisticType, saveLookup } from '../../services/LookupService'

function Record({ type, log, label, handleChangeLookup, error, helperText }) {
  const [data, setData] = useState([])
  const [inputValue, setInputValue] = useState('')
  const headers = useAuthHeader()
  const payload = usePayload({
    lookupCode: type,
    lookupName: inputValue.toUpperCase(),
    lookupDescription: '-',
  })

  const handleAdd = async () => {
    let res = await saveLookup(payload)
    notify('Ekleme Basarili')
    setData([...data, res])
    setInputValue('')
  }
  const fetchLogisticTypes = async () => {
    let res = await getLogisticType(headers, type)
    setData(res)
  }

  useEffect(() => {
    fetchLogisticTypes()
  }, [type])

  return (
    <Autocomplete
      noOptionsText={
        <Button onClick={handleAdd} variant="contained">
          Ekle
        </Button>
      }
      renderInput={(params) => <TextField {...params} label={label} error={error} helperText={helperText} />}
      fullWidth
      options={data}
      getOptionLabel={(option) => option.lookupName}
      value={log}
      onChange={(event, newValue) => {
        handleChangeLookup(newValue, type)
      }}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue)
      }}
      sx={{ minWidth: 200 }}
    />
  )
}

export default Record
