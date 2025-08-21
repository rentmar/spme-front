import { defineStore } from 'pinia'
import { ref } from 'vue'
import { actividadServicios } from '@/modules/proyecto/services/actividadService'
import { usuarioServicios } from '@/modules/usuarios/services/usuariosService'
import { tipoActividadServicio } from '@/modules/proyecto/services/tipoActividadService'
// Importar Handsontable para registrar tipos de celda

export const usePlanificacionStore = defineStore('planificacion', () => {
  // Estados básicos
  const loading = ref({ general: false })
  const actividades = ref([])
  const usuarios = ref([])
  const tiposActividad = ref([])
  const actividadesEliminadas = ref([])
  const tablaData = ref([])

  // Configuración de columnas CORREGIDA
  const columnConfig = ref([
    { data: 'id', title: 'ID', readOnly: true, width: 60 },
    { data: 'nombre', title: 'Nombre', width: 200 },
    { data: 'descripcion', title: 'Descripción', width: 250 },
    {
      data: 'usuario_id',
      title: 'Usuario',
      width: 150,
      editor: 'dropdown',
      renderer: 'dropdown',
      source: () => usuarios.value.map((u) => u.nombre),
    },
    {
      data: 'tipo_actividad_id',
      title: 'Tipo Actividad',
      width: 150,
      editor: 'dropdown',
      renderer: 'dropdown',
      source: () => tiposActividad.value.map((t) => t.nombre),
    },
    {
      data: 'fecha_inicio',
      title: 'Inicio',
      type: 'date',
      dateFormat: 'YYYY-MM-DD',
      width: 100,
    },
    {
      data: 'fecha_fin',
      title: 'Fin',
      type: 'date',
      dateFormat: 'YYYY-MM-DD',
      width: 100,
    },
    { data: 'duracion', title: 'Duración', type: 'numeric', width: 80 },
    { data: 'progreso', title: 'Progreso', type: 'numeric', width: 80 },
    {
      data: 'prioridad',
      title: 'Prioridad',
      width: 100,
      editor: 'dropdown',
      renderer: 'dropdown',
      source: ['alta', 'media', 'baja'],
    },
  ])

  // Función única para cargar todo
  async function cargarTodo(proyectoId) {
    loading.value.general = true
    try {
      // Cargar todo en paralelo
      const [actividadesData, usuariosData, tiposData] = await Promise.all([
        actividadServicios.allPorIdProyecto(proyectoId),
        usuarioServicios.all(),
        tipoActividadServicio.all(),
      ])

      // Guardar datos
      actividades.value = actividadesData || []
      usuarios.value = usuariosData || []
      tiposActividad.value = tiposData || []

      // Transformar datos para la tabla
      tablaData.value = transformarActividadesParaTabla(actividadesData)
    } catch (error) {
      console.error('Error cargando datos:', error)
      // Limpiar datos en caso de error
      actividades.value = []
      usuarios.value = []
      tiposActividad.value = []
      tablaData.value = []
      throw error
    } finally {
      loading.value.general = false
    }
  }

  // Función para transformar actividades al formato de tabla
  function transformarActividadesParaTabla(actividadesLista) {
    if (!actividadesLista) return []

    return actividadesLista.map((actividad) => ({
      id: actividad.id,
      nombre: actividad.nombre,
      descripcion: actividad.descripcion || '',
      usuario_id: actividad.usuario_id || null,
      tipo_actividad_id: actividad.tipo_actividad_id || null,
      fecha_inicio: actividad.fecha_inicio || '',
      fecha_fin: actividad.fecha_fin || '',
      duracion: actividad.duracion || 0,
      progreso: actividad.progreso || 0,
      prioridad: actividad.prioridad || 'media',
    }))
  }

  async function restaurarActividad(index) {
    // Implementación de restaurar actividad
    const actividad = actividadesEliminadas.value[index]
    if (actividad) {
      actividadesEliminadas.value.splice(index, 1)
      tablaData.value.push(actividad)
    }
  }

  return {
    loading,
    tablaData,
    columnConfig,
    actividadesEliminadas,
    cargarTodo,
    restaurarActividad,
    isLoading: (key) => loading.value[key] || false,
  }
})
