//Composable: useInstanciaGestora.js
//Composable para el CRUD de la Instacia Gestora
// Y el despliegue de datos de forma reactiva en selects

import { ref, computed } from 'vue'
import { instanciaGestoraServicio } from '../services/instanciaGestoraService'

//Estados
const instancias = ref([]) //Lista reactiva global
const opcionesInstanciaGestora = ref([])
const loading = ref(false)
const error = ref(false)

export function useInstanciaGestora() {
  //Obtener todas las instancias gestoras
  async function cargarInstancias() {
    loading.value = true
    try {
      instancias.value = await instanciaGestoraServicio.obtenerTodo()
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }
  //Agregar una nueva instancia
  async function agregarInstancia(data) {
    try {
      const nueva = await instanciaGestoraServicio.crear(data)
      instancias.value.push(nueva)
    } catch (err) {
      error.value = err
      throw err
    }
  }
  //Actualizar una instancia
  async function actualizarInstancia(id, data) {
    try {
      const actualizada = await instanciaGestoraServicio.actualizar(id, data)
      const index = instancias.value.findIndex((i) => i.id === id)
      if (index !== -1) instancias.value[index] = actualizada
    } catch (err) {
      error.value = err
      throw err
    }
  }
  //Eliminar una instancia
  async function eliminarInstancia(id) {
    try {
      await instanciaGestoraServicio.eliminar(id)
      instancias.value = instancias.value.filter((i) => i.id !== id)
    } catch (err) {
      error.value = err
      throw err
    }
  }

  // Función mejorada para chips
  const instanciasParaChips = computed(() => {
    return instancias.value.map((instancia) => ({
      id: instancia.id,
      text: instancia.instancia,
      codigo: instancia.codigo,
      clasificador: instancia.clasificador,
      raw: instancia,
    }))
  })

  //Funcion para obtener nombres especificos por IDs
  const getInstanciasByIds = (ids) => {
    if (!ids) return []
    const idsArray = Array.isArray(ids) ? ids : [ids]
    return instanciasParaChips.value.filter((inst) => idsArray.includes(inst.id))
  }

  //Poblar select con instancias gestoras
  const fetchOptionsInstancias = async (transformFn = (item) => item) => {
    loading.value = true
    error.value = null
    try {
      const data = await instanciaGestoraServicio.obtenerTodo()
      opcionesInstanciaGestora.value = data.map((item) => transformFn(item))
    } catch (err) {
      error.value = err.message || 'Error al cargar las opciones'
      console.error('Error fetching options:', err)
    } finally {
      loading.value = false
    }
  }

  return {
    instancias, //todas las instacias
    loading, //Bandera de carga
    error, //Error
    instanciasParaChips, // Formato listo para chips
    opcionesInstanciaGestora,
    cargarInstancias, //Funcion de carga de todas las instancias
    agregarInstancia, //Agregar nuva instancia
    actualizarInstancia, //Actualiza una instancia
    eliminarInstancia, //Elimina una instancia
    getInstanciasByIds, // Obtener nombres por IDs
    fetchOptionsInstancias,
  }
}
