import { GridToolbarQuickFilter, Toolbar } from '@mui/x-data-grid'
import React from 'react'

// MUI X v8+ toolbar alt bilesenleri Toolbar baglami ister; render ile eski sade
// kapsayici gorunumu korunur.
const CustomToolbar = () => {
  return (
    <Toolbar render={<div style={{ padding: '0.5rem', display: 'flex', justifyContent: 'flex-end' }} />}>
      <GridToolbarQuickFilter debounceMs={500} />
    </Toolbar>
  )
}

export default CustomToolbar
