import { Button } from '@mui/material'

const BooleanFilter = ({ selected, text, handleClick }) => {
  return (
    <Button variant={selected ? 'contained' : 'outlined'} onClick={handleClick} sx={{ borderRadius: 2, whiteSpace: 'nowrap', flexShrink: 0 }}>
      {text}
    </Button>
  )
}

export default BooleanFilter
