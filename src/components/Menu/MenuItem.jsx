import { List } from '@mui/material'
import MenuTreeItem from './MenuTreeItem'

export default function MenuItem({ data, leaf, openMenuId, handleClick, handleToggle }) {
  return (
    <List sx={{ paddingRight: 1, paddingLeft: 1 }}>
      {data.map((item) => (
        <MenuTreeItem
          key={item.id}
          item={item}
          children={item.children.length > 0 ? true : false}
          leaf={leaf}
          handleClick={handleClick}
          handleToggle={handleToggle}
          openMenuId={openMenuId}
        />
      ))}
    </List>
  )
}
