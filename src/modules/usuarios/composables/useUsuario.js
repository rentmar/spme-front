//Composable useUsuario
import { ref } from 'vue'
import { usuarioServicios } from '../services/usuariosService'
//Estados
const loading = ref(false)
const error = ref(null)
const usuarios = ref([])
const usuario = ref(null)

export function useUsuario() {
  //Datos de usuario por nick
  async function informacionUsuarioPorNick(usuarioNick) {
    loading.value = true
    try {
      const respuesta = await usuarioServicios.usuarioDatosPorNick(usuarioNick)
      usuario.value = respuesta
      return respuesta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  return {
    loading, //ref
    error, //ref
    usuarios, //ref lista de kpis
    usuario, //ref un kpi por id
    informacionUsuarioPorNick, //func
  }
}
