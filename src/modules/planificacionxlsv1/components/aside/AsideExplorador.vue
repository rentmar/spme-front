<!-- ========== aside/AsideExplorador.vue ========== -->
<template>
  <div class="aside-explorador">
    <!-- Sin actividad -->
    <div v-if="!actividadSeleccionada" class="estado-vacio">
      <v-icon size="64" color="grey-lighten-2" class="mb-4">mdi-file-tree</v-icon>
      <p class="vacio-texto">Sin datos de actividad</p>
      <p class="vacio-subtexto">Seleccione una actividad en la grilla</p>
    </div>

    <!-- Contenido -->
    <template v-else>
      <!-- Encabezado: Actividad -->
      <div class="actividad-header">
        <div class="actividad-header-main">
          <v-icon color="primary" size="20" class="mr-2">mdi-clipboard-text-outline</v-icon>
          <div>
            <div class="actividad-titulo">
              <strong>{{ actividadSeleccionada?.datos?.codigo }}</strong>
              <span class="actividad-sep">—</span>
              <span>{{ actividadSeleccionada?.datos?.nombre }}</span>
            </div>
            <div class="actividad-sub">
              <v-chip
                size="x-small"
                :color="getEstadoColor(actividadSeleccionada?.datos?.estado)"
                variant="flat"
                class="mr-2"
              >
                {{ actividadSeleccionada?.datos?.estado_display }}
              </v-chip>
              <span class="text-caption text-medium-emphasis">
                {{ formatearMonto(actividadSeleccionada?.datos?.presupuesto_actividad) }}
              </span>
              <span class="text-caption text-medium-emphasis ml-2">
                {{ actividadSeleccionada?.datos?.porcentaje_ejecucion || 0 }}%
              </span>
            </div>
          </div>
          <v-spacer />
          <v-btn
            v-if="actividadSeleccionada?.formularios?.length"
            size="x-small"
            variant="text"
            color="primary"
            @click="mostrarFormsActividad = !mostrarFormsActividad"
          >
            <v-icon size="16" class="mr-1">{{
              mostrarFormsActividad ? 'mdi-chevron-up' : 'mdi-chevron-down'
            }}</v-icon>
            Formularios ({{ actividadSeleccionada.formularios.length }})
          </v-btn>
        </div>
      </div>

      <!-- Formularios de la actividad (expandibles con paginación) -->
      <v-expand-transition>
        <div
          v-if="mostrarFormsActividad && actividadSeleccionada?.formularios?.length"
          class="forms-actividad"
        >
          <div class="forms-actividad-header">
            <v-icon size="14" color="primary" class="mr-2">mdi-file-document-multiple</v-icon>
            <span>Formularios de la Actividad</span>
            <v-chip size="x-small" class="ml-2" color="primary" variant="flat">
              {{ actividadSeleccionada.formularios.length }}
            </v-chip>
          </div>

          <!-- Buscador -->
          <div class="forms-search pa-2">
            <v-text-field
              v-model="busquedaForms"
              placeholder="Buscar formulario..."
              density="compact"
              variant="outlined"
              hide-details
              prepend-inner-icon="mdi-magnify"
              clearable
              class="search-mini"
            />
          </div>

          <!-- Lista paginada -->
          <div
            v-for="(form, i) in formsPaginados"
            :key="form.id"
            class="form-item"
            @click="abrirSolicitud(form)"
          >
            <span class="form-num">{{ (paginaActual - 1) * itemsPorPagina + i + 1 }}</span>
            <v-icon size="14" class="ml-2 mr-2" :color="getColorTipoSolicitudExtendido(form.tipo)">
              {{ getIconoTipoSolicitud(form.tipo) }}
            </v-icon>
            <span class="form-tipo">{{ getNombreCortoTipoSolicitud(form.tipo) }}</span>
            <span class="form-codigo">{{ form.codigo }}</span>
            <v-chip size="x-small" :color="getColorEstado(form.estado)" variant="flat" class="ml-2">
              {{ form.estado }}
            </v-chip>
            <span class="form-monto ml-auto">{{ formatearMonto(form.monto) }}</span>
            <v-icon size="14" color="primary" class="ml-2 link-icon">mdi-open-in-new</v-icon>
          </div>

          <!-- Vacío búsqueda -->
          <div
            v-if="formsFiltrados.length === 0"
            class="text-center pa-4 text-caption text-medium-emphasis"
          >
            Sin resultados
          </div>

          <!-- Paginación -->
          <div v-if="totalPaginas > 1" class="forms-pagination pa-2">
            <v-pagination
              v-model="paginaActual"
              :length="totalPaginas"
              density="compact"
              size="x-small"
              :total-visible="5"
              active-color="primary"
            />
          </div>
        </div>
      </v-expand-transition>

      <v-divider />

      <!-- Cuerpo: Tareas -->
      <div class="tareas-body">
        <div class="tareas-header">
          <v-icon size="14" color="secondary" class="mr-1">mdi-format-list-checks</v-icon>
          <span class="tareas-header-text">Subactividades</span>
          <v-chip size="x-small" class="ml-2" color="secondary" variant="flat">
            {{ tareas.length }}
          </v-chip>
        </div>

        <div v-if="tareas.length === 0" class="text-center pa-6 text-caption text-medium-emphasis">
          <v-icon size="32" color="disabled" class="mb-2">mdi-file-document-outline</v-icon>
          <p>No hay subactividades</p>
        </div>

        <div v-else class="tareas-list">
          <div v-for="(tarea, index) in tareas" :key="tarea.id" class="tarea-card">
            <div class="tarea-header" @click="toggleTarea(tarea.id)">
              <span class="tarea-num">{{ index + 1 }}</span>
              <v-icon :color="getEstadoColor(tarea.datos?.estado)" size="14" class="ml-2 mr-2">
                {{ getEstadoIcon(tarea.datos?.estado) }}
              </v-icon>
              <div class="tarea-info">
                <span class="tarea-titulo">{{ tarea.datos?.titulo || 'Sin título' }}</span>
                <span class="tarea-codigo">{{ tarea.datos?.codigo }}</span>
              </div>
              <v-chip
                size="x-small"
                :color="getEstadoColor(tarea.datos?.estado)"
                variant="flat"
                class="ml-2"
              >
                {{ tarea.datos?.estado_display }}
              </v-chip>
              <span class="tarea-monto ml-2">{{
                formatearMonto(tarea.datos?.presupuesto_tarea)
              }}</span>
              <v-icon
                v-if="tarea.formularios?.length"
                size="16"
                class="ml-2"
                :class="{ rotado: tareasExpandidas.includes(tarea.id) }"
              >
                mdi-chevron-down
              </v-icon>
            </div>

            <div class="tarea-meta">
              <span class="tarea-meta-item">
                <v-icon size="10" color="green" class="mr-1">mdi-cash</v-icon>
                Presupuesto: {{ formatearMonto(tarea.datos?.presupuesto_tarea) }}
              </span>
              <span class="tarea-meta-item">
                <v-icon size="10" color="blue" class="mr-1">mdi-check-circle</v-icon>
                Ejecutado: {{ formatearMonto(tarea.datos?.presupuesto_ejecutado) }}
              </span>
              <span class="tarea-meta-item">
                <v-icon size="10" color="orange" class="mr-1">mdi-percent</v-icon>
                {{ tarea.datos?.porcentaje_ejecucion || 0 }}%
              </span>
              <span class="tarea-meta-item" v-if="tarea.datos?.fecha_limite">
                <v-icon size="10" class="mr-1">mdi-calendar-clock</v-icon>
                Vence: {{ formatearFecha(tarea.datos?.fecha_limite) }}
              </span>
              <span class="tarea-meta-item" v-if="tarea.datos?.fecha_ejecucion">
                <v-icon size="10" class="mr-1">mdi-calendar-check</v-icon>
                Ejecución: {{ formatearFecha(tarea.datos?.fecha_ejecucion) }}
              </span>
            </div>

            <v-expand-transition>
              <div
                v-if="tareasExpandidas.includes(tarea.id) && tarea.formularios?.length"
                class="forms-tarea"
              >
                <div class="forms-tarea-header">
                  <v-icon size="12" color="warning" class="mr-1">mdi-file-document-multiple</v-icon>
                  <span>Formularios de esta subactividad</span>
                  <v-chip size="x-small" class="ml-2" color="warning" variant="flat">
                    {{ tarea.formularios.length }}
                  </v-chip>
                </div>
                <div
                  v-for="(form, j) in tarea.formularios"
                  :key="form.id"
                  class="form-item-tarea"
                  @click="abrirSolicitudTarea(form, tarea.id)"
                >
                  <span class="form-num-tarea">{{ j + 1 }}</span>
                  <v-icon
                    size="12"
                    :color="getColorTipoSolicitudExtendido(form.tipo)"
                    class="ml-2 mr-1"
                  >
                    {{ getIconoTipoSolicitud(form.tipo) }}
                  </v-icon>
                  <span class="form-tipo-tarea">{{ getNombreCortoTipoSolicitud(form.tipo) }}</span>
                  <span class="form-codigo-tarea">{{ form.codigo }}</span>
                  <v-chip
                    size="x-small"
                    :color="getColorEstado(form.estado)"
                    variant="flat"
                    class="ml-1"
                  >
                    {{ form.estado }}
                  </v-chip>
                  <span class="form-monto-tarea ml-auto">{{ formatearMonto(form.monto) }}</span>
                  <v-icon size="12" color="primary" class="ml-1 link-icon">mdi-open-in-new</v-icon>
                </div>
              </div>
            </v-expand-transition>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { usePresupuestoStore } from '../../stores/usePresupuestoStore'
import {
  getColorEstado,
  getIconoTipoSolicitud,
  getNombreCortoTipoSolicitud,
  getColorTipoSolicitudExtendido,
  formatearMonto,
} from '@/modules/formularios/utils/validadoresHelpers'
import {
  getEstadoColor,
  getEstadoIcon,
  formatearFecha,
} from '@/modules/formularios/utils/estadoTareaUtils'

const props = defineProps({
  actividad: { type: Object, required: true },
})

const storePresupuesto = usePresupuestoStore()
const actividadSeleccionada = ref(null)
const mostrarFormsActividad = ref(true)
const tareasExpandidas = ref([])

// Paginación formularios
const busquedaForms = ref('')
const paginaActual = ref(1)
const itemsPorPagina = 5

async function cargarActividad() {
  if (props.actividad?.id) {
    const resultado = await storePresupuesto.obtenerActividad(props.actividad.id)
    actividadSeleccionada.value = resultado.arbol
  } else {
    actividadSeleccionada.value = null
  }
}

onMounted(() => cargarActividad())
watch(
  () => props.actividad?.id,
  () => cargarActividad(),
)

const tareas = computed(() => {
  return (
    actividadSeleccionada.value?.hijos?.filter(
      (n) => n.tipo_nodo === 'tarea' && !n.es_nodo_virtual,
    ) || []
  )
})

function toggleTarea(id) {
  const idx = tareasExpandidas.value.indexOf(id)
  if (idx >= 0) tareasExpandidas.value.splice(idx, 1)
  else tareasExpandidas.value.push(id)
}

// ─── Paginación de formularios ────────────────────────

const formsFiltrados = computed(() => {
  const forms = actividadSeleccionada.value?.formularios || []
  if (!busquedaForms.value) return forms
  const q = busquedaForms.value.toLowerCase()
  return forms.filter(
    (f) =>
      f.codigo?.toLowerCase().includes(q) ||
      getNombreCortoTipoSolicitud(f.tipo)?.toLowerCase().includes(q) ||
      f.estado?.toLowerCase().includes(q),
  )
})

const totalPaginas = computed(() => Math.ceil(formsFiltrados.value.length / itemsPorPagina) || 1)

const formsPaginados = computed(() => {
  const inicio = (paginaActual.value - 1) * itemsPorPagina
  return formsFiltrados.value.slice(inicio, inicio + itemsPorPagina)
})

watch(busquedaForms, () => {
  paginaActual.value = 1
})

// ─── Navegación ────────────────────────────────────────

const formularioNum = {
  solicitud_fondos: '011',
  solicitud_viaje: '055',
  solicitud_pago_directo: '088',
  solicitud_reposicion: '033',
  rendicion_cuentas: '022',
}

function abrirSolicitud(form) {
  if (!form?.uid) return
  const [tipo, id] = form.uid.split(':')
  const num = formularioNum[tipo]
  if (!num) return
  const actividadId = actividadSeleccionada.value?.id
  const url = `/monitoreo/formulario${num}/${actividadId}?solicitud_id=${id}`
  window.open(url, '_blank')
}

function abrirSolicitudTarea(form, tareaId) {
  if (!form?.uid) return
  const [tipo, id] = form.uid.split(':')
  const num = formularioNum[tipo]
  if (!num) return
  const actividadId = actividadSeleccionada.value?.id
  const url = `/monitoreo/formulario${num}/${actividadId}?solicitud_id=${id}&tarea_id=${tareaId}`
  window.open(url, '_blank')
}
</script>

<style scoped>
.aside-explorador {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
  overflow: hidden;
}
.estado-vacio {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 40px 16px;
}
.vacio-texto {
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
}
.vacio-subtexto {
  font-size: 12px;
  color: #888;
}

.actividad-header {
  padding: 8px 12px;
  background: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
  flex-shrink: 0;
}
.actividad-header-main {
  display: flex;
  align-items: center;
}
.actividad-titulo {
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.actividad-sep {
  color: #ccc;
  font-weight: 300;
}
.actividad-sub {
  display: flex;
  align-items: center;
  margin-top: 2px;
}

.forms-actividad {
  background: #e8eaf6;
  border-bottom: 1px solid #c5cae9;
}
.forms-actividad-header {
  display: flex;
  align-items: center;
  padding: 6px 16px;
  font-size: 12px;
  font-weight: 500;
  color: #283593;
  border-bottom: 1px solid #c5cae9;
}
.forms-search {
  background: #fff;
  border-bottom: 1px solid #c5cae9;
}
.search-mini :deep(.v-input__control) {
  min-height: 28px;
}
.search-mini :deep(.v-field__input) {
  font-size: 11px;
  padding-top: 2px;
  padding-bottom: 2px;
}

.form-item {
  display: flex;
  align-items: center;
  padding: 6px 16px;
  border-bottom: 1px solid #c5cae9;
  font-size: 11px;
  cursor: pointer;
  transition: background 0.12s;
}
.form-item:hover {
  background: #c5cae9;
}
.form-item .link-icon {
  opacity: 0;
}
.form-item:hover .link-icon {
  opacity: 1;
}
.form-num {
  font-size: 10px;
  font-weight: 700;
  color: #7986cb;
  min-width: 18px;
}
.form-tipo {
  font-weight: 600;
  font-size: 10px;
  color: #3949ab;
  margin-right: 6px;
}
.form-codigo {
  font-family: monospace;
  font-size: 10px;
  color: #333;
}
.form-monto {
  font-weight: 600;
  color: #2e7d32;
  font-size: 11px;
}

.forms-pagination {
  display: flex;
  justify-content: center;
  background: #fff;
}

.tareas-body {
  flex: 1;
  overflow-y: auto;
}
.tareas-header {
  display: flex;
  align-items: center;
  padding: 6px 12px;
  background: #eceff1;
  border-bottom: 1px solid #cfd8dc;
  position: sticky;
  top: 0;
  z-index: 1;
}
.tareas-header-text {
  font-size: 12px;
  font-weight: 600;
  color: #455a64;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.tareas-list {
  display: flex;
  flex-direction: column;
}
.tarea-card {
  border-bottom: 1px solid #f0f0f0;
  padding: 8px 12px;
  cursor: pointer;
  transition: background 0.12s;
}
.tarea-card:hover {
  background: #fafafa;
}
.tarea-header {
  display: flex;
  align-items: center;
}
.tarea-num {
  font-size: 10px;
  font-weight: 700;
  color: #90a4ae;
  min-width: 18px;
  text-align: center;
}
.tarea-info {
  display: flex;
  flex-direction: column;
  gap: 1px;
}
.tarea-titulo {
  font-size: 13px;
  font-weight: 500;
  color: #333;
}
.tarea-codigo {
  font-family: monospace;
  font-size: 10px;
  color: #999;
}
.tarea-monto {
  font-weight: 600;
  color: #2e7d32;
  font-size: 12px;
}
.tarea-meta {
  display: flex;
  gap: 10px;
  margin-top: 3px;
  flex-wrap: wrap;
}
.tarea-meta-item {
  font-size: 10px;
  color: #888;
  display: flex;
  align-items: center;
}
.rotado {
  transform: rotate(180deg);
}

.forms-tarea {
  background: #fff8e1;
  border-top: 1px solid #ffe0b2;
  margin-top: 4px;
}
.forms-tarea-header {
  display: flex;
  align-items: center;
  padding: 4px 20px;
  font-size: 10px;
  font-weight: 500;
  color: #e65100;
  border-bottom: 1px solid #ffe0b2;
}
.form-item-tarea {
  display: flex;
  align-items: center;
  padding: 4px 20px;
  border-bottom: 1px solid #ffe0b2;
  font-size: 10px;
  cursor: pointer;
}
.form-item-tarea:hover {
  background: #ffe0b2;
}
.form-item-tarea .link-icon {
  opacity: 0;
}
.form-item-tarea:hover .link-icon {
  opacity: 1;
}
.form-num-tarea {
  font-size: 9px;
  font-weight: 700;
  color: #ffb74d;
  min-width: 14px;
}
.form-tipo-tarea {
  font-weight: 600;
  font-size: 9px;
  color: #e65100;
  margin: 0 4px;
}
.form-codigo-tarea {
  font-family: monospace;
  font-size: 8px;
  color: #666;
}
.form-monto-tarea {
  font-weight: 600;
  color: #2e7d32;
  font-size: 10px;
}
</style>
