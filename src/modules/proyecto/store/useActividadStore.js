import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useActividad } from '../composables/useActividad'
import { useUserStore } from '@/stores/user'

export const useActividadStore = defineStore('actividades-tareas', () => {
  //Estados
  const loading = ref(false)
  const error = ref(null)
  //Estados de actividad - Tarea
  const actividad = ref(null) //Una actividad
  const actividadesSubactividadesLista = ref() //Lista de Actividades mas tareas

  //Iniciar los composables
  const { actividadesTareasListas, obtenerListaActividadesConTareas } = useActividad()

  //Iniciar el store de usuarios
  const userStore = useUserStore()

  //Cargar las actividades + Tareas
  async function cargarActividadesTareas() {
    loading.value = true
    try {
      await obtenerListaActividadesConTareas()
      actividadesSubactividadesLista.value = actividadesTareasListas.value
    } catch (err) {
      console.error('Error al cargar las actividades', err)
    } finally {
      loading.value = false
    }
  }

  //Filtrado de actividades
  const actividadesFiltradas = computed(() => {
    if (!actividadesSubactividadesLista.value?.actividades) return []

    const usuario = userStore.userData
    const esAdmin = userStore.rol === 'admin'

    return actividadesSubactividadesLista.value.actividades.filter((actividad) => {
      // Siempre excluir inactivas y creadas
      if (actividad.estaInactiva === true || actividad.estado === 'CRD') {
        return false
      }

      // Si es admin, ve todo
      if (esAdmin) {
        return true
      }

      // Si no es admin, solo ve sus actividades
      const esResponsable =
        actividad.responsable_info?.username === usuario?.user?.username ||
        actividad.responsable === usuario?.user?.id

      // console.log('esResponsable', esResponsable)
      // console.log('Actividad responsable info USERName: ', actividad.responsable_info?.username)
      // console.log('Usuario: ', usuario?.user?.username)
      // console.log('Actividad responsable: ', actividad.responsable)
      // console.log('USUARIO ID: ', usuario?.user?.id)
      return esResponsable
    })
  })

  return {
    loading,
    error,
    actividad,
    actividadesSubactividadesLista,
    actividadesFiltradas,
    //Funciones
    cargarActividadesTareas,
  }
})
