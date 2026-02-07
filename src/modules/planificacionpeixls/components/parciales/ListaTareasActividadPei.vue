<template>
  <div class="panel-info">
    <!-- Encabezado Sencillo de la Actividad -->
    <div class="panel-header">
      <div class="actividad-info">
        <div class="actividad-codigo">
          <v-icon color="primary" size="18" class="mr-2">mdi-clipboard-text-outline</v-icon>
          <strong>{{ actividad?.codigo || 'Sin código' }}</strong>
        </div>
        <div class="actividad-nombre">{{ actividad?.nombreCorto || 'Sin nombre' }}</div>
        <div class="actividad-meta">
          <span class="meta-item">
            <v-icon size="14" color="grey">mdi-calendar</v-icon>
            {{ formatDate(actividad?.fecha_inicio) }}
          </span>
          <span class="meta-item" v-if="actividad?.fecha_cierre">
            <v-icon size="14" color="grey">mdi-calendar-end</v-icon>
            {{ formatDate(actividad?.fecha_cierre) }}
          </span>
          <span class="meta-item">
            <v-icon size="14" color="green">mdi-cash</v-icon>
            {{ formatCurrency(actividad?.presupuesto) }}
          </span>
          <span>
            <ValidationPeiBar :actividad-id="actividad.id"></ValidationPeiBar>
          </span>
        </div>
      </div>
    </div>

    <!-- Barra de Herramientas de Tareas -->
    <div class="toolbar-tareas">
      <div class="toolbar-main">
        <!-- Búsqueda -->
        <div class="search-container">
          <v-text-field
            v-model="busqueda"
            placeholder="Buscar tareas..."
            density="compact"
            variant="outlined"
            hide-details
            class="search-field"
            prepend-inner-icon="mdi-magnify"
            clearable
          ></v-text-field>
        </div>

        <!-- Botones alineados horizontalmente -->
        <div class="buttons-container">
          <!-- Botón Refrescar -->
          <v-btn
            color="primary"
            variant="outlined"
            size="small"
            @click="cargarInformacion"
            class="btn-refrescar"
          >
            <v-icon left size="16">mdi-refresh</v-icon>
            Refrescar
          </v-btn>

          <!-- Botón Crear Tarea -->
          <v-btn
            color="primary"
            variant="flat"
            size="small"
            @click="abrirDialogoTarea"
            class="btn-crear"
          >
            <v-icon left size="16">mdi-plus</v-icon>
            Subactividad
          </v-btn>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading-state">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
      <p>Cargando tareas...</p>
    </div>

    <!-- Contenido Principal - Tareas -->
    <div v-else class="contenido-principal">
      <!-- Lista de Tareas -->
      <div v-if="tareasFiltradas.length > 0" class="lista-tareas">
        <div class="tareas-header">
          <div class="tareas-count">
            {{ tareasFiltradas.length }} subactividad{{ tareasFiltradas.length !== 1 ? 'es' : '' }}
          </div>
        </div>
        <div class="tareas-container">
          <div
            v-for="tarea in tareasFiltradas"
            :key="tarea.id"
            class="tarea-item"
            :class="`tarea-${tarea.estado?.toLowerCase() || 'pen'}`"
          >
            <div class="tarea-content">
              <div class="tarea-header">
                <div class="tarea-estado">
                  <v-icon :color="getTareaEstadoColor(tarea.estado)" size="16" class="mr-2">
                    {{ getTareaEstadoIcon(tarea.estado) }}
                  </v-icon>
                </div>
                <div class="tarea-info">
                  <div class="tarea-titulo">{{ tarea.titulo || 'Sin título' }}</div>
                  <div class="tarea-codigo">{{ tarea.codigo }}</div>
                </div>
                <div class="tarea-acciones">
                  <v-menu location="bottom">
                    <template #activator="{ props }">
                      <v-btn v-bind="props" icon size="x-small" variant="text" class="btn-accion">
                        <v-icon size="16">mdi-dots-vertical</v-icon>
                      </v-btn>
                    </template>
                    <v-list density="compact">
                      <v-list-item @click="editarTarea(tarea)">
                        <template #prepend>
                          <v-icon size="16">mdi-pencil</v-icon>
                        </template>
                        <v-list-item-title>Editar</v-list-item-title>
                      </v-list-item>
                      <!-- <v-list-item @click="cambiarEstadoTarea(tarea)">
                        <template #prepend>
                          <v-icon size="16">mdi-sync</v-icon>
                        </template>
                        <v-list-item-title>Cambiar Estado</v-list-item-title>
                      </v-list-item> -->
                      <v-divider></v-divider>
                      <v-list-item @click="eliminarTarea(tarea)" color="error">
                        <template #prepend>
                          <v-icon size="16" color="error">mdi-delete</v-icon>
                        </template>
                        <v-list-item-title>Eliminar</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </div>
              </div>

              <div class="tarea-detalles">
                <div class="tarea-meta" v-if="tarea.descripcion">
                  <span class="descripcion">{{ truncateText(tarea.descripcion, 80) }}</span>
                </div>
                <div>
                  <ValidationTareaPeiBar
                    :actividad-id="actividad.id"
                    :tarea-id="tarea.id"
                  ></ValidationTareaPeiBar>
                </div>
                <div class="tarea-footer">
                  <div class="tarea-fechas">
                    <span v-if="tarea.fecha_limite" class="fecha">
                      <v-icon size="12" class="mr-1">mdi-calendar-clock</v-icon>
                      Vence: {{ formatDate(tarea.fecha_limite) }}
                    </span>
                    <span v-if="tarea.fecha_creacion" class="fecha">
                      <v-icon size="12" class="mr-1">mdi-calendar-plus</v-icon>
                      Creada: {{ formatDate(tarea.fecha_creacion) }}
                    </span>
                  </div>
                  <div class="tarea-presupuesto" v-if="tarea.presupuesto">
                    <v-chip size="x-small" variant="outlined" color="green">
                      {{ formatCurrency(tarea.presupuesto) }}
                    </v-chip>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Estado Vacío -->
      <div v-else class="estado-vacio">
        <div class="vacio-content">
          <v-icon size="48" color="grey-lighten-2" class="mb-3">mdi-format-list-bulleted</v-icon>
          <p class="vacio-texto">
            {{ busqueda ? 'No se encontraron tareas' : 'No hay tareas registradas' }}
          </p>
          <p class="vacio-subtexto" v-if="!busqueda">
            Comienza agregando la primera subactividad a esta actividad
          </p>
          <v-btn
            color="primary"
            variant="outlined"
            size="small"
            @click="abrirDialogoTarea"
            class="btn-vacio"
          >
            <v-icon left size="16">mdi-plus</v-icon>
            Crear Primera Subactividad
          </v-btn>
        </div>
      </div>
    </div>

    <!-- Diálogo para agregar/editar tarea -->
    <DialogTareaPei
      v-model="mostrarDialogo"
      :actividad="actividad"
      :tarea="tareaSeleccionada"
      @guardar="manejarGuardarTarea"
      @cancelar="cerrarDialogo"
    />

    <!-- Snackbar para mensajes -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
      {{ snackbar.message }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.show = false">Cerrar</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import DialogTareaPei from './DialogTareaPei.vue'
import { useInformeActividadPeiStore } from '@/modules/formularios/store/useInformeActividadPeiStore'
import { peiServicios } from '@/modules/pei/services/peiService'
//Barras de validacion
import ValidationPeiBar from '@/modules/formularios/components/ValidationPeiBar.vue'
import ValidationTareaPeiBar from '@/modules/formularios/components/ValidationTareaPeiBar.vue'

const props = defineProps({
  actividad: {
    type: Object,
    required: true,
  },
})

// Iniciar el store
const storeInfActividad = useInformeActividadPeiStore()

// Estados locales
const busqueda = ref('')
const mostrarDialogo = ref(false)
const tareaSeleccionada = ref(null)

// Usar variable local para tareas para actualización inmediata
const tareasLocales = ref([])

// Snackbar
const snackbar = ref({
  show: false,
  message: '',
  color: 'success',
})

// Método de carga mejorado
const cargarInformacion = async () => {
  if (!props.actividad?.id) {
    console.warn('⚠️ No hay ID de actividad')
    return
  }

  console.log('🔄 Cargando información para actividad ID:', props.actividad.id)

  try {
    await storeInfActividad.cargarActividadPeiPorId(props.actividad.id)

    // Actualizar tareas locales con datos del store
    tareasLocales.value = [...(storeInfActividad.tareas || [])]

    console.log('✅ Carga completada:', {
      actividad: storeInfActividad.actividad,
      cantidadTareas: tareasLocales.value.length,
    })
  } catch (err) {
    console.error('❌ Error al cargar la actividad:', err)
    mostrarMensaje('Error al cargar las tareas', 'error')
  }
}

// Usar tareas locales en lugar de las del store directamente
const tareas = computed(() => tareasLocales.value)

const isLoading = computed(() => storeInfActividad.loading)

const tareasFiltradas = computed(() => {
  let filtered = tareas.value

  // Filtrar solo por búsqueda (sin filtro de estado)
  if (busqueda.value) {
    const searchLower = busqueda.value.toLowerCase()
    filtered = filtered.filter(
      (tarea) =>
        tarea.titulo?.toLowerCase().includes(searchLower) ||
        tarea.codigo?.toLowerCase().includes(searchLower) ||
        (tarea.descripcion && tarea.descripcion.toLowerCase().includes(searchLower)),
    )
  }

  return filtered
})

// Watcher mejorado
watch(
  () => props.actividad?.id,
  (nuevoId, viejoId) => {
    if (nuevoId && nuevoId !== viejoId) {
      cargarInformacion()
    }
  },
  { immediate: true },
)

// Métodos del ciclo de vida
onMounted(() => {
  // Cargar si no se ha cargado aún
  if (
    props.actividad?.id &&
    (!storeInfActividad.actividad || storeInfActividad.actividad.id !== props.actividad.id)
  ) {
    cargarInformacion()
  }
})

// Métodos de tareas
const abrirDialogoTarea = () => {
  tareaSeleccionada.value = null
  mostrarDialogo.value = true
}

const editarTarea = (tarea) => {
  tareaSeleccionada.value = { ...tarea }
  mostrarDialogo.value = true
}

const cerrarDialogo = () => {
  mostrarDialogo.value = false
  tareaSeleccionada.value = null
}

const manejarGuardarTarea = async (payload) => {
  try {
    if (tareaSeleccionada.value) {
      // Actualizar tarea existente
      const tareaActualizada = await peiServicios.updateTareaPei(payload.id, payload)

      // Actualizar inmediatamente en el array local
      const index = tareasLocales.value.findIndex((t) => t.id === payload.id)
      if (index !== -1) {
        tareasLocales.value[index] = { ...tareasLocales.value[index], ...tareaActualizada }
      }

      mostrarMensaje('Subactividad actualizada correctamente', 'success')
    } else {
      // Crear nueva tarea
      const nuevaTarea = await peiServicios.crearTareaPei(payload)

      // Agregar inmediatamente al array local
      tareasLocales.value.unshift(nuevaTarea)

      mostrarMensaje('Subactividad creada correctamente', 'success')
    }
    cerrarDialogo()
  } catch (error) {
    console.error('Error al guardar subactividad:', error)
    mostrarMensaje('Error al guardar la subactividad', 'error')
  }
}

const eliminarTarea = async (tarea) => {
  if (!confirm(`¿Estás seguro de eliminar la subactividad "${tarea.titulo}"?`)) {
    return
  }

  try {
    //Eliminar en el servidor
    await peiServicios.delTareaPei(tarea.id)

    //Eliminar localmente
    tareasLocales.value = tareasLocales.value.filter((t) => t.id !== tarea.id)
  } catch (err) {
    console.error('Error al eliminar la subactivida', err)
    mostrarMensaje('Error al eliminar la subactividad', 'error')
    cargarInformacion()
  }
}

// Helper methods para tareas
const getTareaEstadoColor = (estado) => {
  const colores = {
    PEN: 'orange',
    EPROG: 'blue',
    COMPL: 'green',
  }
  return colores[estado] || 'grey'
}

const getTareaEstadoIcon = (estado) => {
  const iconos = {
    PEN: 'mdi-clock-outline',
    EPROG: 'mdi-progress-clock',
    COMPL: 'mdi-check-circle-outline',
  }
  return iconos[estado] || 'mdi-help-circle-outline'
}

const formatCurrency = (value) => {
  if (!value) return '$0.00'
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(value)
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES')
  } catch {
    return 'Fecha inválida'
  }
}

const truncateText = (text, maxLength) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

const mostrarMensaje = (mensaje, color = 'success') => {
  snackbar.value = {
    show: true,
    message: mensaje,
    color: color,
  }
}

// También puedes agregar una función para forzar recarga si es necesario
const recargarDatos = async () => {
  await cargarInformacion()
}

// Exponer funciones si es necesario
defineExpose({
  recargarDatos,
  tareas: tareasLocales,
})
</script>

<style scoped>
.panel-info {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: white;
  min-height: 500px; /* Altura mínima del panel completo */
}

/* Encabezado de la actividad */
.panel-header {
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
  background: #f8f9fa;
  flex-shrink: 0;
}

.actividad-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.actividad-codigo {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #0078d4;
}

.actividad-nombre {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  line-height: 1.3;
}

.actividad-meta {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #666;
}

/* Barra de herramientas */
.toolbar-tareas {
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
  background: white;
  flex-shrink: 0;
}

.toolbar-main {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Búsqueda */
.search-container {
  width: 100%;
}

.search-field {
  width: 100%;
}

/* Contenedor de botones - alineados horizontalmente */
.buttons-container {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  width: 100%;
}

.btn-refrescar,
.btn-crear {
  white-space: nowrap;
  min-width: auto;
}

/* Estado de carga */
.loading-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #666;
  min-height: 300px;
}

.loading-state p {
  margin-top: 16px;
  font-size: 14px;
}

/* CONTENIDO PRINCIPAL - ALTURA FIJA */
.contenido-principal {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 400px; /* Altura mínima garantizada */
  height: 60vh; /* 60% del viewport height */
  max-height: 700px; /* Altura máxima */
  overflow: hidden;
}

/* Lista de tareas */
.lista-tareas {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

/* Header de tareas */
.tareas-header {
  padding: 12px 16px;
  border-bottom: 1px solid #e0e0e0;
  background: #fafafa;
  flex-shrink: 0;
}

.tareas-count {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

/* CONTENEDOR DE TAREAS CON SCROLL */
.tareas-container {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
  min-height: 0;
  padding: 0;
}

.tarea-item {
  border-bottom: 1px solid #f0f0f0;
  padding: 16px;
  transition: background-color 0.2s;
  min-height: 90px; /* Altura mínima por tarea */
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.tarea-item:hover {
  background-color: #f8f9fa;
}

.tarea-item:last-child {
  border-bottom: none;
}

.tarea-pen {
  border-left: 3px solid #ff9800;
}

.tarea-eprog {
  border-left: 3px solid #2196f3;
}

.tarea-compl {
  border-left: 3px solid #4caf50;
  opacity: 0.8;
}

.tarea-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tarea-header {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.tarea-estado {
  display: flex;
  align-items: center;
  margin-top: 2px;
}

.tarea-info {
  flex: 1;
  min-width: 0;
}

.tarea-titulo {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  line-height: 1.3;
  margin-bottom: 2px;
}

.tarea-codigo {
  font-size: 11px;
  color: #666;
  font-family: monospace;
}

.tarea-acciones {
  display: flex;
  align-items: center;
}

.btn-accion {
  color: #666;
}

.btn-accion:hover {
  color: #0078d4;
}

.tarea-detalles {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.tarea-meta .descripcion {
  font-size: 12px;
  color: #666;
  line-height: 1.4;
}

.tarea-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.tarea-fechas {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.fecha {
  display: flex;
  align-items: center;
  font-size: 11px;
  color: #888;
}

.tarea-presupuesto {
  display: flex;
  align-items: center;
}

/* Estado vacío */
.estado-vacio {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  min-height: 300px;
}

.vacio-content {
  text-align: center;
  max-width: 300px;
}

.vacio-texto {
  font-size: 16px;
  color: #666;
  margin-bottom: 8px;
  font-weight: 500;
}

.vacio-subtexto {
  font-size: 14px;
  color: #888;
  margin-bottom: 16px;
}

.btn-vacio {
  margin-top: 8px;
}

/* Scrollbar personalizado */
.tareas-container::-webkit-scrollbar {
  width: 8px;
}

.tareas-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.tareas-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.tareas-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Responsive */
@media (max-width: 768px) {
  .buttons-container {
    justify-content: space-between;
  }

  .contenido-principal {
    height: 50vh; /* Menor altura en móviles */
    max-height: 500px;
  }

  .actividad-meta {
    flex-direction: column;
    gap: 8px;
  }

  .tarea-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .tarea-fechas {
    flex-direction: column;
    gap: 4px;
  }

  .tarea-item {
    padding: 12px;
    min-height: 100px; /* Más altura en móvil para mejor legibilidad */
  }
}

/* Para pantallas muy grandes */
@media (min-height: 900px) {
  .contenido-principal {
    height: 65vh;
    max-height: 800px;
  }
}

/* Para pantallas pequeñas */
@media (max-height: 600px) {
  .contenido-principal {
    height: 50vh;
    max-height: 400px;
  }
}
</style>
