import groupBy from '../utils/Utils'

const createAurTmpList = (stokKodu, stokAdi, barkod, siparisMiktar, teslimMiktar, sipUid, isPiece, pieceMaster, pieceAmount, pieceId, orderNo, reserve, reserveDescription) => ({
  stokKodu,
  stokAdi,
  barkod,
  siparisMiktar,
  teslimMiktar,
  sipUid,
  isPiece,
  pieceMaster,
  pieceAmount,
  pieceId,
  orderNo,
  reserve,
  reserveDescription,
})

const createFromItem = (item, siparisMiktar = item.siparisMiktar, teslimMiktar = item.teslimMiktar) =>
  createAurTmpList(
    item.stokKodu,
    item.stokAdi,
    item.barkod,
    siparisMiktar,
    teslimMiktar,
    item.sipUid,
    !!(item.piece || item.isPiece),
    item.pieceMaster,
    item.pieceAmount,
    item.aurPartialItemId,
    item.orderNo,
    item.reserve,
    item.reserveDescription
  )

export function processAssignedOrderDetails(orderDetail, info) {
  const order = orderDetail.find((todo) => todo.orderInfo === info)
  if (!order) return { detailList: [], apiList: [], orderInfo: {}, found: false }

  const mainList = order.aurTmpDetailList
  const groupByStockCode = groupBy(mainList, (criteria) => criteria.stokKodu)
  const distinctStockCodes = [...new Set(mainList.map((item) => item.stokKodu))]

  const detailList = distinctStockCodes.flatMap((stockCode) => {
    const groupedList = groupByStockCode.get(stockCode)

    if (groupedList.length > 1) {
      const pieceItems = groupedList.filter((item) => item.piece || item.isPiece)
      const nonPieceItems = groupedList.filter((item) => !item.piece && !item.isPiece)

      const result = []
      if (nonPieceItems.length > 0) {
        const totalSiparis = nonPieceItems.reduce((acc, x) => acc + x.siparisMiktar, 0)
        const totalTeslim = nonPieceItems.reduce((acc, x) => acc + x.teslimMiktar, 0)
        result.push(createFromItem(nonPieceItems[0], totalSiparis, totalTeslim))
      }

      pieceItems.forEach((item) => result.push(createFromItem(item)))
      return result
    }

    return createFromItem(groupedList[0])
  })

  return {
    detailList,
    apiList: mainList,
    orderInfo: {
      firmCode: order.firmCode,
      orderId: order.id,
      cariBaglantiTipi: order.cariBaglantiTipi,
      cariCode: order.cariCode,
      firmName: order.firmName,
    },
    found: true,
  }
}

export function calculateDistribution(apiItems, totalTargetAmount, addressId, status = 'IN_PROGRESS') {
  let remainingTarget = totalTargetAmount
  const updateBody = []

  for (const item of apiItems) {
    if (remainingTarget <= 0) break

    const teslimMiktar = Math.min(item.siparisMiktar, remainingTarget)

    updateBody.push({
      sipUid: item.sipUid,
      teslimMiktar: teslimMiktar,
      status: status,
      observerAmount: teslimMiktar,
      addressId: addressId,
      aurPartialItemId: item.aurPartialItemId,
      barkod: item.barkod,
    })

    remainingTarget -= teslimMiktar
    if (item.siparisMiktar >= totalTargetAmount) break
  }

  return updateBody
}

export function prepareControlAreaPayloads(orderDetail, account, transferDepoCode, orderNo, selectedControlAddress) {
  const pickedList = orderDetail.filter((item) => item.teslimMiktar > 0)
  const groupedByStock = pickedList.reduce((acc, item) => {
    if (!acc[item.stokKodu]) acc[item.stokKodu] = []
    acc[item.stokKodu].push(item)
    return acc
  }, {})

  return Object.values(groupedByStock).map((group) => {
    const first = group[0]
    const totalMiktar = group.reduce((sum, item) => sum + item.teslimMiktar, 0)

    return {
      barkodTipi: 'RAF',
      barcode: first.barkod,
      stokAdi: first.stokAdi,
      companyCode: account?.companyCode,
      depoCode: transferDepoCode,
      miktar: totalMiktar,
      orderNo: orderNo,
      status: true,
      stokKod: first.stokKodu,
      urunAdres: selectedControlAddress?.adres,
    }
  })
}

export function validateDispatchment({ amount, totalSiparisMiktar, totalTeslimMiktar, isPiece, pieceAmount, orderType, depotStockAmount }) {
  if (amount < 0) {
    return { isValid: false, errorMessage: '0 dan küçük değer giremezsiniz' }
  }

  if (amount > totalSiparisMiktar - totalTeslimMiktar) {
    return { isValid: false, errorMessage: 'Sipariş miktarından fazlasını sevk edemezsiniz' }
  }

  if (isPiece && amount % pieceAmount !== 0) {
    return { isValid: false, errorMessage: 'Parçalı ürünlerin miktarı parça miktarının tam katı olmalıdır' }
  }

  if (orderType === 'MSK' && amount > depotStockAmount) {
    return { isValid: false, errorMessage: 'Depodaki stok miktarı yetersiz' }
  }

  return { isValid: true }
}

export function updateDraftQuantities(draft, stockCode, amount, partialItemId, sipUid) {
  const filteredItems = draft.filter((item) => {
    const stockMatch = item.stokKodu === stockCode
    const partialMatch = partialItemId ? item.pieceId === partialItemId : true
    const uidMatch = sipUid ? item.sipUid === sipUid : true
    return stockMatch && partialMatch && uidMatch
  })

  if (filteredItems.length === 0) return

  if (filteredItems.length > 1) {
    let target = amount
    filteredItems.forEach((item) => {
      if (target > 0) {
        const availableInItem = item.siparisMiktar - item.teslimMiktar
        if (target <= availableInItem) {
          item.teslimMiktar += target
          target = 0
        } else {
          item.teslimMiktar = item.siparisMiktar
          target -= availableInItem
        }
      }
    })
  } else {
    filteredItems[0].teslimMiktar += amount
  }
}

export function prepareShippingPayload(headers, data) {
  return {
    method: 'POST',
    headers,
    body: JSON.stringify({
      dorsePlakaNo: data.dorsePlakaNo,
      aracPlakaNo: data.aracPlakaNo,
      soforAdi: data.soforAdi,
      soforSoyadi: data.soforSoyadi,
      soforTckn: data.soforTckn,
      soforTel: data.soforTel,
      transportationType: data.transportationType,
      companyLogistics: data.companyLogistics,
      carryType: data.carryType,
      depoNo: data.depoNo,
      belgeNo: data.belgeNo,
      erpUserCode: data.erpUserCode,
      firmCode: data.firmCode,
      orderDetailList: data.orderDetail,
      orderNo: data.orderNo,
      tarih: data.tarih,
      orderId: data.orderId,
    }),
  }
}

export function prepareUpdateOrderPayload(headers, data) {
  return {
    method: 'POST',
    headers,
    body: JSON.stringify({
      aurTmpDetailList: data.aurTmpDetailList,
      opType: data.opType,
      orderInfo: data.orderInfo,
      status: data.status,
      complete: data.complete,
      soforAdi: data.soforAdi,
      soforTel: data.soforTel,
      soforTcNo: data.soforTcNo,
      soforPlaka: data.soforPlaka,
      addressId: '0',
      transportationType: data.transportationType,
      companyLogistics: data.companyLogistics,
      carryType: data.carryType,
    }),
  }
}

export function combineSameStockCodes(filter) {
  if (!filter || filter.length === 0) return []

  const mainList = filter[0].aurTmpDetailList
  const groupByStockCode = groupBy(mainList, (criteria) => criteria.stokKodu)
  const distinctStockCodes = [...new Set(mainList.map((item) => item.stokKodu))]

  return distinctStockCodes.map((stockCode) => {
    const list = groupByStockCode.get(stockCode)
    const first = list[0]

    const totals = list.reduce(
      (acc, x) => ({
        siparisMiktar: acc.siparisMiktar + x.siparisMiktar,
        teslimMiktar: acc.teslimMiktar + x.teslimMiktar,
        observerAmount: acc.observerAmount + (x.observerAmount || 0),
      }),
      { siparisMiktar: 0, teslimMiktar: 0, observerAmount: 0 }
    )

    const combinedItem = createAurTmpList(
      stockCode,
      first.stokAdi,
      first.barkod,
      totals.siparisMiktar,
      totals.teslimMiktar,
      first.sipUid,
      first.piece || first.isPiece,
      first.pieceMaster,
      first.pieceAmount,
      first.aurPartialItemId,
      first.orderNo,
      first.reserve,
      first.reserveDescription
    )

    combinedItem.observerAmount = totals.observerAmount
    combinedItem.siparisNo = first.siparisNo

    return combinedItem
  })
}
