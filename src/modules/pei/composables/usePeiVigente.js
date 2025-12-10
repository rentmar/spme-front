//Composable PEI Vigente
import { ref } from 'vue'
import { peiVigenteServicio } from '../services/peiVigenteService'

//Estados
const loading = ref(null)
const error = ref(null)
const peiVigente = ref(null)
const peiActividades = ref([])

export function usePeiVigente() {
  async function cargarPeiVigente() {
    loading.value = true
    try {
      const respuesta = await peiVigenteServicio.peiVigente()
      peiVigente.value = respuesta
    } catch (err) {
      console.error('Error al cargar el pei vigente PEI', err)
      error.value = err
    } finally {
      loading.value = false
    }
  }

  return {
    //Estados
    loading,
    error,
    peiVigente,
    peiActividades,
    //Func
    cargarPeiVigente,
  }
}
