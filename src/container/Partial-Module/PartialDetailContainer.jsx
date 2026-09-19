import { Box, Button, List, ListItem, ListItemText, Skeleton, Typography, useTheme } from '@mui/material'
import React from 'react'
import NotFound from '../../shared/components/NotFound/NotFound'

const PartialDetailContainer = ({ selectedPartialItem, partialDetailList, childLoading, handleUpdateStatus }) => {
  const theme = useTheme()
  return (
    <Box sx={{ p: 1 }}>
      {selectedPartialItem && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            borderBottom: '1px solid black',
            p: 1,
          }}
        >
          <Typography align="left" variant="h5">
            {selectedPartialItem.packageName} Detayları
          </Typography>
          <Button variant="outlined" onClick={() => handleUpdateStatus(selectedPartialItem.id, !selectedPartialItem.status)}>
            {selectedPartialItem.status ? 'Pasife Çek' : 'Aktif Et'}
          </Button>
        </Box>
      )}

      <List sx={{ display: 'flex', flexDirection: 'column', gap: 1, pl: 1, pr: 1 }}>
        {selectedPartialItem === null ? (
          <></>
        ) : childLoading ? (
          <>
            <Skeleton variant="rectangular" height={50} />
            <Skeleton variant="rectangular" height={50} />
          </>
        ) : partialDetailList && partialDetailList.length > 0 && partialDetailList[0].packageDetail.length === 0 ? (
          <NotFound msg="Detay Bulunamadı" />
        ) : (
          partialDetailList &&
          partialDetailList.length &&
          partialDetailList[0].packageDetail.map((item) => (
            <ListItem sx={{ bgcolor: theme.palette.action.hover, borderRadius: 3 }} secondaryAction={<Typography>{item.quantity}</Typography>}>
              <ListItemText primary={item.stockName} secondary={item.stockCode} />
            </ListItem>
          ))
        )}
      </List>
    </Box>
  )
}

export default PartialDetailContainer
