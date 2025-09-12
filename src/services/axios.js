// src/services/axios.js
import axios from 'axios'

//Instancia Base
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  withCredentials: false,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

//INstancia para Solicitud
const apiMonitoreo = axios.create({
  baseURL: import.meta.env.VITE_API_URL_MONITOREO,
  withCredentials: false,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

//Instancia para planes
const apiPlan = axios.create({
  //baseURL: import.meta.env.VITE_API_URL_PLAN,
  baseURL: 'http://127.0.0.1:8000/api-plan/',
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

//Instancia para programas
const apiProg = axios.create({
  //baseURL: import.meta.env.VITE_API_URL_PLAN,
  baseURL: import.meta.env.VITE_API_URL_PROGS,
  withCredentials: false,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

//Instancia para proyectos
const apiProy = axios.create({
  //baseURL: import.meta.env.VITE_API_URL_PLAN,
  baseURL: import.meta.env.VITE_API_URL_PROYS,
  withCredentials: false,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

//Instancia para proyectos
const apiRep = axios.create({
  //baseURL: import.meta.env.VITE_API_URL_PLAN,
  baseURL: import.meta.env.VITE_API_URL_REPS,
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
apiProy.interceptors.response.use((response) => response, errorInterceptor)
apiProg.interceptors.response.use((response) => response, errorInterceptor)
apiProy.interceptors.response.use((response) => response, errorInterceptor)
apiRep.interceptors.response.use((response) => response, errorInterceptor)
// Interceptor para manejar errores globales
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     console.error('Error en petición:', error.response?.data || error.message)
//     return Promise.reject(error)
//   },
// )
export default api
export { api, apiPlan, apiUsuarios, apiProg, apiProy, apiMonitoreo, apiRep }
