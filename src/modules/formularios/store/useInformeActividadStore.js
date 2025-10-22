import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useActividad } from '@/modules/proyecto/composables/useActividad'
import { useInformeActividad } from '../composables/useInformeActividad'

export const useInformeActividadStore = defineStore('informe-actividad', () => {
  //Estados
  const loading = ref(false)
  const error = ref(null)

  //Variables de estado
  const actividadDetalles = ref() //La totalidad de informacion de la rest api
  const actividad = ref() //Contiene la informacion de la actividad
  const tareas = ref([]) //Contiene la informacion de las tareas
  const listaAcvidadSubActividadInformes = ref([]) //Contiene la lista de informes de actividad y subactividades
  const listaInformeActividad = ref([]) //Lista de informes de una actividad
  const listaInformeTareas = ref([]) //Lista de informes de una tarea
  const listaInformes = ref([]) //Lista conjunta de los informes

  //Iniciar composables
  const { actividadInfo, obtenerActidadPorId } = useActividad() //manejo de actividades
  const {
    informeActividadMinRespuesta,
    listaInformeActividadSubactividadMin,
    crearInformeActividadMin,
    listarInformeActividadSubactividadMinPorId,
  } = useInformeActividad()

  //Cargar la actividad y desestructurar en los estados
  async function cargarActividadPorId(idactividad) {
    loading.value = true
    try {
      //Cargar la informacion detallada usando el composable
      await obtenerActidadPorId(idactividad)
      //La respuesta completa
      actividadDetalles.value = actividadInfo.value

      // Desestructurar la respuesta en las variables específicas
      if (actividadInfo.value) {
        // Extraer la información principal de la actividad (excluyendo tareas)
        const { tareas: tareasData, ...actividadData } = actividadInfo.value
        actividad.value = actividadData
        tareas.value = tareasData || []
      }
    } catch (err) {
      console.error('Error al cargar la tarea', err)
      error.value = err
    } finally {
      loading.value = false
    }
  }

  //Cargar los informes de actividad y desestructurar los datos
  async function cargarInformesActividadPorId(idactividad) {
    loading.value = true
    try {
      //Cargar los informes usando el composable
      await listarInformeActividadSubactividadMinPorId(idactividad)

      // Desestructurar la respuesta y almacenar en las variables correspondientes
      if (listaInformeActividadSubactividadMin.value) {
        listaAcvidadSubActividadInformes.value = listaInformeActividadSubactividadMin.value
        const respuesta = listaInformeActividadSubactividadMin.value
        // Almacenar informes de actividad
        listaInformeActividad.value = respuesta.informes_actividad || []
        // Almacenar informes de tareas (extraer todos los informes_tarea de todas las tareas)
        const todosInformesTareas = []
        if (respuesta.tareas_con_todos_informes) {
          respuesta.tareas_con_todos_informes.forEach((tarea) => {
            if (tarea.informes_tarea && tarea.informes_tarea.length > 0) {
              todosInformesTareas.push(...tarea.informes_tarea)
            }
          })
        }
        listaInformeTareas.value = todosInformesTareas

        // Combinar ambos tipos de informes en listaInformes
        listaInformes.value = [...listaInformeActividad.value, ...listaInformeTareas.value]
      }
    } catch (err) {
      console.error('Error al cargar los informes de la actividad con id: ' + idactividad, err)
      error.value = err
    } finally {
      loading.value = false
    }
  }

  return {
    //Estados
    loading,
    error,
    actividadDetalles,
    actividad,
    tareas,
    listaAcvidadSubActividadInformes,
    listaInformeActividad,
    listaInformeTareas,
    listaInformes,
    //Funciones
    cargarActividadPorId,
    cargarInformesActividadPorId,
  }
})
