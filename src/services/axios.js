// src/services/axios.js
import axios from 'axios'

//Instancia Base
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: false,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

//Instancia para planes
const apiPlan = axios.create({
  baseURL: import.meta.env.VITE_API_URL_PLAN,
  withCredentials: false,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

//Instancia para Usuarios
const apiUsuarios = axios.create({
  baseURL: import.meta.env.VITE_API_URL_USR,
  withCredentials: false,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

//Interceptor comun para ambas instancias
const errorInterceptor = (error) => {
  console.error('Error en petición:', error.response?.data || error.message)
  return Promise.reject(error)
}

api.interceptors.response.use((response) => response, errorInterceptor)
apiPlan.interceptors.response.use((response) => response, errorInterceptor)
apiUsuarios.interceptors.response.use((response) => response, errorInterceptor)
// Interceptor para manejar errores globales
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     console.error('Error en petición:', error.response?.data || error.message)
//     return Promise.reject(error)
//   },
// )
export default api
export { api, apiPlan, apiUsuarios }
