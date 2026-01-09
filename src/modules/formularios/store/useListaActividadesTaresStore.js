import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useActividad } from '@/modules/proyecto/composables/useActividad'
export const useListaActividadesTareasStore = defineStore('lista-actividades-tareas', () => {
  //Estados
  const loading = ref(false)
  const error = ref(null)

  //Actividades y tareas
  const actividadesFromApi = ref([])
  const actividadesProyectos = ref([])
  const actividadesPei = ref([])

  //Iniciar Composables
  const { actividadesTareas, actividadTarea, actividadesTareasPei, actividadTareaPei } =
    useActividad()

  //Cargar la informacion
  const cargarActividadesConTareas = async () => {
    loading.value = true
    try {
      await actividadesTareas()
      await actividadesTareasPei()
      console.log('actividadTarea: ', actividadTarea.value)
      console.log('actividadTareaPei: ', actividadTareaPei.value)
      actividadesProyectos.value = actividadTarea.value
      actividadesPei.value = actividadTareaPei.value
      actualizarActividadesFromApi()
    } catch (err) {
      console.error('No se pudo cargar las actividades con tareas', err)
    } finally {
      loading.value = false
    }
  }

  //Actualizar la informacion Actividades
  const actualizarActividadesFromApi = () => {
    // Crear un nuevo array combinando ambas fuentes
    actividadesFromApi.value = [...actividadesProyectos.value, ...actividadesPei.value]

    console.log('Actividades combinadas:', actividadesFromApi.value)
    console.log(`Total de actividades: ${actividadesFromApi.value.length}`)
    console.log(`De proyectos: ${actividadesProyectos.value.length}`)
    console.log(`De PEI: ${actividadesPei.value.length}`)
  }

  return {
    //Estados
    loading,
    error,
    actividadesFromApi,
    actividadesProyectos,
    actividadesPei,
    //func
    cargarActividadesConTareas,
  }
})
