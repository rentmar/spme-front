import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useActividad } from '../composables/useActividad'
import { useUserStore } from '@/stores/user'
import { useValidadores } from '@/modules/formularios/composables/useValidadores'
import { useUserPermissions } from '@/stores/useUserPermissions'
import { proyectoServicios } from '../services/proyectoService'

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
  //Listado de IDs de proyectos habilitados
  const listaIdsProyectosHabilitados = ref([])

  //Validaciones pendientes
  const misValidaciones = ref([])

  //Estados para agrupacion
  const agrupacionActual = ref('ninguna') //'ninguna', 'proyecto', 'responsable'
  const proyectoSeleccionado = ref(null)
  const responsableSeleccionado = ref(null)
  const proyectosCatalogo = ref([])

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
        cargarListaIdsProyectosHabilitados(),
        cargarCatalogoProyectos(),
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

  //Cargar los proyectos habilitados, solo ids
  const cargarListaIdsProyectosHabilitados = async () => {
    loading.value = true
    try {
      const respuesta = await proyectoServicios.listaIdsProyectosHabilitados()
      listaIdsProyectosHabilitados.value = respuesta.ids
    } catch (err) {
      console.error('Error al cargar la lista de id de proyectos habilitados', err)
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
    // const esAdmin = userStore.rol === 'admin'
    const esAdmin = userStore.rol === 'admin' || userStore.rol === 'dir-administrativo'

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
  // const actividadesFiltradas = computed(() => {
  //   if (!actividadesSubactividadesLista.value) return []

  //   const usuario = userStore.userData
  //   const esAdmin = userStore.rol === 'admin'

  //   // Obtener IDs de proyectos a los que el usuario tiene acceso
  //   const proyectosAccesiblesIds = usuarioPermisosStore.proyectosAccesiblesIds || []

  //   console.log('------------------FILTRAR ACTIVIDADES --------------')
  //   console.log('Usuario:', usuario?.user?.username)
  //   console.log('Es admin:', esAdmin)
  //   console.log('Proyectos accesibles IDs:', proyectosAccesiblesIds)
  //   console.log('Total actividades a filtrar:', actividadesSubactividadesLista.value.length)

  //   // Si es admin, retorna todas las actividades (excluyendo inactivas/CRD)
  //   if (esAdmin) {
  //     return actividadesSubactividadesLista.value.filter((actividad) => {
  //       // Excluir inactivas y creadas
  //       if (actividad.estaInactiva === true || actividad.estado === 'CRD') {
  //         console.log(`❌ Actividad ${actividad.id} excluida: inactiva o CRD`)
  //         return false
  //       }
  //       console.log(`✅ Admin - Actividad ${actividad.id} incluida`)
  //       return true
  //     })
  //   }

  //   // Para usuarios no-admin: obtener actividades por dos criterios

  //   // 1. Actividades donde es responsable directo
  //   const actividadesPorResponsabilidad = actividadesSubactividadesLista.value.filter(
  //     (actividad) => {
  //       // Excluir inactivas y creadas
  //       if (actividad.estaInactiva === true || actividad.estado === 'CRD') {
  //         return false
  //       }

  //       const esResponsable =
  //         actividad.responsable_info?.username === usuario?.user?.username ||
  //         actividad.responsable === usuario?.user?.id

  //       if (esResponsable) {
  //         console.log(
  //           `✅ [Responsable] Actividad ${actividad.id} - Usuario es responsable, incluida`,
  //         )
  //         return true
  //       }
  //       return false
  //     },
  //   )

  //   // 2. Actividades que pertenecen a proyectos accesibles
  //   // CORRECCIÓN: Usar actividad.proyecto (no proyecto_id)
  //   const actividadesPorProyecto = actividadesSubactividadesLista.value.filter((actividad) => {
  //     // Excluir inactivas y creadas
  //     if (actividad.estaInactiva === true || actividad.estado === 'CRD') {
  //       return false
  //     }

  //     // Obtener el ID del proyecto de la actividad
  //     // Los datos muestran que la propiedad es 'proyecto' directamente
  //     const proyectoId = actividad.proyecto

  //     if (proyectoId && proyectosAccesiblesIds.includes(proyectoId)) {
  //       console.log(
  //         `✅ [Proyecto] Actividad ${actividad.id} - Pertenece al proyecto accesible ${proyectoId}, incluida`,
  //       )
  //       return true
  //     }
  //     return false
  //   })

  //   // 3. Combinar ambos resultados y eliminar duplicados
  //   const actividadesMap = new Map()

  //   // Agregar actividades por responsabilidad
  //   actividadesPorResponsabilidad.forEach((actividad) => {
  //     actividadesMap.set(actividad.id, actividad)
  //   })

  //   // Agregar actividades por proyecto (no duplica si ya existe)
  //   actividadesPorProyecto.forEach((actividad) => {
  //     if (!actividadesMap.has(actividad.id)) {
  //       actividadesMap.set(actividad.id, actividad)
  //     }
  //   })

  //   const actividadesUnicas = Array.from(actividadesMap.values())

  //   console.log('📊 Resumen de filtrado:')
  //   console.log(`- Actividades por responsabilidad: ${actividadesPorResponsabilidad.length}`)
  //   console.log(`- Actividades por proyecto accesible: ${actividadesPorProyecto.length}`)
  //   console.log(`- Total únicas: ${actividadesUnicas.length}`)

  //   return actividadesUnicas
  // })

  const actividadesFiltradas = computed(() => {
    if (!actividadesSubactividadesLista.value) return []

    const usuario = userStore.userData
    const esAdmin = userStore.rol === 'admin'

    // Obtener IDs de proyectos a los que el usuario tiene acceso
    const proyectosAccesiblesIds = usuarioPermisosStore.proyectosAccesiblesIds || []

    // NUEVO: Obtener IDs de proyectos habilitados
    const proyectosHabilitadosIds = listaIdsProyectosHabilitados.value || []

    console.log('------------------FILTRAR ACTIVIDADES --------------')
    console.log('Usuario:', usuario?.user?.username)
    console.log('Es admin:', esAdmin)
    console.log('Proyectos accesibles IDs:', proyectosAccesiblesIds)
    console.log('Proyectos habilitados IDs:', proyectosHabilitadosIds)
    console.log('Total actividades a filtrar:', actividadesSubactividadesLista.value.length)

    // NUEVO PASO 0: Filtrar solo actividades de proyectos habilitados
    const actividadesHabilitadas = actividadesSubactividadesLista.value.filter((actividad) => {
      const proyectoId = actividad.proyecto
      const estaHabilitado = proyectosHabilitadosIds.includes(proyectoId)

      if (!estaHabilitado) {
        console.log(`❌ Actividad ${actividad.id} excluida - Proyecto ${proyectoId} no habilitado`)
      }
      return estaHabilitado
    })

    console.log(`Actividades de proyectos habilitados: ${actividadesHabilitadas.length}`)

    // Si es admin, retorna todas las actividades habilitadas (excluyendo inactivas/CRD)
    if (esAdmin) {
      return actividadesHabilitadas.filter((actividad) => {
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
    const actividadesPorResponsabilidad = actividadesHabilitadas.filter((actividad) => {
      // Excluir inactivas y creadas
      if (actividad.estaInactiva === true || actividad.estado === 'CRD') {
        return false
      }

      const esResponsable =
        actividad.responsable_info?.username === usuario?.user?.username ||
        actividad.responsable === usuario?.user?.id

      if (esResponsable) {
        console.log(`✅ [Responsable] Actividad ${actividad.id} - Usuario es responsable, incluida`)
        return true
      }
      return false
    })

    // 2. Actividades que pertenecen a proyectos accesibles
    const actividadesPorProyecto = actividadesHabilitadas.filter((actividad) => {
      // Excluir inactivas y creadas
      if (actividad.estaInactiva === true || actividad.estado === 'CRD') {
        return false
      }

      // Obtener el ID del proyecto de la actividad
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
    console.log(`- Actividades de proyectos habilitados: ${actividadesHabilitadas.length}`)
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

  /*****************************************************************************/
  /*      GETTERS POR AGRUPACION                                               */
  /*****************************************************************************/
  //Actividades por Proyecto
  const actividadesPorProyecto = computed(() => {
    const actividades = actividadesFiltradas.value || []
    const agrupadas = {}

    actividades.forEach((actividad) => {
      const proyectoId = actividad.proyecto || 'sin_proyecto'

      if (!agrupadas[proyectoId]) {
        // ✅ BUSCAR datos del proyecto en el catálogo
        const proyectoInfo = proyectosCatalogo.value?.find(
          (p) => p.id === proyectoId || p.id === Number(proyectoId),
        )

        agrupadas[proyectoId] = {
          proyectoId,
          proyectoCodigo: proyectoInfo?.codigo || `PROY-${proyectoId}`,
          proyectoNombre: proyectoInfo?.titulo || proyectoInfo?.nombre || `Proyecto ${proyectoId}`,
          actividades: [],
          totalActividades: 0,
          presupuestoTotal: 0,
          estados: {},
        }
      }

      agrupadas[proyectoId].actividades.push({
        ...actividad,
        tareasOrdenadas: [...(actividad.tareas || [])].sort((a, b) => b.id - a.id),
      })
      agrupadas[proyectoId].totalActividades++
      agrupadas[proyectoId].presupuestoTotal += Number(actividad.presupuesto || 0)

      const estado = actividad.estado
      agrupadas[proyectoId].estados[estado] = (agrupadas[proyectoId].estados[estado] || 0) + 1
    })

    return Object.values(agrupadas).sort((a, b) => b.totalActividades - a.totalActividades)
  })
  //Actividades por Responsable
  const actividadesPorResponsable = computed(() => {
    const actividades = actividadesFiltradas.value || []
    const agrupadas = {}

    actividades.forEach((actividad) => {
      const responsableId = actividad.responsable || 'sin_responsable'
      const responsableNombre = actividad.responsable_info?.nombre_completo || 'Sin asignar'

      if (!agrupadas[responsableId]) {
        agrupadas[responsableId] = {
          responsableId,
          responsableNombre,
          responsableUsername: actividad.responsable_info?.username || '',
          actividades: [],
          totalActividades: 0,
          presupuestoTotal: 0,
          estados: {},
          proyectos: new Set(),
        }
      }

      agrupadas[responsableId].actividades.push({
        ...actividad,
        tareasOrdenadas: [...(actividad.tareas || [])].sort((a, b) => b.id - a.id),
      })
      agrupadas[responsableId].totalActividades++
      agrupadas[responsableId].presupuestoTotal += Number(actividad.presupuesto || 0)

      const estado = actividad.estado
      agrupadas[responsableId].estados[estado] = (agrupadas[responsableId].estados[estado] || 0) + 1

      if (actividad.proyecto) {
        agrupadas[responsableId].proyectos.add(actividad.proyecto)
      }
    })

    return Object.values(agrupadas).map((grupo) => ({
      ...grupo,
      proyectos: Array.from(grupo.proyectos),
    }))
  })

  //Proyectos disponibles
  const proyectosDisponibles = computed(() => {
    const proyectos = new Map()
    const actividades = actividadesFiltradas.value || []

    actividades.forEach((actividad) => {
      const proyectoId = actividad.proyecto
      if (proyectoId && !proyectos.has(proyectoId)) {
        proyectos.set(proyectoId, {
          id: proyectoId,
          nombre: actividad.proyecto_nombre || `Proyecto ${proyectoId}`,
          totalActividades: 0,
        })
      }
      if (proyectoId) {
        proyectos.get(proyectoId).totalActividades++
      }
    })

    return Array.from(proyectos.values()).sort((a, b) => b.totalActividades - a.totalActividades)
  })

  //Responsables disponibles
  const responsablesDisponibles = computed(() => {
    const responsables = new Map()
    const actividades = actividadesFiltradas.value || []

    actividades.forEach((actividad) => {
      const responsableId = actividad.responsable
      const responsableNombre = actividad.responsable_info?.nombre_completo || 'Sin asignar'

      if (!responsables.has(responsableId)) {
        responsables.set(responsableId, {
          id: responsableId,
          nombre: responsableNombre,
          username: actividad.responsable_info?.username || '',
          totalActividades: 0,
        })
      }
      if (responsables.has(responsableId)) {
        responsables.get(responsableId).totalActividades++
      }
    })

    return Array.from(responsables.values()).sort((a, b) => b.totalActividades - a.totalActividades)
  })

  //FUNCIONES: Acciones de agrupación
  function cambiarAgrupacion(tipo) {
    agrupacionActual.value = tipo
    if (tipo === 'ninguna') {
      proyectoSeleccionado.value = null
      responsableSeleccionado.value = null
    }
  }

  function filtrarPorProyecto(proyectoId) {
    proyectoSeleccionado.value = proyectoId
    agrupacionActual.value = 'proyecto'
  }

  function filtrarPorResponsable(responsableId) {
    responsableSeleccionado.value = responsableId
    agrupacionActual.value = 'responsable'
  }

  const cargarCatalogoProyectos = async () => {
    try {
      const respuesta = await proyectoServicios.listaProyectosHabilitadosResumen()
      // proyectosCatalogo.value = respuesta.results || respuesta.data || respuesta
      proyectosCatalogo.value = respuesta.proyectos
      console.log('Catálogo de proyectos cargado:', proyectosCatalogo.value)
    } catch (error) {
      console.error('Error al cargar catálogo de proyectos:', error)
    }
  }

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
    //Proyectos habilitados
    listaIdsProyectosHabilitados,
    //Validaciones
    misValidaciones,
    //Getters
    actividadesFiltradasTotales,
    //Estados y getters de agrupacion
    agrupacionActual,
    proyectoSeleccionado,
    responsableSeleccionado,
    actividadesPorProyecto,
    actividadesPorResponsable,
    proyectosDisponibles,
    responsablesDisponibles,
    proyectosCatalogo,
    //Funciones
    cargarActividadesTareas,
    cargarActividadesPeiTareas,
    cargarListaActividadesGeneral,
    cargarActividadesPeiTareasPorIdPei,
    cargarListaIdsProyectosHabilitados,
    //Acciones de agrupacion
    cambiarAgrupacion,
    filtrarPorProyecto,
    filtrarPorResponsable,
    cargarCatalogoProyectos,
  }
})
