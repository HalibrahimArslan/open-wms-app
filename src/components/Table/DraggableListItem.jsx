import { Box, Checkbox, ListItem, ListItemIcon, ListItemText, useTheme } from '@mui/material'
import { useRef } from 'react'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import { Opacity } from '@mui/icons-material'

const ItemTypes = {
  CARD: 'card',
}

const style = {
  border: '1px dashed gray',
  padding: '0.5rem 1rem',
  marginBottom: '.5rem',
  backgroundColor: 'white',
  cursor: 'move',
}

export const DraggableListItem = ({ id, text, index, moveListItem, checked, disabled, handleChecked }) => {
  const ref = useRef < HTMLDivElement > null
  const theme = useTheme()
  // const [{ handlerId }, drop] = useDrop({
  //   accept: ItemTypes.CARD,
  //   collect(monitor) {
  //     return {
  //       handlerId: monitor.getHandlerId(),
  //     }
  //   },
  //   hover(item, monitor) {
  //     if (!ref.current) {
  //       return
  //     }
  //     const dragIndex = item.index
  //     const hoverIndex = index

  //     // Don't replace items with themselves
  //     if (dragIndex === hoverIndex) {
  //       return
  //     }

  //     // Determine rectangle on screen
  //     const hoverBoundingRect = ref.current?.getBoundingClientRect()

  //     // Get vertical middle
  //     const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

  //     // Determine mouse position
  //     const clientOffset = monitor.getClientOffset()

  //     // Get pixels to the top
  //     const hoverClientY = (clientOffset).y - hoverBoundingRect.top

  //     // Only perform the move when the mouse has crossed half of the items height
  //     // When dragging downwards, only move when the cursor is below 50%
  //     // When dragging upwards, only move when the cursor is above 50%

  //     // Dragging downwards
  //     if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
  //       return
  //     }

  //     // Dragging upwards
  //     if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
  //       return
  //     }

  //     // Time to actually perform the action
  //     moveListItem(dragIndex, hoverIndex)

  //     // Note: we're mutating the monitor item here!
  //     // Generally it's better to avoid mutations,
  //     // but it's good here for the sake of performance
  //     // to avoid expensive index searches.
  //     item.index = hoverIndex
  //   },
  // })

  // const [{ isDragging }, drag] = useDrag({
  //   type: ItemTypes.CARD,
  //   item: () => {
  //     return { id, index }
  //   },
  //   collect: (monitor) => ({
  //     isDragging: monitor.isDragging(),
  //   }),
  // })

  // const opacity = isDragging ? 0 : 1
  // drag(drop(ref))
  return (
    <Box
    // sx={{
    //   '&:hover': { cursor: 'pointer' },
    //   '&:active': { background: '#b2d0b2' },
    // }}
    // ref={ref}
    // style={{ opacity: 1 }}
    // data-handler-id={handlerId}
    >
      <ListItem sx={{ py: 1 }} secondaryAction={<Checkbox checked={checked} onChange={handleChecked} disabled={true} />}>
        <ListItemIcon>
          <DragIndicatorIcon />
        </ListItemIcon>
        <ListItemText primary={text.charAt(0).toUpperCase() + text.slice(1)} />
      </ListItem>
    </Box>
  )
}
