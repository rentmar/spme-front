import { defineStore } from 'pinia'
import { ref } from 'vue'
import { peiServicios } from '@/modules/pei/services/peiService'
import { useActividad } from '@/modules/proyecto/composables/useActividad'

export const useInformeActividadPeiStore = defineStore('informe-actividad-pei', () => {
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

  //Cargar la Actividad PEI y desestrucutrar en los estados
  async function cargarActividadPeiPorId(idactividad) {
    loading.value = true
    try {
      //Cargar la informacion de la actividad pei
      const respuesta = await peiServicios.cargarActividadTareaPorIdActividad(idactividad)
      //La respuesta completa
      actividadDetalles.value = respuesta
      const { tareas_pei: tareasData, ...actividadData } = respuesta
      actividad.value = actividadData
      tareas.value = tareasData
    } catch (err) {
      console.error('Error al cargar la informacion', err)
    } finally {
      loading.value = false
    }
  }

  const cargarListaInformesActividadSubactividad = async () => {}

  return {
    loading,
    error,
    actividadDetalles,
    actividad,
    tareas,
    listaAcvidadSubActividadInformes,
    listaInformeActividad,
    listaInformeTareas,
    listaInformes,
    //Func
    cargarActividadPeiPorId,
  }
})
