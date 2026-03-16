//Composable para:
//- Informe de Actividad
//- Informe de Tareas
//- Comprobar si hay Informes de una actividad por idactividad
//- Comprobar si hay informes de una tarea por su id
import { informeActividadPrinServicio } from '../services/informeActividadPrinService'
import { ref } from 'vue'
import { useSnackbar } from '@/composables/useSnackbar'
import { useRouter } from 'vue-router'

export function useInformeActividadPrincipal() {
  //Estados
  const loading = ref(false)
  const error = ref(null)
  const actividadDetallesInforme = ref(null)
  const informeActividadPrincipal = ref(null) //Informe de Actividad principal
  const informeTareaPrincipal = ref(null) //Informe de Tarea principal
  const verificando = ref(false)
  const listaInformesActividad = ref([]) //Lista de informes de actividad principal

  //Inicar el composable
  const { warningMsg } = useSnackbar()
  const router = useRouter()

  /********************************** Informe de Actividad Principal ******************************************************/
  //Obtener las tareas de una actividad(usando su id), mas sus respectivos informes
  async function obtenerDetallesActividadPorID(idactividadprin) {
    loading.value = true
    try {
      const respuesta = await informeActividadPrinServicio.infActividadPrinDetalles(idactividadprin)
      actividadDetallesInforme.value = respuesta
      return respuesta
    } catch (err) {
      console.error('error al obtener detalles de la activida: ' + idactividadprin, err)
    } finally {
      loading.value = false
    }
  }

  //Crear un informe de Actividad principal
  async function crearInformeActividadPrincipal(datosInformePrincipal) {
    loading.value = true
    try {
      const respuesta =
        await informeActividadPrinServicio.crearInformeActividadPrincipal(datosInformePrincipal)
      informeActividadPrincipal.value = respuesta
      return respuesta
    } catch (err) {
      console.error('Error al crear el informe de actividad principal', err)
    } finally {
      loading.value = false
    }
  }

  //Comprobar si una actividad tiene informes, usando su id
  async function verificarActividad(actividadId) {
    verificando.value = true
    try {
      const data =
        await informeActividadPrinServicio.comprobarInformesActividadPrincipalPorIdActividad(
          actividadId,
        )

      if (data.existe) {
        warningMsg('Ya existe un informe de actividad')
        router.push('/actividades/informe/')
        return true
      }
      return false
    } catch (error) {
      console.error('Error al verificar informes de la actividad', error)
    } finally {
      verificando.value = false
    }
  }

  //Obtener un informe de actividad por su id
  async function obtenerInformeActividadPrincipalPorId(idInformeActividadPrin) {
    loading.value = true
    try {
      const respuesta =
        await informeActividadPrinServicio.informeActividadPrincipalPorId(idInformeActividadPrin)
      informeActividadPrincipal.value = respuesta
      return respuesta
    } catch (err) {
      console.error('Error al crear el informe de actividad principal', err)
    } finally {
      loading.value = false
    }
  }

  //Listar los informes de Actividad Principal
  async function listarInformesActividadPrincipal() {
    loading.value = true
    try {
      const respuesta = await informeActividadPrinServicio.todosInformesActividadPrin()
      listaInformesActividad.value = respuesta
      return respuesta
    } catch (error) {
      console.error('Error al obtener la lista de informes de actividad principal', error)
    } finally {
      loading.value = false
    }
  }

  /*********************************Informe de Tarea Principal ********************************/
  //Crear un informe de Tarea Principal
  async function crearInformeTareaPrincipal(datosInformePrincipal) {
    loading.value = true
    try {
      const respuesta =
        await informeActividadPrinServicio.crearInformeTareaPrincipal(datosInformePrincipal)
      informeTareaPrincipal.value = respuesta
    } catch (err) {
      console.error('Error al crear el informe de tarea principal', err)
    } finally {
      loading.value = false
    }
  }

  //Obtener los informes de una tarea usando su id

  return {
    //Estado
    loading,
    error,
    actividadDetallesInforme, //Actividad con tareas e informes
    informeActividadPrincipal,
    informeTareaPrincipal,
    verificando,
    listaInformesActividad,
    //Func Informe Actividad
    obtenerDetallesActividadPorID,
    crearInformeActividadPrincipal,
    obtenerInformeActividadPrincipalPorId,
    listarInformesActividadPrincipal,
    //Func Informe Tarea
    crearInformeTareaPrincipal,
    //Comprobacion
    verificarActividad,
  }
}
