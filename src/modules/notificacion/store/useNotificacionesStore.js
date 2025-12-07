import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { mensajeServicios } from '../services/mensajeService'

export const useNotificacionesStore = defineStore('notificaciones', () => {
  //Estado
  const notificaciones = ref([])
  const loading = ref(false)
  const error = ref(null)
  const noLeidosCuenta = ref(0)
  const pollingIntervalo = ref(null)

  //Iniciar el store de usuario
  const usuarioStore = useUserStore()

  //Getters

  /************ Acciones **************/
  //Cargar las notificaciones del usuario
  const cargarNotificaciones = async () => {
    if (!usuarioStore.isAuthenticated) {
      console.warn('Usuario no auntenticado')
    }

    loading.value = true
    try {
      const respuesta = await mensajeServicios.obtenerBandeja(usuarioStore.accessToken)
      notificaciones.value = respuesta.data.mensajes
    } catch (error) {
      console.error('No se pudo cargar la informacion del usuario', error)
    } finally {
      loading.value = false
    }
  }

  return {
    // Estado
    notificaciones,
    loading,
    error,
    noLeidosCuenta,
    //Getters
    //Acciones
    cargarNotificaciones,
  }
})
