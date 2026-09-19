import React from 'react'
import useIsMobile from '../../hooks/useIsMobile'
import { Box } from '@mui/system'
import { Alert, IconButton, MenuItem, Select, Typography } from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

const AurPagination = ({ page, count, rowsPerPageList, rowsPerPage, defaultValue, handleChange, handleIncrease, handleDecrease }) => {
  const isMobile = useIsMobile()
  let ratio = count / rowsPerPage

  return (
    <Box sx={{ display: 'flex', width: '100%', alignItems: 'center', flexDirection: isMobile ? 'column' : 'row', gap: 2, justifyContent: 'space-between' }}>
      <Alert severity="info" sx={{ py: 0, px: 1 }}>
        {count} adet bulundu
      </Alert>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <IconButton disabled={page === 1} onClick={handleDecrease}>
          <ChevronLeftIcon />
        </IconButton>
        <Typography
          sx={{
            fontWeight: 'bold',
          }}
        >
          {page}
        </Typography>
        <IconButton onClick={handleIncrease} disabled={page === (ratio <= 1 ? 1 : Math.ceil(ratio))}>
          <ChevronRightIcon />
        </IconButton>
        <Select defaultValue={defaultValue} value={rowsPerPage} size="small" onChange={handleChange}>
          {rowsPerPageList.map((perItem) => (
            <MenuItem value={perItem}>{perItem}</MenuItem>
          ))}
        </Select>
      </Box>
    </Box>
  )
}

export default AurPagination
