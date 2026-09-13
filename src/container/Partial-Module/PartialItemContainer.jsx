import { Box, Button, List, Skeleton } from '@mui/material'
import React from 'react'
import PartialListItem from '../../components/List/PartialListItem'
import CompareArrowsIcon from '@mui/icons-material/CompareArrows'
import NotFound from '../../shared/components/NotFound/NotFound'

const PartialItemContainer = ({ loading, search, partialItemList, getPartialDetails, handleTransferFromMicro }) => {
  return (
    <List sx={{ display: 'flex', flexDirection: 'column', gap: 1, pl: 1, pr: 1 }}>
      {loading ? (
        <>
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton variant="rectangular" height={100} />
          ))}
        </>
      ) : partialItemList.length === 0 ? (
        <Box>
          <NotFound msg="Kayıt Bulunamadı" />
          {search && (
            <Button endIcon={<CompareArrowsIcon />} variant="contained" onClick={handleTransferFromMicro}>
              Mikrodan Aktar
            </Button>
          )}
        </Box>
      ) : (
        <>
          {partialItemList.map((item) => (
            <PartialListItem partialItem={item} getPartialDetails={getPartialDetails} />
          ))}
        </>
      )}
    </List>
  )
}

export default PartialItemContainer
