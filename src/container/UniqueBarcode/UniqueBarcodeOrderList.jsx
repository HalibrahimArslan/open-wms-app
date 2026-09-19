import { Table, TableContainer, TableHead, TableCell, TableBody, TableRow, Box, TextField, Chip, Paper, Tooltip, InputAdornment, Collapse, IconButton } from '@mui/material'
import { Button, Stack, Typography } from '@mui/material'
import React, { useCallback, useMemo } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { utils, writeFile } from 'xlsx'
import { styled, alpha } from '@mui/material/styles'
import { useTheme } from '@mui/material'
import QrCode2Icon from '@mui/icons-material/QrCode2'
import SearchIcon from '@mui/icons-material/Search'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import AccountTreeIcon from '@mui/icons-material/AccountTree'
import ViewInArIcon from '@mui/icons-material/ViewInAr'
import excelimg from '../../assets/images/cards/excel.png'
import * as XLSX from 'xlsx'
import TablePanel, { tableHeadSx } from '../../shared/components/Table/TablePanel'
import TableSearchField from '../../shared/components/Table/TableSearchField'

// Parçalı bir ürünün partialList'inden düz parça listesi çıkarır.
// partialList: [{ packageCode, packageDetail: [{ stockCode, stockName, barcode, quantity }] }]
const extractPieces = (row) => {
  if (!row?.hasPiece || !Array.isArray(row.partialList)) return []
  return row.partialList.flatMap((pkg) =>
    (pkg?.packageDetail || []).map((d) => ({
      stokKodu: d.stockCode,
      stokAdi: d.stockName,
      barkod: d.barcode,
      quantity: d.quantity,
      packageCode: pkg.packageCode,
      // Parça birimi ve grup/ölçü bilgileri parçanın kendi ürün (product) kaydından gelir; yoksa ADET.
      // BarcodePrintDialog birime göre kendini uyarlar (M2 -> en/boy, MT/KG -> tek değer, ADET -> stepper).
      stokBirimi: d.product?.stokBirimi ?? 'ADET',
      anaGrup: d.product?.anaGrup ?? '',
      kategoriAdi: d.product?.kategoriAdi ?? '',
      physicalAttributes: d.product?.physicalAttributes ?? null,
      lotBasedTracking: d.product?.lotBasedTracking ?? false,
      // Barkod create payload'ında gönderilecek partialItemId (paket/ana parça id'si)
      partialItemId: d.aurPartialItem?.id ?? null,
    }))
  )
}

const StyledTableRow = styled(TableRow)(({ theme, siparisMiktar, teslimMiktar, isPiece }) => ({
  backgroundColor: teslimMiktar <= 0 ? '#D77676  !important' : teslimMiktar < siparisMiktar ? 'antiquewhite' : '#EAFAF1 !important',
}))

const StickyActionCell = styled(TableCell)(({ theme }) => ({
  position: 'sticky',
  right: 0,
  backgroundColor: theme.palette.background.paper,
  borderLeft: `1px solid ${theme.palette.divider}`,
  boxShadow: `-6px 0 8px -6px ${theme.palette.action.disabled}`,
}))

function UniqueBarcodeOrderList({ list, opType, adresList, handleBarcode, barcodeMap = {}, pieceReceipts = {}, onRowSelect, onPieceSelect, selectedStokKodu }) {
  const [enable, setEnable] = useState(true)
  const [value, setValue] = useState('')
  const [data, setData] = useState([])
  const [expandedRows, setExpandedRows] = useState(() => new Set())
  const theme = useTheme()

  const toggleExpand = (stokKodu) => {
    setExpandedRows((prev) => {
      const next = new Set(prev)
      next.has(stokKodu) ? next.delete(stokKodu) : next.add(stokKodu)
      return next
    })
  }

  // Parça alt tablosunun kaç kolonu kaplayacağını dinamik hesapla (kolon başlıklarıyla uyumlu).
  const colSpanCount = useMemo(() => {
    let count = 7 // Stok Kodu, Ürün Adı, Stok Birimi, Barkod, Sipariş, Teslim, Kalan
    if (opType !== 'FMK') count += 1 // Adresler
    if (opType === 'FMK') count += 1 // Barkod İşlemleri
    return count
  }, [opType])

  // Tabloda miktarları en fazla 2 ondalık göster. Değerler parseFloat toplamından geldiği için
  // (ör. 30.400000000000002) ham gösterim uzun kuyruk üretebiliyor; hesap değeri sayı kalır, sadece görünüm yuvarlanır.
  const formatMiktar = (v) => {
    const n = Number(v)
    return Number.isFinite(n) ? n.toFixed(2) : (v ?? '')
  }

  const scannedTotal = useMemo(() => Object.values(barcodeMap).reduce((acc, arr) => acc + (arr?.filter((b) => b.used).length || 0), 0), [barcodeMap])

  const excelDataArray = useMemo(() => {
    return []
  }, [])

  function generateExcelBody(address, stokKodu, stokAdi, siparisMiktar, teslimMiktar, onay) {
    let dto = {
      address: address,
      stokKodu: stokKodu,
      stokAdi: stokAdi,
      siparisMiktar: siparisMiktar,
      teslimMiktar: teslimMiktar,
      onay: onay,
    }

    return dto
  }

  useEffect(() => {
    if (opType === 'MSK') {
      if (adresList.length > 0 && list.length > 0) {
        list.forEach((todo) => {
          let adressesList = adresList.filter((row) => row.stockCode === todo.stokKodu)
          adressesList.forEach((cycle) => {
            let response = false

            if (excelDataArray.length > 0) {
              excelDataArray.forEach((excelData) => {
                if (excelData.stokKodu === todo.stokKodu && excelData.address === cycle.address) {
                  response = true
                }
              })
            }

            if (response === false) {
              excelDataArray.push(generateExcelBody(cycle.address, todo.stokKodu, todo.stokAdi, todo.siparisMiktar, todo.teslimMiktar, ''))
            }
          })
        })
        setEnable(false)
      }
    }
  }, [adresList, list, opType, excelDataArray])

  const handleExportListExcel = useCallback(() => {
    const sheetData = (list || []).map((row) => {
      const siparis = Number(row.siparisMiktar)
      const teslim = Number(row.teslimMiktar)
      const kalan = Number.isFinite(siparis) && Number.isFinite(teslim) ? siparis - teslim : ''

      return {
        'Stok Kodu': row.stokKodu ?? '',
        'Ürün Adı': row.stokAdi ?? '',
        Barkod: row.barkod ?? '',
        'Sipariş Miktar': Number.isFinite(siparis) ? siparis : (row.siparisMiktar ?? ''),
        'Teslim Miktar': Number.isFinite(teslim) ? teslim : (row.teslimMiktar ?? ''),
        'Kalan Miktar': kalan,
        'Parça Var mı': row.hasPiece ? 'Evet' : 'Hayır',
      }
    })

    const headers = ['Stok Kodu', 'Ürün Adı', 'Barkod', 'Sipariş Miktar', 'Teslim Miktar', 'Kalan Miktar', 'Parça Var mı']

    const ws = XLSX.utils.json_to_sheet(sheetData.length ? sheetData : [headers.reduce((acc, h) => ((acc[h] = ''), acc), {})])

    ws['!cols'] = headers.map((h) => ({ wch: Math.max(h.length + 2, 16) }))

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'SiparisListesi')
    XLSX.writeFile(wb, 'siparis_listesi.xlsx')
  }, [list])

  const handleChange = (e) => {
    let input = e.target.value
    setValue(input.toLocaleUpperCase('TR'))
  }

  useEffect(() => {
    if (opType == 'FMK') {
      if (value.length > 0) {
        setData(list.filter((q) => q.stokAdi.toLocaleUpperCase('TR').includes(value)))
      } else {
        setData(list)
      }
    } else {
      setData(list)
    }
  }, [value, list])

  const renderBarcodeCell = (row) => {
    // Parçalı üründe ana ürün okutulmaz/barkodlanmaz; barkodlar parça bazında üretilir.
    const isPieceParent = row.hasPiece && extractPieces(row).length > 0
    return (
      <StickyActionCell align="center">
        <Stack spacing={0.75} alignItems="center">
          {isPieceParent ? (
            <Button
              variant="outlined"
              size="small"
              startIcon={<AccountTreeIcon />}
              onClick={(e) => {
                e.stopPropagation()
                if (!expandedRows.has(row.stokKodu)) toggleExpand(row.stokKodu)
              }}
              sx={{ borderRadius: 8, textTransform: 'none', whiteSpace: 'nowrap' }}
            >
              Parça Barkodları
            </Button>
          ) : (
            <Button
              variant="contained"
              size="small"
              startIcon={<QrCode2Icon />}
              onClick={(e) => {
                e.stopPropagation()
                handleBarcode(row)
              }}
              sx={{ borderRadius: 8, textTransform: 'none', boxShadow: 'none', px: 2, whiteSpace: 'nowrap' }}
            >
              Oluştur / Yazdır
            </Button>
          )}
        </Stack>
      </StickyActionCell>
    )
  }

  return (
    <Box p={2}>
      <TablePanel
        title="Sipariş Kalemleri"
        meta={
          <>
            <Chip size="small" variant="outlined" label={`${list.length} kalem`} />
            <Chip size="small" color="primary" label={`${scannedTotal} okutuldu`} />
          </>
        }
        actions={
          <>
            <TableSearchField placeholder="Stok adı ara" onChange={handleChange} />
            <Tooltip title="Excel'e aktar">
              <Button
                onClick={handleExportListExcel}
                variant="outlined"
                color="success"
                startIcon={<img src={excelimg} alt="" width={18} height={18} />}
                sx={{ whiteSpace: 'nowrap', borderRadius: 2 }}
              >
                Excel
              </Button>
            </Tooltip>
          </>
        }
      >
        <TableContainer sx={{ display: 'flex' }}>
          <Table aria-label="simple table">
            <TableHead sx={tableHeadSx}>
              <TableRow>
                {opType !== 'FMK' ? (
                  <>
                    <TableCell align="left">Adresler</TableCell>
                  </>
                ) : (
                  <></>
                )}

                <TableCell align="left">Stok Kodu</TableCell>
                <TableCell align="left">Ürün Adı</TableCell>
                <TableCell align="left">Stok Birimi</TableCell>
                {/* geçici */}
                <TableCell align="left">Barkod</TableCell>
                <TableCell align="left">Siparis Miktar</TableCell>
                <TableCell align="left">Teslim Miktar</TableCell>
                <TableCell align="left">Kalan Miktar</TableCell>
                {opType === 'FMK' ? <StickyActionCell align="center">Barkod İşlemleri</StickyActionCell> : <></>}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => {
                // Parçalı ana ürünün teslim/kalanı parçalarından türetilir:
                // teslim = tamamlanan ana ürün seti = min(parçaTeslim / parçaBaşınaAdet)
                const derived = (() => {
                  const pieces = extractPieces(row)
                  if (!row.hasPiece || pieces.length === 0) return null
                  const ratios = pieces.map((p) => {
                    const q = Number(p.quantity) || 0
                    const teslim = Number(pieceReceipts[`${row.stokKodu}|${p.stokKodu}`] || 0)
                    return q > 0 ? teslim / q : 0
                  })
                  const teslim = ratios.length ? Math.min(...ratios) : 0
                  return { teslim, kalan: (Number(row.siparisMiktar) || 0) - teslim }
                })()
                const teslimVal = derived ? derived.teslim : row.teslimMiktar
                const kalanVal = derived ? derived.kalan : row.siparisMiktar - row.teslimMiktar
                return (
                  <>
                    {row.isPiece ? (
                      <StyledTableRow>
                        <TableCell align="left">Parça Sahibi</TableCell>
                        <TableCell align="left">{row.pieceMaster.stokKodu}</TableCell>
                        <TableCell align="left">{row.pieceMaster.stokAdi}</TableCell>
                        <TableCell align="left"></TableCell>
                        {/* geçici: stok birimi */}
                        <TableCell align="left"></TableCell>
                        <TableCell align="left">{formatMiktar(row.siparisMiktar / row.pieceAmount)}</TableCell>
                        <TableCell align="left"></TableCell>
                        <TableCell align="left"></TableCell>
                        {opType === 'FMK' ? <TableCell align="left"></TableCell> : <></>}
                      </StyledTableRow>
                    ) : (
                      <></>
                    )}

                    <StyledTableRow
                      siparisMiktar={row.siparisMiktar}
                      teslimMiktar={teslimVal}
                      key={row.stokKodu}
                      isPiece={row.hasPiece}
                      onClick={() => !row.hasPiece && onRowSelect && onRowSelect(row)}
                      sx={{
                        cursor: onRowSelect && !row.hasPiece ? 'pointer' : 'default',
                        outline: selectedStokKodu === row.stokKodu ? `2px solid ${theme.palette.primary.main}` : 'none',
                        outlineOffset: '-2px',
                      }}
                    >
                      {opType !== 'FMK' ? (
                        <TableCell align="right">
                          <Stack sx={{ overflow: 'auto', height: '100px' }}>
                            {adresList && adresList.length > 0 ? (
                              adresList.filter((todo) => todo.stockCode === row.stokKodu).map((cycle) => <Typography align="left">{cycle.address}</Typography>)
                            ) : (
                              <></>
                            )}
                          </Stack>
                        </TableCell>
                      ) : (
                        <></>
                      )}

                      <TableCell sx={{ fontWeight: 'bold' }} align="left">
                        {row.stokKodu}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }} align="left">
                        <Stack direction="row" spacing={1} alignItems="center">
                          {row.hasPiece && extractPieces(row).length > 0 && (
                            <Tooltip title={expandedRows.has(row.stokKodu) ? 'Parçaları gizle' : 'Parçaları göster'}>
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleExpand(row.stokKodu)
                                }}
                                sx={{ bgcolor: alpha(theme.palette.primary.main, 0.12), '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.22) } }}
                              >
                                {expandedRows.has(row.stokKodu) ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
                              </IconButton>
                            </Tooltip>
                          )}
                          <span>{row.stokAdi}</span>
                          {row.hasPiece && extractPieces(row).length > 0 && (
                            <Chip size="small" color="primary" icon={<AccountTreeIcon />} label={`Parçalı · ${extractPieces(row).length}`} />
                          )}
                          {row.lotBasedTracking && <Chip size="small" color="secondary" variant="outlined" label="Lot'lu" />}
                        </Stack>
                      </TableCell>
                      <TableCell align="left">
                        {/* Lot'lu ürünlerde stok birimi (MT/M2/KG...) dikkate alınmaz; miktar lot üzerinden yürür → "Lotlu" göster. */}
                        {row.lotBasedTracking ? (
                          <Chip size="small" variant="filled" color="secondary" label="Lotlu" />
                        ) : (
                          <Chip size="small" variant="outlined" color="primary" label={row.stokBirimi || '-'} />
                        )}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }} align="left">
                        {(() => {
                          // Sadece ilk (en güncel) toplanmış barkodu göster; seed + okutulanlar barcodeMap'te
                          const code = (barcodeMap[row.stokKodu] || []).filter((b) => b.used).map((b) => b.code)[0]
                          return code ? (
                            <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                              {code}
                            </Typography>
                          ) : null
                        })()}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }} align="left">
                        {formatMiktar(row.siparisMiktar)}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }} align="left">
                        {formatMiktar(teslimVal)}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }} align="left">
                        {formatMiktar(kalanVal)}
                      </TableCell>
                      {opType === 'FMK' ? renderBarcodeCell(row) : <></>}
                    </StyledTableRow>

                    {row.hasPiece && extractPieces(row).length > 0 && (
                      <TableRow>
                        <TableCell sx={{ p: 0, borderBottom: expandedRows.has(row.stokKodu) ? undefined : 'none' }} colSpan={colSpanCount}>
                          <Collapse in={expandedRows.has(row.stokKodu)} timeout="auto" unmountOnExit>
                            <Box
                              sx={{
                                m: 1.5,
                                borderRadius: 2,
                                border: '1px dashed',
                                borderColor: alpha(theme.palette.primary.main, 0.4),
                                bgcolor: alpha(theme.palette.primary.main, 0.04),
                                overflow: 'hidden',
                              }}
                            >
                              <Stack direction="row" alignItems="center" spacing={1} sx={{ px: 2, py: 1, bgcolor: alpha(theme.palette.primary.main, 0.08) }}>
                                <ViewInArIcon fontSize="small" color="primary" />
                                <Typography variant="subtitle2" fontWeight={700} color="primary.main">
                                  Ürün Parçaları
                                </Typography>
                                <Chip size="small" variant="outlined" color="primary" label={`${extractPieces(row).length} parça`} />
                                <Box sx={{ flexGrow: 1 }} />
                                <Typography variant="caption" color="text.secondary">
                                  Ana Ürün: <b>{row.stokKodu}</b>
                                </Typography>
                              </Stack>

                              <Stack spacing={1} sx={{ p: 1.5 }}>
                                {extractPieces(row).map((piece, idx) => {
                                  // Parçanın gereken toplam adedi = ana ürün sipariş miktarı * parça başına adet
                                  const mapKey = `${row.stokKodu}|${piece.stokKodu}`
                                  const required = (Number(row.siparisMiktar) || 0) * (Number(piece.quantity) || 0)
                                  const teslim = Number(pieceReceipts[mapKey] || 0)
                                  const kalan = required - teslim
                                  const done = required > 0 && kalan <= 0
                                  const lastCode = (barcodeMap[mapKey] || [])
                                    .filter((b) => b.used)
                                    .map((b) => b.code)
                                    .slice(-1)[0]
                                  return (
                                    <Box
                                      key={`${piece.stokKodu}-${piece.barkod}-${idx}`}
                                      onClick={() => onPieceSelect && onPieceSelect(row, piece)}
                                      sx={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        alignItems: 'center',
                                        gap: 1.5,
                                        p: 1.25,
                                        border: '1px solid',
                                        borderColor: done ? alpha(theme.palette.success.main, 0.5) : 'divider',
                                        borderRadius: 1.5,
                                        bgcolor: done ? alpha(theme.palette.success.main, 0.1) : 'background.paper',
                                        cursor: onPieceSelect ? 'pointer' : 'default',
                                        transition: 'border-color .15s',
                                        '&:hover': { borderColor: 'primary.main' },
                                      }}
                                    >
                                      <Chip size="small" label={idx + 1} sx={{ fontWeight: 700, flex: '0 0 auto' }} />

                                      {/* Kimlik: stok kodu, ad, birim, barkod, son okutulan */}
                                      <Box sx={{ flex: '1 1 220px', minWidth: 0 }}>
                                        <Stack direction="row" spacing={0.75} alignItems="center" sx={{ minWidth: 0 }}>
                                          <Typography variant="body2" fontWeight={700} noWrap>
                                            {piece.stokKodu}
                                          </Typography>
                                          {piece.lotBasedTracking ? (
                                            <Chip size="small" variant="filled" color="secondary" label="Lotlu" sx={{ flex: '0 0 auto', height: 20 }} />
                                          ) : (
                                            <Chip size="small" variant="outlined" color="primary" label={piece.stokBirimi || '-'} sx={{ flex: '0 0 auto', height: 20 }} />
                                          )}
                                        </Stack>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }} noWrap>
                                          {piece.stokAdi}
                                        </Typography>
                                        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 0.25 }}>
                                          <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                                            Barkod: <b>{piece.barkod || '-'}</b>
                                          </Typography>
                                          {lastCode && (
                                            <Typography variant="caption" color="success.main" sx={{ fontFamily: 'monospace' }} noWrap>
                                              Son: <b>{lastCode}</b>
                                            </Typography>
                                          )}
                                        </Stack>
                                      </Box>

                                      {/* Miktar özetleri */}
                                      <Stack direction="row" spacing={1.5} sx={{ flex: '0 0 auto' }}>
                                        {[
                                          { label: 'Gereken', value: required, color: 'text.primary' },
                                          { label: 'Toplanan', value: teslim, color: 'success.main' },
                                          { label: 'Kalan', value: kalan, color: kalan > 0 ? 'warning.main' : 'text.secondary' },
                                        ].map((s) => (
                                          <Box key={s.label} sx={{ textAlign: 'center', minWidth: 52 }}>
                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.2 }}>
                                              {s.label}
                                            </Typography>
                                            <Typography variant="body2" fontWeight={700} color={s.color}>
                                              {formatMiktar(s.value)}
                                            </Typography>
                                          </Box>
                                        ))}
                                      </Stack>

                                      {opType === 'FMK' && (
                                        <Button
                                          variant="contained"
                                          size="small"
                                          startIcon={<QrCode2Icon />}
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            handleBarcode({
                                              isPiece: true,
                                              partialItemId: piece.partialItemId,
                                              stokKodu: piece.stokKodu,
                                              stokAdi: piece.stokAdi,
                                              barkod: piece.barkod,
                                              siparisMiktar: piece.quantity,
                                              stokBirimi: piece.stokBirimi,
                                              anaGrup: piece.anaGrup,
                                              kategoriAdi: piece.kategoriAdi,
                                              physicalAttributes: piece.physicalAttributes,
                                              lotBasedTracking: piece.lotBasedTracking,
                                              parentStokKodu: row.stokKodu,
                                            })
                                          }}
                                          sx={{ borderRadius: 8, textTransform: 'none', boxShadow: 'none', whiteSpace: 'nowrap', flex: '0 0 auto' }}
                                        >
                                          Oluştur / Yazdır
                                        </Button>
                                      )}
                                    </Box>
                                  )
                                })}
                              </Stack>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </TablePanel>
    </Box>
  )
}

export default React.memo(UniqueBarcodeOrderList)
