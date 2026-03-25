import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useActividad } from '../composables/useActividad'
import { useUserStore } from '@/stores/user'
import { useValidadores } from '@/modules/formularios/composables/useValidadores'
import { useUserPermissions } from '@/stores/useUserPermissions'

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

  //Iniciar el store de permisos para los usuarios
  const usuarioPermisosStore = useUserPermissions()
  //Getters

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

  // Cargar las actividades del proyecto
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
  //Si no es admin carga solo las actividades que pertenecen a los proyectos
  //que el usuario tenga acceso
  const actividadesFiltradas = computed(() => {
    if (!actividadesSubactividadesLista.value) return []

    const usuario = userStore.userData
    const esAdmin = userStore.rol === 'admin'

    // Obtener IDs de proyectos a los que el usuario tiene acceso
    const proyectosAccesiblesIds = usuarioPermisosStore.proyectosAccesiblesIds || []

    console.log('------------------FILTRAR ACTIVIDADES --------------')
    console.log('Usuario:', usuario?.user?.username)
    console.log('Es admin:', esAdmin)
    console.log('Proyectos accesibles IDs:', proyectosAccesiblesIds)
    console.log('Total actividades a filtrar:', actividadesSubactividadesLista.value.length)

    // Si es admin, retorna todas las actividades (excluyendo inactivas/CRD)
    if (esAdmin) {
      return actividadesSubactividadesLista.value.filter((actividad) => {
        // Excluir inactivas y creadas
        if (actividad.estaInactiva === true || actividad.estado === 'CRD') {
          console.log(`❌ Actividad ${actividad.id} excluida: inactiva o CRD`)
          return false
        }
        console.log(`✅ Admin - Actividad ${actividad.id} incluida`)
        return true
      })
    }

    // Para usuarios no-admin: obtener actividades por dos criterios

    // 1. Actividades donde es responsable directo
    const actividadesPorResponsabilidad = actividadesSubactividadesLista.value.filter(
      (actividad) => {
        // Excluir inactivas y creadas
        if (actividad.estaInactiva === true || actividad.estado === 'CRD') {
          return false
        }

        const esResponsable =
          actividad.responsable_info?.username === usuario?.user?.username ||
          actividad.responsable === usuario?.user?.id

        if (esResponsable) {
          console.log(
            `✅ [Responsable] Actividad ${actividad.id} - Usuario es responsable, incluida`,
          )
          return true
        }
        return false
      },
    )

    // 2. Actividades que pertenecen a proyectos accesibles
    // CORRECCIÓN: Usar actividad.proyecto (no proyecto_id)
    const actividadesPorProyecto = actividadesSubactividadesLista.value.filter((actividad) => {
      // Excluir inactivas y creadas
      if (actividad.estaInactiva === true || actividad.estado === 'CRD') {
        return false
      }

      // Obtener el ID del proyecto de la actividad
      // Los datos muestran que la propiedad es 'proyecto' directamente
      const proyectoId = actividad.proyecto

      if (proyectoId && proyectosAccesiblesIds.includes(proyectoId)) {
        console.log(
          `✅ [Proyecto] Actividad ${actividad.id} - Pertenece al proyecto accesible ${proyectoId}, incluida`,
        )
        return true
      }
      return false
    })

    // 3. Combinar ambos resultados y eliminar duplicados
    const actividadesMap = new Map()

    // Agregar actividades por responsabilidad
    actividadesPorResponsabilidad.forEach((actividad) => {
      actividadesMap.set(actividad.id, actividad)
    })

    // Agregar actividades por proyecto (no duplica si ya existe)
    actividadesPorProyecto.forEach((actividad) => {
      if (!actividadesMap.has(actividad.id)) {
        actividadesMap.set(actividad.id, actividad)
      }
    })

    const actividadesUnicas = Array.from(actividadesMap.values())

    console.log('📊 Resumen de filtrado:')
    console.log(`- Actividades por responsabilidad: ${actividadesPorResponsabilidad.length}`)
    console.log(`- Actividades por proyecto accesible: ${actividadesPorProyecto.length}`)
    console.log(`- Total únicas: ${actividadesUnicas.length}`)

    return actividadesUnicas
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
