import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  List,
  Radio,
  RadioGroup,
  SxProps,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Theme,
  useTheme,
} from '@mui/material'
import useIsMobile from '../../../hooks/useIsMobile'
import { cloneElement, useCallback, useEffect, useMemo, useState } from 'react'
import ViewColumnIcon from '@mui/icons-material/ViewColumn'
import { utils, writeFile } from 'xlsx'
import { ArrowUpward, ArrowDownward, Edit, Save, Cancel } from '@mui/icons-material'
import produce, { Draft } from 'immer'
import Iconify from '../../../components/Iconify'
import RepetableSkeleton from '../../../components/Loading/RepetableSkeleton'
import NotFound from '../NotFound/NotFound'
import SwipeableDrawerWrapper from '../Slider/SwipeableDrawerWrapper'
import ColumnVisibilityItem from '../../../components/Table/ColumnVisibilityItem'
import useDebounce from '../../../hooks/useDebounce'

const DynamicTable = ({
  data,
  columns,
  sx,
  tableSx,
  tableHeadSx,
  loading,
  searchCriteria,
  search,
  selectionMode,
  handleChangeSearchCriteria,
  handleChangeSearch,
  handleSaveEdit,
  handleChangeColumn,
}) => {
  const theme = useTheme()
  const isMobile = useIsMobile()
  const anchor = 'bottom'

  const [tableColumns, setTableColumns] = useState(columns.filter((column) => column.hide !== true))
  const [excelExportLoading, setExcelExportLoading] = useState(false)
  const [filterText, setFilterText] = useState('')
  const [editRowId, setEditRowId] = useState(null)
  const [editRowData, setEditRowData] = useState({})
  const [sortColumn, setSortColumn] = useState(null)
  const [sortDirection, setSortDirection] = useState('asc')
  const [selectedRows, setSelectedRows] = useState([])
  const hasEditableColumns = tableColumns.some((column) => column.editable)
  const firstColumnField = columns[0].field
  const debouncedFilterText = useDebounce(filterText, 300)

  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  })
  const [searchParamsOptions, setSearchParamsOptions] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  })

  const handleSelectRow = (row) => {
    const rowId = getRowKey(row)
    if (selectionMode === 'single') {
      if (selectedRows.includes(rowId)) {
        setSelectedRows([])
      } else {
        setSelectedRows([rowId])
      }
    } else {
      setSelectedRows((prev) => (prev.includes(rowId) ? prev.filter((id) => id !== rowId) : [...prev, rowId]))
    }
  }

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allIds = data.map((row) => getRowKey(row))
      setSelectedRows(allIds)
    } else {
      setSelectedRows([])
    }
  }

  const handleExportExcel = () => {
    setExcelExportLoading(true)
    const visibleColumns = columns.filter((col) => col.type !== 'actions' && col.visible !== false)
    const headers = visibleColumns.map((col) => col.headerName)
    const data = filteredData.map((row) => {
      let rowData = {}
      visibleColumns.forEach((col) => {
        rowData[col.headerName] = getValue(row, col.field)
      })
      return rowData
    })

    let wb = utils.book_new()
    let ws = utils.json_to_sheet(data, { header: headers })
    utils.book_append_sheet(wb, ws, `data`)
    writeFile(wb, `Veriler.xlsx`)

    setExcelExportLoading(false)
  }

  const moveListItem = useCallback((dragIndex, hoverIndex) => {
    setTableColumns((prevCards) =>
      produce(prevCards, (draft) => {
        const [movedItem] = draft.splice(dragIndex, 1)
        draft.splice(hoverIndex, 0, movedItem)
      })
    )
  }, [])

  const toggleDrawer = (anchor, open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return
    }

    setState({ ...state, [anchor]: open })
  }

  const toggleDrawerSearchParams = (anchor, open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return
    }

    setSearchParamsOptions({ ...state, [anchor]: open })
  }

  const handleChangeVisibility = (field, newValue) => {
    setTableColumns((prev) => prev.map((column) => (column.field === field ? { ...column, visible: newValue } : column)))
  }

  const styledRow = (row) => {
    if (sx) {
      return sx(row)
    }
    return {}
  }

  const getRowKey = (row) => {
    const fallbackField = columns.find((col) => col.fallbackField)?.field
    return fallbackField ? row[fallbackField] : row[firstColumnField]
  }

  const getValue = (row, field) => {
    const value = field.split('.').reduce((acc, part) => acc && acc[part], row)
    return value !== null && value !== undefined ? value : ''
  }

  const handleFilterChange = (event) => {
    setFilterText(event.target.value)
    handleChangeSearch && handleChangeSearch(event.target.value)
  }

  const handleEditClick = (row) => {
    setEditRowId(getValue(row, firstColumnField))
    setEditRowData(row)
  }

  const handleSaveClick = () => {
    if (handleSaveEdit && editRowId !== null) {
      handleSaveEdit(editRowId, editRowData)
    }
    setEditRowId(null)
  }

  const handleCancelClick = () => {
    setEditRowId(null)
    setEditRowData({})
  }

  const handleInputChange = (field, value) => {
    setEditRowData((prevData) => ({
      ...prevData,
      [field]: value,
    }))
  }

  const handleSort = (column) => {
    const isAsc = sortColumn === column.field && sortDirection === 'asc'
    setSortDirection(isAsc ? 'desc' : 'asc')
    setSortColumn(column.field)
  }

  const filteredData = tableColumns.some((column) => column.filterKey)
    ? data
    : data?.length
      ? data.filter((row) =>
          tableColumns.some((column) =>
            column.visible !== false && column.type !== 'actions'
              ? getValue(row, column.field)?.toString().toLowerCase().includes(debouncedFilterText.toLowerCase()) ?? false
              : false
          )
        )
      : []

  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData
    return [...filteredData].sort((a, b) => {
      const aValue = getValue(a, sortColumn)
      const bValue = getValue(b, sortColumn)
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [filteredData, sortColumn, sortDirection])

  useEffect(() => {
    setFilterText(search || '')
  }, [search])

  return (
    <Box
      sx={{
        borderTopLeftRadius: theme.shape.borderRadius,
        borderTopRightRadius: theme.shape.borderRadius,
        border: `2px solid ${theme.palette.action.hover}`,
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          bgcolor: 'background.paper',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', padding: '5px 3px' }}>
          <Button startIcon={<ViewColumnIcon />} onClick={toggleDrawer(anchor, true)} disableElevation disableRipple>
            {isMobile ? '' : 'Sütunlar'}
          </Button>
          <Button startIcon={<Iconify icon={'lets-icons:export'} />} onClick={handleExportExcel} disableElevation disableRipple disabled={excelExportLoading}>
            {isMobile ? '' : 'Dışarı Aktar'}
          </Button>
        </Box>

        <TextField
          value={filterText}
          onChange={handleFilterChange}
          placeholder="Ara..."
          size="small"
          InputProps={{
            startAdornment: <Iconify icon={'material-symbols:search'} sx={{ mr: 1, mb: 0.5 }} />,
            endAdornment: (
              <IconButton sx={{ display: columns.find((column) => column.filterKey) ? 'flex' : 'none' }} onClick={toggleDrawerSearchParams(anchor, true)}>
                <Iconify icon={'bytesize:options'} />
              </IconButton>
            ),
          }}
          variant="standard"
        />
      </Box>
      {/* Table */}
      <TableContainer
        sx={{
          ...tableSx,
        }}
      >
        {loading || data === undefined ? (
          <RepetableSkeleton length={5} />
        ) : data && data.length === 0 ? (
          <NotFound msg="Kayıt Bulunamadı" />
        ) : (
          <Table size="small" aria-label="simple table" stickyHeader>
            <TableHead>
              <TableRow>
                {selectionMode && (
                  <TableCell align="center" padding="checkbox">
                    {selectionMode === 'multiple' && <Checkbox checked={data.length > 0 && selectedRows.length === data.length} onChange={handleSelectAll} />}
                  </TableCell>
                )}
                {tableColumns.map(
                  (column) =>
                    column.visible !== false && (
                      <TableCell
                        align="center"
                        key={column.field}
                        sx={{ ...tableHeadSx, cursor: 'pointer', position: 'relative' }}
                        onClick={() => column.type !== 'boolean' && handleSort(column)}
                      >
                        {column.type === 'boolean' ? (
                          <Box
                            sx={{
                              width: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <span>{column.headerName}</span>
                            <Checkbox
                              size="small"
                              checked={sortedData.length > 0 && sortedData.every((row) => getValue(row, column.field))}
                              indeterminate={sortedData.some((row) => getValue(row, column.field)) && !sortedData.every((row) => getValue(row, column.field))}
                              onChange={(e) => handleChangeColumn && handleChangeColumn(column.field, e.target.checked)}
                              onClick={(e) => e.stopPropagation()}
                              sx={{
                                position: 'sticky',
                                top: 0,
                                backgroundColor: 'white',
                              }}
                            />
                          </Box>
                        ) : (
                          <>
                            <span>{column.headerName}</span>
                            {sortColumn === column.field &&
                              (sortDirection === 'asc' ? (
                                <ArrowUpward
                                  sx={{
                                    position: 'absolute',
                                    right: 8,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    fontSize: 16,
                                  }}
                                />
                              ) : (
                                <ArrowDownward
                                  sx={{
                                    position: 'absolute',
                                    right: 8,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    fontSize: 16,
                                  }}
                                />
                              ))}
                          </>
                        )}
                      </TableCell>
                    )
                )}
                {hasEditableColumns && <TableCell align="center"></TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedData &&
                sortedData.map((row) => {
                  const rowId = getRowKey(row)
                  const isSelected = selectedRows.includes(rowId)
                  return (
                    <TableRow
                      key={getRowKey(row)}
                      sx={{
                        ...styledRow(row),
                        '&:last-child td, &:last-child th': { borderBottom: 'none' },
                      }}
                      hover
                      onClick={() => selectionMode && handleSelectRow(row)}
                    >
                      {selectionMode && (
                        <TableCell align="center" padding="checkbox">
                          {selectionMode === 'multiple' ? (
                            <Checkbox checked={isSelected} onChange={() => handleSelectRow(row)} onClick={(e) => e.stopPropagation()} />
                          ) : (
                            <Checkbox checked={isSelected} onChange={() => handleSelectRow(row)} onClick={(e) => e.stopPropagation()} />
                          )}
                        </TableCell>
                      )}
                      {tableColumns.map((column) =>
                        column.visible !== false ? (
                          column.type === 'actions' ? (
                            <TableCell align="center" key={column.field}>
                              <Box display={'flex'} key={column.field} justifyContent={'center'} alignItems={'center'}>
                                {column.getActions &&
                                  column.getActions(row).map((action) => (
                                    <IconButton key={action.id} onClick={() => action.onClick(row)}>
                                      {cloneElement(action.icon, { sx: { ...action.icon.props.sx, fontSize: 20 } })}
                                    </IconButton>
                                  ))}
                              </Box>
                            </TableCell>
                          ) : (
                            <TableCell align="center" key={column.field}>
                              {editRowId === getValue(row, firstColumnField) && column.editable ? (
                                <TextField
                                  size="small"
                                  value={editRowData[column.field]}
                                  onChange={(e) => handleInputChange(column.field, e.target.value)}
                                  variant="standard"
                                  type={column.editType || 'text'}
                                  inputProps={column.editType === 'number' ? { min: 0 } : {}}
                                />
                              ) : column.render ? (
                                column.render(getValue(row, column.field), row)
                              ) : (
                                getValue(row, column.field)
                              )}
                            </TableCell>
                          )
                        ) : null
                      )}
                      {hasEditableColumns && (
                        <TableCell align="center">
                          {editRowId === getValue(row, firstColumnField) ? (
                            <Box display={'flex'}>
                              <IconButton onClick={handleSaveClick}>
                                <Save sx={{ fontSize: 20 }} />
                              </IconButton>
                              <IconButton onClick={handleCancelClick}>
                                <Cancel sx={{ fontSize: 20 }} />
                              </IconButton>
                            </Box>
                          ) : (
                            <IconButton onClick={() => handleEditClick(row)}>
                              <Edit sx={{ fontSize: 20 }} />
                            </IconButton>
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  )
                })}
            </TableBody>
          </Table>
        )}
      </TableContainer>
      <SwipeableDrawerWrapper anchor={anchor} state={state} toggleDrawer={toggleDrawer}>
        <List>
          {tableColumns.map((column, index) => (
            <ColumnVisibilityItem key={column.field} column={column} handleChangeVisibility={handleChangeVisibility} index={index} moveListItem={moveListItem} />
          ))}
        </List>
      </SwipeableDrawerWrapper>
      <SwipeableDrawerWrapper anchor={anchor} state={searchParamsOptions} toggleDrawer={toggleDrawerSearchParams}>
        <Box p={2}>
          <FormControl sx={{ width: '100%' }}>
            <FormLabel id="demo-controlled-radio-buttons-group">Seçenekler</FormLabel>
            <RadioGroup aria-labelledby="demo-controlled-radio-buttons-group" name="controlled-radio-buttons-group" value={searchCriteria} onChange={handleChangeSearchCriteria}>
              {tableColumns
                .filter((column) => column.filterKey)
                .map((item, index) => (
                  <FormControlLabel key={index} value={item.filterKey} control={<Radio />} label={item.headerName} />
                ))}
            </RadioGroup>
          </FormControl>
        </Box>
      </SwipeableDrawerWrapper>
    </Box>
  )
}

export default DynamicTable
