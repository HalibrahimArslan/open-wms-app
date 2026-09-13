export const createOrderPayloads = (orderDetail, apiList, orderInfo, kabul, reservationDataList = [], pieceReceipts = {}) => {
  let updateBody = []
  let mikroRequest = []
  let bulkListData = []

  let finalList = orderDetail.filter((list) => list.teslimMiktar > 0)

  finalList.forEach((todo) => {
    const reservationData = reservationDataList.find((r) => r.stokKodu === todo.stokKodu) || {
      isReserve: 'H',
      reserveNo: '',
      description: '',
    }

    let filteredList = apiList.filter((main) => main.stokKodu === todo.stokKodu)

    if (filteredList.length > 0) {
      let referenceValue = todo.teslimMiktar
      for (let i = 0; i < filteredList.length; i++) {
        if (filteredList[i].siparisMiktar >= referenceValue) {
          let aurTmpDetailList = {
            sipUid: filteredList[i].sipUid,
            teslimMiktar: referenceValue,
            status: 'DONE',
            observerAmount: 0,
          }

          let dto = {
            sipUid: filteredList[i].sipUid,
            stokKodu: filteredList[i].stokKodu,
            kabulMiktar: referenceValue,
            barkod: filteredList[i].barkod,
            stokAdi: filteredList[i].stokAdi,
            aurPartialItemId: filteredList[i].aurPartialItemId ?? 0,
            reserveNo: reservationData.reserveNo,
            description: reservationData.description,
            isReserve: reservationData.isReserve,
          }

          let bulkList = {
            erpOrderId: filteredList[i].sipUid,
            processAmount: referenceValue,
            erpOrderInfo: orderInfo,
            orderAmount: filteredList[i].siparisMiktar,
            stokAdi: filteredList[i].stokAdi,
            stokKodu: filteredList[i].stokKodu,
            barkod: filteredList[i].barkod,
            status: 'DONE',
          }

          bulkListData.push(bulkList)
          mikroRequest.push(dto)
          updateBody.push(aurTmpDetailList)
          break
        }

        if (filteredList[i].siparisMiktar < referenceValue) {
          let aurTmpDetailList = {
            sipUid: filteredList[i].sipUid,
            teslimMiktar: filteredList[i].siparisMiktar,
            status: 'DONE',
            observerAmount: 0,
          }

          let dto = {
            sipUid: filteredList[i].sipUid,
            stokKodu: filteredList[i].stokKodu,
            barkod: filteredList[i].barkod,
            stokAdi: filteredList[i].stokAdi,
            kabulMiktar: filteredList[i].siparisMiktar,
            aurPartialItemId: filteredList[i].aurPartialItemId ?? 0,
            reserveNo: reservationData.reserveNo,
            description: reservationData.description,
            isReserve: reservationData.isReserve,
          }

          let bulkList = {
            erpOrderId: filteredList[i].sipUid,
            processAmount: filteredList[i].siparisMiktar,
            erpOrderInfo: orderInfo,
            orderAmount: filteredList[i].siparisMiktar,
            stokAdi: filteredList[i].stokAdi,
            stokKodu: filteredList[i].stokKodu,
            barkod: filteredList[i].barkod,
            status: 'DONE',
          }

          bulkListData.push(bulkList)
          mikroRequest.push(dto)
          updateBody.push(aurTmpDetailList)
          referenceValue -= filteredList[i].siparisMiktar
        }
      }
    } else {
      const fallback = {
        sipUid: 'UNKNOWN',
        stokKodu: todo.stokKodu,
        barkod: '',
        stokAdi: todo.stokAdi,
        siparisMiktar: todo.siparisMiktar || 0,
      }

      let aurTmpDetailList = {
        sipUid: fallback.sipUid,
        teslimMiktar: kabul,
        status: 'DONE',
        observerAmount: 0,
      }

      let dto = {
        sipUid: fallback.sipUid,
        stokKodu: fallback.stokKodu,
        barkod: fallback.barkod,
        stokAdi: fallback.stokAdi,
        kabulMiktar: kabul,
        aurPartialItemId: 0,
        reserveNo: reservationData.reserveNo,
        description: reservationData.description,
        isReserve: reservationData.isReserve,
      }

      let bulkList = {
        erpOrderId: fallback.sipUid,
        processAmount: kabul,
        erpOrderInfo: orderInfo,
        orderAmount: fallback.siparisMiktar,
        stokAdi: fallback.stokAdi,
        stokKodu: fallback.stokKodu,
        barkod: fallback.barkod,
        status: 'DONE',
      }

      bulkListData.push(bulkList)
      mikroRequest.push(dto)
      updateBody.push(aurTmpDetailList)
    }
  })

  // Parçalı ürünler: İrsaliyede parçalar değil, ait oldukları GERÇEK ürün (ana ürün) TEK satır gönderilir.
  // Bir ana ürünün birden çok parçası aynı aurPartialItemId'yi paylaştığı için parça bazında değil,
  // gerçek ürün (paket) bazında gruplanır. kabulMiktar = tamamlanan set = min(parçaTeslim / parçaBaşınaAdet).
  const pieceParentCodes = [...new Set(Object.keys(pieceReceipts).map((k) => k.slice(0, k.indexOf('|'))))]
  pieceParentCodes.forEach((parentStokKodu) => {
    const parent = apiList.find((p) => p.stokKodu === parentStokKodu && p.hasPiece && Array.isArray(p.partialList))
    if (!parent) return

    parent.partialList.forEach((pkg) => {
      const details = pkg?.packageDetail || []
      if (details.length === 0) return

      // Paketteki her parçanın toplanan/gereken oranı; tamamlanan set = en düşük oran.
      const ratios = details.map((d) => {
        const teslim = Number(pieceReceipts[`${parentStokKodu}|${d.stockCode}`] || 0)
        const q = Number(d.quantity) || 0
        return q > 0 ? teslim / q : 0
      })
      const completed = ratios.length ? Math.min(...ratios) : 0
      if (completed <= 0) return

      const aurPartialItem = details[0].aurPartialItem || {}
      const aurPartialItemId = aurPartialItem.id ?? 0
      const realStokKodu = aurPartialItem.packageCode || parent.stokKodu
      const realBarkod = aurPartialItem.packageBarcode || parent.barkod
      const realStokAdi = aurPartialItem.packageName || parent.stokAdi

      const reservationData = reservationDataList.find((r) => r.stokKodu === realStokKodu) || {
        isReserve: 'H',
        reserveNo: '',
        description: '',
      }

      updateBody.push({
        sipUid: parent.sipUid,
        teslimMiktar: completed,
        status: 'DONE',
        observerAmount: 0,
        aurPartialItemId,
      })

      mikroRequest.push({
        sipUid: parent.sipUid,
        stokKodu: realStokKodu,
        barkod: realBarkod,
        stokAdi: realStokAdi,
        kabulMiktar: completed,
        aurPartialItemId,
        reserveNo: reservationData.reserveNo,
        description: reservationData.description,
        isReserve: reservationData.isReserve,
      })

      bulkListData.push({
        erpOrderId: parent.sipUid,
        processAmount: completed,
        erpOrderInfo: orderInfo,
        orderAmount: parent.siparisMiktar,
        stokAdi: realStokAdi,
        stokKodu: realStokKodu,
        barkod: realBarkod,
        status: 'DONE',
        aurPartialItemId,
      })
    })
  })

  return {
    updateBody,
    mikroRequest,
    bulkListData,
  }
}
