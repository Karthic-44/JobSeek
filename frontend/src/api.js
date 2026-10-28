import axios from 'axios'

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || ''}/api`,
  withCredentials: true,
})

/** Pull a readable sentence out of whatever the backend (or the network) sent back. */
export function errorMessage(err, fallback = 'Something went wrong. Try again.') {
  if (!err?.response) return 'Cannot reach the server. Check that the backend is running.'
  const data = err.response.data
  if (typeof data === 'string' && data.trim()) return data
  if (data?.message) return data.message
  if (data && typeof data === 'object') {
    const first = Object.values(data).find((v) => typeof v === 'string')
    if (first) return first
  }
  return fallback
}

export default api
