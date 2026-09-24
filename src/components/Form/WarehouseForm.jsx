import { Autocomplete, Box, Button, FormControlLabel, Switch, TextField } from '@mui/material'
import { useFormik } from 'formik'
import { warehouseSchema } from '../../schemas/schemas'

const WarehouseForm = ({ initialWarehouse, warehouses, handleWarehouse }) => {
  const isEdit = Boolean(initialWarehouse)

  const formik = useFormik({
    initialValues: {
      code: initialWarehouse?.code ?? '',
      name: initialWarehouse?.name ?? '',
      receivingCode: initialWarehouse?.receivingCode ?? '',
      transferCode: initialWarehouse?.transferCode?.trim() ?? '',
      autoScan: initialWarehouse?.autoScan ?? false,
      uniquePickingAddress: initialWarehouse?.uniquePickingAddress ?? false,
    },
    validationSchema: warehouseSchema,
    onSubmit: (values) =>
      handleWarehouse({
        code: values.code.trim(),
        name: values.name.trim(),
        receivingCode: values.receivingCode.trim(),
        transferCode: values.transferCode.trim() || null,
        autoScan: values.autoScan,
        uniquePickingAddress: values.uniquePickingAddress,
      }),
  })

  const warehouseCodes = warehouses.map((warehouse) => warehouse.code)
  const warehouseName = (code) => warehouses.find((warehouse) => warehouse.code === code)?.name

  const fieldProps = (name) => {
    const error = formik.touched[name] && formik.errors[name]
    return {
      id: name,
      name,
      fullWidth: true,
      value: formik.values[name],
      onChange: formik.handleChange,
      onBlur: formik.handleBlur,
      error: Boolean(error),
      helperText: error || undefined,
    }
  }

  const codeField = (name, label, disabled) => {
    const error = formik.touched[name] && formik.errors[name]
    return (
      <Autocomplete
        freeSolo
        disabled={disabled}
        options={warehouseCodes}
        inputValue={formik.values[name]}
        onInputChange={(_, value) => formik.setFieldValue(name, value)}
        renderOption={({ key, ...props }, code) => (
          <li key={key} {...props}>
            {warehouseName(code) ? `${code} - ${warehouseName(code)}` : code}
          </li>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            name={name}
            label={label}
            onBlur={formik.handleBlur}
            error={Boolean(error)}
            helperText={error || (!disabled && 'Listeden seçin ya da depo kodunu yazın')}
          />
        )}
      />
    )
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField {...fieldProps('code')} label="Depo Kodu" disabled={isEdit} />
        <TextField {...fieldProps('name')} label="Depo Adı" />
        {codeField('receivingCode', 'Mal Kabul Depo Kodu', isEdit)}
        {codeField('transferCode', 'Transfer Depo Kodu', false)}
        <FormControlLabel label="Otomatik Arttırma" control={<Switch id="autoScan" name="autoScan" checked={formik.values.autoScan} onChange={formik.handleChange} />} />
        <FormControlLabel
          label="Toplama Gözü Tekil"
          control={<Switch id="uniquePickingAddress" name="uniquePickingAddress" checked={formik.values.uniquePickingAddress} onChange={formik.handleChange} />}
        />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 2 }}>
        <Button type="submit" variant="contained" disabled={formik.isSubmitting}>
          {isEdit ? 'Güncelle' : 'Oluştur'}
        </Button>
      </Box>
    </form>
  )
}

export default WarehouseForm
