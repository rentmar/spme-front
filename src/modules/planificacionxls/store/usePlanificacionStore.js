import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUsuario } from '@/modules/usuarios/composables/useUsuario'
import { useActividad } from '@/modules/proyecto/composables/useActividad'

export const usePlanificacionStore = defineStore('planificacion', () => {
  // Estados del store
  const loading = ref(true)
  const error = ref(false)
  const listaActividades = ref([])
  const listaUsuariosCompleta = ref([])

  // Iniciar el composable
  const { usuarios, obtenerUsuarios } = useUsuario()
  const { actividades, cargarActividadesPorIdProyecto } = useActividad()

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

  // Función para actualizar manualmente el dropdown si es necesario
  function actualizarDropdownUsuarios() {
    // Esta función fuerza la actualización del computed
    // Al cambiar listaUsuariosCompleta, usernamesParaDropdown se actualiza automáticamente
    console.log('Usuarios disponibles para dropdown:', usernamesParaDropdown.value)
  }

  return {
    loading,
    error,
    tableData,
    listaActividades,
    listaUsuariosCompleta,
    usernamesParaDropdown, // Exportar por si se necesita acceder directamente
    obtenerListaUsuarios,
    actualizarDropdownUsuarios,
    listaActividadesProyecto,
  }
})
