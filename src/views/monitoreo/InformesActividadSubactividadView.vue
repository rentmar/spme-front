<template>
  <v-container class="informes-container">
    <!-- Título Principal -->
    <v-row>
      <v-col cols="12">
        <pagina-titulo-icono
          :titulo="'Informes de Actividad - Subactividad'"
          :icon="'mdi-file-document-multiple'"
        ></pagina-titulo-icono>
      </v-col>
    </v-row>

    <!-- Estados de Carga y Error -->
    <v-row v-if="loading">
      <v-col cols="12">
        <v-card>
          <v-card-text class="text-center py-8">
            <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
            <div class="text-h6 mt-4">Cargando información...</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-else-if="error">
      <v-col cols="12">
        <v-alert type="error" prominent>
          <v-row align="center">
            <v-col class="grow"> Error al cargar los datos: {{ error }} </v-col>
            <v-col class="shrink">
              <v-btn color="error" @click="cargarDatos" variant="outlined">
                <v-icon left>mdi-refresh</v-icon>
                Reintentar
              </v-btn>
            </v-col>
          </v-row>
        </v-alert>
      </v-col>
    </v-row>

    <!-- Contenido Principal -->
    <div v-else>
      <!-- Filtros -->
      <v-row class="mb-6">
        <v-col cols="12" md="4">
          <v-select
            v-model="filtroTipo"
            :items="opcionesFiltro"
            label="Tipo de informe"
            item-title="text"
            item-value="value"
            variant="outlined"
            density="compact"
            hide-details
          ></v-select>
        </v-col>
        <v-col cols="12" md="8">
          <v-text-field
            v-model="filtroBusqueda"
            placeholder="Buscar por número de informe, código o título..."
            variant="outlined"
            density="compact"
            hide-details
            prepend-inner-icon="mdi-magnify"
          ></v-text-field>
        </v-col>
      </v-row>

      <!-- Información de la Actividad -->
      <v-row v-if="actividadPrincipal" class="mb-6">
        <v-col cols="12">
          <v-card class="elevation-2">
            <v-card-title class="primary white--text">
              <v-row align="center">
                <v-col class="grow">
                  <h3 class="text-h5">
                    {{ actividadPrincipal.codigo }} -
                    {{ actividadPrincipal.nombreCorto || 'Sin nombre' }}
                  </h3>
                </v-col>
                <v-col class="shrink">
                  <v-chip :color="obtenerColorEstado(actividadPrincipal.estado)" dark size="large">
                    {{ obtenerEstadoTexto(actividadPrincipal.estado) }}
                  </v-chip>
                </v-col>
              </v-row>
            </v-card-title>

            <v-card-text class="pa-4">
              <v-row>
                <v-col cols="12" md="6">
                  <div class="d-flex align-center mb-4">
                    <v-icon color="primary" class="mr-3">mdi-text</v-icon>
                    <div>
                      <div class="font-weight-bold">Descripción</div>
                      <div class="text-caption text-medium-emphasis">
                        {{ actividadPrincipal.descripcion || 'No especificada' }}
                      </div>
                    </div>
                  </div>

                  <div class="d-flex align-center mb-4">
                    <v-icon color="primary" class="mr-3">mdi-calendar-start</v-icon>
                    <div>
                      <div class="font-weight-bold">Fecha inicio</div>
                      <div class="text-caption text-medium-emphasis">
                        {{ formatoFecha(actividadPrincipal.fecha_inicio) }}
                      </div>
                    </div>
                  </div>

                  <div class="d-flex align-center mb-4">
                    <v-icon color="primary" class="mr-3">mdi-calendar-end</v-icon>
                    <div>
                      <div class="font-weight-bold">Fecha cierre</div>
                      <div class="text-caption text-medium-emphasis">
                        {{ formatoFecha(actividadPrincipal.fecha_cierre) }}
                      </div>
                    </div>
                  </div>
                </v-col>

                <v-col cols="12" md="6">
                  <div class="d-flex align-center mb-4">
                    <v-icon color="primary" class="mr-3">mdi-cash</v-icon>
                    <div>
                      <div class="font-weight-bold">Presupuesto</div>
                      <div class="text-caption text-medium-emphasis">
                        {{ formatoMoneda(actividadPrincipal.presupuesto) }}
                      </div>
                    </div>
                  </div>

                  <div class="d-flex align-center mb-4">
                    <v-icon color="primary" class="mr-3">mdi-progress-check</v-icon>
                    <div>
                      <div class="font-weight-bold">Grado ejecución</div>
                      <div class="text-caption text-medium-emphasis">
                        {{ actividadPrincipal.gradoEjecucion || 'No especificado' }}
                      </div>
                    </div>
                  </div>

                  <div class="d-flex align-center mb-4">
                    <v-icon color="primary" class="mr-3">mdi-file-document</v-icon>
                    <div>
                      <div class="font-weight-bold">Informes de actividad</div>
                      <div class="text-caption text-medium-emphasis">
                        {{ actividadPrincipal.informes_actividad?.length || 0 }} informe(s)
                      </div>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Sección de Informes de Actividad -->
      <v-row v-if="actividadPrincipal?.informes_actividad?.length > 0" class="mb-6">
        <v-col cols="12">
          <v-card class="elevation-1">
            <v-card-title class="secondary white--text">
              <v-icon left>mdi-file-document</v-icon>
              Informes de Actividad ({{ actividadPrincipal.informes_actividad.length }})
            </v-card-title>

            <v-card-text class="pa-4">
              <v-row>
                <v-col
                  v-for="informe in informesActividadFiltrados"
                  :key="'actividad-' + informe.id"
                  cols="12"
                  md="6"
                  lg="4"
                >
                  <v-card
                    class="elevation-2 mb-4"
                    border="left"
                    style="border-left: 4px solid #3498db"
                  >
                    <v-card-title class="py-3">
                      <v-row align="center" no-gutters>
                        <v-col class="grow">
                          <span class="text-subtitle-1 font-weight-bold">
                            {{ informe.numeroInforme || 'Sin número' }}
                          </span>
                        </v-col>
                        <v-col class="shrink">
                          <v-chip size="small" color="blue" text-color="white"> Actividad </v-chip>
                        </v-col>
                      </v-row>
                    </v-card-title>

                    <v-card-text>
                      <div class="d-flex align-center mb-3">
                        <v-icon size="small" class="mr-2">mdi-calendar</v-icon>
                        <div>
                          <div class="text-caption font-weight-bold">Fecha ejecución</div>
                          <div class="text-caption text-medium-emphasis">
                            {{ formatoFecha(informe.fecha_ejecucion) }}
                          </div>
                        </div>
                      </div>

                      <div class="d-flex align-center mb-3">
                        <v-icon size="small" class="mr-2">mdi-target</v-icon>
                        <div>
                          <div class="text-caption font-weight-bold">Objetivo</div>
                          <div class="text-caption text-medium-emphasis text-truncate">
                            {{ informe.objetivo_actividad || 'No especificado' }}
                          </div>
                        </div>
                      </div>

                      <div class="d-flex align-center mb-3">
                        <v-icon size="small" class="mr-2">mdi-format-list-bulleted-type</v-icon>
                        <div>
                          <div class="text-caption font-weight-bold">Tipo actividad</div>
                          <div class="text-caption text-medium-emphasis">
                            {{ informe.tipo_actividad || 'No especificado' }}
                          </div>
                        </div>
                      </div>

                      <v-divider class="my-3"></v-divider>

                      <v-row class="text-center">
                        <v-col cols="6">
                          <div class="text-caption font-weight-bold">Planificado</div>
                          <div class="text-body-2 text-success">
                            {{ formatoMoneda(informe.presupuesto_planificado) }}
                          </div>
                        </v-col>
                        <v-col cols="6">
                          <div class="text-caption font-weight-bold">Ejecutado</div>
                          <div class="text-body-2 text-info">
                            {{ formatoMoneda(informe.presupuesto_ejecutado) }}
                          </div>
                        </v-col>
                      </v-row>
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="primary" size="small" @click="verDetalle(informe, 'actividad')">
                        <v-icon left size="small">mdi-eye</v-icon>
                        Ver detalle
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Sección de Tareas/Subactividades -->
      <v-row v-if="tareasConInformes.length > 0" class="mb-6">
        <v-col cols="12">
          <v-card class="elevation-1">
            <v-card-title class="success white--text">
              <v-icon left>mdi-checkbox-multiple-marked</v-icon>
              Subactividades ({{ tareasConInformes.length }})
            </v-card-title>

            <v-card-text class="pa-4">
              <v-expansion-panels multiple v-model="panelesAbiertos">
                <v-expansion-panel
                  v-for="(tarea, index) in tareasFiltradas"
                  :key="'tarea-' + tarea.id"
                  :value="index"
                >
                  <v-expansion-panel-title>
                    <v-row align="center" no-gutters>
                      <v-col cols="8">
                        <div class="text-subtitle-1 font-weight-bold">
                          {{ tarea.codigo }} - {{ tarea.titulo || 'Sin título' }}
                        </div>
                        <div class="text-caption text-medium-emphasis">
                          {{ tarea.descripcion || 'No especificada' }}
                        </div>
                      </v-col>
                      <v-col cols="4" class="text-right">
                        <v-chip :color="obtenerColorEstadoTarea(tarea.estado)" size="small" dark>
                          {{ obtenerEstadoTareaTexto(tarea.estado) }}
                        </v-chip>
                      </v-col>
                    </v-row>
                  </v-expansion-panel-title>

                  <v-expansion-panel-text>
                    <v-row class="mb-4">
                      <v-col cols="12" md="4">
                        <div class="d-flex align-center">
                          <v-icon size="small" class="mr-2">mdi-calendar-clock</v-icon>
                          <div>
                            <div class="text-caption font-weight-bold">Fecha límite</div>
                            <div class="text-caption text-medium-emphasis">
                              {{ formatoFecha(tarea.fecha_limite) }}
                            </div>
                          </div>
                        </div>
                      </v-col>
                      <v-col cols="12" md="4">
                        <div class="d-flex align-center">
                          <v-icon size="small" class="mr-2">mdi-cash</v-icon>
                          <div>
                            <div class="text-caption font-weight-bold">Presupuesto</div>
                            <div class="text-caption text-medium-emphasis">
                              {{ formatoMoneda(tarea.presupuesto) }}
                            </div>
                          </div>
                        </div>
                      </v-col>
                      <v-col cols="12" md="4">
                        <div class="d-flex align-center">
                          <v-icon size="small" class="mr-2">mdi-file-document</v-icon>
                          <div>
                            <div class="text-caption font-weight-bold">Informes</div>
                            <div class="text-caption text-medium-emphasis">
                              {{ tarea.informes_tarea?.length || 0 }} informe(s)
                            </div>
                          </div>
                        </div>
                      </v-col>
                    </v-row>

                    <!-- Informes de la tarea -->
                    <div v-if="tarea.informes_tarea?.length">
                      <div class="text-subtitle-2 font-weight-bold mb-3 pl-0">
                        Informes de esta Subactividad ({{ tarea.informes_tarea.length }})
                      </div>

                      <v-row>
                        <v-col
                          v-for="informe in informesTareaFiltrados(tarea)"
                          :key="'tarea-' + tarea.id + '-informe-' + informe.id"
                          cols="12"
                          md="6"
                        >
                          <v-card
                            class="elevation-1 mb-3"
                            border="left"
                            style="border-left: 4px solid #2ecc71"
                          >
                            <v-card-title class="py-2">
                              <v-row align="center" no-gutters>
                                <v-col class="grow">
                                  <span class="text-body-1 font-weight-bold">
                                    {{ informe.numeroInforme || 'Sin número' }}
                                  </span>
                                </v-col>
                                <v-col class="shrink">
                                  <v-chip size="x-small" color="green" text-color="white">
                                    Subactividad
                                  </v-chip>
                                </v-col>
                              </v-row>
                            </v-card-title>

                            <v-card-text class="pb-2">
                              <div class="d-flex align-center mb-2">
                                <v-icon size="x-small" class="mr-2">mdi-calendar</v-icon>
                                <div>
                                  <div class="text-caption font-weight-bold">Fecha ejecución</div>
                                  <div class="text-caption text-medium-emphasis">
                                    {{ formatoFecha(informe.fecha_ejecucion) }}
                                  </div>
                                </div>
                              </div>

                              <div class="d-flex align-center mb-2">
                                <v-icon size="x-small" class="mr-2">mdi-target</v-icon>
                                <div>
                                  <div class="text-caption font-weight-bold">Objetivo</div>
                                  <div class="text-caption text-medium-emphasis text-truncate">
                                    {{ informe.objetivo_tarea || 'No especificado' }}
                                  </div>
                                </div>
                              </div>

                              <v-divider class="my-2"></v-divider>

                              <v-row class="text-center">
                                <v-col cols="6">
                                  <div class="text-caption font-weight-bold">Planificado</div>
                                  <div class="text-caption text-success">
                                    {{ formatoMoneda(informe.presupuesto_planificado) }}
                                  </div>
                                </v-col>
                                <v-col cols="6">
                                  <div class="text-caption font-weight-bold">Ejecutado</div>
                                  <div class="text-caption text-info">
                                    {{ formatoMoneda(informe.presupuesto_ejecutado) }}
                                  </div>
                                </v-col>
                              </v-row>
                            </v-card-text>

                            <v-card-actions class="pt-0">
                              <v-spacer></v-spacer>
                              <v-btn
                                color="primary"
                                size="x-small"
                                @click="verDetalle(informe, 'tarea')"
                              >
                                <v-icon size="x-small" left>mdi-eye</v-icon>
                                Ver
                              </v-btn>
                            </v-card-actions>
                          </v-card>
                        </v-col>
                      </v-row>
                    </div>

                    <div v-else class="text-center py-4">
                      <v-icon color="grey" size="large">mdi-file-remove</v-icon>
                      <div class="text-body-2 text-grey mt-2">
                        No hay informes para esta subactividad
                      </div>
                    </div>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Estado Vacío -->
      <v-row v-if="!hayInformes && !loading">
        <v-col cols="12">
          <v-card>
            <v-card-text class="text-center py-8">
              <v-icon color="grey" size="64">mdi-file-remove</v-icon>
              <div class="text-h6 text-grey mt-4">
                No se encontraron informes para esta actividad
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useInformeActividadStore } from '@/modules/formularios/store/useInformeActividadStore'
import PaginaTituloIcono from '@/components/layout/partials/PaginaTituloIcono.vue'

// Route y Store
const route = useRoute()
const informeStore = useInformeActividadStore()

// Props
const props = defineProps({
  actividadId: {
    type: [String, Number],
    default: null,
  },
})

// Estados locales
const filtroTipo = ref('todos')
const filtroBusqueda = ref('')
// Estado para controlar paneles abiertos
const panelesAbiertos = ref([])

// Opciones para el filtro
const opcionesFiltro = [
  { text: 'Todos los informes', value: 'todos' },
  { text: 'Informes de Actividad', value: 'actividad' },
  { text: 'Informes de Subactividad', value: 'tarea' },
]

// Computed properties del store
const loading = computed(() => informeStore.loading)
const error = computed(() => informeStore.error)

// Actividad principal desde listaAcvidadSubActividadInformes
const actividadPrincipal = computed(() => {
  return informeStore.listaAcvidadSubActividadInformes || null
})

// Informes de actividad desde la respuesta completa
const listaInformeActividad = computed(() => {
  return actividadPrincipal.value?.informes_actividad || []
})

// Computed properties para tareas
const tareasConInformes = computed(() => {
  return actividadPrincipal.value?.tareas_con_todos_informes || []
})

const tareas = computed(() => {
  return tareasConInformes.value
})

// Computed properties para filtros - DEFINIR ANTES DEL WATCH
const informesActividadFiltrados = computed(() => {
  let informes = listaInformeActividad.value

  if (filtroBusqueda.value) {
    const busqueda = filtroBusqueda.value.toLowerCase()
    informes = informes.filter(
      (informe) =>
        informe.numeroInforme?.toLowerCase().includes(busqueda) ||
        actividadPrincipal.value?.codigo?.toLowerCase().includes(busqueda) ||
        informe.objetivo_actividad?.toLowerCase().includes(busqueda),
    )
  }

  if (filtroTipo.value === 'tarea') {
    return []
  }

  return informes
})

const tareasFiltradas = computed(() => {
  let tareasFiltradas = tareas.value

  if (filtroBusqueda.value) {
    const busqueda = filtroBusqueda.value.toLowerCase()
    tareasFiltradas = tareasFiltradas.filter(
      (tarea) =>
        tarea.codigo?.toLowerCase().includes(busqueda) ||
        tarea.titulo?.toLowerCase().includes(busqueda) ||
        tarea.descripcion?.toLowerCase().includes(busqueda),
    )
  }

  if (filtroTipo.value === 'actividad') {
    return tareasFiltradas.filter((tarea) => tarea.informes_tarea?.length > 0)
  }

  return tareasFiltradas
})

const informesTareaFiltrados = (tarea) => {
  if (!tarea.informes_tarea) return []

  let informes = tarea.informes_tarea

  if (filtroBusqueda.value) {
    const busqueda = filtroBusqueda.value.toLowerCase()
    informes = informes.filter(
      (informe) =>
        informe.numeroInforme?.toLowerCase().includes(busqueda) ||
        tarea.codigo?.toLowerCase().includes(busqueda) ||
        informe.objetivo_tarea?.toLowerCase().includes(busqueda),
    )
  }

  return informes
}

const hayInformes = computed(() => {
  return listaInformeActividad.value.length > 0 || tareasConInformes.value.length > 0
})

watch(
  tareasFiltradas,
  (nuevasTareas) => {
    if (nuevasTareas.length > 0) {
      // Abrir todos los paneles (usando índices)
      panelesAbiertos.value = nuevasTareas.map((_, index) => index)
    }
  },
  { immediate: true },
)

// Funciones de formato
const formatoFecha = (fecha) => {
  if (!fecha) return 'No especificada'
  try {
    return new Date(fecha).toLocaleDateString('es-ES')
  } catch {
    return 'Fecha inválida'
  }
}

const formatoMoneda = (monto) => {
  if (!monto) return '$ 0.00'
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
  }).format(monto)
}

// Funciones de texto para estados
const obtenerEstadoTexto = (estado) => {
  const estados = {
    CRD: 'Creada',
    PLAN: 'Planificada',
    RETR: 'Retraso',
    REPROG: 'Reprogramación',
    EJEC: 'En Ejecución',
    REP: 'En Reporte',
    FIN: 'Finalizado',
  }
  return estados[estado] || estado
}

const obtenerEstadoTareaTexto = (estado) => {
  const estados = {
    PEN: 'Pendiente',
    EPROG: 'En Progreso',
    COMPL: 'Completada',
  }
  return estados[estado] || estado
}

// Funciones para colores de estados
const obtenerColorEstado = (estado) => {
  const colores = {
    CRD: 'grey',
    PLAN: 'blue',
    RETR: 'orange',
    REPROG: 'amber',
    EJEC: 'green',
    REP: 'purple',
    FIN: 'teal',
  }
  return colores[estado] || 'grey'
}

const obtenerColorEstadoTarea = (estado) => {
  const colores = {
    PEN: 'orange',
    EPROG: 'blue',
    COMPL: 'green',
  }
  return colores[estado] || 'grey'
}

// Funciones de acción
const verDetalle = (informe, tipo) => {
  console.log(`Ver detalle del informe de ${tipo}:`, informe)
  alert(`Detalle del informe: ${informe.numeroInforme || 'Sin número'} (${tipo})`)
}

// Obtener ID de la actividad y cargar datos
const obtenerActividadId = () => {
  return props.actividadId || route.params.id
}

const cargarDatos = async () => {
  const actividadId = obtenerActividadId()
  if (!actividadId) {
    console.error('No se proporcionó ID de actividad')
    return
  }

  try {
    // Cargar los informes, que ya incluyen la información de la actividad
    await informeStore.cargarInformesActividadPorId(actividadId)
  } catch (err) {
    console.error('Error al cargar datos:', err)
  }
}

onMounted(() => {
  cargarDatos()
})
</script>

<style scoped>
.informes-container {
  max-width: 1400px;
}

/* Estilos personalizados adicionales */
.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.v-expansion-panel-title {
  min-height: 64px;
}
</style>
