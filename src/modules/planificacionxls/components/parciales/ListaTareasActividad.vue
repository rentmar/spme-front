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
            <ValidationBar :actividad-id="actividad.id"></ValidationBar>
          </span>
        </div>
      </div>
    </div>

    <!-- Barra de Herramientas de Tareas - LAYOUT AJUSTADO -->
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

        <!-- Botones en línea -->
        <div class="botones-container">
          <!-- Botón Refrescar -->
          <v-btn
            color="grey-darken-1"
            variant="outlined"
            size="small"
            @click="refrescarDialogo"
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
                      <v-list-item @click="cambiarEstadoTarea(tarea)">
                        <template #prepend>
                          <v-icon size="16">mdi-sync</v-icon>
                        </template>
                        <v-list-item-title>Cambiar Estado</v-list-item-title>
                      </v-list-item>
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
                  <ValidationBar :actividad-id="actividad.id"></ValidationBar>
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
    <DialogTarea
      v-model="mostrarDialogo"
      :actividad="actividad"
      :tarea="tareaSeleccionada"
      @guardar="manejarGuardarTarea"
      @cancelar="cerrarDialogo"
    />

    <!-- 🔥 DIALOG PARA CAMBIAR ESTADO -->
    <v-dialog v-model="mostrarDialogoEstado" max-width="350">
      <v-card>
        <v-card-text class="pa-4">
          <!-- Título -->
          <div class="text-h6 text-center mb-3">Cambiar Estado</div>

          <!-- Tarea -->
          <div class="text-body-1 text-center mb-4">
            <strong>"{{ tareaParaCambioEstado?.titulo }}"</strong>
          </div>

          <!-- Estado actual -->
          <div class="text-center mb-3">
            <div class="text-caption text-grey mb-1">Estado actual</div>
            <v-chip :color="getTareaEstadoColor(tareaParaCambioEstado?.estado)" size="large">
              <v-icon start>{{ getTareaEstadoIcon(tareaParaCambioEstado?.estado) }}</v-icon>
              {{ getTareaEstadoTexto(tareaParaCambioEstado?.estado) }}
            </v-chip>
          </div>

          <!-- Selector de nuevo estado -->
          <div class="text-center mb-4">
            <div class="text-caption text-grey mb-2">Seleccionar nuevo estado</div>
            <v-select
              v-model="estadoSeleccionado"
              :items="estadosTarea"
              item-title="text"
              item-value="value"
              density="compact"
              variant="outlined"
              hide-details
              class="estado-selector"
            >
              <template v-slot:selection="{ item }">
                <v-chip :color="getTareaEstadoColor(item.value)" size="small">
                  <v-icon start size="14">{{ getTareaEstadoIcon(item.value) }}</v-icon>
                  {{ item.title }}
                </v-chip>
              </template>
            </v-select>
          </div>

          <!-- Botones -->
          <div class="d-flex justify-space-between">
            <v-btn variant="text" @click="cancelarCambioEstado" :disabled="cambiandoEstado">
              Cancelar
            </v-btn>
            <v-btn
              :color="getTareaEstadoColor(estadoSeleccionado)"
              @click="confirmarCambioEstado"
              :loading="cambiandoEstado"
              :disabled="
                !estadoSeleccionado || estadoSeleccionado === tareaParaCambioEstado?.estado
              "
            >
              <v-icon start>{{ getTareaEstadoIcon(estadoSeleccionado) }}</v-icon>
              Cambiar
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Snackbar para mensajes -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
      {{ snackbar.message }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.show = false">Cerrar</v-btn>
      </template>
    </v-snackbar>

    <ConfirmDialog></ConfirmDialog>
  </div>
  <!-- {{ actividad }} -->
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import DialogTarea from '@/modules/actividades/components/DialogTarea.vue'
import { useInformeActividadStore } from '@/modules/formularios/store/useInformeActividadStore'
import { useTareaSubactividad } from '@/modules/proyecto/composables/useTareaSubactividad'
import { useConfirmDialog } from '@/composables/useConfirmDialog'
import ConfirmDialog from '@/components/layout/partials/ConfirmDialog.vue'
import ValidationBar from '@/modules/formularios/components/ValidationBar.vue'

const props = defineProps({
  actividad: {
    type: Object,
    required: true,
  },
})

// Iniciar el store
const storeInfActividad = useInformeActividadStore()

// Iniciar el composable
const { crearUnaTarea, actualizarUnaTarea, eliminarUnaTarea } = useTareaSubactividad()
const { openConfirmDialog } = useConfirmDialog()

// Estados locales
const busqueda = ref('')
const mostrarDialogo = ref(false)
const tareaSeleccionada = ref(null)

// 🔥 ESTADOS PARA DIALOG DE CAMBIO DE ESTADO
const mostrarDialogoEstado = ref(false)
const tareaParaCambioEstado = ref(null)
const estadoSeleccionado = ref('')
const cambiandoEstado = ref(false)

// 🔥 DEFINIR ESTADOS DE TAREA
const estadosTarea = [
  { text: 'Pendiente', value: 'PEN' },
  { text: 'En Progreso', value: 'EPROG' },
  { text: 'Completada', value: 'COMPL' },
]

// Snackbar
const snackbar = ref({
  show: false,
  message: '',
  color: 'success',
})

// 🔥 FUNCIÓN PARA ABRIR DIALOG DE CAMBIO DE ESTADO
const cambiarEstadoTarea = (tarea) => {
  console.log('🔄 Abriendo cambio de estado para:', tarea.titulo)

  tareaParaCambioEstado.value = tarea
  estadoSeleccionado.value = tarea.estado // Inicializar con estado actual
  mostrarDialogoEstado.value = true
}

// 🔥 FUNCIÓN PARA CONFIRMAR CAMBIO DE ESTADO
const confirmarCambioEstado = async () => {
  if (!tareaParaCambioEstado.value || !estadoSeleccionado.value) {
    mostrarDialogoEstado.value = false
    return
  }

  // Verificar si el estado cambió
  if (estadoSeleccionado.value === tareaParaCambioEstado.value.estado) {
    mostrarMensaje('El estado seleccionado es el mismo', 'info')
    mostrarDialogoEstado.value = false
    return
  }

  cambiandoEstado.value = true

  try {
    // Mostrar mensaje de proceso
    mostrarMensaje('Cambiando estado...', 'info')

    // Preparar datos para actualizar
    const datosActualizacion = {
      ...tareaParaCambioEstado.value,
      estado: estadoSeleccionado.value,
      fecha_actualizacion: new Date().toISOString(),
    }

    console.log('🔄 Actualizando estado:', {
      tareaId: tareaParaCambioEstado.value.id,
      titulo: tareaParaCambioEstado.value.titulo,
      estadoAnterior: tareaParaCambioEstado.value.estado,
      estadoNuevo: estadoSeleccionado.value,
    })

    // Actualizar en la API
    await actualizarUnaTarea(tareaParaCambioEstado.value.id, datosActualizacion)

    // Recargar información
    await cargarInformacion()

    // Mostrar mensaje final
    const estadoNuevo = estadosTarea.find((e) => e.value === estadoSeleccionado.value)
    mostrarMensaje(
      `✅ Estado cambiado a ${estadoNuevo?.text || estadoSeleccionado.value}`,
      'success',
    )
  } catch (error) {
    console.error('❌ Error al cambiar estado:', error)
    mostrarMensaje('Error al cambiar estado', 'error')
  } finally {
    // Limpiar estados
    cambiandoEstado.value = false
    mostrarDialogoEstado.value = false
    tareaParaCambioEstado.value = null
    estadoSeleccionado.value = ''
  }
}

// 🔥 FUNCIÓN PARA CANCELAR CAMBIO DE ESTADO
const cancelarCambioEstado = () => {
  console.log('⏹️ Cambio de estado cancelado')
  mostrarDialogoEstado.value = false
  tareaParaCambioEstado.value = null
  estadoSeleccionado.value = ''
}

// Método de carga mejorado
const cargarInformacion = async () => {
  if (!props.actividad?.id) {
    console.warn('⚠️ No hay ID de actividad')
    return
  }

  console.log('🔄 Cargando información para actividad ID:', props.actividad.id)

  try {
    await storeInfActividad.cargarActividadPorId(props.actividad.id)
    console.log('✅ Carga completada:', {
      actividad: storeInfActividad.actividad,
      tareas: storeInfActividad.tareas,
      cantidadTareas: storeInfActividad.tareas?.length,
      loading: storeInfActividad.loading,
    })
  } catch (err) {
    console.error('❌ Error al cargar la actividad:', err)
    mostrarMensaje('Error al cargar las tareas', 'error')
  }
}

// Computed properties
const tareas = computed(() => {
  const tareasStore = storeInfActividad.tareas || []
  return tareasStore
})

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
  console.log('Subactividad: ', payload)
  try {
    if (tareaSeleccionada.value) {
      console.log('Id de actividad: ', payload.id)
      await actualizarUnaTarea(payload.id, payload)
      mostrarMensaje('Subactividad actualizada correctamente', 'success')
      await cargarInformacion()
    } else {
      await crearUnaTarea(payload)
      mostrarMensaje('Subactividad creada correctamente', 'success')
      await cargarInformacion()
    }
    cerrarDialogo()
  } catch (error) {
    console.error('Error al guardar subactividad:', error)
    mostrarMensaje('Error al guardar la subactividad', 'error')
  }
}

const refrescarDialogo = async () => {
  try {
    await cargarInformacion()
    mostrarMensaje('Tareas Actualizadas')
  } catch (err) {
    console.error('Lista refrescada', err)
  }
}

const eliminarTarea = async (tarea) => {
  console.log('TAREA: ', tarea)
  try {
    console.log('Iniciar')
    const confirmado = await openConfirmDialog({
      title: 'Eliminar subactividad',
      message: `¿Estás seguro de eliminar "${tarea.titulo}"?`,
      confirmLabel: 'Sí, eliminar',
      cancelLabel: 'Cancelar',
      type: 'delete',
    })

    if (!confirmado) {
      console.log('Eliminación cancelada')
      return
    }

    mostrarMensaje('Eliminando subactividad ...', 'info')
    await eliminarUnaTarea(tarea.id)

    await cargarInformacion()
    mostrarMensaje('Subactividad eliminada correctamente', 'success')
  } catch (error) {
    console.error('Error al eliminar subactividad:', error)
    mostrarMensaje('Error al eliminar la subactividad', 'error')
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

const getTareaEstadoTexto = (estado) => {
  const textos = {
    PEN: 'Pendiente',
    EPROG: 'En Progreso',
    COMPL: 'Completada',
  }
  return textos[estado] || estado
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

/* 🔥 BARRA DE HERRAMIENTAS - LAYOUT AJUSTADO */
.toolbar-tareas {
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
  background: white;
  flex-shrink: 0;
}

.toolbar-main {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Contenedor de búsqueda */
.search-container {
  display: flex;
  align-items: center;
}

.search-field {
  flex: 1;
  min-width: 0;
}

/* 🔥 CONTENEDOR DE BOTONES EN LÍNEA */
.botones-container {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
}

.btn-refrescar,
.btn-crear {
  white-space: nowrap;
  min-width: auto;
}

.btn-refrescar {
  border-color: #e0e0e0;
  color: #666;
}

.btn-crear {
  background-color: #1976d2;
  color: white;
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

/* 🔥 ESTILOS PARA EL DIALOG DE ESTADO */
.estado-selector {
  max-width: 200px;
  margin: 0 auto;
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

/* 🔥 RESPONSIVE - LAYOUT AJUSTADO */
@media (max-width: 768px) {
  .contenido-principal {
    height: 50vh; /* Menor altura en móviles */
    max-height: 500px;
  }

  .search-field {
    width: 100%;
  }

  .botones-container {
    flex-direction: column;
    width: 100%;
    gap: 8px;
  }

  .btn-refrescar,
  .btn-crear {
    width: 100%;
    justify-content: center;
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

  .estado-selector {
    max-width: 180px;
  }
}

/* Para pantallas más grandes (tablets) */
@media (min-width: 769px) and (max-width: 1024px) {
  .botones-container {
    gap: 8px;
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
