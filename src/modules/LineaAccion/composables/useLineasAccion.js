//Composable: useLineasAccion.js
//Composable para cargar lineas de accion en un select

// useLineasAccion.js
import { ref, onMounted, computed } from 'vue'
import { lineaAccionServicios } from '../services/lineaAccionService'

export function useLineasAccion(options = {}) {
  // Opciones configurables
  const { cargarAutomaticamente = true, valorInicial = null, filtros = {} } = options

  // Estado reactivo
  const lineas = ref([])
  const lineaSeleccionada = ref(valorInicial)
  const loading = ref(false)
  const error = ref(null)

  // Obtener todas las líneas de acción
  const obtenerLineas = async () => {
    try {
      loading.value = true
      error.value = null
      const data = await lineaAccionServicios.obtenerTodo()
      lineas.value = data.map((linea) => ({
        value: linea.id,
        label: linea.codigo + linea.titulo,
        data: linea, // Guardamos toda la información por si se necesita
      }))
      return lineas.value
    } catch (err) {
      error.value = err
      console.error('Error en useLineasAccion:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Obtener una línea específica por ID
  const obtenerLinea = async (id) => {
    try {
      loading.value = true
      const data = await lineaAccionServicios.obtenerPorId(id)
      return data
    } catch (err) {
      error.value = err
      console.error('Error al obtener línea:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Crear nueva línea de acción
  const crearLinea = async (lineaData) => {
    try {
      loading.value = true
      const nuevaLinea = await lineaAccionServicios.crear(lineaData)
      await obtenerLineas() // Recargamos la lista
      return nuevaLinea
    } catch (err) {
      error.value = err
      console.error('Error al crear línea:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Actualizar línea existente
  const actualizarLinea = async (id, lineaData) => {
    try {
      loading.value = true
      const lineaActualizada = await lineaAccionServicios.actualizar(id, lineaData)
      await obtenerLineas() // Recargamos la lista
      return lineaActualizada
    } catch (err) {
      error.value = err
      console.error('Error al actualizar línea:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Eliminar línea
  const eliminarLinea = async (id) => {
    try {
      loading.value = true
      const resultado = await lineaAccionServicios.eliminar(id)
      await obtenerLineas() // Recargamos la lista
      return resultado
    } catch (err) {
      error.value = err
      console.error('Error al eliminar línea:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Filtrar líneas (opcional)
  const lineasFiltradas = computed(() => {
    if (!filtros.nombre) return lineas.value
    return lineas.value.filter((linea) =>
      linea.label.toLowerCase().includes(filtros.nombre.toLowerCase()),
    )
  })

  // Carga inicial automática
  onMounted(async () => {
    if (cargarAutomaticamente) {
      await obtenerLineas()
    }
  })

  return {
    // Estado
    lineas,
    lineaSeleccionada,
    loading,
    error,
    lineasFiltradas,

    // Métodos
    obtenerLineas,
    obtenerLinea,
    crearLinea,
    actualizarLinea,
    eliminarLinea,

    // Helpers
    reset: () => {
      lineaSeleccionada.value = valorInicial
      error.value = null
    },
  }
}
