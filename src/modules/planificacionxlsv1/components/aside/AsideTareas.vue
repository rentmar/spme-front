<!-- AsideTareas.vue -->
<template>
  <div class="aside-tareas">
    <!-- Encabezado de la Actividad -->
    <div class="aside-header">
      <div class="actividad-info">
        <div class="actividad-titulo-row">
          <div class="actividad-titulo">
            <v-icon color="primary" size="18" class="mr-2">mdi-clipboard-text-outline</v-icon>
            <strong class="actividad-codigo">{{
              actividadSeleccionada?.datos?.codigo || 'Sin código'
            }}</strong>
            <span class="actividad-separador">—</span>
            <span class="actividad-nombre">{{
              actividadSeleccionada?.datos?.nombre || 'Sin nombre'
            }}</span>
          </div>
          <!-- Botonera al lado del título -->
          <div class="titulo-actions" v-if="!props.actividad?.esNueva">
            <v-btn
              v-if="actividadSeleccionada?.formularios?.length"
              icon
              size="x-small"
              variant="text"
              @click="dialogoFormularios = true"
              class="btn-icono"
            >
              <v-badge
                :content="actividadSeleccionada?.formularios?.length || 0"
                color="primary"
                size="x-small"
                floating
              >
                <v-icon size="16" color="primary">mdi-file-document-multiple</v-icon>
              </v-badge>
              <v-tooltip activator="parent" location="bottom">
                {{ actividadSeleccionada?.formularios?.length || 0 }} formulario(s)
              </v-tooltip>
            </v-btn>
            <v-btn
              icon
              size="x-small"
              variant="text"
              @click="dialogoBusqueda = true"
              class="btn-icono"
            >
              <v-icon size="16">mdi-magnify</v-icon>
              <v-tooltip activator="parent" location="bottom">Buscar subactividades</v-tooltip>
            </v-btn>
            <v-btn icon size="x-small" variant="text" @click="refrescarTareas" class="btn-icono">
              <v-icon size="16">mdi-refresh</v-icon>
              <v-tooltip activator="parent" location="bottom">Refrescar</v-tooltip>
            </v-btn>
            <v-btn
              icon
              size="x-small"
              variant="text"
              color="primary"
              @click="abrirDialogoNueva"
              class="btn-icono"
            >
              <v-icon size="16">mdi-plus</v-icon>
              <v-tooltip activator="parent" location="bottom">Nueva subactividad</v-tooltip>
            </v-btn>
          </div>
        </div>
        <div class="actividad-meta">
          <span class="meta-item">
            <v-icon size="14" color="grey">mdi-calendar</v-icon>
            {{ formatearFecha(actividadSeleccionada?.datos?.fecha_inicio) }}
          </span>
          <span class="meta-item" v-if="actividadSeleccionada?.datos?.fecha_cierre">
            <v-icon size="14" color="grey">mdi-calendar-end</v-icon>
            {{ formatearFecha(actividadSeleccionada?.datos?.fecha_cierre) }}
          </span>
          <span class="meta-item">
            <v-icon size="14" color="green">mdi-cash</v-icon>
            {{ formatearPresupuesto(actividadSeleccionada?.datos?.presupuesto_actividad) }}
          </span>
          <span class="meta-item">
            <v-chip
              size="x-small"
              :color="getEstadoColor(actividadSeleccionada?.datos?.estado)"
              variant="flat"
            >
              {{
                actividadSeleccionada?.datos?.estado_display || actividadSeleccionada?.datos?.estado
              }}
            </v-chip>
          </span>
        </div>

        <!-- Barra de presupuestos con chips -->
        <div class="actividad-presupuestos" v-if="actividadSeleccionada?.datos">
          <v-chip size="x-small" variant="flat" color="blue-lighten-4" text-color="blue-darken-4">
            <strong>Pres. Act.</strong>&nbsp;{{
              formatearMonto(actividadSeleccionada.datos.presupuesto_actividad)
            }}
          </v-chip>
          <v-chip
            size="x-small"
            variant="flat"
            color="orange-lighten-4"
            text-color="orange-darken-4"
          >
            <strong>Pres. Sub.</strong>&nbsp;{{
              formatearMonto(actividadSeleccionada.datos.presupuesto_tareas)
            }}
          </v-chip>
          <v-chip
            size="x-small"
            variant="flat"
            color="purple-lighten-4"
            text-color="purple-darken-4"
          >
            <strong>Ejec.</strong>&nbsp;{{
              formatearMonto(actividadSeleccionada.datos.presupuesto_ejecutado)
            }}
          </v-chip>
          <v-chip size="x-small" variant="flat" color="green-lighten-4" text-color="green-darken-4">
            <strong>Saldo</strong>&nbsp;{{
              formatearMonto(
                (actividadSeleccionada.datos.presupuesto_actividad || 0) -
                  (actividadSeleccionada.datos.presupuesto_ejecutado || 0),
              )
            }}
          </v-chip>
          <v-chip size="x-small" variant="flat" color="cyan-lighten-4" text-color="cyan-darken-4">
            <strong>{{ actividadSeleccionada.datos.porcentaje_ejecucion || 0 }}%</strong>
          </v-chip>
        </div>

        <!-- Barra de resumen -->
        <div class="actividad-resumen" v-if="actividadSeleccionada?.datos">
          <span class="resumen-item">
            <v-icon size="14" color="primary">mdi-file-document-outline</v-icon>
            Formularios: {{ actividadSeleccionada.formularios?.length || 0 }}
          </span>
          <span class="resumen-item">
            <v-icon size="14" color="warning">mdi-format-list-checks</v-icon>
            Subactividades: {{ tareasActividad.length }}
          </span>
          <span class="resumen-item">
            <v-icon size="14" color="green-darken-2">mdi-chart-pie</v-icon>
            Ejecución: {{ actividadSeleccionada.datos.porcentaje_ejecucion || 0 }}%
          </span>
        </div>
      </div>
    </div>

    <v-divider v-if="!props.actividad?.esNueva"></v-divider>

    <!-- Contenido Principal -->
    <div class="aside-content">
      <div v-if="props.actividad?.esNueva" class="estado-vacio">
        <v-icon size="48" color="warning" class="mb-3">mdi-lock-outline</v-icon>
        <p class="vacio-texto font-weight-bold">Actividad sin guardar</p>
        <p class="vacio-subtexto">
          Es necesario guardar la actividad para proceder con las subactividades.
        </p>
      </div>

      <template v-else>
        <!-- Lista de Tareas -->
        <div v-if="tareasFiltradas.length > 0" class="lista-tareas">
          <div class="tareas-count">
            {{ tareasFiltradas.length }} subactividad{{ tareasFiltradas.length !== 1 ? 'es' : '' }}
          </div>
          <div class="tareas-container">
            <div
              v-for="tarea in tareasFiltradas"
              :key="tarea.id"
              class="tarea-item"
              :class="getEstadoClaseBorde(tarea.datos?.estado)"
            >
              <div class="tarea-content">
                <div class="tarea-header">
                  <div class="tarea-estado">
                    <v-icon :color="getEstadoColor(tarea.datos?.estado)" size="14">
                      {{ getEstadoIcon(tarea.datos?.estado) }}
                    </v-icon>
                    <v-chip
                      size="x-small"
                      :color="getEstadoColor(tarea.datos?.estado)"
                      variant="flat"
                      class="ml-2"
                    >
                      {{ tarea.datos?.estado_display || obtenerLiteralEstado(tarea.datos?.estado) }}
                    </v-chip>
                  </div>
                  <div class="tarea-info">
                    <div class="tarea-titulo">{{ tarea.datos?.titulo || 'Sin título' }}</div>
                    <div class="tarea-codigo">{{ tarea.datos?.codigo }}</div>
                  </div>
                  <div class="tarea-actions">
                    <v-chip
                      v-if="tarea.datos?.presupuesto_tarea"
                      size="x-small"
                      variant="outlined"
                      color="green"
                      class="mr-2"
                    >
                      {{ formatearPresupuesto(tarea.datos.presupuesto_tarea) }}
                    </v-chip>
                    <v-menu location="bottom end">
                      <template #activator="{ props }">
                        <v-btn v-bind="props" icon size="x-small" variant="text">
                          <v-icon size="16">mdi-dots-vertical</v-icon>
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

                <!-- Presupuesto de la tarea -->
                <div class="tarea-presupuesto-mini" v-if="tarea.datos">
                  <span class="presupuesto-mini-item">
                    <v-icon size="10" color="green">mdi-cash</v-icon>
                    Pres: {{ formatearMonto(tarea.datos.presupuesto_tarea) }}
                  </span>
                  <span class="presupuesto-mini-item">
                    <v-icon size="10" color="blue">mdi-check-circle</v-icon>
                    Ejec: {{ formatearMonto(tarea.datos.presupuesto_ejecutado) }}
                  </span>
                  <span class="presupuesto-mini-item">
                    {{ tarea.datos.porcentaje_ejecucion || 0 }}%
                  </span>
                </div>

                <!-- Formularios de la tarea en Collapsable -->
                <v-expansion-panels
                  v-if="tarea.formularios?.length"
                  class="tarea-formularios-panel"
                  variant="accordion"
                >
                  <v-expansion-panel class="panel-tarea">
                    <v-expansion-panel-title class="tarea-panel-title">
                      <div class="panel-title-mini">
                        <v-icon size="12" class="mr-1">mdi-file-document-multiple</v-icon>
                        <span>Formularios</span>
                        <v-chip
                          size="x-small"
                          class="ml-1"
                          variant="flat"
                          density="compact"
                          color="warning"
                        >
                          {{ tarea.formularios.length }}
                        </v-chip>
                      </div>
                      <v-tooltip activator="parent" location="top">
                        {{ tarea.formularios.length }} formulario(s) en esta subactividad
                      </v-tooltip>
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                      <div v-for="form in tarea.formularios" :key="form.id" class="formulario-mini">
                        <v-icon
                          size="12"
                          class="mr-1"
                          :color="getColorTipoSolicitudExtendido(form.tipo)"
                        >
                          {{ getIconoTipoSolicitud(form.tipo) }}
                        </v-icon>
                        <span class="form-tipo-mini">{{
                          getNombreCortoTipoSolicitud(form.tipo)
                        }}</span>
                        <span class="form-codigo-mini">{{ form.codigo }}</span>
                        <v-chip
                          size="x-small"
                          :color="getColorEstado(form.estado)"
                          variant="flat"
                          class="ml-1"
                        >
                          <v-icon start size="8">{{ getIconoEstado(form.estado) }}</v-icon>
                          {{ form.estado }}
                        </v-chip>
                        <span class="form-monto ml-auto">{{ formatearMonto(form.monto) }}</span>
                        <v-tooltip activator="parent" location="left">
                          <div class="tooltip-content">
                            <strong>{{ getNombreCortoTipoSolicitud(form.tipo) }}</strong
                            ><br />
                            Código: {{ form.codigo }}<br />
                            Monto: {{ formatearMonto(form.monto) }}<br />
                            Estado: {{ form.estado }}
                          </div>
                        </v-tooltip>
                      </div>
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>

                <!-- Detalles de la tarea -->
                <div
                  class="tarea-detalles"
                  v-if="tarea.datos?.descripcion || tarea.datos?.fecha_limite"
                >
                  <div class="tarea-meta" v-if="tarea.datos?.descripcion">
                    <span class="descripcion">{{ tarea.datos.descripcion }}</span>
                  </div>
                  <div class="tarea-footer">
                    <div class="tarea-fechas">
                      <span v-if="tarea.datos?.fecha_limite" class="fecha">
                        <v-icon size="10" class="mr-1">mdi-calendar-clock</v-icon>
                        Vence: {{ formatearFecha(tarea.datos.fecha_limite) }}
                      </span>
                      <span v-if="tarea.datos?.fecha_ejecucion" class="fecha">
                        <v-icon size="10" class="mr-1">mdi-calendar-check</v-icon>
                        Ejecución: {{ formatearFecha(tarea.datos.fecha_ejecucion) }}
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
          <v-btn
            v-if="!busqueda"
            color="primary"
            variant="outlined"
            size="small"
            @click="abrirDialogoNueva"
          >
            <v-icon left size="16">mdi-plus</v-icon>
            Crear Primera Subactividad
          </v-btn>
        </div>
      </template>
    </div>

    <!-- Diálogo de formularios de actividad -->
    <v-dialog v-model="dialogoFormularios" max-width="550" scrollable>
      <v-card>
        <v-toolbar color="primary" density="compact">
          <v-toolbar-title class="text-body-2">
            <v-icon size="18" class="mr-2">mdi-file-document-multiple</v-icon>
            Formularios de la Actividad
          </v-toolbar-title>
          <v-chip size="x-small" color="white" variant="flat" text-color="primary">
            {{ actividadSeleccionada?.formularios?.length || 0 }}
          </v-chip>
          <template #append>
            <v-btn icon size="small" variant="text" @click="dialogoFormularios = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </template>
        </v-toolbar>

        <!-- Buscador -->
        <div class="pa-3 pb-0">
          <v-text-field
            v-model="busquedaFormularios"
            placeholder="Buscar formulario..."
            density="compact"
            variant="outlined"
            hide-details
            prepend-inner-icon="mdi-magnify"
            clearable
          />
        </div>

        <v-card-text class="pa-0">
          <!-- Lista paginada -->
          <div
            v-for="form in formulariosPaginados"
            :key="form.id"
            class="formulario-item-dialog"
            @click="abrirFormulario(form)"
          >
            <v-icon size="16" class="mr-3" :color="getColorTipoSolicitudExtendido(form.tipo)">
              {{ getIconoTipoSolicitud(form.tipo) }}
            </v-icon>
            <div class="form-info-dialog">
              <span class="form-tipo-dialog">{{ getNombreCortoTipoSolicitud(form.tipo) }}</span>
              <span class="form-codigo-dialog">{{ form.codigo }}</span>
            </div>
            <v-chip size="x-small" :color="getColorEstado(form.estado)" variant="flat" class="ml-2">
              <v-icon start size="10">{{ getIconoEstado(form.estado) }}</v-icon>
              {{ form.estado }}
            </v-chip>
            <span class="form-monto-dialog ml-auto">{{ formatearMonto(form.monto) }}</span>
            <span class="form-fecha-dialog ml-2">{{ formatDateCorta(form.fecha) }}</span>
            <v-icon size="14" color="primary" class="ml-2 link-icon">mdi-open-in-new</v-icon>
          </div>

          <!-- Vacío -->
          <div
            v-if="formulariosFiltrados.length === 0"
            class="text-center pa-6 text-caption text-medium-emphasis"
          >
            <v-icon size="32" color="disabled" class="mb-2">mdi-file-document-outline</v-icon>
            <p>{{ busquedaFormularios ? 'Sin resultados' : 'No hay formularios registrados' }}</p>
          </div>
        </v-card-text>

        <!-- Paginación -->
        <v-card-actions v-if="totalPaginas > 1" class="px-4 py-2">
          <span class="text-caption text-medium-emphasis mr-2">
            {{ formulariosFiltrados.length }} resultado(s)
          </span>
          <v-spacer />
          <v-pagination
            v-model="paginaActual"
            :length="totalPaginas"
            density="compact"
            size="small"
            :total-visible="5"
            active-color="primary"
          />
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo de búsqueda -->
    <v-dialog v-model="dialogoBusqueda" max-width="400">
      <v-card>
        <v-card-text class="pt-4">
          <v-text-field
            v-model="busqueda"
            placeholder="Buscar subactividad..."
            density="compact"
            variant="outlined"
            hide-details
            prepend-inner-icon="mdi-magnify"
            clearable
            autofocus
            @keydown.esc="dialogoBusqueda = false"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn size="small" variant="text" @click="limpiarBusqueda">Limpiar</v-btn>
          <v-btn size="small" color="primary" variant="text" @click="dialogoBusqueda = false">
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo Nueva/Editar Tarea -->
    <DialogoTareaActividad
      v-model="dialogoNueva"
      :actividad="actividadSeleccionada"
      :tarea="tareaSeleccionada"
      :procedencia-fondos="props.procedenciaFondos || []"
      :limite-presupuesto="limitePresupuesto"
      @guardar="guardarTarea"
      @cancelar="dialogoNueva = false"
    />

    <!-- Diálogo Cambiar Estado -->
    <v-dialog v-model="dialogoEstado" max-width="350" persistent>
      <v-card>
        <v-card-text class="pa-4 text-center">
          <div class="text-h6 mb-3">Cambiar Estado</div>
          <div class="text-body-1 mb-4">
            <strong>"{{ tareaEstado?.datos?.titulo }}"</strong>
          </div>
          <div class="mb-3">
            <v-chip :color="getEstadoColor(tareaEstado?.datos?.estado)" size="large">
              <v-icon start>{{ getEstadoIcon(tareaEstado?.datos?.estado) }}</v-icon>
              {{
                tareaEstado?.datos?.estado_display ||
                obtenerLiteralEstado(tareaEstado?.datos?.estado)
              }}
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
              :disabled="!nuevoEstado || nuevoEstado === tareaEstado?.datos?.estado"
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
import { ref, computed, onMounted, watch } from 'vue'
import DialogoTareaActividad from '../Dialogs/DialogoTareaActividad.vue'
import { usePresupuestoStore } from '../../stores/usePresupuestoStore'
import {
  obtenerLiteralEstado,
  ESTADOS_TAREA,
  formatearFecha,
  formatearPresupuesto,
  getEstadoColor,
  getEstadoIcon,
  getEstadoClaseBorde,
} from '@/modules/formularios/utils/estadoTareaUtils'

import {
  getColorEstado,
  getIconoEstado,
  getIconoTipoSolicitud,
  getNombreCortoTipoSolicitud,
  getColorTipoSolicitudExtendido,
  formatDateCorta,
  formatearMonto,
} from '@/modules/formularios/utils/validadoresHelpers'
import { useSnackbar } from '@/composables/useSnackbar.js'

const props = defineProps({
  actividad: { type: Object, required: true },
  presupuestoActividad: { type: [Number, String], required: true },
  procedenciaFondos: { type: Array, default: () => [] },
})

const emit = defineEmits(['close', 'add-tarea', 'update-tarea', 'delete-tarea', 'disable-tarea'])

const storePresupuesto = usePresupuestoStore()
const busqueda = ref('')
const dialogoBusqueda = ref(false)
const dialogoFormularios = ref(false)
const tareaSeleccionada = ref(null)
const actividadSeleccionada = ref(null)

const { successMsg, errorMsg } = useSnackbar()

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

const tareasActividad = computed(() => {
  return (
    actividadSeleccionada.value?.hijos?.filter(
      (n) => n.tipo_nodo === 'tarea' && !n.es_nodo_virtual,
    ) || []
  )
})

const saldoDisponible = computed(() => {
  if (!actividadSeleccionada.value?.datos) return 0
  const presupuestoActividad = actividadSeleccionada.value.datos.presupuesto_actividad || 0
  const presupuestoTareas = actividadSeleccionada.value.datos.presupuesto_tareas || 0
  return presupuestoActividad - presupuestoTareas
})

const limitePresupuesto = computed(() => {
  const saldo = saldoDisponible.value
  if (tareaSeleccionada.value?.presupuesto_tarea) {
    return saldo + parseFloat(tareaSeleccionada.value.presupuesto_tarea)
  }
  if (tareaSeleccionada.value?.presupuesto) {
    return saldo + parseFloat(tareaSeleccionada.value.presupuesto)
  }
  return saldo
})

const tareasFiltradas = computed(() => {
  if (!busqueda.value) return tareasActividad.value
  const q = busqueda.value.toLowerCase()
  return tareasActividad.value.filter(
    (t) =>
      t.datos?.titulo?.toLowerCase().includes(q) ||
      t.datos?.codigo?.toLowerCase().includes(q) ||
      t.datos?.descripcion?.toLowerCase().includes(q),
  )
})

const refrescarTareas = async () => {
  busqueda.value = ''
  await cargarActividad()
}

const limpiarBusqueda = () => {
  busqueda.value = ''
  dialogoBusqueda.value = false
}

const dialogoNueva = ref(false)
const abrirDialogoNueva = () => {
  tareaSeleccionada.value = null
  dialogoNueva.value = true
}
const editarTarea = (tarea) => {
  tareaSeleccionada.value = { ...tarea.datos, id: tarea.id }
  dialogoNueva.value = true
}

const guardarTarea = async (datos) => {
  try {
    if (tareaSeleccionada.value) {
      await storePresupuesto.actualizarTarea(tareaSeleccionada.value.id, datos)
    } else {
      await storePresupuesto.crearTarea(datos)
    }
    dialogoNueva.value = false
    await cargarActividad()
  } catch (error) {
    console.error('Error al guardar tarea:', error)
  }
}

const dialogoEstado = ref(false)
const tareaEstado = ref(null)
const nuevoEstado = ref('')
const estadosTarea = Object.entries(ESTADOS_TAREA).map(([value, text]) => ({ text, value }))
const abrirCambioEstado = (tarea) => {
  tareaEstado.value = tarea
  nuevoEstado.value = tarea.datos?.estado
  dialogoEstado.value = true
}
const confirmarCambioEstado = async () => {
  if (!tareaEstado.value || !nuevoEstado.value) return
  try {
    await storePresupuesto.actualizarTarea(tareaEstado.value.id, { estado: nuevoEstado.value })
    successMsg('Estado actualizado')
    dialogoEstado.value = false
    await cargarActividad()
  } catch (error) {
    console.error('Error al cambiar estado:', error)
    errorMsg('Error al cambiar el estado')
  }
}

const exportarTarea = (tarea) => console.log('Exportar:', tarea.datos?.titulo)
const confirmarEliminar = (tarea) => {
  const index = tareasActividad.value.findIndex((t) => t.id === tarea.id)
  if (tarea.datos?.esNueva) emit('delete-tarea', index)
  else emit('disable-tarea', index)
}

/////////////////////////////paginacion formularios
// Paginación y búsqueda de formularios
const busquedaFormularios = ref('')
const paginaActual = ref(1)
const itemsPorPagina = 8

const formulariosFiltrados = computed(() => {
  const formularios = actividadSeleccionada.value?.formularios || []
  if (!busquedaFormularios.value) return formularios
  const q = busquedaFormularios.value.toLowerCase()
  return formularios.filter(
    (f) =>
      f.codigo?.toLowerCase().includes(q) ||
      getNombreCortoTipoSolicitud(f.tipo)?.toLowerCase().includes(q) ||
      f.estado?.toLowerCase().includes(q),
  )
})

const totalPaginas = computed(() => {
  return Math.ceil(formulariosFiltrados.value.length / itemsPorPagina) || 1
})

const formulariosPaginados = computed(() => {
  const inicio = (paginaActual.value - 1) * itemsPorPagina
  return formulariosFiltrados.value.slice(inicio, inicio + itemsPorPagina)
})

// Resetear página al buscar
watch(busquedaFormularios, () => {
  paginaActual.value = 1
})

// Navegar al formulario (usa la lógica de enlaces ya definida)
function abrirFormulario(form) {
  if (!form?.uid) return
  const [tipo, id] = form.uid.split(':')
  const formularioNum = {
    solicitud_fondos: '011',
    solicitud_viaje: '055',
    solicitud_pago_directo: '088',
    solicitud_reposicion: '033',
    rendicion_cuentas: '022',
  }
  const num = formularioNum[tipo]
  if (!num) return
  const actividadId = actividadSeleccionada.value?.id
  const url = `/monitoreo/formulario${num}/${actividadId}?solicitud_id=${id}`
  window.open(url, '_blank')
}
</script>

<style scoped>
.aside-tareas {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f5f5f5;
  min-height: 500px;
}
.aside-header {
  padding: 6px 10px;
  background: #fff;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  z-index: 2;
  border-bottom: 1px solid #e0e0e0;
}
.actividad-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex: 1;
}
.actividad-titulo-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.actividad-titulo {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  line-height: 1.2;
  flex: 1;
  min-width: 0;
}
.titulo-actions {
  display: flex;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;
}
.btn-icono {
  opacity: 0.7;
}
.btn-icono:hover {
  opacity: 1;
}
.actividad-codigo {
  color: #0078d4;
  font-family: monospace;
  white-space: nowrap;
}
.actividad-separador {
  color: #ccc;
  font-weight: 300;
}
.actividad-nombre {
  font-weight: 600;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.actividad-meta {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
}
.meta-item {
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 10px;
  color: #666;
}

.actividad-presupuestos {
  display: flex;
  gap: 3px;
  flex-wrap: wrap;
  margin-top: 2px;
}

.actividad-resumen {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 2px 6px;
  background: #e8eaf6;
  border-radius: 3px;
  margin-top: 2px;
}
.resumen-item {
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 10px;
  font-weight: 500;
  color: #283593;
}

.aside-content {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  padding: 4px;
}

/* ─── Diálogo formularios ─── */
.formulario-item-dialog {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 12px;
  transition: all 0.12s ease;
  cursor: pointer;
}
.formulario-item-dialog:hover {
  background: #f5f5f5;
}
.form-info-dialog {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.form-tipo-dialog {
  font-weight: 600;
  font-size: 11px;
  color: #3949ab;
}
.form-codigo-dialog {
  font-family: monospace;
  font-size: 10px;
  color: #666;
}
.form-monto-dialog {
  font-weight: 600;
  color: #2e7d32;
  font-size: 12px;
  white-space: nowrap;
}
.form-fecha-dialog {
  font-size: 10px;
  color: #999;
  white-space: nowrap;
}

/* ─── Panel de Formularios de Tarea ─── */
.panel-tarea {
  border: 1px solid #ffe0b2 !important;
  border-radius: 4px !important;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(255, 152, 0, 0.06);
  margin-top: 2px;
}
.panel-tarea :deep(.v-expansion-panel-title) {
  background: #fff8e1;
  border-radius: 4px 4px 0 0;
  padding: 2px 8px;
  min-height: 22px;
  font-weight: 500;
  color: #e65100;
  font-size: 10px;
}
.panel-tarea :deep(.v-expansion-panel-title--active) {
  background: #ffe0b2;
}
.panel-tarea :deep(.v-expansion-panel-text__wrapper) {
  padding: 0;
}

.panel-title-mini {
  display: flex;
  align-items: center;
  font-size: 10px;
  color: #e65100;
}

.formulario-mini {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 3px 8px;
  border-bottom: 1px solid #fff3e0;
  font-size: 9px;
  color: #555;
  transition: all 0.12s ease;
  cursor: pointer;
}
.formulario-mini:hover {
  background: #fff8e1;
}
.form-tipo-mini {
  font-weight: 600;
  font-size: 8px;
  color: #e65100;
  white-space: nowrap;
}
.form-codigo-mini {
  font-family: monospace;
  font-size: 8px;
}

.tooltip-content {
  font-size: 10px;
  line-height: 1.3;
}

/* ─── Tareas ─── */
.tareas-count {
  padding: 3px 8px;
  font-size: 10px;
  font-weight: 600;
  color: #5d4037;
  background: #efebe9;
  border-radius: 3px;
  margin-bottom: 4px;
}
.tarea-item {
  background: #fff;
  border-radius: 5px;
  padding: 6px 10px;
  margin-bottom: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.15s ease;
}
.tarea-item:hover {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  transform: translateY(-1px);
}
.tarea-pen {
  border-left: 3px solid #ff9800;
}
.tarea-eprog {
  border-left: 3px solid #2196f3;
}
.tarea-compl {
  border-left: 3px solid #4caf50;
}
.tarea-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.tarea-header {
  display: flex;
  align-items: center;
  gap: 4px;
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
  font-size: 12px;
  font-weight: 500;
  color: #333;
  line-height: 1.2;
}
.tarea-codigo {
  font-size: 9px;
  color: #999;
  font-family: monospace;
}
.tarea-actions {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.tarea-presupuesto-mini {
  display: flex;
  gap: 6px;
  padding: 1px 0;
}
.presupuesto-mini-item {
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 9px;
  font-weight: 500;
  color: #888;
}

.tarea-detalles {
  display: flex;
  flex-direction: column;
  gap: 1px;
  padding-top: 2px;
  border-top: 1px solid #f5f5f5;
}
.descripcion {
  font-size: 10px;
  color: #888;
  word-wrap: break-word;
  white-space: normal;
  line-height: 1.2;
}
.tarea-fechas {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.fecha {
  display: flex;
  align-items: center;
  font-size: 9px;
  color: #aaa;
}

.estado-vacio {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px 16px;
  text-align: center;
  min-height: 160px;
}
.vacio-texto {
  font-size: 14px;
  color: #666;
  margin-bottom: 3px;
}
.vacio-subtexto {
  font-size: 12px;
  color: #888;
  margin-bottom: 12px;
}
</style>
