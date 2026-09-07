import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
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
