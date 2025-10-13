<template>
  <div
    v-if="actividadData && visible"
    ref="popupElement"
    class="floating-popup compact-popup"
    :class="{ dragging: isDragging }"
    :style="popupStyle"
  >
    <!-- Header arrastrable -->
    <div class="popup-header draggable-handle" @mousedown="startDrag">
      <div class="header-content">
        <v-icon color="white" size="16">mdi-clipboard-list-outline</v-icon>
        <span class="popup-title">
          {{ actividadData?.codigo }}
        </span>
        <span class="activity-name">
          {{ actividadData?.nombreCorto }}
        </span>
      </div>

      <div class="header-actions">
        <!-- Botón para cambiar posición -->
        <v-btn
          icon
          variant="text"
          color="white"
          size="x-small"
          @click="cambiarPosicion"
          class="action-btn"
          title="Cambiar posición"
        >
          <v-icon size="16">mdi-arrow-all</v-icon>
        </v-btn>

        <v-btn
          icon
          variant="text"
          color="white"
          size="x-small"
          @click="cerrar"
          class="action-btn"
          title="Cerrar"
        >
          <v-icon size="16">mdi-close</v-icon>
        </v-btn>
      </div>
    </div>

    <!-- Contenido compacto -->
    <div class="popup-content compact-content">
      <!-- Información compacta de la actividad -->
      <div class="info-compact">
        <div class="info-row-compact">
          <div class="info-item">
            <v-icon size="14" color="primary">mdi-account</v-icon>
            <span class="info-text">{{ actividadData?.responsable || 'Sin responsable' }}</span>
          </div>
          <div class="info-item">
            <v-icon size="14" color="primary">mdi-cash</v-icon>
            <span class="info-text">{{ formatCurrency(actividadData?.presupuesto) }}</span>
          </div>
        </div>
        <div class="info-row-compact">
          <div class="info-item">
            <v-icon size="14" color="primary">mdi-calendar-start</v-icon>
            <span class="info-text">{{ formatDateShort(actividadData?.fecha_inicio) }}</span>
          </div>
          <div class="info-item">
            <v-icon size="14" color="primary">mdi-calendar-end</v-icon>
            <span class="info-text">{{ formatDateShort(actividadData?.fecha_cierre) }}</span>
          </div>
        </div>
      </div>

      <!-- Lista compacta de tareas -->
      <div class="tareas-section">
        <div class="tareas-header">
          <span class="tareas-title">Subactividades ({{ tareas.length }})</span>
        </div>

        <div class="tareas-list-compact">
          <div
            v-for="tarea in tareas"
            :key="tarea.id"
            class="tarea-item-compact"
            :class="`estado-${tarea.estado.toLowerCase()}`"
          >
            <div class="tarea-main-compact">
              <div class="tarea-header-compact">
                <v-chip
                  :color="getColorEstado(tarea.estado)"
                  size="x-small"
                  class="estado-chip-compact"
                >
                  {{ getTextoEstadoCorto(tarea.estado) }}
                </v-chip>
                <div class="tarea-codigo-compact">{{ tarea.codigo }}</div>
              </div>

              <div class="tarea-titulo-compact">{{ tarea.titulo }}</div>

              <div class="tarea-details-compact">
                <div class="tarea-detail-compact">
                  <v-icon size="12" color="grey">mdi-calendar</v-icon>
                  <span>{{ formatDateShort(tarea.fecha_limite) }}</span>
                </div>
                <div class="tarea-detail-compact">
                  <v-icon size="12" color="grey">mdi-cash</v-icon>
                  <span>{{ formatCurrencyShort(tarea.presupuesto) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Estado vacío -->
          <div v-if="tareas.length === 0" class="empty-state-compact">
            <v-icon size="32" color="grey-lighten-2">mdi-clipboard-off-outline</v-icon>
            <div class="empty-text-compact">No hay Subactividades</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useInformeActividadStore } from '@/modules/formularios/store/useInformeActividadStore'

// Props
const props = defineProps({
  actividadData: {
    type: Object,
    required: true,
  },
})

// Emits
const emit = defineEmits(['update:actividadData', 'cerrar'])

// Store
const storeInfActividad = useInformeActividadStore()

// Referencias
const popupElement = ref(null)

// Estado del popup
const visible = ref(false)
const isDragging = ref(false)
const dragOffset = ref({ x: 0, y: 0 })

// ================================
// VARIABLES PARA AJUSTAR POSICIÓN
// ================================

// 1. POSICIÓN INICIAL POR DEFECTO - Cambia estos valores:
const POSICION_INICIAL_DEFAULT = { x: 100, y: 100 }

// 2. TAMAÑO DEL POPUP - Ajusta según necesites:
const POPUP_WIDTH = 380
const POPUP_HEIGHT = 450

// 3. MARGENES MÍNIMOS - Distancia mínima de los bordes:
const MARGIN_MIN = 20

// 4. POSICIÓN ACTUAL
const popupPosition = ref({ ...POSICION_INICIAL_DEFAULT })
const indicePosicion = ref(0)

// 5. POSICIONES PREDEFINIDAS - Modifica estas coordenadas:
const posicionesPredefinidas = [
  // Esquina superior izquierda
  { x: MARGIN_MIN, y: MARGIN_MIN },
  // Esquina superior derecha
  { x: window.innerWidth - POPUP_WIDTH - MARGIN_MIN, y: MARGIN_MIN },
  // Esquina inferior izquierda
  { x: MARGIN_MIN, y: window.innerHeight - POPUP_HEIGHT - MARGIN_MIN },
  // Esquina inferior derecha
  {
    x: window.innerWidth - POPUP_WIDTH - MARGIN_MIN,
    y: window.innerHeight - POPUP_HEIGHT - MARGIN_MIN,
  },
  // Centro izquierda
  { x: MARGIN_MIN, y: (window.innerHeight - POPUP_HEIGHT) / 2 },
  // Centro derecha
  { x: window.innerWidth - POPUP_WIDTH - MARGIN_MIN, y: (window.innerHeight - POPUP_HEIGHT) / 2 },
  // Centro arriba
  { x: (window.innerWidth - POPUP_WIDTH) / 2, y: MARGIN_MIN },
  // Centro abajo
  { x: (window.innerWidth - POPUP_WIDTH) / 2, y: window.innerHeight - POPUP_HEIGHT - MARGIN_MIN },
]

// Datos para tareas
const tareas = ref([])
const isLoading = ref(false)

// Computed
const popupStyle = computed(() => ({
  left: `${popupPosition.value.x}px`,
  top: `${popupPosition.value.y}px`,
  transform: `translate(${isDragging.value ? '-50% -50%' : '0'})`,
}))

// Métodos de utilidad
const formatCurrency = (value) => {
  if (!value) return '$0.00'
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(value)
}

const formatCurrencyShort = (value) => {
  if (!value) return '$0'
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`
  }
  return `$${value}`
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES')
  } catch {
    return 'N/A'
  }
}

const formatDateShort = (dateString) => {
  if (!dateString) return '-'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      month: '2-digit',
      day: '2-digit',
    })
  } catch {
    return '-'
  }
}

const getColorEstado = (estado) => {
  const colores = {
    PEN: 'orange',
    EPROG: 'blue',
    COMPL: 'green',
  }
  return colores[estado] || 'grey'
}

const getTextoEstadoCorto = (estado) => {
  const textos = {
    PEN: 'Pend',
    EPROG: 'Prog',
    COMPL: 'Comp',
  }
  return textos[estado] || estado
}

// Cambiar a la siguiente posición
const cambiarPosicion = () => {
  indicePosicion.value = (indicePosicion.value + 1) % posicionesPredefinidas.length
  const nuevaPosicion = posicionesPredefinidas[indicePosicion.value]

  // Asegurar que no se salga de la pantalla
  const maxX = window.innerWidth - POPUP_WIDTH
  const maxY = window.innerHeight - POPUP_HEIGHT

  popupPosition.value = {
    x: Math.max(MARGIN_MIN, Math.min(nuevaPosicion.x, maxX)),
    y: Math.max(MARGIN_MIN, Math.min(nuevaPosicion.y, maxY)),
  }
}

// Calcular posición inicial
const calcularPosicionInicial = () => {
  // Si ya hay una posición guardada (de un popup anterior), mantenerla
  // Si no, usar la posición por defecto
  return popupPosition.value.x !== POSICION_INICIAL_DEFAULT.x ||
    popupPosition.value.y !== POSICION_INICIAL_DEFAULT.y
    ? { ...popupPosition.value } // Mantener posición actual
    : { ...POSICION_INICIAL_DEFAULT } // Usar posición por defecto
}

// Cargar tareas desde el store
const cargarTareas = async (actividad) => {
  if (!actividad) {
    tareas.value = []
    return
  }

  try {
    await storeInfActividad.cargarActividadPorId(actividad.id)
    // CORREGIDO: Acceso correcto a las tareas del store
    tareas.value = storeInfActividad.tareas || []
  } catch (error) {
    console.error('Error al cargar tareas:', error)
    tareas.value = []
  }
}

// Métodos de interacción
const cerrar = () => {
  visible.value = false
  // NO resetear la posición aquí
  setTimeout(() => {
    emit('update:actividadData', null)
    emit('cerrar')
  }, 300)
}

// Funcionalidad de arrastre
const startDrag = (e) => {
  if (e.target.closest('.action-btn')) return

  isDragging.value = true
  const rect = popupElement.value.getBoundingClientRect()
  dragOffset.value = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  }

  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
}

const onDrag = (e) => {
  if (!isDragging.value) return

  const newX = e.clientX - dragOffset.value.x
  const newY = e.clientY - dragOffset.value.y

  const maxX = window.innerWidth - POPUP_WIDTH
  const maxY = window.innerHeight - POPUP_HEIGHT

  // Actualiza la posición permanentemente
  popupPosition.value = {
    x: Math.max(0, Math.min(newX, maxX)),
    y: Math.max(0, Math.min(newY, maxY)),
  }
}

const stopDrag = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}

// Watcher para cargar tareas cuando cambia la actividad
watch(
  () => props.actividadData,
  (newActividad, oldActividad) => {
    if (newActividad && newActividad !== oldActividad) {
      console.log('Actividad seleccionada:', newActividad)
      visible.value = true
      cargarTareas(newActividad)

      // Solo calcular nueva posición si es un popup nuevo
      nextTick(() => {
        // Solo resetear posición si es una actividad diferente
        if (!oldActividad || oldActividad.id !== newActividad.id) {
          popupPosition.value = calcularPosicionInicial()
        }
        // Si es la misma actividad, mantener la posición actual
      })
    } else if (!newActividad && oldActividad) {
      // Si se limpia la actividad, cerrar el popup pero mantener posición
      visible.value = false
    }
  },
  { immediate: true },
)

// Carga de datos al montar
onMounted(() => {
  if (props.actividadData) {
    cargarDatos()
  }
})

const cargarDatos = async () => {
  isLoading.value = true
  try {
    await cargarTareas(props.actividadData)
  } catch (err) {
    console.error('Error al cargar datos:', err)
  } finally {
    isLoading.value = false
  }
}

// Limpiar eventos
onUnmounted(() => {
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
})
</script>

<style scoped>
.floating-popup {
  position: fixed;
  width: 380px;
  max-width: 90vw;
  background: white;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid #e0e0e0;
  z-index: 10000;
  overflow: hidden;
  font-size: 0.8rem;
  transition: all 0.3s ease;
}

.floating-popup:hover {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
}

.floating-popup.dragging {
  cursor: grabbing;
  user-select: none;
}

.popup-header {
  background: linear-gradient(135deg, #1976d2, #1565c0);
  color: white;
  padding: 10px 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: move;
  user-select: none;
}

.popup-header:active {
  cursor: grabbing;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

.popup-title {
  font-weight: 600;
  font-size: 0.9rem;
  white-space: nowrap;
}

.activity-name {
  font-size: 0.8rem;
  opacity: 0.9;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  margin-left: 6px;
}

.header-actions {
  display: flex;
  gap: 4px;
  margin-left: 10px;
}

.action-btn {
  min-width: 28px !important;
  width: 28px;
  height: 28px;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: scale(1.1);
}

.compact-content {
  max-height: 60vh;
  overflow-y: auto;
  padding: 0;
}

/* Información compacta */
.info-compact {
  padding: 12px 14px;
  background: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
}

.info-row-compact {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.info-row-compact:last-child {
  margin-bottom: 0;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
}

.info-text {
  font-size: 0.8rem;
  color: #424242;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Sección de tareas */
.tareas-section {
  padding: 0;
}

.tareas-header {
  padding: 10px 14px;
  background: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
}

.tareas-title {
  font-weight: 600;
  font-size: 0.85rem;
  color: #1976d2;
}

/* Lista compacta de tareas */
.tareas-list-compact {
  display: flex;
  flex-direction: column;
  max-height: 350px;
  overflow-y: auto;
}

.tarea-item-compact {
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s ease;
}

.tarea-item-compact:hover {
  background: #f8f9fa;
}

.tarea-item-compact:last-child {
  border-bottom: none;
}

.tarea-item-compact.estado-pen {
  border-left: 3px solid #ff9800;
}

.tarea-item-compact.estado-eprog {
  border-left: 3px solid #2196f3;
}

.tarea-item-compact.estado-compl {
  border-left: 3px solid #4caf50;
}

.tarea-main-compact {
  padding: 10px 14px;
}

.tarea-header-compact {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
  gap: 8px;
}

.estado-chip-compact {
  font-size: 0.65rem !important;
  height: 20px !important;
  min-width: 50px !important;
}

.tarea-codigo-compact {
  font-weight: 600;
  color: #1976d2;
  font-size: 0.75rem;
  white-space: nowrap;
}

.tarea-titulo-compact {
  font-weight: 500;
  color: #424242;
  line-height: 1.3;
  font-size: 0.8rem;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tarea-details-compact {
  display: flex;
  gap: 16px;
}

.tarea-detail-compact {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.7rem;
  color: #757575;
}

/* Estado vacío compacto */
.empty-state-compact {
  text-align: center;
  padding: 40px 20px;
  color: #9e9e9e;
}

.empty-text-compact {
  margin: 12px 0;
  font-size: 0.85rem;
}

/* Scroll personalizado */
.tareas-list-compact::-webkit-scrollbar {
  width: 6px;
}

.tareas-list-compact::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.tareas-list-compact::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.tareas-list-compact::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Responsive */
@media (max-width: 480px) {
  .floating-popup {
    width: 95vw;
    left: 2.5vw !important;
    right: 2.5vw;
  }

  .info-row-compact {
    flex-direction: column;
    gap: 6px;
  }

  .tarea-details-compact {
    flex-direction: column;
    gap: 6px;
  }
}
</style>
