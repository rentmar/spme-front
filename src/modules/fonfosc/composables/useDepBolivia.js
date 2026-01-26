//Composable useNotificaciones.js
import { ref } from 'vue'
import { depBolServicios } from '../services/depBolService'
//Estados
const loading = ref(false)
const error = ref(null)
const departamentosLista = ref([])

export function useDepBolivia() {
  /******************** CRUD BASICO******************************/
  //Cargar todas las intstituciones
  async function cargarDepartamentosBolivia() {
    loading.value = true
    try {
      const respuesta = await depBolServicios.depboltodos()
      departamentosLista.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  return {
    //Estados
    loading,
    error,
    departamentosLista,
    //func
    cargarDepartamentosBolivia,
  }
}
