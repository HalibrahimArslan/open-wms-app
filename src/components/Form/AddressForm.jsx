import { Box, Button, Checkbox, FormControlLabel, TextField } from '@mui/material'
import { useFormik } from 'formik'
import * as yup from 'yup'

const validationSchema = yup.object({})

const AddressForm = ({ address, handleUpdateAddress }) => {
  const formik = useFormik({
    initialValues: {
      urunAdresId: address.urunAdresId,
      address: address.adres,
      geciciAdres: address.geciciAdres,
      toplamaGozu: address.toplamaGozu,
      kontrolAdres: address.kontrolAdres,
      countable: address.countable,
      bolum: address.bolum,
      reyon: address.reyon,
      unite: address.unite,
      kat: address.kat,
      oda: address.oda,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleUpdateAddress(values)
    },
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
        <TextField fullWidth id="address" name="Adres" label="Adres" placeholder="Adres" value={formik.values.address} disabled />
        <TextField fullWidth id="bolum" name="Bölüm" label="Bölüm" placeholder="Bölüm" value={formik.values.bolum} disabled />
        <TextField fullWidth id="reyon" name="Koridor" label="Koridor" placeholder="Koridor" value={formik.values.reyon} disabled />
        <TextField fullWidth id="unite" name="Unite" label="Unite" placeholder="Unite" value={formik.values.unite} disabled />
        <TextField fullWidth id="kat" name="Kat" label="Kat" placeholder="Kat" value={formik.values.kat} disabled />

        <Box
          sx={{
            p: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <FormControlLabel
            label="Gecici Adres"
            control={<Checkbox checked={formik.values.geciciAdres} onChange={formik.handleChange} name="geciciAdres" id="geciciAdres" />}
            labelPlacement="end"
          />
          <FormControlLabel
            label="Toplama Gozu"
            control={<Checkbox checked={formik.values.toplamaGozu} onChange={formik.handleChange} name="toplamaGozu" id="toplamaGozu" />}
            labelPlacement="end"
          />
          <FormControlLabel
            label="Kontrol Adresi"
            control={<Checkbox checked={formik.values.kontrolAdres} onChange={formik.handleChange} name="kontrolAdres" id="kontrolAdres" />}
            labelPlacement="end"
          />
          <FormControlLabel
            label="Sayimlanabilir"
            control={<Checkbox checked={formik.values.countable} onChange={formik.handleChange} name="countable" id="countable" />}
            labelPlacement="end"
          />
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          mt: 2,
        }}
      >
        <Button type="submit" variant="contained">
          Güncelle
        </Button>
      </Box>
    </form>
  )
}

export default AddressForm
