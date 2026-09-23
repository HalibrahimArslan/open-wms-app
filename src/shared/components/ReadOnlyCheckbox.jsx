import { Checkbox } from '@mui/material'

export default function ReadOnlyCheckbox({ checked, ...props }) {
  return <Checkbox checked={Boolean(checked)} disabled sx={{ '&.Mui-disabled.Mui-checked': { color: 'primary.main' } }} {...props} />
}
