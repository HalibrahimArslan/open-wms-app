import { Box, Button, Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { useFormik } from 'formik'
import * as yup from 'yup'

const validationSchema = yup.object({
  menuName: yup.string().required('Menü Adı boş bırakılamaz'),
})

const CreateMenuForm = ({ menuItem, menuList, companyList, handleCreateMenu }) => {
  const formik = useFormik({
    initialValues: {
      id: menuItem ? menuItem.id : null,
      menuName: menuItem ? menuItem.menuName : '',
      parentMenuId: menuItem ? menuItem.parentMenuId : 0,
      index: menuItem && menuItem.index !== null ? menuItem.index : false,
      path: menuItem ? menuItem.path : null,
      menuType: menuItem ? menuItem.menuType : 'TERMINAL',
      icon: menuItem ? menuItem.icon : null,
      companyCode: menuItem ? menuItem.companyCode : null,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => handleCreateMenu(values),
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
        <TextField
          fullWidth
          id="menuName"
          name="menuName"
          label="Menü Adı"
          placeholder="Menü Adı Giriniz"
          value={formik.values.menuName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.menuName && Boolean(formik.errors.menuName)}
          helperText={formik.touched.menuName && formik.errors.menuName}
        />
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Üst Menü</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={formik.values.parentMenuId}
            label="Üst Menü"
            onChange={(event) => {
              formik.setFieldValue('parentMenuId', event.target.value)
            }}
          >
            <MenuItem value={0}>
              <em>None</em>
            </MenuItem>
            {menuList.map((menu) => (
              <MenuItem value={menu.id}>{menu.menuName}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="company-simple-select-label">Şirket</InputLabel>
          <Select
            labelId="company-simple-select-label"
            id="company-simple-select"
            value={formik.values.companyCode}
            label="Şirket"
            onChange={(event) => {
              formik.setFieldValue('companyCode', event.target.value)
            }}
          >
            <MenuItem value={null}>
              <em>None</em>
            </MenuItem>
            {companyList.map((company) => (
              <MenuItem value={company.companyCode}>{company.companyName}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          id="path"
          name="path"
          label="Path"
          placeholder="Path Giriniz"
          value={formik.values.path}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.path && Boolean(formik.errors.path)}
          helperText={formik.touched.path && formik.errors.path}
        />
        <TextField
          fullWidth
          id="icon"
          name="icon"
          label="Icon"
          placeholder="Icon Giriniz"
          value={formik.values.icon}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.icon && Boolean(formik.errors.icon)}
          helperText={formik.touched.icon && formik.errors.icon}
        />
        <Box
          sx={{
            p: 1,
          }}
        >
          <FormControlLabel label="Index" control={<Checkbox checked={formik.values.index} onChange={formik.handleChange} name="index" id="index" />} labelPlacement="end" />
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
        <Button type="submit" variant="contained" disabled={formik.isSubmitting}>
          {menuItem ? 'Güncelle' : 'Oluştur'}
        </Button>
      </Box>
    </form>
  )
}

export default CreateMenuForm
