export const LOT_BARCODE_SUFFIX = '0000'

export const buildLotBarcode = (anaBarkod) => `${anaBarkod ?? ''}${LOT_BARCODE_SUFFIX}`

export const normalizeStockItem = (item) => {
  const anaBarkod = item?.id?.barkod ?? ''
  const companyCode = item?.id?.companyCode ?? ''
  return {
    rowKey: `${companyCode}-${anaBarkod}`,
    companyCode,
    anaBarkod,
    stokKodu: item?.stokKodu ?? '',
    stokAdi: item?.stokAdi ?? '',
    stokBirimi: item?.stokBirimi ?? '',
    isLotlu: item?.isLotlu ?? false,
    uniqueBarcode: buildLotBarcode(anaBarkod),
  }
}
