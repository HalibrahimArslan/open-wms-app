export const createOrderPayloads = (orderDetail, apiList, orderInfo, kabul, reservationDataList = []) => {
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

  return {
    updateBody,
    mikroRequest,
    bulkListData,
  }
}
