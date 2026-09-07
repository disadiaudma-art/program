import axios from 'axios'

//  FIX: Checks if an environment variable is set on Vercel, otherwise falls back to local or relative path
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

export const submitDelegate = (data) => api.post('/delegates', data)
export const fetchDelegates = (params) => api.get('/delegates', { params })
export const fetchStats = () => api.get('/delegates/stats')
export const deleteDelegate = (id) => api.delete(`/delegates/${id}`)
export const uploadPhoto = (file) => {
  const form = new FormData()
  form.append('photo', file)
  return api.post('/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } })
}

export default api
