import { GridToolbarQuickFilter } from '@mui/x-data-grid'
import React from 'react'

const CustomToolbar = () => {
  return (
    <div style={{ padding: '0.5rem', display: 'flex', justifyContent: 'flex-end' }}>
      <GridToolbarQuickFilter debounceMs={500} />
    </div>
  )
}

export default CustomToolbar
