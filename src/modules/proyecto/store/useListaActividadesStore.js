import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useActividad } from '../composables/useActividad'
import { useUserStore } from '@/stores/user'
import { useValidadores } from '@/modules/formularios/composables/useValidadores'

export const useListaActividadStore = defineStore('actividades-tareas-lista', () => {
  //Estados
  const loading = ref(false)
  const error = ref(null)
  //Estados de actividad - Tarea
  const actividad = ref(null) //Una actividad
  const actividadesSubactividadesLista = ref() //Lista de Actividades mas tareas
  //Estados de actividad pei - tarea
  const actividadPei = ref(null) //Una actividad PEI
  const actividadesSubactividadesListaPei = ref() //Lista de Actividades mas tareas
  //Listado general de actividades
  const actividadesListaGeneral = ref([])

  //Validaciones pendientes
  const misValidaciones = ref([])

  //Iniciar los composables
  const {
    actividadesTareasListas,
    obtenerListaActividadesConTareas,
    actividadesTareasListasPei,
    obtenerListaActividadesConTareasPei,
  } = useActividad()

  const { obtenerMisValidaciones } = useValidadores()

  //Iniciar el store de usuarios
  const userStore = useUserStore()

  //Cargar las actividades + Tareas
  async function cargarActividadesTareas() {
    loading.value = true
    try {
      // await obtenerListaActividadesConTareas()
      // actividadesSubactividadesLista.value = actividadesTareasListas.value.actividades
      // misValidaciones.value = await obtenerMisValidaciones()
      const [, validaciones] = await Promise.all([
        obtenerListaActividadesConTareas(),
        obtenerMisValidaciones(),
      ])
      misValidaciones.value = validaciones
      actividadesSubactividadesLista.value = actividadesTareasListas.value.actividades
    } catch (err) {
      console.error('Error al cargar las actividades', err)
    } finally {
      loading.value = false
    }
  }

  //Cargar las actividades PEI + Tareas
  const cargarActividadesPeiTareas = async () => {
    loading.value = true
    try {
      await obtenerListaActividadesConTareasPei()
      actividadesSubactividadesListaPei.value = actividadesTareasListasPei.value
    } catch (err) {
      console.error('Error al cargar las actividades del PEI', err)
    } finally {
      loading.value = false
    }
  }

  //Cargar actividades por id de PEI
  //Cargar las actividades PEI + Tareas (MODIFICADA para aceptar id_pei)
  const cargarActividadesPeiTareasPorIdPei = async (id_pei = null) => {
    loading.value = true
    try {
      await obtenerListaActividadesConTareasPei()

      let actividadesFiltradas = actividadesTareasListasPei.value

      // Si se proporciona id_pei, filtrar por ese PEI
      if (id_pei !== null) {
        actividadesFiltradas = actividadesTareasListasPei.value.filter(
          (actividad) => actividad.pei_id === id_pei,
        )
      }

      actividadesSubactividadesListaPei.value = actividadesFiltradas
    } catch (err) {
      console.error('Error al cargar las actividades del PEI', err)
    } finally {
      loading.value = false
    }
  }

  // Cargar las actividades del proyecto y Pei en una sola lista
  const cargarListaActividadesGeneral = async (idpei) => {
    loading.value = true
    try {
      // Obtener las actividades de los proyectos
      await obtenerListaActividadesConTareas()
      actividadesSubactividadesLista.value = actividadesTareasListas.value

      // Obtener las actividades del PEI
      await obtenerListaActividadesConTareasPei()

      // Filtrar las actividades del PEI por el idpei proporcionado
      const actividadesPeiFiltradas = actividadesTareasListasPei.value.filter(
        (actividad) => actividad.pei_id === idpei,
      )

      actividadesSubactividadesListaPei.value = actividadesPeiFiltradas
    } catch (err) {
      console.error('Error al cargar la lista general de actividades', err)
    } finally {
      loading.value = false
    }
  }

  //Filtrado de actividades
  const actividadesFiltradasTotales = computed(() => {
    // Obtener arrays
    const actividades = actividadesSubactividadesLista.value?.actividades || []
    const actividadesPei = actividadesSubactividadesListaPei?.value || []

    const usuario = userStore.userData
    const esAdmin = userStore.rol === 'admin'

    // Filtrar actividades de proyectos
    const actividadesFiltradas = actividades.filter((actividad) => {
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

      return esResponsable
    })

    // Filtrar actividades PEI (misma lógica)
    const actividadesPeiFiltradas = actividadesPei.filter((actividad) => {
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

      return esResponsable
    })

    // Combinar ambos arrays filtrados
    return [...actividadesFiltradas, ...actividadesPeiFiltradas]
  })

  //Filtrado de actividades
  // Si es admin carga todas
  //Si no es admin carga solo de las q es responsable
  const actividadesFiltradas = computed(() => {
    if (!actividadesSubactividadesLista.value) return []

    const usuario = userStore.userData
    const esAdmin = userStore.rol === 'admin'

    return actividadesSubactividadesLista.value.filter((actividad) => {
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

  const actividadesPeiFiltradas = computed(() => {
    // Usar actividadesSubactividadesListaPei.value (no actividadesSubactividadesLista.value)
    if (!actividadesSubactividadesListaPei.value) return []

    const usuario = userStore.userData
    const esAdmin = userStore.rol === 'admin'

    return actividadesSubactividadesListaPei.value.filter((actividad) => {
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

      return esResponsable
    })
  })

  return {
    loading,
    error,
    actividad,
    actividadPei,
    actividadesSubactividadesLista,
    actividadesSubactividadesListaPei,
    actividadesFiltradas,
    actividadesPeiFiltradas,
    actividadesListaGeneral,
    //Validaciones
    misValidaciones,
    //Getters
    actividadesFiltradasTotales,
    //Funciones
    cargarActividadesTareas,
    cargarActividadesPeiTareas,
    cargarListaActividadesGeneral,
    cargarActividadesPeiTareasPorIdPei,
  }
})
