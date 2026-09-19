import { Button, Dialog, DialogContent, DialogActions, DialogTitle, IconButton, Stack, Typography, Box } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import useAuthHeader from '../../hooks/useAuthHeader'
import { getActiveAurSayimTanim } from '../../services/CountingDetailService'
import SelectActiveCounting from './SelectActiveCounting'
import NotFound from '../../shared/components/NotFound/NotFound'
import LoadingInner from '../../components/Loading/LoadingInner'
import useDepoCode from '../../hooks/useDepoCode'
import { useContainer } from 'unstated-next'
import { DepoContainer } from '../../store/DepoContainer'
import { notifyError } from '../../layout/Layout'
import useIsMobile from '../../hooks/useIsMobile'
import CloseIcon from '@mui/icons-material/Close'

export default function CountingPickingContainer() {
  const { userAuthorityList } = useContainer(DepoContainer)

  const headers = useAuthHeader()
  const nav = useNavigate()
  const depoCode = useDepoCode()
  const isMobile = useIsMobile()

  const [sayimTanimList, setSayimTanimList] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSayimTanim, setSelectedSayimTanim] = useState([])
  const [open, setOpen] = useState(true)

  const getActiveCountingList = (userAuthorityList, sayimTanimList) => {
    let authorities = userAuthorityList.map((q) => q.authorityName)
    let list = sayimTanimList.filter((q) => {
      let count = 0
      authorities.forEach((element) => {
        if (q.visibilityAuthorities !== null && q.visibilityAuthorities && q.visibilityAuthorities.length > 0 && q.visibilityAuthorities.includes(element)) {
          count = count + 1
        }
      })
      if (count > 0) {
        return true
      } else {
        return false
      }
    })

    return list
  }

  const goHome = () => {
    setOpen(false)
    if (depoCode) {
      nav(`/d:${depoCode}/dashboard`)
    } else {
      nav(`/home`)
    }
  }

  const fetchActiveCountingList = async () => {
    try {
      setLoading(true)
      const res = await getActiveAurSayimTanim(depoCode, headers)
      res && setSayimTanimList(res)
    } catch (e) {
      notifyError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRouteDetail = () => {
    if (!selectedSayimTanim || selectedSayimTanim.length === 0) return
    let list = sayimTanimList.filter((item) => item.sayimAdi === selectedSayimTanim[0])
    if (!list || list.length === 0) return
    let sayimTanimId = list[0].id
    nav(`/d:${depoCode}/counting/${sayimTanimId}?sayimAdi=${list[0].sayimAdi}&ordered=false`)
  }

  useEffect(() => {
    fetchActiveCountingList()
  }, [])

  const activeCountingList = getActiveCountingList(userAuthorityList, sayimTanimList)
  const canStart = selectedSayimTanim && selectedSayimTanim.length > 0

  return (
    <Dialog
      fullScreen={isMobile}
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={goHome}
      aria-labelledby="responsive-dialog-title"
      slotProps={{
        paper: {
          sx: {
            borderRadius: isMobile ? 0 : 2,
          },
        },
      }}
    >
      <DialogTitle id="responsive-dialog-title" sx={{ pb: 1 }}>
        <Stack
          direction="row"
          sx={{
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Sayım Tanımı Seçiniz
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
              }}
            >
              Başlatmak istediğiniz aktif sayımı seçin.
            </Typography>
          </Box>
          <IconButton size="small" onClick={goHome}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
      </DialogTitle>
      {loading ? (
        <LoadingInner text={'Tanımlı Sayımlar Yükleniyor ...'} />
      ) : sayimTanimList.length === 0 ? (
        <NotFound msg={'Açık Sayım Bulunamadı'} />
      ) : (
        <>
          <DialogContent sx={{ pt: 1 }}>
            <SelectActiveCounting
              countingDefinitionList={activeCountingList}
              countingDefinition={selectedSayimTanim}
              handleCountingDefinition={(newCountingDefinition) => setSelectedSayimTanim(newCountingDefinition)}
              label={'Aktif Sayımlar'}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2.5, pt: 0 }}>
            <Button variant="outlined" onClick={goHome}>
              Geri Dön
            </Button>
            <Button variant="contained" onClick={handleRouteDetail} disabled={!canStart} sx={{ textTransform: 'none' }}>
              Sayıma Başla
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  )
}
