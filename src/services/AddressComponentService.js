import { getErrorMessage } from '../utils/Utils'

export async function getAddressDepartments(headers, companyCode, depoCode) {
  const response = await fetch(`/api/departments/${companyCode}/${Number(depoCode)}`, { headers })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const departments = await response.json()

  return departments
}

export async function getAddressHalls(headers, companyCode, depoCode) {
  const response = await fetch(`/api/halls/${companyCode}/${Number(depoCode)}`, { headers })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const halls = await response.json()

  return halls
}

export async function getAddressUnits(headers, companyCode, depoCode) {
  const response = await fetch(`/api/units/${companyCode}/${Number(depoCode)}`, { headers })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const units = await response.json()

  return units
}

export async function getAddressFlats(headers, companyCode, depoCode) {
  const response = await fetch(`/api/flats/${companyCode}/${Number(depoCode)}`, { headers })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const flats = await response.json()

  return flats
}

export async function getAddressRooms(headers, companyCode, depoCode) {
  const response = await fetch(`/api/rooms/${companyCode}/${Number(depoCode)}`, { headers })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const rooms = await response.json()

  return rooms
}

export async function getAddressTypes(headers, companyCode, depoCode) {
  const response = await fetch(`/api/address-types/${companyCode}/${Number(depoCode)}`, { headers })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const addressTypes = await response.json()

  return addressTypes
}

export async function updateAddressDepartment(headers, payload) {
  const response = await fetch(`/api/department`, {
    method: 'PUT',
    headers: headers,
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const newDepartment = await response.json()

  return newDepartment
}

export async function updateAddressHall(headers, payload) {
  const response = await fetch(`/api/hall`, {
    method: 'PUT',
    headers: headers,
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const newHall = await response.json()

  return newHall
}

export async function updateAddressUnit(headers, payload) {
  const response = await fetch(`/api/unit`, {
    method: 'PUT',
    headers: headers,
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const newUnit = await response.json()

  return newUnit
}

export async function updateAddressFlat(headers, payload) {
  const response = await fetch(`/api/flat`, {
    method: 'PUT',
    headers: headers,
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const newFlat = await response.json()

  return newFlat
}

export async function updateAddressRoom(headers, payload) {
  const response = await fetch(`/api/room`, {
    method: 'PUT',
    headers: headers,
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const newRoom = await response.json()

  return newRoom
}

export async function updateAddressType(headers, payload) {
  const response = await fetch(`/api/address-type`, {
    method: 'PUT',
    headers: headers,
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const newAddressType = await response.json()

  return newAddressType
}

export async function saveAddressDepartment(payload) {
  const response = await fetch(`/api/department`, payload)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const newDepartment = await response.json()

  return newDepartment
}

export async function saveAddressHall(payload) {
  const response = await fetch(`/api/hall`, payload)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const newHall = await response.json()

  return newHall
}

export async function saveAddressUnit(payload) {
  const response = await fetch(`/api/unit`, payload)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const newUnit = await response.json()

  return newUnit
}

export async function saveAddressFlat(payload) {
  const response = await fetch(`/api/flat`, payload)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const newFlat = await response.json()

  return newFlat
}

export async function saveAddressRoom(payload) {
  const response = await fetch(`/api/room`, payload)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const newRoom = await response.json()

  return newRoom
}

export async function saveAddressType(payload) {
  const response = await fetch(`/api/address-type`, payload)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const newAddressType = await response.json()

  return newAddressType
}

export async function deleteAddressDepartment(id, headers) {
  const response = await fetch(`/api/department/${id}`, {
    method: 'DELETE',
    headers,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }
}

export async function deleteAddressHall(id, headers) {
  const response = await fetch(`/api/hall/${id}`, {
    method: 'DELETE',
    headers,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }
}

export async function deleteAddressUnit(id, headers) {
  const response = await fetch(`/api/unit/${id}`, {
    method: 'DELETE',
    headers,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }
}

export async function deleteAddressFlat(id, headers) {
  const response = await fetch(`/api/flat/${id}`, {
    method: 'DELETE',
    headers,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }
}

export async function deleteAddressRoom(id, headers) {
  const response = await fetch(`/api/room/${id}`, {
    method: 'DELETE',
    headers,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }
}

export async function deleteAddressType(id, headers) {
  const response = await fetch(`/api/address-type/${id}`, {
    method: 'DELETE',
    headers,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }
}
