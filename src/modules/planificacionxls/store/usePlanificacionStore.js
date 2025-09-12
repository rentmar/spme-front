import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUsuario } from '@/modules/usuarios/composables/useUsuario'
import { useActividad } from '@/modules/proyecto/composables/useActividad'
import { useTipoActividad } from '@/modules/proyecto/composables/useTipoActividad'

export const usePlanificacionStore = defineStore('planificacion', () => {
  // Estados del store
  const loading = ref(true)
  const error = ref(false)
  const listaActividades = ref([])
  const listaUsuariosCompleta = ref([])
  const listaTiposAct = ref([])

  // Iniciar el composable
  const { usuarios, obtenerUsuarios } = useUsuario()
  const { actividades, cargarActividadesPorIdProyecto } = useActividad()
  const { tipoDeActividades, cargarListaTiposActividades } = useTipoActividad()

  const tableData = ref([])

  // Computed para obtener usernames para el dropdown
  const usernamesParaDropdown = computed(() => {
    if (!listaUsuariosCompleta.value.length) {
      return ['Cargando usuarios...'] // Valor temporal mientras se cargan
    }

    return listaUsuariosCompleta.value
      .filter((user) => user.is_active !== false) // Solo usuarios activos
      .map((user) => user.username) // Extraer usernames
      .filter((username) => username) // Filtrar valores nulos o vacíos
      .sort() // Ordenar alfabéticamente
  })

  // Obtener la lista completa de usuarios
  async function obtenerListaUsuarios() {
    try {
      loading.value = true
      await obtenerUsuarios()
      listaUsuariosCompleta.value = usuarios.value || []
      return usuarios.value
    } catch (error) {
      console.error('Error al obtener usuarios', error)
      error.value = true
      return []
    } finally {
      loading.value = false
    }
  }

  //Obtener la lista de actividades de un proyecto
  async function listaActividadesProyecto(idproyecto) {
    try {
      loading.value = true
      await cargarActividadesPorIdProyecto(idproyecto)
      listaActividades.value = actividades.value
      tableData.value = actividades.value
    } catch (error) {
      console.error('Error al cargar actividades', error)
      error.value = true
      return []
    } finally {
      loading.value = false
    }
  }

  //Obtener la lista de Tipos de Actividad
  async function listaTiposDeActividad() {
    try {
      loading.value = true
      await cargarListaTiposActividades()
      listaTiposAct.value = tipoDeActividades.value
    } catch (error) {
      console.error(error)
      error.value = true
    } finally {
      loading.value = false
    }
  }

  // Función para actualizar manualmente el dropdown si es necesario
  function actualizarDropdownUsuarios() {
    // Esta función fuerza la actualización del computed
    // Al cambiar listaUsuariosCompleta, usernamesParaDropdown se actualiza automáticamente
    console.log('Usuarios disponibles para dropdown:', usernamesParaDropdown.value)
  }

  // NUEVO: Computed para obtener siglas de tipos de actividad
  const siglasTiposActividad = computed(() => {
    if (!listaTiposAct.value.length) {
      return tipoActividadFallback // Fallback estático
    }
    return listaTiposAct.value.map((tipo) => tipo.codigo || tipo.siglas || tipo.nombre_corto)
  })
  // NUEVO: Fallback estático por si no hay datos del store
  const tipoActividadFallback = [
    'ACAP',
    'PRIN',
    'AOP',
    'CSNS',
    'PDES',
    'AINC',
    'AART',
    'NODEF',
    'OTRO',
  ]

  // NUEVO: Función para obtener el nombre completo del tipo por siglas
  const obtenerNombreCompletoPorSiglas = (siglas) => {
    const tipo = listaTiposAct.value.find(
      (t) => t.codigo === siglas || t.siglas === siglas || t.nombre_corto === siglas,
    )
    return tipo ? tipo.nombre : siglas
  }

  return {
    loading,
    error,
    tableData,
    listaActividades,
    listaUsuariosCompleta,
    siglasTiposActividad,
    obtenerNombreCompletoPorSiglas,
    listaTiposAct,
    usernamesParaDropdown, // Exportar por si se necesita acceder directamente
    obtenerListaUsuarios,
    actualizarDropdownUsuarios,
    listaActividadesProyecto,
    listaTiposDeActividad,
  }
})
