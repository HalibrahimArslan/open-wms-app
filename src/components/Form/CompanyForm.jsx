import { Autocomplete, Box, Button, FormControlLabel, MenuItem, Switch, TextField } from '@mui/material'
import { useFormik } from 'formik'
import { ERP_TYPES, companySchema } from '../../schemas/schemas'

const CompanyForm = ({ initialCompany, handleCompany }) => {
  const isEdit = Boolean(initialCompany)
  const apiParameters = initialCompany?.apiParameters

  const formik = useFormik({
    initialValues: {
      companyCode: initialCompany?.companyCode ?? '',
      companyName: initialCompany?.companyName ?? '',
      erpType: initialCompany?.erpType ?? 'LOCAL',
      apiEndPoint: initialCompany?.apiEndPoint ?? '',
      erpApiActive: apiParameters?.erpApiActive ?? false,
      depoNo: apiParameters?.depoNo ?? [],
      username: apiParameters?.username ?? '',
      password: '',
    },
    validationSchema: companySchema,
    onSubmit: (values) =>
      handleCompany({
        id: initialCompany?.id ?? null,
        companyCode: Number(values.companyCode),
        companyName: values.companyName.trim(),
        erpType: values.erpType,
        apiEndPoint: values.apiEndPoint.trim() || null,
        apiParameters: {
          erpApiActive: values.erpApiActive,
          depoNo: values.depoNo,
          username: values.username.trim() || null,
          password: values.password || null,
        },
      }),
  })

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

  const handleDepoNoChange = (_, values) => {
    const depoNo = values.map((value) => String(value).trim()).filter((value) => /^\d+$/.test(value))
    formik.setFieldValue('depoNo', [...new Set(depoNo.map(Number))])
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField {...fieldProps('companyCode')} label="Şirket Kodu" slotProps={{ htmlInput: { inputMode: 'numeric' } }} />
        <TextField {...fieldProps('companyName')} label="Şirket Adı" />
        <TextField {...fieldProps('erpType')} select label="ERP Tipi">
          {ERP_TYPES.map((type) => (
            <MenuItem key={type.value} value={type.value}>
              {type.label}
            </MenuItem>
          ))}
        </TextField>
        <FormControlLabel
          label="ERP bağlantısı aktif"
          control={<Switch id="erpApiActive" name="erpApiActive" checked={formik.values.erpApiActive} onChange={formik.handleChange} />}
        />
        <TextField {...fieldProps('apiEndPoint')} label="API Adresi" />
        <Autocomplete
          multiple
          freeSolo
          options={[]}
          value={formik.values.depoNo}
          onChange={handleDepoNoChange}
          renderInput={(params) => <TextField {...params} label="Depo Numaraları" helperText="Numarayı yazıp Enter'a basın" />}
        />
        <TextField {...fieldProps('username')} label="Kullanıcı Adı" autoComplete="off" />
        <TextField
          {...fieldProps('password')}
          type="password"
          label="Şifre"
          autoComplete="new-password"
          helperText={isEdit ? 'Boş bırakılırsa mevcut şifre korunur' : undefined}
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

export default CompanyForm
