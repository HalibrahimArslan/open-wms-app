import { Box, FormControl, InputLabel, MenuItem, Paper, Select } from '@mui/material'

const WarehouseCombo = ({ warehouse, label, warehouseList, handleChange }) => {
  return (
    <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label">{label}</InputLabel>
      <Select labelId="demo-simple-select-label" id="demo-simple-select" value={warehouse} label={label} onChange={handleChange}>
        {warehouseList &&
          warehouseList.length > 0 &&
          warehouseList.map((warehouse) => (
            <MenuItem key={warehouse.code} value={warehouse.code}>
              {warehouse.name}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  )
}

const SelectWarehouseContainer = ({ transferWarehouse, targetWarehouse, handleChangeTransfer, handleChangeTarget, depoList }) => {
  return (
    <Box
      component={Paper}
      sx={{
        display: 'flex',
        justifyContent: 'space-around',
        gap: 5,
        padding: 2,
        mb: 2,
      }}
    >
      <WarehouseCombo warehouse={transferWarehouse} label={'Çıkış Depo Seçiniz'} warehouseList={depoList} handleChange={handleChangeTransfer} />
      <WarehouseCombo warehouse={targetWarehouse} label={'Giriş Depo Seçiniz'} warehouseList={depoList} handleChange={handleChangeTarget} />
    </Box>
  )
}

export default SelectWarehouseContainer
