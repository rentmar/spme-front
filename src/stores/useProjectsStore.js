import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUserPermissions } from './useUserPermissions'

export const useProjectsStore = defineStore('projects-acceso', () => {
  // ========== STATE ==========
  const proyectos = ref([])
  const proyectoActual = ref(null)
  const isLoading = ref(false)
  const error = ref(null)
  const filtros = ref({
    estado: '',
    search: '',
    page: 1,
    page_size: 20,
  })

  // ========== GETTERS ==========
  const proyectosFiltrados = computed(() => {
    let filtered = [...proyectos.value]

    if (filtros.value.estado) {
      filtered = filtered.filter((p) => p.estado === filtros.value.estado)
    }

    if (filtros.value.search) {
      const searchLower = filtros.value.search.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.codigo.toLowerCase().includes(searchLower) ||
          p.titulo.toLowerCase().includes(searchLower),
      )
    }

    return filtered
  })

  const proyectosPaginados = computed(() => {
    const start = (filtros.value.page - 1) * filtros.value.page_size
    const end = start + filtros.value.page_size
    return proyectosFiltrados.value.slice(start, end)
  })

  const infoPaginacion = computed(() => ({
    pagina_actual: filtros.value.page,
    tamano_pagina: filtros.value.page_size,
    total_proyectos: proyectosFiltrados.value.length,
    total_paginas: Math.ceil(proyectosFiltrados.value.length / filtros.value.page_size),
  }))

  // ========== ACTIONS ==========
  const setProyectos = (proyectosData) => {
    proyectos.value = proyectosData
  }

  const establecerProyectoActual = (proyecto) => {
    if (typeof proyecto === 'number' || typeof proyecto === 'string') {
      proyectoActual.value = proyectos.value.find((p) => p.id == proyecto) || null
    } else {
      proyectoActual.value = proyecto
    }

    if (proyectoActual.value) {
      sessionStorage.setItem('proyectoActual', JSON.stringify(proyectoActual.value))
    }
  }

  const limpiarProyectoActual = () => {
    proyectoActual.value = null
    sessionStorage.removeItem('proyectoActual')
  }

  const aplicarFiltros = (nuevosFiltros) => {
    filtros.value = { ...filtros.value, ...nuevosFiltros, page: 1 }
  }

  const cambiarPagina = (pagina) => {
    filtros.value.page = pagina
  }

  const cargarProyectosDesdePermisos = async () => {
    const userPermissions = useUserPermissions()

    if (userPermissions.tienePermisosCargados) {
      proyectos.value = userPermissions.proyectosAccesibles
      return proyectos.value
    }

    // Si no hay permisos cargados, intentar cargarlos
    await userPermissions.cargarPermisosGlobales()
    proyectos.value = userPermissions.proyectosAccesibles
    return proyectos.value
  }

  const inicializarDesdeSession = () => {
    const storedProyecto = sessionStorage.getItem('proyectoActual')
    if (storedProyecto) {
      proyectoActual.value = JSON.parse(storedProyecto)
    }
  }

  const limpiarStore = () => {
    proyectos.value = []
    proyectoActual.value = null
    filtros.value = {
      estado: '',
      search: '',
      page: 1,
      page_size: 20,
    }
    sessionStorage.removeItem('proyectoActual')
  }

  return {
    // State
    proyectos,
    proyectoActual,
    isLoading,
    filtros,
    error,

    // Getters
    proyectosFiltrados,
    proyectosPaginados,
    infoPaginacion,

    // Actions
    setProyectos,
    establecerProyectoActual,
    limpiarProyectoActual,
    aplicarFiltros,
    cambiarPagina,
    cargarProyectosDesdePermisos,
    inicializarDesdeSession,
    limpiarStore,
  }
})
