import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUsuario } from '@/modules/usuarios/composables/useUsuario'

export const usePlanificacionStore = defineStore('planificacion', () => {
  //Estados
  const loading = ref(false)
  const error = ref(null)
  const listaUsuarios = ref([])
  const usuarioSeleccionado = ref()

  //Iniciar el composable
  const {
    usuario: usuarioComposable,
    usuarios: usuariosComposable,
    loading: usuarioLoading,
    error: usuarioError,
    obtenerUsuarios,
  } = useUsuario()

  // Getters computados
  const usuarios = computed(() => listaUsuarios.value)
  const usuario = computed(() => usuarioSeleccionado.value)
  const isLoading = computed(() => loading.value || usuarioLoading.value)

  async function cargarUsuarios() {
    loading.value = true
    error.value = null
    try {
      await obtenerUsuarios()
      listaUsuarios.value = [...usuariosComposable]
      return listaUsuarios.value
    } catch (err) {
      error.value = err.message || 'Error al cargar usuario'
      throw err
    } finally {
      loading.value = false
    }
  }
  return {
    listaUsuarios,
    loading,
    error,
    //acciones
    cargarUsuarios,
  }
})
