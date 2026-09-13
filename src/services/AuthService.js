export async function authenticate(body) {
  const response = await fetch('api/authenticate', body)
  if (!response.ok) {
    const message = `Kullanıcı adınız veya Parolanız Hatalı`
    throw new Error(message)
  }
  const token = await response.json()
  localStorage.setItem('hwms_token', token.id_token)
  return token.id_token
}
