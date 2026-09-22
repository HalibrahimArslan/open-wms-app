import useAuthHeader from '../../hooks/useAuthHeader'
import { createCompany, updateCompany } from '../../services/CompanyService'
import { notifyError } from '../../layout/Layout'
import ExtendedDialog from '../../shared/components/Dialog/ExtendedDialog'
import CompanyForm from '../Form/CompanyForm'

export default function CompanyDialog({ open, onClose, company, onSave }) {
  const headers = useAuthHeader()

  const handleCompany = async (payload) => {
    try {
      const savedCompany = company ? await updateCompany(headers, company.id, payload) : await createCompany(headers, payload)
      onSave(savedCompany)
      onClose()
    } catch (err) {
      notifyError(err.message)
    }
  }

  return (
    <ExtendedDialog
      dialogHeader={company ? 'Şirket Düzenle' : 'Yeni Şirket Ekle'}
      open={open}
      handleClose={onClose}
      dialogContent={<CompanyForm initialCompany={company} handleCompany={handleCompany} />}
    />
  )
}
