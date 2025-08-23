<script setup>
import { ref, onMounted, computed, nextTick } from 'vue'
import { useActividad } from '@/modules/proyecto/composables/useActividad'

const { actividadesTareas, actividadTarea: actividadesFromApi } = useActividad()

// --- ESTADOS REACTIVOS ---
const actividades = ref([])
const loading = ref(true)
const emptyResponse = ref(false)
const searchQuery = ref('')
const statusFilters = ref([])
const expandedActividadId = ref(null)

// Paginación
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Diálogos y formularios de actividades
const actividadDialog = ref(false)
const actividadForm = ref({ id: null, nombreCorto: '', estado: 'PR' })
const isEditandoActividad = ref(false)
const actividadFormRef = ref(null)

// Diálogos y formularios de tareas
const tareaDialog = ref(false)
const tareaForm = ref({ id: null, titulo: '', descripcion: '', estado: 'PE' })
const actividadIdParaTarea = ref(null)
const isEditandoTarea = ref(false)
const tareaFormRef = ref(null)

// Diálogos de eliminación
const deleteActividadDialog = ref(false)
const actividadToDelete = ref(null)
const deleteTareaDialog = ref(false)
const tareaToDelete = ref(null)
const actividadIdParaEliminarTarea = ref(null)

// Notificaciones
const snackbar = ref({ show: false, text: '', color: 'success' })

// --- MÉTODOS Y COMPUTADAS ---

// Estados disponibles para actividades y tareas
const availableStatuses = [
  { text: 'Pendiente', value: 'PE' },
  { text: 'En Progreso', value: 'PR' },
  { text: 'Completada', value: 'CO' },
]

// Mapeo de estados del backend al frontend
const mapEstadoBackendToFrontend = (estadoBackend) => {
  const estadoMap = {
    CRD: 'PE', // Creada -> Pendiente
    PLAN: 'PE', // Planificada -> Pendiente
    RETR: 'PR', // Retraso -> En Progreso
    REPROG: 'PR', // Reprogramacion -> En Progreso
    EJEC: 'PR', // En Ejecucion -> En Progreso
    REP: 'PR', // En Reporte -> En Progreso
    PEN: 'PE', // Pendiente -> Pendiente
    EPROG: 'PR', // En Progreso -> En Progreso
    COMPL: 'CO', // Completada -> Completada
  }
  return estadoMap[estadoBackend] || 'PE'
}

const mapEstadoFrontendToBackend = (estadoFrontend) => {
  const estadoMap = {
    PE: 'PEN',
    PR: 'EPROG',
    CO: 'COMPL',
  };
  return estadoMap[estadoFrontend] || 'PEN';
};

const getStatusColor = (status) => {
  switch (status) {
    case 'PE':
      return 'light-blue';
    case 'PR':
      return 'orange';
    case 'CO':
      return 'green';
    default:
      return 'grey';
  }
};

const getEstadoTexto = (status) => {
  const estado = availableStatuses.find((s) => s.value === status)
  return estado ? estado.text : 'Desconocido'
}

// Carga inicial de datos
onMounted(async () => {
  await cargar()
})

const cargar = async () => {
  loading.value = true
  try {
    // Aquí simulamos la carga de datos de tu API
    // (en el código original esto se hace con useActividad)
    // Usamos el JSON que proporcionaste para el ejemplo
    const dataFromApi = [
        { "id": 1, "nombreCorto": "taller capacitacion", "estado": "PLAN", "tareas": [ { "id": 3, "titulo": "PEI 2023-2024", "descripcion": "descripcion de tarea2", "estado": "COMPL", "fecha_creacion": "2025-08-20T10:03:28.617170Z", "fecha_limite": "2025-08-20", "presupuesto": "6000.00" }, { "id": 1, "titulo": "Tarea pendiente 1", "descripcion": "Esta tarea está pendiente.", "estado": "PEN", "fecha_creacion": "2025-08-20T09:59:32.032115Z", "fecha_limite": null, "presupuesto": null } ] },
        { "id": 2, "nombreCorto": "taller capacitacion1", "estado": "REPROG", "tareas": [ { "id": 4, "titulo": "PEI 2024-2025", "descripcion": "descripcion de tarea3", "estado": "PEN", "fecha_creacion": "2025-08-20T10:04:31.884197Z", "fecha_limite": "2025-08-15", "presupuesto": "7000.00" }, { "id": 2, "titulo": "PEI 2023-2024", "descripcion": "descripcion de tarea1", "estado": "EPROG", "fecha_creacion": "2025-08-20T10:02:51.344773Z", "fecha_limite": "2025-08-03", "presupuesto": "8000.00" } ] },
        { "id": 3, "nombreCorto": "taller capacitacion2", "estado": "PLAN", "tareas": [] },
        { "id": 4, "nombreCorto": "nombre corto en actividad1", "estado": "EJEC", "tareas": [] },
        { "id": 5, "nombreCorto": "nombre corto en actividad1", "estado": "RETR", "tareas": [] }
    ];

    if (Array.isArray(dataFromApi)) {
      actividades.value = dataFromApi.map((actividad) => ({
        ...actividad,
        estadoFrontend: mapEstadoBackendToFrontend(actividad.estado),
        tareas: Array.isArray(actividad.tareas) ? actividad.tareas : [],
      }))
    } else {
      actividades.value = []
    }

    emptyResponse.value = actividades.value.length === 0
  } catch (error) {
    console.error('Error al cargar actividades:', error)
    actividades.value = []
    emptyResponse.value = true
  } finally {
    loading.value = false
  }
}

// Lógica de filtros y paginación
const filteredActividades = computed(() => {
  if (!Array.isArray(actividades.value)) return []

  let filtered = [...actividades.value]

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (actividad) => actividad.nombreCorto && actividad.nombreCorto.toLowerCase().includes(query),
    )
  }

  if (statusFilters.value.length > 0) {
    filtered = filtered.filter((actividad) =>
      statusFilters.value.includes(actividad.estadoFrontend),
    )
  }

  return filtered
})

const actividadesPaginadas = computed(() => {
  if (!Array.isArray(filteredActividades.value)) return []

  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredActividades.value.slice(start, end)
})

const actividadesConTareasFiltradas = computed(() => {
  return actividadesPaginadas.value.map(actividad => {
    if (statusFilters.value.length === 0) {
      return actividad;
    }

    const tareasFiltradas = actividad.tareas.filter(tarea => {
      const estadoFrontendTarea = mapEstadoBackendToFrontend(tarea.estado);
      return statusFilters.value.includes(estadoFrontendTarea);
    });

    return {
      ...actividad,
      tareas: tareasFiltradas
    };
  });
});

const totalPages = computed(() => {
  if (!Array.isArray(filteredActividades.value)) return 0
  return Math.ceil(filteredActividades.value.length / itemsPerPage.value)
})

const startItem = computed(() => (currentPage.value - 1) * itemsPerPage.value + 1)
const endItem = computed(() => {
  if (!Array.isArray(filteredActividades.value)) return 0
  const end = currentPage.value * itemsPerPage.value
  return end > filteredActividades.value.length ? filteredActividades.value.length : end
})

const countByStatus = (status) => {
  if (!Array.isArray(filteredActividades.value)) return 0
  return filteredActividades.value.filter((a) => a.estadoFrontend === status).length
}

const toggleExpanded = (id) => {
  expandedActividadId.value = expandedActividadId.value === id ? null : id
}

// --- CRUD ACTIVIDADES ---
const openActividadDialog = (actividad = null) => {
  isEditandoActividad.value = !!actividad
  if (isEditandoActividad.value) {
    Object.assign(actividadForm.value, {
      id: actividad.id,
      nombreCorto: actividad.nombreCorto,
      estado: actividad.estadoFrontend,
    })
  } else {
    Object.assign(actividadForm.value, { id: null, nombreCorto: '', estado: 'PR' })
  }
  actividadDialog.value = true
}

const saveActividad = async () => {
  const { valid } = await actividadFormRef.value.validate()
  if (!valid) return

  if (isEditandoActividad.value) {
    const index = actividades.value.findIndex((a) => a.id === actividadForm.value.id)
    if (index !== -1) {
      actividades.value[index].nombreCorto = actividadForm.value.nombreCorto
      actividades.value[index].estadoFrontend = actividadForm.value.estado
      snackbar.value = { show: true, text: 'Actividad editada con éxito', color: 'success' }
    }
  } else {
    const newId = Math.max(...actividades.value.map((a) => a.id), 0) + 1
    actividades.value.push({
      id: newId,
      nombreCorto: actividadForm.value.nombreCorto,
      estado: mapEstadoFrontendToBackend(actividadForm.value.estado),
      estadoFrontend: actividadForm.value.estado,
      tareas: [],
    })
    snackbar.value = { show: true, text: 'Actividad creada con éxito', color: 'success' }
  }
  actividadDialog.value = false
  await nextTick()
  actividadFormRef.value.reset()
}

const confirmDeleteActividad = (actividad) => {
  actividadToDelete.value = actividad
  deleteActividadDialog.value = true
}

const deleteActividad = () => {
  actividades.value = actividades.value.filter((a) => a.id !== actividadToDelete.value.id)
  deleteActividadDialog.value = false
  snackbar.value = { show: true, text: 'Actividad eliminada con éxito', color: 'success' }
}

// --- CRUD TAREAS ---
const openTareaDialog = (actividadId, tarea = null) => {
  isEditandoTarea.value = !!tarea
  actividadIdParaTarea.value = actividadId
  if (isEditandoTarea.value) {
    Object.assign(tareaForm.value, {
      id: tarea.id,
      titulo: tarea.titulo,
      descripcion: tarea.descripcion,
      estado: mapEstadoBackendToFrontend(tarea.estado),
    })
  } else {
    Object.assign(tareaForm.value, { id: null, titulo: '', descripcion: '', estado: 'PE' })
  }
  tareaDialog.value = true
}

// Función para guardar una nueva tarea o editar una existente
const saveTarea = async () => {
  // 1. Validar el formulario
  const { valid } = await tareaFormRef.value.validate()
  if (!valid) return

  // 2. Encontrar la actividad a la que pertenece la tarea
  const actividad = actividades.value.find((a) => a.id === actividadIdParaTarea.value)
  if (!actividad) {
    snackbar.value = { show: true, text: 'Error: Actividad no encontrada', color: 'error' };
    return;
  }

  // Lógica para editar una tarea
  if (isEditandoTarea.value) {
    const index = actividad.tareas.findIndex((t) => t.id === tareaForm.value.id)
    if (index !== -1) {
      Object.assign(actividad.tareas[index], {
        titulo: tareaForm.value.titulo,
        descripcion: tareaForm.value.descripcion,
        estado: mapEstadoFrontendToBackend(tareaForm.value.estado),
      })
      snackbar.value = { show: true, text: 'Tarea editada con éxito', color: 'success' }
    }
  } else { // Lógica para crear una nueva tarea
    // 3. Generar un nuevo ID único para la tarea
    const newId = actividad.tareas.length > 0
      ? Math.max(...actividad.tareas.map(t => t.id)) + 1
      : 1;

    // 4. Crear el nuevo objeto de tarea
    const nuevaTarea = {
      id: newId,
      titulo: tareaForm.value.titulo,
      descripcion: tareaForm.value.descripcion,
      estado: mapEstadoFrontendToBackend(tareaForm.value.estado),
      fecha_creacion: new Date().toISOString(),
      fecha_limite: null,
      presupuesto: null,
    };

    // 5. Agregar la nueva tarea al array de tareas de la actividad
    actividad.tareas.push(nuevaTarea);
    snackbar.value = { show: true, text: 'Tarea creada con éxito', color: 'success' }
  }

  // 6. Cerrar el diálogo y limpiar el formulario
  tareaDialog.value = false;
  await nextTick();
  tareaFormRef.value.reset();
}

const confirmDeleteTarea = (actividadId, tarea) => {
  actividadIdParaEliminarTarea.value = actividadId
  tareaToDelete.value = tarea
  deleteTareaDialog.value = true
}

const deleteTarea = () => {
  const actividad = actividades.value.find((a) => a.id === actividadIdParaEliminarTarea.value)
  if (actividad) {
    actividad.tareas = actividad.tareas.filter((t) => t.id !== tareaToDelete.value.id)
    snackbar.value = { show: true, text: 'Tarea eliminada con éxito', color: 'success' }
  }
  deleteTareaDialog.value = false
}
</script>
