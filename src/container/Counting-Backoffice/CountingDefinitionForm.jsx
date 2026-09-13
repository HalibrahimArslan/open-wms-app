import { Box, Button, Collapse, Divider, Grid, Paper, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import DepoCombo from '../../components/Combobox/DepoCombo'
import { saveCountingDefinition } from '../../services/CountingDetailService'
import { DepoContainer } from '../../store/DepoContainer'
import { notify, notifyError } from '../../layout/Layout'
import CheckedListItem from '../../components/List/CheckedListItem'
import { useContainer } from 'unstated-next'
import { DataStore } from '../../store/DataStore'
import { AuthContainer } from '../../store/AuthContainer'

export default function CountingDefinitionForm({ open, handleVisible, handleAddCountingList }) {
  const { account } = useContainer(DataStore)
  const { token } = AuthContainer.useContainer()
  const depoCombo = DepoContainer.useContainer()
  const [selectedValues, setSelectedValues] = useState([])

  const options = [
    {
      value: 'COUNTER',
      description: 'Sayım Personeli',
    },
    {
      value: 'CHECKER',
      description: 'Kontrol Personeli',
    },
  ]

  const fetchCountingDefiniton = async (payload) => {
    try {
      const res = await saveCountingDefinition(payload)
      res && handleAddCountingList(res)
      res && setSelectedValues([])
      res && notify('Sayım tanımı başarıyla oluşturuldu.')
      res && handleVisible()
    } catch (e) {
      notifyError(e.message)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const countingName = String(data.get('countingName') ?? '').trim()
    const definition = String(data.get('definition') ?? '').trim()

    if (definition.length === 0 || countingName.length === 0 || selectedValues.length === 0) {
      notifyError('Eksik parametre girişi yaptınız')
    } else {
      const requestOptions = {
        method: 'POST',
        headers: {
          Authorization: (token && 'Bearer ' + token) || '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          aciklama: definition,
          sayimAdi: countingName,
          sayimDurumu: 'ACTIVE',
          status: true,
          depoNo: depoCombo.depoCombo,
          visibilityAuthorities: selectedValues,
          companyCode: account.companyCode,
        }),
      }
      fetchCountingDefiniton(requestOptions)
    }
  }

  return (
    <Collapse in={open} timeout="auto" unmountOnExit>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <DepoCombo />
          </Grid>
          <Grid item xs={12}>
            <TextField required fullWidth id="countingName" label="Sayım Adı" name="countingName" type="text" autoComplete="off" autoFocus size="small" />
          </Grid>
          <Grid item xs={12}>
            <TextField required fullWidth name="definition" label="Sayım Açıklaması" type="text" id="definition" multiline minRows={2} />
          </Grid>
          <Grid item xs={12}>
            <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 1.5 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Sayım Görüntüleme Yetkisi
              </Typography>
              <CheckedListItem
                data={options}
                keyField={'value'}
                displayField={'description'}
                multiple={false}
                checkedList={selectedValues}
                handleCheckedList={setSelectedValues}
                header={''}
                maxWidth={'100%'}
              />
            </Paper>
          </Grid>
        </Grid>
        <Divider flexItem sx={{ mt: 1.5 }} />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            position: 'sticky',
            bottom: 0,
            backgroundColor: 'background.paper',
            pt: 1.5,
            pb: 0.5,
            zIndex: 1,
          }}
        >
          <Button type="submit" variant="contained">
            Kaydet
          </Button>
        </Box>
      </Box>
    </Collapse>
  )
}
