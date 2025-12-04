import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { useUserPermissions } from '@/stores/useUserPermissions'

export const useProjectsAccessStore = defineStore('projectsAccess', () => {
  //Estados
  const proyectos = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  //Stores
  const userStore = useUserStore()

  /******************* ACCIONES **************************/
  //Cargar proyectos con acceso segun el tipo de usuario
  const cargarProyectosConAcceso = async () => {
    isLoading.value = true
    try {
      console.log('Cargar proyecto')
    } catch (err) {
      console.log('Error al cargar los ')
    }
  }

  //Cargar todos los proyectos
  const cargarTodosLosProyectos = async () => {}

  //Cargar Proyectos accesibles, para usuarios normales
  const cargarProyectosAccesibles = async () => {}

  //Verificar si se puede editar un proyecto
  const puedeEditarProyecto = () => {}

  //Verifica si se puede administrar un proyecto
  const puedeAdministrarProyecto = (proyectoId) => {}

  //Verifica si se puede eliminar un proyecto
  const puedeEliminarProyecto = (proyectoId) => {}

  //Verifica si puede crear un proyecto
  const puedeCrearProyecto = computed(() => {
    //Solo el admin puede crear proyectos
    return 0
  })

  //Limpiar los proyectos
  const limpiarProyectos = () => {
    proyectos.value = []
    error.value = null
  }

  return {
    // Estado
    proyectos,
    isLoading,
    error,

    // Getters
    puedeCrearProyecto,

    // Acciones
    cargarProyectosConAcceso,
    cargarTodosLosProyectos,
    cargarProyectosAccesibles,
    puedeEditarProyecto,
    puedeAdministrarProyecto,
    puedeEliminarProyecto,
    limpiarProyectos,
  }
})
