import { Box, Button, TextField } from '@mui/material'
import { useFormik } from 'formik'
import * as yup from 'yup'
import useIsMobile from '../../hooks/useIsMobile'

const validationSchema = yup.object({
  ruleName: yup.string().required('Kural Adı boş bırakılamaz'),
  ruleContent: yup.string().required('Kural İçeriği boş bırakılamaz'),
})

const RuleForm = ({ rule, handleRule }) => {
  const isMobile = useIsMobile()
  const formik = useFormik({
    initialValues: {
      ruleName: rule ? rule.ruleName : '',
      ruleContent: rule ? rule.ruleContent : '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleRule(values)
    },
  })
  return (
    <form onSubmit={formik.handleSubmit}>
      <Box display={'flex'} flexDirection={'column'} gap={2}>
        <TextField
          fullWidth
          id="ruleName"
          name="ruleName"
          label="Kural Adı"
          placeholder="Kural Adı Giriniz"
          value={formik.values.ruleName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.ruleName && Boolean(formik.errors.ruleName)}
          helperText={formik.touched.ruleName && formik.errors.ruleName}
        />
        <TextField
          fullWidth
          id="ruleContent"
          name="ruleContent"
          label="Kural İçeriği"
          placeholder="Kural İçeriği Giriniz"
          value={formik.values.ruleContent}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.ruleContent && Boolean(formik.errors.ruleContent)}
          helperText={formik.touched.ruleContent && formik.errors.ruleContent}
          multiline
          rows={20}
          sx={!isMobile && { width: 500 }}
        />
      </Box>
      <Box display={'flex'} justifyContent={'flex-end'} alignItems={'center'} mt={2}>
        <Button type="submit" variant="contained">
          Oluştur
        </Button>
      </Box>
    </form>
  )
}

export default RuleForm
