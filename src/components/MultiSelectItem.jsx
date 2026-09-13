import * as React from 'react'
import Box from '@mui/material/Box'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import Chip from '@mui/material/Chip'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { notifyError } from '../layout/Layout'
import { useTheme } from '@mui/material'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 360,
    },
  },
}

function getStyles(option, value, theme) {
  return {
    fontWeight: value.indexOf(option) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium,
  }
}

export default function MultiSelectItem({ options, selectedValues, handleChangeValues, label, originalData }) {
  const theme = useTheme()

  const labelMap = React.useMemo(() => {
    if (!Array.isArray(originalData)) return {}
    return originalData.reduce((acc, item) => {
      const key = String(item?.orderNo ?? '')
      if (!key) return acc
      acc[key] = item?.transGroupName ? `${key} - ${item.transGroupName}` : key
      return acc
    }, {})
  }, [originalData])

  const getOptionKey = (option) => {
    if (typeof option === 'object' && option !== null) return String(option.orderNo ?? '')
    return String(option ?? '')
  }

  const getOptionLabel = (option) => {
    const key = getOptionKey(option)
    return labelMap[key] || key
  }

  const handleChange = (event) => {
    const {
      target: { value },
    } = event
    const nextValues = typeof value === 'string' ? value.split(',') : value

    if (!originalData || originalData.length === 0) {
      handleChangeValues(nextValues)
      return
    }

    if (nextValues.length === 0 || selectedValues.length === 0 || nextValues.length < selectedValues.length) {
      handleChangeValues(nextValues)
      return
    }

    const addedValue = nextValues.find((val) => !selectedValues.includes(val))
    if (!addedValue) {
      handleChangeValues(nextValues)
      return
    }

    const selectedTransGrupCode = originalData.find((item) => String(item.orderNo) === String(selectedValues[0]))?.transGroupCode
    const targetTransGrupCode = originalData.find((item) => String(item.orderNo) === String(addedValue))?.transGroupCode

    if (selectedTransGrupCode && targetTransGrupCode && selectedTransGrupCode !== targetTransGrupCode) {
      notifyError('Farklı Carilere ait siparişler seçilemez.')
      return
    }

    handleChangeValues(nextValues)
  }

  return (
    <Box sx={{ minWidth: '200px' }}>
      <FormControl sx={{ m: 2, display: 'flex', flexGrow: 1 }}>
        <InputLabel id="demo-multiple-chip-label">{label}</InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={selectedValues}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Tooltip key={value} title={getOptionLabel(value)}>
                  <Chip
                    label={getOptionLabel(value)}
                    sx={{
                      maxWidth: 180,
                      '& .MuiChip-label': {
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      },
                    }}
                  />
                </Tooltip>
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
          sx={{ borderRadius: theme.shape.borderRadius }}
        >
          {options
            .filter((a) => a !== null)
            .sort((a, b) => getOptionKey(a).toLowerCase().localeCompare(getOptionKey(b).toLowerCase()))
            .map((option) => {
              const key = getOptionKey(option)
              return (
                <MenuItem key={key} value={option} style={getStyles(key, selectedValues, theme)}>
                  <Tooltip title={getOptionLabel(option)} placement="right">
                    <Typography noWrap sx={{ maxWidth: 320 }}>
                      {getOptionLabel(option)}
                    </Typography>
                  </Tooltip>
                </MenuItem>
              )
            })}
        </Select>
      </FormControl>
    </Box>
  )
}
