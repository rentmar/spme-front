// src/modules/listaActividadesSolicitudes/composables/useRendiciones.js
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { useUserPermissions } from '@/stores/useUserPermissions'
import { listaRendicionesServicio } from '../services/listaRendicionesService'
import { proyectoServicios } from '@/modules/proyecto/services/proyectoService'
//filtros
import { filtrarPorProyectosHabilitados, filtrarPorRol } from '../utils'

export function useRendiciones() {
  //Inicializacion del store
  const userStore = useUserStore() //store de usuarios
  const usuarioPermisosStore = useUserPermissions() //store de permisos para el usuario

  //Estados de carga
  const loadingRendiciones = ref(false)
  const loading = ref(false)
  const error = ref(null)
  const todasLasActividades = ref([])
  const emptyResponse = ref(false)
  const listaIdsProyectosHabilitados = ref([]) //todos los proyectos habilitados

  // Paginación manual
  const paginaActual = ref(1)
  const pageSize = ref(10)

  // Filtros de UI
  const searchQuery = ref('')
  const statusFilters = ref([])

  // ─── FILTRO POR ROL (TEMPORAL) ───
  // function filtrarPorRol(lista) {
  //   if (!userStore.rol) return lista
  //   switch (userStore.rol) {
  //     case 'coordinador':
  //       return lista.filter((a) => a.proyecto?.coordinacion_id === userStore.coordinacionId)
  //     case 'responsable':
  //       return lista.filter((a) => a.responsable?.id === userStore.userId)
  //     case 'administrador':
  //     default:
  //       return lista
  //   }
  // }

  // ─── FILTROS LOCALES ───
  function filtrarLocal(lista) {
    let resultado = [...lista]
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      resultado = resultado.filter(
        (a) => a.codigo?.toLowerCase().includes(q) || a.nombre_corto?.toLowerCase().includes(q),
      )
    }
    if (statusFilters.value.length > 0) {
      resultado = resultado.filter((a) => statusFilters.value.includes(a.estado))
    }
    return resultado
  }

  //Carga inicial
  async function cargarTodas() {
    loadingRendiciones.value = true
    try {
      const [_, data] = await Promise.all([
        cargarListaIdsProyectosHabilitados(),
        listaRendicionesServicio.obtenerActividades({
          page: 1,
          page_size: 9999,
        }),
      ])
      //Acceder al store para el acceso de proyecto
      const proyectosAccesiblesIds = usuarioPermisosStore.proyectosAccesiblesIds || []

      if (data.success) {
        //Filtrar por proyectos habilitados
        const habilitadas = filtrarPorProyectosHabilitados(
          data.results,
          listaIdsProyectosHabilitados.value,
        )
        //Filtro por Rol
        const porRol = filtrarPorRol(
          habilitadas,
          userStore.userData,
          userStore.rol,
          proyectosAccesiblesIds,
        )
        todasLasActividades.value = porRol
        paginaActual.value = 1
        emptyResponse.value = porRol.length === 0
      }
    } catch (err) {
      console.error('Error al cargar rendiciones ', err)
      todasLasActividades.value = []
      emptyResponse.value = true
      throw err
    } finally {
      loadingRendiciones.value = false
    }
  }
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

  // ─── DATOS ───
  const actividadesFiltradas = computed(() => filtrarLocal(todasLasActividades.value))

  const actividades = computed(() => {
    const inicio = (paginaActual.value - 1) * pageSize.value
    return actividadesFiltradas.value.slice(inicio, inicio + pageSize.value)
  })

  const totalItems = computed(() => actividadesFiltradas.value.length)
  const totalPaginas = computed(() => Math.ceil(totalItems.value / pageSize.value))

  // ─── ACCIONES DE UI ───
  function buscar(query) {
    searchQuery.value = query || ''
    paginaActual.value = 1
  }

  function filtrarPorEstado(estados) {
    statusFilters.value = estados || []
    paginaActual.value = 1
  }

  function cambiarPagina(pagina) {
    paginaActual.value = pagina
  }

  // ─── COMPUTADAS ───
  const conteoEstados = computed(() => {
    const conteo = {}
    actividadesFiltradas.value.forEach((a) => {
      conteo[a.estado] = (conteo[a.estado] || 0) + 1
    })
    return [
      {
        texto: 'Planificación',
        color: 'info',
        icono: 'mdi-calendar-check-outline',
        conteo: conteo['PLAN'] || 0,
      },
      {
        texto: 'Reprogramación',
        color: 'warning',
        icono: 'mdi-calendar-refresh',
        conteo: conteo['REPROG'] || 0,
      },
      {
        texto: 'En Ejecución',
        color: 'success',
        icono: 'mdi-calendar-arrow-right',
        conteo: conteo['EJEC'] || 0,
      },
      {
        texto: 'En Reporte',
        color: 'primary',
        icono: 'mdi-file-document-edit',
        conteo: conteo['REP'] || 0,
      },
      {
        texto: 'Finalizado',
        color: 'green-darken-2',
        icono: 'mdi-calendar-check',
        conteo: conteo['FIN'] || 0,
      },
    ]
  })

  const presupuestoTotal = computed(() =>
    actividadesFiltradas.value.reduce((s, a) => s + (Number(a.presupuesto) || 0), 0),
  )

  const solicitudesPendientes = computed(() => {
    let total = 0
    actividadesFiltradas.value.forEach((a) => {
      const b = a.badges?.rendiciones
      if (b) total += (b.pendientes || 0) + (b.borradores || 0)
    })
    return total
  })

  return {
    //Estados
    loadingRendiciones,
    error,
    actividades,
    todasLasActividades,
    paginaActual,
    pageSize,
    totalPaginas,
    searchQuery,
    statusFilters,
    totalItems,
    conteoEstados,
    presupuestoTotal,
    solicitudesPendientes,
    //func
    cargarTodas,
    buscar,
    filtrarPorEstado,
    cambiarPagina,
  }
}
