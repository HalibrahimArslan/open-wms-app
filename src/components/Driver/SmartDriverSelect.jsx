import React, { useEffect, useState } from 'react'
import { Autocomplete, TextField } from '@mui/material'
import useAuthHeader from '../../hooks/useAuthHeader'
import { getInitialDrivers, getDrivers } from '../../services/DriverService'

export default function SmartDriverSelect({ value, setValue, onAddDriverClick }) {
  const [inputValue, setInputValue] = useState('')
  const [initialOptions, setInitialOptions] = useState([])
  const [searchOptions, setSearchOptions] = useState([])
  const [loading, setLoading] = useState(false)
  const headers = useAuthHeader()

  useEffect(() => {
    const loadInitial = async () => {
      setLoading(true)
      try {
        const data = await getInitialDrivers(headers)
        setInitialOptions(data)
      } catch (err) {
        console.error('Initial driver fetch failed:', err)
      } finally {
        setLoading(false)
      }
    }

    loadInitial()
  }, [headers])

  useEffect(() => {
    const delay = setTimeout(async () => {
      if (inputValue.length >= 3) {
        setSearchOptions([])
        setLoading(true)
        try {
          const query = `driverName.contains=${encodeURIComponent(inputValue)}`
          const data = await getDrivers(headers, query)

          if (data.length > 0) {
            setSearchOptions(data)
          } else {
            setSearchOptions([
              {
                isNewOption: true,
                label: `Yeni şoför "${inputValue}" eklemek ister misiniz?`,
              },
            ])
          }
        } catch (err) {
          console.error('Search fetch failed:', err)
          setSearchOptions([])
        } finally {
          setLoading(false)
        }
      }
    }, 400)

    return () => clearTimeout(delay)
  }, [inputValue, headers])

  const optionsToShow = inputValue.length >= 3 ? searchOptions : initialOptions

  const handleChange = (event, newValue) => {
    if (newValue?.isNewOption) {
      onAddDriverClick()
    } else {
      setValue(newValue)
    }
  }
  return (
    <Autocomplete
      value={value}
      fullWidth
      onChange={handleChange}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
      options={optionsToShow}
      filterOptions={(x) => x}
      getOptionLabel={(option) => (option?.isNewOption ? option.label : option.driverName?.trim() || '')}
      renderOption={(props, option) => <li {...props}>{option?.isNewOption ? option.label : `${option.driverName} – ${option.licensePlate}`}</li>}
      renderInput={(params) => <TextField {...params} label="Şoför Seçiniz" fullWidth />}
      loading={loading}
    />
  )
}
