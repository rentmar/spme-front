//Store de permisos basico
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePermisosStore = defineStore('permisos', () => {
  //Estados
  const permisosData = ref(null)

  const cargarPermisos = async () => {
    console.log('Cargando permisos')
    return { user: { username: 'test' } }
  }

  const limpiarCache = () => {
    permisosData.value = null
  }

  return {
    permisosData,
    cargarPermisos,
    limpiarCache,
  }
})
