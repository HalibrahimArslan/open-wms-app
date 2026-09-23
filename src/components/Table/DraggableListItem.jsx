import { Box, Checkbox, ListItem, ListItemIcon, ListItemText } from '@mui/material'
import { useState } from 'react'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import ReadOnlyCheckbox from '../../shared/components/ReadOnlyCheckbox'

export const DraggableListItem = ({ text, index, moveListItem, checked, disabled, draggable, locked, handleChecked }) => {
  const [isOver, setIsOver] = useState(false)

  const handleDragStart = (event) => {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', String(index))
  }

  const handleDragOver = (event) => {
    event.preventDefault()
    setIsOver(true)
  }

  const handleDrop = (event) => {
    event.preventDefault()
    setIsOver(false)
    const dragIndex = Number(event.dataTransfer.getData('text/plain'))
    if (dragIndex !== index) {
      moveListItem(dragIndex, index)
    }
  }

  const dragProps = draggable
    ? {
        draggable: true,
        onDragStart: handleDragStart,
        onDragOver: handleDragOver,
        onDragLeave: () => setIsOver(false),
        onDrop: handleDrop,
      }
    : {}

  return (
    <Box {...dragProps} sx={{ cursor: draggable ? 'grab' : 'default', borderRadius: 1, bgcolor: isOver ? 'action.hover' : 'transparent' }}>
      <ListItem sx={{ py: 1 }} secondaryAction={locked ? <ReadOnlyCheckbox checked /> : <Checkbox checked={checked} onChange={handleChecked} disabled={disabled} />}>
        <ListItemIcon>
          <DragIndicatorIcon />
        </ListItemIcon>
        <ListItemText primary={text.charAt(0).toUpperCase() + text.slice(1)} />
      </ListItem>
    </Box>
  )
}
