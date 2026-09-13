import React from 'react'
import PalletBarcodeDetailCardItem from './PalletBarcodeDetailCardItem'
import AurTabs from '../Tabs/AurTabs'
import NotFound from '../../shared/components/NotFound/NotFound'
import { Box } from '@mui/material'

export default function PalletBarcodeDetailCardList({ palletInfoList, theme, handleDelete, addableItemList, addPalletBarcode }) {
  return (
    <>
      <AurTabs
        section={[
          {
            label: 'Sil',
            value: '1',
          },
          {
            label: 'Ekle',
            value: '2',
          },
        ]}
        sectionPanel={[
          {
            label: 'Sil',
            value: '1',
            component: (
              <Box display={'flex'} flexDirection={'column'} alignItems={'center'} gap={2} minWidth={300}>
                {palletInfoList && palletInfoList.length > 0 ? (
                  palletInfoList.map((item) => <PalletBarcodeDetailCardItem palletInfo={item} theme={theme} handleDelete={handleDelete} />)
                ) : (
                  <NotFound msg={'Pallet Boş'} />
                )}
              </Box>
            ),
          },
          {
            label: 'Ekle',
            value: '2',
            component: (
              <Box display={'flex'} flexDirection={'column'} alignItems={'center'} gap={2}>
                {addableItemList && addableItemList.length > 0 ? (
                  addableItemList.map((item) => <PalletBarcodeDetailCardItem palletInfo={item} theme={theme} handleAdd={addPalletBarcode} />)
                ) : (
                  <NotFound msg={'Eklenecek Kalem Bulunamadı'} />
                )}
              </Box>
            ),
          },
        ]}
        scrollButtonEnable={true}
      />
    </>
  )
}
