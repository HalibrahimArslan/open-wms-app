import * as React from 'react'
import { List } from 'react-window'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Checkbox from '@mui/material/Checkbox'
import SearchBox from '../../components/SearchBox'
import { notifyError } from '../../layout/Layout'
import { Box, Chip, CircularProgress, Stack, useTheme } from '@mui/material'
import BasicSlider from '../../shared/components/Slider/BasicSlider'
import CenterizedBox from '../../shared/components/Box/CenterizedBox'

// Her satırın kapladığı toplam dikey alan (içerik + alt boşluk).
const ITEM_SIZE = 76

// Sanallaştırılmış tek satır. react-window yalnızca görünür satırları render eder.
// `rowProps` içindeki değerler doğrudan prop olarak buraya geçer.
const Row = React.memo(function Row({ index, style, items, checkedSet, onToggle, theme }) {
  const value = items[index]
  const selected = checkedSet.has(value.sipUid)
  const labelId = `checkbox-list-label-${value.sipUid}`

  return (
    <div style={style}>
      <ListItem
        disablePadding
        sx={{
          mb: 1,
          borderRadius: theme.shape.borderRadius,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: selected ? theme.palette.primary.main : theme.palette.divider,
          borderLeft: '4px solid',
          borderLeftColor: selected ? theme.palette.primary.main : theme.palette.divider,
          backgroundColor: selected ? theme.palette.action.selected : theme.palette.background.paper,
          transition: 'all 150ms ease',
        }}
      >
        <ListItemButton role={undefined} onClick={() => onToggle(value.sipUid)} dense sx={{ '&:hover': { backgroundColor: 'transparent' } }}>
          <ListItemIcon>
            <Checkbox
              edge="start"
              checked={selected}
              tabIndex={-1}
              disableRipple
              color="primary"
              slotProps={{
                input: { 'aria-labelledby': labelId },
              }}
            />
          </ListItemIcon>
          <ListItemText
            id={labelId}
            primary={`${value.orderNo} - ${value.stokAdi}`}
            secondary={`${value.stokKodu}`}
            slotProps={{
              primary: {
                variant: 'body2',
                fontWeight: selected ? 600 : 400,
                color: selected ? 'primary.main' : 'text.primary',
                noWrap: true,
              },

              secondary: {
                variant: 'caption',
                color: 'text.secondary',
              },
            }}
          />
        </ListItemButton>
      </ListItem>
    </div>
  )
})

export default function BulkListDetail({ checked, setChecked, bulkList, apiList, depoList, selectedDepoList, handleChangeStatus, loading }) {
  const [searchText, setSearchText] = React.useState('')
  const [debouncedSearch, setDebouncedSearch] = React.useState('')
  const theme = useTheme()

  // apiList'i ref üzerinden okuyoruz ki onToggle referansı stabil kalsın.
  const apiListRef = React.useRef(apiList)
  apiListRef.current = apiList

  const handleChangeSearch = (search) => {
    setSearchText(search)
  }

  // Input anında yazar; ağır filtreleme yazma durduktan ~250ms sonra çalışır.
  React.useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(searchText), 250)
    return () => clearTimeout(id)
  }, [searchText])

  const filteredList = React.useMemo(() => {
    if (debouncedSearch.length > 0) {
      return bulkList.filter((item) => item.stokKodu.includes(debouncedSearch))
    }
    return bulkList
  }, [debouncedSearch, bulkList])

  React.useEffect(() => {
    setChecked([])
  }, [])

  const handleToggle = React.useCallback(
    (sipUid) => {
      if (apiListRef.current.some((todo) => todo.sipUid === sipUid.toString())) {
        notifyError('Aynı Sipariş Numarası Eklenmiş')
        return
      }
      setChecked((prev) => {
        const currentIndex = prev.indexOf(sipUid)
        if (currentIndex === -1) {
          return [...prev, sipUid]
        }
        const next = [...prev]
        next.splice(currentIndex, 1)
        return next
      })
    },
    [setChecked]
  )

  // checked (dizi) yerine Set → satır seçili mi kontrolü O(1).
  const checkedSet = React.useMemo(() => new Set(checked), [checked])

  const rowProps = React.useMemo(() => ({ items: filteredList, checkedSet, onToggle: handleToggle, theme }), [filteredList, checkedSet, handleToggle, theme])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      <BasicSlider
        children={
          <Stack direction={'row'} spacing={1}>
            {depoList.map((q) => (
              <Chip key={q.code} label={q.name} variant={selectedDepoList.find((item) => item == q.code) ? 'filled' : 'outlined'} onClick={() => handleChangeStatus(q.code)} />
            ))}
          </Stack>
        }
      />
      {loading ? (
        <CenterizedBox>
          <CircularProgress />
        </CenterizedBox>
      ) : (
        <>
          <SearchBox search={searchText} handleChangeSearch={handleChangeSearch} zIndex={true} top={'5px'} />
          <Box sx={{ flex: 1, minHeight: 0, mt: 1 }}>
            {filteredList.length > 0 && (
              <List
                rowComponent={Row}
                rowCount={filteredList.length}
                rowHeight={ITEM_SIZE}
                rowProps={rowProps}
                rowKey={(index, { items }) => items[index].sipUid}
                overscanCount={4}
                style={{ height: '100%', width: '100%' }}
              />
            )}
          </Box>
        </>
      )}
    </Box>
  )
}
