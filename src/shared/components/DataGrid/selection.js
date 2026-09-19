/**
 * MUI X v8+ satir secim modelini ({ type, ids: Set }) secili id dizisine cevirir.
 *
 * "include" modelinde secilenler dogrudan ids'tedir. "Tumunu sec" sonrasinda gelen
 * "exclude" modelinde ise ids haric tutulanlardir; secili olanlar satirlardan
 * (varsa secilebilirlik filtresiyle) hesaplanir.
 */
export function selectionModelToIds(model, rows, isSelectable = () => true) {
  if (!model) return []
  if (model.type === 'exclude') {
    return rows.filter((row) => isSelectable(row) && !model.ids.has(row.id)).map((row) => row.id)
  }
  return [...model.ids]
}
