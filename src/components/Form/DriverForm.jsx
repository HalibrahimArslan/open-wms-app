import { Box, Button, TextField } from '@mui/material'
import { useFormik } from 'formik'
import { DRIVER_PLATE_MAX_LENGTH, driverSchema } from '../../schemas/schemas'

const fields = [
  { name: 'driverName', label: 'Ad Soyad' },
  { name: 'identityNumber', label: 'T.C. No' },
  { name: 'phoneNumber', label: 'Telefon' },
  { name: 'licensePlate', label: 'Plaka', maxLength: DRIVER_PLATE_MAX_LENGTH },
  { name: 'trailerPlate', label: 'Dorse Plaka', maxLength: DRIVER_PLATE_MAX_LENGTH },
]

const DriverForm = ({ initialDriver, handleDriver }) => {
  const formik = useFormik({
    initialValues: {
      driverName: initialDriver?.driverName ?? '',
      identityNumber: initialDriver?.identityNumber ?? '',
      phoneNumber: initialDriver?.phoneNumber ?? '',
      licensePlate: initialDriver?.licensePlate ?? '',
      trailerPlate: initialDriver?.trailerPlate ?? '',
    },
    validationSchema: driverSchema,
    onSubmit: (values) =>
      handleDriver({
        id: initialDriver?.id ?? null,
        opType: initialDriver?.opType ?? 'MSK',
        ...values,
        driverName: values.driverName.trim(),
        licensePlate: values.licensePlate.trim(),
        trailerPlate: values.trailerPlate.trim(),
      }),
  })

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {fields.map(({ name, label, maxLength }) => {
          const error = formik.touched[name] && formik.errors[name]
          return (
            <TextField
              key={name}
              fullWidth
              id={name}
              name={name}
              label={label}
              value={formik.values[name]}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={Boolean(error)}
              helperText={error || (maxLength && `Maksimum ${maxLength} karakter`)}
              slotProps={maxLength && { htmlInput: { maxLength } }}
            />
          )
        })}
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          mt: 2,
        }}
      >
        <Button type="submit" variant="contained" disabled={formik.isSubmitting}>
          {initialDriver ? 'Güncelle' : 'Oluştur'}
        </Button>
      </Box>
    </form>
  )
}

export default DriverForm
