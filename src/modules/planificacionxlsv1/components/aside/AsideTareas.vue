<!-- AsideTareas.vue -->
<template>
  <div class="aside-tareas">
    <!-- Encabezado de la Actividad -->
    <div class="aside-header">
      <div class="actividad-info">
        <div class="actividad-codigo">
          <v-icon color="primary" size="18" class="mr-2">mdi-clipboard-text-outline</v-icon>
          <strong>{{ actividad?.codigo || 'Sin código' }}</strong>
        </div>
        <div class="actividad-nombre">{{ actividad?.nombreCorto || 'Sin nombre' }}</div>
        <div class="actividad-meta">
          <span class="meta-item">
            <v-icon size="14" color="grey">mdi-calendar</v-icon>
            {{ formatearFecha(actividad?.fecha_inicio) }}
          </span>
          <span class="meta-item" v-if="actividad?.fecha_cierre">
            <v-icon size="14" color="grey">mdi-calendar-end</v-icon>
            {{ formatearFecha(actividad?.fecha_cierre) }}
          </span>
          <span class="meta-item">
            <v-icon size="14" color="green">mdi-cash</v-icon>
            {{ formatearPresupuesto(presupuestoActividad) }}
          </span>
        </div>
      </div>
    </div>

    <v-divider></v-divider>

    <!-- Barra de Herramientas - Ocultar si es nueva -->
    <div class="aside-toolbar" v-if="!actividad?.esNueva">
      <div class="toolbar-row">
        <v-text-field
          v-model="busqueda"
          placeholder="Buscar..."
          density="compact"
          variant="outlined"
          hide-details
          prepend-inner-icon="mdi-magnify"
          clearable
          class="search-field"
        />
        <v-btn
          color="grey-darken-1"
          variant="outlined"
          size="small"
          @click="refrescarTareas"
          class="btn-refrescar"
        >
          <v-icon size="16" class="mr-1">mdi-refresh</v-icon>
          Refrescar
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          size="small"
          @click="abrirDialogoNueva"
          class="btn-crear"
        >
          <v-icon size="16" class="mr-1">mdi-plus</v-icon>
          Subactividad
        </v-btn>
      </div>
    </div>

    <v-divider v-if="!actividad?.esNueva"></v-divider>

    <!-- Contenido Principal -->
    <div class="aside-content">
      <!-- Mensaje para actividad nueva -->
      <div v-if="actividad?.esNueva" class="estado-vacio">
        <v-icon size="48" color="warning" class="mb-3">mdi-lock-outline</v-icon>
        <p class="vacio-texto font-weight-bold">Actividad sin guardar</p>
        <p class="vacio-subtexto">
          Es necesario guardar la actividad para proceder con las subactividades.
        </p>
      </div>

      <!-- Contenido normal -->
      <template v-else>
        <div v-if="tareasFiltradas.length > 0" class="lista-tareas">
          <div class="tareas-count">
            {{ tareasFiltradas.length }} subactividad{{ tareasFiltradas.length !== 1 ? 'es' : '' }}
          </div>
          <div class="tareas-container">
            <div
              v-for="tarea in tareasFiltradas"
              :key="tarea.id"
              class="tarea-item"
              :class="getEstadoClaseBorde(tarea.estado)"
            >
              <div class="tarea-content">
                <div class="tarea-header">
                  <div class="tarea-estado">
                    <v-icon :color="getEstadoColor(tarea.estado)" size="16">
                      {{ getEstadoIcon(tarea.estado) }}
                    </v-icon>
                    <v-chip
                      size="x-small"
                      :color="getEstadoColor(tarea.estado)"
                      variant="flat"
                      class="ml-2"
                    >
                      {{ obtenerLiteralEstado(tarea.estado) }}
                    </v-chip>
                  </div>
                  <div class="tarea-info">
                    <div class="tarea-titulo">{{ tarea.titulo || 'Sin título' }}</div>
                    <div class="tarea-codigo">{{ tarea.codigo }}</div>
                  </div>

                  <div class="tarea-actions">
                    <v-chip
                      v-if="tarea.presupuesto"
                      size="x-small"
                      variant="outlined"
                      color="green"
                      class="mr-2"
                    >
                      {{ formatearPresupuesto(tarea.presupuesto) }}
                    </v-chip>

                    <v-menu location="bottom end">
                      <template #activator="{ props }">
                        <v-btn v-bind="props" icon size="x-small" variant="text">
                          <v-icon size="18">mdi-dots-vertical</v-icon>
                        </v-btn>
                      </template>
                      <v-list density="compact">
                        <v-list-item @click="exportarTarea(tarea)">
                          <template #prepend
                            ><v-icon size="16" color="red-darken-2"
                              >mdi-file-pdf-box</v-icon
                            ></template
                          >
                          <v-list-item-title>Exportar PDF</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="editarTarea(tarea)">
                          <template #prepend><v-icon size="16">mdi-pencil</v-icon></template>
                          <v-list-item-title>Editar</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="abrirCambioEstado(tarea)">
                          <template #prepend><v-icon size="16">mdi-sync</v-icon></template>
                          <v-list-item-title>Cambiar Estado</v-list-item-title>
                        </v-list-item>
                        <v-divider></v-divider>
                        <v-list-item @click="confirmarEliminar(tarea)" color="error">
                          <template #prepend
                            ><v-icon size="16" color="error">mdi-delete</v-icon></template
                          >
                          <v-list-item-title>Eliminar</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </div>
                </div>

                <div
                  class="tarea-detalles"
                  v-if="tarea.descripcion || tarea.fecha_limite || tarea.fecha_creacion"
                >
                  <div class="tarea-meta" v-if="tarea.descripcion">
                    <span class="descripcion">{{ tarea.descripcion }}</span>
                  </div>
                  <div class="tarea-footer">
                    <div class="tarea-fechas">
                      <span v-if="tarea.fecha_limite" class="fecha">
                        <v-icon size="12" class="mr-1">mdi-calendar-clock</v-icon>
                        Vence: {{ formatearFecha(tarea.fecha_limite) }}
                      </span>
                      <span v-if="tarea.fecha_creacion" class="fecha">
                        <v-icon size="12" class="mr-1">mdi-calendar-plus</v-icon>
                        Creada: {{ formatearFecha(tarea.fecha_creacion) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="estado-vacio">
          <v-icon size="48" color="grey-lighten-2" class="mb-3">mdi-format-list-bulleted</v-icon>
          <p class="vacio-texto">
            {{ busqueda ? 'No se encontraron tareas' : 'No hay tareas registradas' }}
          </p>
          <p class="vacio-subtexto" v-if="!busqueda">Comienza agregando la primera subactividad</p>
          <v-btn color="primary" variant="outlined" size="small" @click="abrirDialogoNueva">
            <v-icon left size="16">mdi-plus</v-icon>
            Crear Primera Subactividad
          </v-btn>
        </div>
      </template>
    </div>

    <!-- Diálogo Nueva/Editar Tarea -->
    <DialogoTareaActividad
      v-model="dialogoNueva"
      :actividad="actividad"
      :tarea="tareaSeleccionada"
      :procedencia-fondos="props.procedenciaFondos"
      @guardar="guardarTarea"
      @cancelar="dialogoNueva = false"
    />

    <!-- Diálogo Cambiar Estado -->
    <v-dialog v-model="dialogoEstado" max-width="350" persistent>
      <v-card>
        <v-card-text class="pa-4 text-center">
          <div class="text-h6 mb-3">Cambiar Estado</div>
          <div class="text-body-1 mb-4">
            <strong>"{{ tareaEstado?.titulo }}"</strong>
          </div>
          <div class="mb-3">
            <v-chip :color="getEstadoColor(tareaEstado?.estado)" size="large">
              <v-icon start>{{ getEstadoIcon(tareaEstado?.estado) }}</v-icon>
              {{ obtenerLiteralEstado(tareaEstado?.estado) }}
            </v-chip>
          </div>
          <v-select
            v-model="nuevoEstado"
            :items="estadosTarea"
            item-title="text"
            item-value="value"
            density="compact"
            variant="outlined"
            hide-details
            class="mb-4"
          />
          <div class="d-flex justify-space-between">
            <v-btn variant="text" @click="dialogoEstado = false">Cancelar</v-btn>
            <v-btn
              :color="getEstadoColor(nuevoEstado)"
              @click="confirmarCambioEstado"
              :disabled="!nuevoEstado || nuevoEstado === tareaEstado?.estado"
            >
              <v-icon start>{{ getEstadoIcon(nuevoEstado) }}</v-icon>
              Cambiar
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import DialogoTareaActividad from '../Dialogs/DialogoTareaActividad.vue'
import { usePlanificacionExcelStore } from '../../stores/usePlanificacionExcelStore'
import {
  obtenerLiteralEstado,
  ESTADOS_TAREA,
  formatearFecha,
  formatearPresupuesto,
  getEstadoColor,
  getEstadoIcon,
  getEstadoClaseBorde,
} from '@/modules/formularios/utils/estadoTareaUtils'

const props = defineProps({
  actividad: { type: Object, required: true },
  presupuestoActividad: { type: [Number, String], required: true },
  procedenciaFondos: { type: Array, default: () => [] },
})

const emit = defineEmits(['close', 'add-tarea', 'update-tarea', 'delete-tarea', 'disable-tarea'])

const store = usePlanificacionExcelStore()
const busqueda = ref('')
const tareaSeleccionada = ref(null)

// ──── Tareas ────
const tareasActividad = computed(() => {
  if (!props.actividad?.id) return []
  return store.getTareasPorActividad(props.actividad.id).value
})

const tareasFiltradas = computed(() => {
  if (!busqueda.value) return tareasActividad.value
  const q = busqueda.value.toLowerCase()
  return tareasActividad.value.filter(
    (t) =>
      t.titulo?.toLowerCase().includes(q) ||
      t.codigo?.toLowerCase().includes(q) ||
      t.descripcion?.toLowerCase().includes(q),
  )
})

const refrescarTareas = () => {
  busqueda.value = ''
}

// ──── Diálogo Nueva/Editar ────
const dialogoNueva = ref(false)

const abrirDialogoNueva = () => {
  tareaSeleccionada.value = null
  dialogoNueva.value = true
}

const editarTarea = (tarea) => {
  tareaSeleccionada.value = { ...tarea }
  dialogoNueva.value = true
}

const guardarTarea = (datos) => {
  if (tareaSeleccionada.value) {
    emit('update-tarea', {
      index: tareasActividad.value.indexOf(tareaSeleccionada.value),
      tarea: datos,
    })
  } else {
    emit('add-tarea', datos)
  }
  dialogoNueva.value = false
}

// ──── Diálogo Cambiar Estado ────
const dialogoEstado = ref(false)
const tareaEstado = ref(null)
const nuevoEstado = ref('')
const estadosTarea = Object.entries(ESTADOS_TAREA).map(([value, text]) => ({ text, value }))

const abrirCambioEstado = (tarea) => {
  tareaEstado.value = tarea
  nuevoEstado.value = tarea.estado
  dialogoEstado.value = true
}

const confirmarCambioEstado = () => {
  if (!tareaEstado.value || !nuevoEstado.value) return
  emit('update-tarea', {
    index: tareasActividad.value.indexOf(tareaEstado.value),
    tarea: { ...tareaEstado.value, estado: nuevoEstado.value },
  })
  dialogoEstado.value = false
}

// ──── Menú 3 puntos ────
const exportarTarea = (tarea) => alert(`Exportar: ${tarea.titulo}`)

const confirmarEliminar = (tarea) => {
  const index = tareasActividad.value.indexOf(tarea)
  if (tarea.esNueva) emit('delete-tarea', index)
  else emit('disable-tarea', index)
}
</script>

<style scoped>
.aside-tareas {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
  min-height: 500px;
}
.aside-header {
  padding: 6px 12px;
  background: #f8f9fa;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 1;
  border-bottom: 1px solid #e0e0e0;
  min-height: 48px;
}
.actividad-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}
.actividad-codigo {
  display: flex;
  align-items: center;
  font-size: 13px;
  color: #0078d4;
}
.actividad-nombre {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  line-height: 1.2;
}
.actividad-meta {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.meta-item {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 11px;
  color: #666;
}
.aside-toolbar {
  padding: 8px 12px;
  flex-shrink: 0;
}
.toolbar-row {
  display: flex;
  align-items: center;
  gap: 6px;
}
.search-field {
  flex: 1;
  min-width: 0;
}
.search-field :deep(.v-input__control) {
  min-height: 32px;
}
.btn-refrescar,
.btn-crear {
  white-space: nowrap;
  flex-shrink: 0;
}
.aside-content {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}
.tareas-count {
  padding: 8px 16px;
  font-size: 13px;
  color: #666;
  background: #fafafa;
  border-bottom: 1px solid #e0e0e0;
}
.tarea-item {
  border-bottom: 1px solid #f0f0f0;
  padding: 12px 16px;
}
.tarea-item:hover {
  background: #f8f9fa;
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
  gap: 6px;
}
.tarea-header {
  display: flex;
  align-items: center;
  gap: 8px;
}
.tarea-estado {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}
.tarea-info {
  flex: 1;
  min-width: 0;
}
.tarea-titulo {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}
.tarea-codigo {
  font-size: 11px;
  color: #666;
  font-family: monospace;
}
.tarea-actions {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}
.tarea-detalles {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.descripcion {
  font-size: 12px;
  color: #666;
  word-wrap: break-word;
  white-space: normal;
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
.estado-vacio {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  min-height: 200px;
}
.vacio-texto {
  font-size: 16px;
  color: #666;
  margin-bottom: 4px;
}
.vacio-subtexto {
  font-size: 14px;
  color: #888;
  margin-bottom: 16px;
}
</style>
