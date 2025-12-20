// En useNotificacionesStore.js - ACTUALIZADO
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { useNotificaciones } from '../composables/useNotificaciones'
import { mensajeServicios } from '../services/mensajeService'

export const useNotificacionesStore = defineStore('notificaciones', () => {
  //Estado
  const notificaciones = ref([])
  const loading = ref(false)
  const error = ref(null)
  const notificacionesEnviadas = ref(null)

  // Computed properties para estadísticas
  const noLeidosCuenta = computed(
    () => notificaciones.value.filter((n) => n.estado === 'no_leido').length,
  )

  const totalUrgentes = computed(
    () => notificaciones.value.filter((n) => n.prioridad >= 4 || n.es_urgente).length,
  )

  const totalArchivadas = computed(
    () => notificaciones.value.filter((n) => n.estado === 'archivado').length,
  )

  //Iniciar el store de usuario
  const usuarioStore = useUserStore()

  //Inciar el composable
  const {
    cambiarMensajeALeidos,
    cambiarEstadoMensajesArchivado,
    eliminaMensajeSoft,
    cambiarEstadoMensajes,
    leerMensajesEnviados,
  } = useNotificaciones()

  /************ Acciones **************/
  //Cargar las notificaciones del usuario
  const cargarNotificaciones = async () => {
    if (!usuarioStore.isAuthenticated) {
      console.warn('Usuario no auntenticado')
      return
    }

    loading.value = true
    try {
      const respuesta = await mensajeServicios.obtenerBandeja(usuarioStore.accessToken)
      notificaciones.value = respuesta.data.mensajes
    } catch (error) {
      console.error('No se pudo cargar la información del usuario', error)
      error.value = error
    } finally {
      loading.value = false
    }
  }

  //Cargar las notificaciones enviadas de un usuario
  const cargarNotificacionesEnviadas = async () => {
    if (!usuarioStore.isAuthenticated) {
      console.warn('Usuario no auntenticado')
      return
    }

    loading.value = true
    try {
      const respuesta = await leerMensajesEnviados(usuarioStore.accessToken)
      notificacionesEnviadas.value = respuesta.data
    } catch (err) {
      console.error('Error al cargar las notificaciones al store Notificaciones', err)
      error.value = err
    } finally {
      loading.value = false
    }
  }

  // Función auxiliar para actualizar el estado local de una notificación
  const actualizarEstadoLocal = (id, estado) => {
    const index = notificaciones.value.findIndex((n) => n.id === id)
    if (index !== -1) {
      notificaciones.value[index] = {
        ...notificaciones.value[index],
        estado: estado,
        es_leido: estado === 'leido' || estado === 'archivado',
      }
    }
  }

  // Actualizar estado local múltiple
  const actualizarEstadosLocales = (ids, estado) => {
    notificaciones.value = notificaciones.value.map((notificacion) => {
      if (ids.includes(notificacion.id)) {
        return {
          ...notificacion,
          estado: estado,
          es_leido: estado === 'leido' || estado === 'archivado',
        }
      }
      return notificacion
    })
  }

  // Archivar mensajes
  const archivarMensajes = async (ids) => {
    if (!usuarioStore.isAuthenticated) {
      console.warn('Usuario no autenticado')
      return
    }

    const idsArray = Array.isArray(ids) ? ids : [ids]

    try {
      const respuesta = await cambiarEstadoMensajesArchivado(idsArray, usuarioStore.accessToken)
      actualizarEstadosLocales(idsArray, 'archivado')
      return respuesta
    } catch (err) {
      console.error('Error al archivar mensajes:', err)
      error.value = err
      throw err
    }
  }

  // Marcar mensajes como leídos
  const marcarComoLeidos = async (ids) => {
    if (!usuarioStore.isAuthenticated) {
      console.warn('Usuario no autenticado')
      throw new Error('Usuario no autenticado')
    }

    const idsArray = Array.isArray(ids) ? ids : [ids]

    try {
      const respuesta = await cambiarMensajeALeidos(idsArray, usuarioStore.accessToken)
      actualizarEstadosLocales(idsArray, 'leido')
      return respuesta
    } catch (err) {
      console.error('Error al marcar mensajes como leídos:', err)
      error.value = err
      throw err
    }
  }

  // Marcar un mensaje como leído individual
  const marcarComoLeida = async (id) => {
    return await marcarComoLeidos([id])
  }

  // Eliminar mensaje (soft delete)
  const eliminarMensaje = async (id) => {
    if (!usuarioStore.isAuthenticated) {
      console.warn('Usuario no autenticado')
      return
    }

    try {
      const respuesta = await eliminaMensajeSoft(id, usuarioStore.accessToken)
      actualizarEstadoLocal(id, 'eliminado')
      return respuesta
    } catch (err) {
      console.error('Error al eliminar mensaje:', err)
      error.value = err
      throw err
    }
  }

  // Restaurar mensaje eliminado
  const restaurarMensaje = async (id) => {
    if (!usuarioStore.isAuthenticated) {
      console.warn('Usuario no autenticado')
      return
    }

    try {
      const mensajeData = { ids: [id], estado: 'leido' }
      const respuesta = await cambiarEstadoMensajes(mensajeData, usuarioStore.accessToken)
      actualizarEstadoLocal(id, 'leido')
      return respuesta
    } catch (err) {
      console.error('Error al restaurar mensaje:', err)
      error.value = err
      throw err
    }
  }

  // Restaurar mensaje archivado
  const restaurarArchivado = async (id) => {
    if (!usuarioStore.isAuthenticated) {
      console.warn('Usuario no autenticado')
      return
    }

    try {
      const mensajeData = { ids: [id], estado: 'leido' }
      const respuesta = await cambiarEstadoMensajes(mensajeData, usuarioStore.accessToken)
      actualizarEstadoLocal(id, 'leido')
      return respuesta
    } catch (err) {
      console.error('Error al restaurar archivado:', err)
      error.value = err
      throw err
    }
  }

  // Eliminar permanentemente
  const eliminarPermanentemente = async (id) => {
    if (!usuarioStore.isAuthenticated) {
      console.warn('Usuario no autenticado')
      return
    }

    try {
      // Primero eliminar del backend
      await mensajeServicios.eliminarMensajeHard(id, usuarioStore.accessToken)
      // Luego remover del array local
      notificaciones.value = notificaciones.value.filter((n) => n.id !== id)
      return { success: true }
    } catch (err) {
      console.error('Error al eliminar permanentemente:', err)
      error.value = err
      throw err
    }
  }

  return {
    // Estado
    notificaciones,
    notificacionesEnviadas,
    loading,
    error,

    // Computed
    noLeidosCuenta,
    totalUrgentes,
    totalArchivadas,

    // Acciones
    cargarNotificaciones,
    cargarNotificacionesEnviadas,
    actualizarEstadoLocal,
    archivarMensajes,
    marcarComoLeidos,
    marcarComoLeida,
    eliminarMensaje,
    restaurarMensaje,
    restaurarArchivado,
    eliminarPermanentemente,
  }
})
