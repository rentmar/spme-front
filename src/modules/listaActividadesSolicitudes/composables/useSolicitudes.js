import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { listaSolicitudesServicio } from '@/modules/listaActividadesSolicitudes/services/listaSolicitudesService'

export function useSolicitudes() {
  const userStore = useUserStore()

  const loading = ref(false)
  const emptyResponse = ref(false)
  const actividades = ref([]) // Todas las actividades (ya filtradas por rol)

  // Paginación manual (frontend)
  const paginaActual = ref(1)
  const pageSize = ref(10)

  // Filtros de UI
  const searchQuery = ref('')
  const statusFilters = ref([])

  // ─── FILTRO POR ROL (TEMPORAL) ───
  function filtrarPorRol(lista) {
    if (!userStore.rol) return lista
    switch (userStore.rol) {
      case 'coordinador':
        return lista.filter((a) => a.proyecto?.coordinacion_id === userStore.coordinacionId)
      case 'responsable':
        return lista.filter((a) => a.responsable?.id === userStore.userId)
      case 'administrador':
      default:
        return lista
    }
  }

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

  // ─── CARGA INICIAL ───
  async function cargarTodas() {
    loading.value = true
    try {
      // Traer todas las actividades
      const data = await listaSolicitudesServicio.obtenerActividades({
        page: 1,
        page_size: 9999,
      })

      if (data.success) {
        // 1. Filtrar por rol
        const porRol = filtrarPorRol(data.results)
        // 2. Guardar todo
        todasLasActividades.value = porRol
        paginaActual.value = 1
        emptyResponse.value = porRol.length === 0
      }
    } catch (error) {
      console.error('Error al cargar actividades:', error)
      todasLasActividades.value = []
      emptyResponse.value = true
    } finally {
      loading.value = false
    }
  }

  // ─── DATOS ───
  const todasLasActividades = ref([])

  // Actividades filtradas (búsqueda + estado)
  const actividadesFiltradas = computed(() => filtrarLocal(todasLasActividades.value))

  // Actividades visibles (paginación manual)
  const actividadesVisibles = computed(() => {
    const inicio = (paginaActual.value - 1) * pageSize.value
    return actividadesFiltradas.value.slice(inicio, inicio + pageSize.value)
  })

  const totalPaginas = computed(() => Math.ceil(actividadesFiltradas.value.length / pageSize.value))

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
  const totalItems = computed(() => actividadesFiltradas.value.length)

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
      const b = a.badges
      if (b)
        Object.values(b).forEach((t) => {
          total += (t.pendientes || 0) + (t.borradores || 0)
        })
    })
    return total
  })

  return {
    loading,
    emptyResponse,
    actividades: actividadesVisibles,
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
    cargarTodas,
    buscar,
    filtrarPorEstado,
    cambiarPagina,
  }
}
