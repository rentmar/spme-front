<template>
  <v-container class="actividad-informes-container">
    <!-- Overlay de carga -->
    <v-overlay
      :model-value="cargandoGeneral"
      class="align-center justify-center"
      persistent
      opacity="0.8"
    >
      <div class="text-center">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
          width="6"
        ></v-progress-circular>
        <p class="mt-4 text-h6">Cargando informes de actividad...</p>
      </div>
    </v-overlay>

    <div v-if="!cargandoGeneral && actividad.id">
      <!--Titulo de la pagina-->
      <PaginaTituloIcono
        :titulo="'Administración de Informes'"
        :icon="'mdi-file-document-multiple'"
      ></PaginaTituloIcono>

      <!--Encabezado del Proyecto-->
      <ProyectoIdHeader
        v-if="actividad.proyecto"
        :proyecto-id="actividad.proyecto"
      ></ProyectoIdHeader>

      <!--Encabezado de la Actividad-->
      <ActividadInformacion v-if="actividad.id" :actividad-id="actividad.id" />

      <!-- Header de la actividad -->
      <v-card elevation="2" class="mb-6" rounded="lg">
        <v-toolbar color="primary" density="compact">
          <v-toolbar-title class="text-white">
            <v-icon class="mr-2">mdi-information</v-icon>
            Información de la Actividad
          </v-toolbar-title>
        </v-toolbar>

        <v-card-text class="pa-4">
          <v-row align="center">
            <v-col cols="12" md="8">
              <h2 class="text-h5 font-weight-bold">
                {{ actividad.nombreCorto }}
                <span class="text-h6 text-grey">({{ actividad.codigo }})</span>
              </h2>
              <div class="d-flex align-center flex-wrap gap-3 mt-2">
                <v-chip :color="getEstadoColor(actividad.estado)" size="small">
                  {{ getEstadoText(actividad.estado) }}
                </v-chip>
                <span class="text-body-2">
                  <v-icon size="small" class="mr-1">mdi-tag</v-icon>
                  {{ actividad.tipo_info.sigla }} - {{ actividad.tipo_info.tipo_actividad }}
                </span>
                <span class="text-body-2">
                  <v-icon size="small" class="mr-1">mdi-calendar</v-icon>
                  {{ formatDate(actividad.fecha_inicio) }} -
                  {{ formatDate(actividad.fecha_cierre) }}
                </span>
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <div class="text-center">
                <div class="text-h5 font-weight-bold">
                  {{ formatCurrency(actividad.presupuesto) }}
                </div>
                <div class="text-body-2 text-grey">Presupuesto Total</div>
                <div
                  class="text-h6 mt-2"
                  :class="getEjecucionClass(actividad.totalEjecutado, actividad.presupuesto)"
                >
                  {{ formatCurrency(actividad.totalEjecutado) }}
                  ({{
                    calcularPorcentajeEjecucion(actividad.totalEjecutado, actividad.presupuesto)
                  }}%)
                </div>
                <div class="text-caption text-grey">Ejecutado</div>
              </div>
            </v-col>
          </v-row>

          <v-divider class="my-4"></v-divider>

          <div class="d-flex justify-end gap-3">
            <v-btn color="primary" prepend-icon="mdi-plus" @click="nuevoInforme">
              Nuevo Informe
            </v-btn>
            <v-btn variant="outlined" prepend-icon="mdi-chart-box" @click="verEstadisticas">
              Ver Estadísticas
            </v-btn>
          </div>
        </v-card-text>
      </v-card>

      <!-- Estadísticas generales -->
      <v-card class="mb-6" elevation="2" rounded="lg">
        <v-toolbar color="secondary" density="compact">
          <v-toolbar-title class="text-white">
            <v-icon class="mr-2">mdi-chart-bar</v-icon>
            Resumen de Informes
          </v-toolbar-title>
        </v-toolbar>

        <v-card-text class="pa-4">
          <v-row>
            <v-col cols="12" sm="6" md="3">
              <div class="estadistica-item text-center">
                <div class="estadistica-valor text-primary">
                  {{ actividad.estadisticas_informes.total_informes_actividad }}
                </div>
                <div class="estadistica-label">Informes de Actividad</div>
              </div>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <div class="estadistica-item text-center">
                <div class="estadistica-valor text-secondary">
                  {{ actividad.estadisticas_informes.total_informes_tareas }}
                </div>
                <div class="estadistica-label">Informes de Tareas</div>
              </div>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <div class="estadistica-item text-center">
                <div class="estadistica-valor text-success">
                  {{ actividad.estadisticas_informes.total_general }}
                </div>
                <div class="estadistica-label">Total Informes</div>
              </div>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <div class="estadistica-item text-center">
                <div class="estadistica-valor text-warning">
                  {{ actividad.estadisticas_informes.cantidad_tareas }}
                </div>
                <div class="estadistica-label">Tareas Relacionadas</div>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Tabs principales -->
      <v-card elevation="2" rounded="lg">
        <v-tabs v-model="tab" color="primary" grow>
          <v-tab value="informes">
            <v-icon start>mdi-file-document</v-icon>
            Informes de Actividad
          </v-tab>
          <v-tab value="tareas">
            <v-icon start>mdi-file-tree</v-icon>
            Tareas e Informes
          </v-tab>
        </v-tabs>

        <v-window v-model="tab">
          <!-- Tab: Informes de Actividad -->
          <v-window-item value="informes">
            <v-card-text class="pa-4">
              <div class="form-section mb-6">
                <h3 class="text-h6 mb-4 primary--text">
                  <v-icon color="primary" class="mr-2">mdi-file-document-multiple</v-icon>
                  Informes de Actividad Principal
                </h3>

                <v-row class="mb-6">
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="buscarInformes"
                      placeholder="Buscar informes por número, objetivo o tipo..."
                      prepend-inner-icon="mdi-magnify"
                      density="compact"
                      variant="outlined"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6" class="text-right">
                    <v-chip
                      v-if="informesFiltrados.length > 0"
                      color="primary"
                      variant="outlined"
                      size="small"
                    >
                      {{ informesFiltrados.length }} informe{{
                        informesFiltrados.length !== 1 ? 's' : ''
                      }}
                    </v-chip>
                  </v-col>
                </v-row>

                <div class="informes-list">
                  <v-row>
                    <v-col
                      v-for="informe in informesFiltrados"
                      :key="informe.id"
                      cols="12"
                      md="6"
                      lg="4"
                    >
                      <v-card
                        class="informe-card h-100"
                        :class="{ 'informe-incompleto': !isInformeCompleto(informe) }"
                      >
                        <v-card-title class="informe-header">
                          <div class="d-flex justify-space-between align-center w-100">
                            <div class="informe-titulo">
                              <span class="text-subtitle-1 font-weight-bold">
                                {{ informe.numeroInforme || `Informe #${informe.id}` }}
                              </span>
                              <v-chip
                                v-if="!isInformeCompleto(informe)"
                                size="x-small"
                                color="warning"
                                class="ml-2"
                              >
                                Incompleto
                              </v-chip>
                            </div>
                            <div class="informe-actions">
                              <v-btn
                                icon
                                size="small"
                                variant="text"
                                @click="editarInforme(informe)"
                              >
                                <v-icon size="small">mdi-pencil</v-icon>
                              </v-btn>
                              <v-btn
                                icon
                                size="small"
                                variant="text"
                                @click="verDetalleInforme(informe)"
                              >
                                <v-icon size="small">mdi-eye</v-icon>
                              </v-btn>
                            </div>
                          </div>
                        </v-card-title>

                        <v-card-text>
                          <div class="informe-content">
                            <div class="d-flex align-center mb-2">
                              <v-icon size="small" class="mr-1">mdi-calendar</v-icon>
                              <span class="text-caption">
                                {{
                                  informe.fechaEjecucion
                                    ? formatDate(informe.fechaEjecucion)
                                    : 'Sin fecha'
                                }}
                              </span>
                            </div>

                            <div v-if="informe.objetivoActividad" class="mb-3">
                              <div class="text-caption text-grey">Objetivo:</div>
                              <p class="text-body-2 mb-0">
                                {{ informe.objetivoActividad }}
                              </p>
                            </div>

                            <!-- Presupuesto -->
                            <div v-if="informe.procedenciaFondos" class="mb-3">
                              <div class="text-caption text-grey">Presupuesto:</div>
                              <div class="d-flex justify-space-between">
                                <span class="text-body-2">
                                  {{ formatCurrency(informe.procedenciaFondos.totalPlanificado) }}
                                  planificado
                                </span>
                                <span
                                  class="text-body-2 font-weight-bold"
                                  :class="
                                    getEjecucionClass(
                                      informe.procedenciaFondos.totalEjecutado,
                                      informe.procedenciaFondos.totalPlanificado,
                                    )
                                  "
                                >
                                  {{ formatCurrency(informe.procedenciaFondos.totalEjecutado) }}
                                  ejecutado
                                </span>
                              </div>
                              <v-progress-linear
                                :model-value="
                                  parseFloat(informe.procedenciaFondos.porcentajeEjecucion) || 0
                                "
                                height="6"
                                :color="
                                  getColorPorcentaje(
                                    parseFloat(informe.procedenciaFondos.porcentajeEjecucion) || 0,
                                  )
                                "
                                rounded
                                class="mt-1"
                              ></v-progress-linear>
                              <div class="text-caption text-right">
                                {{ informe.procedenciaFondos.porcentajeEjecucion }}% ejecutado
                              </div>
                            </div>

                            <!-- Contribución al proyecto -->
                            <div v-if="informe.contribucionProyecto" class="mb-3">
                              <div class="text-caption text-grey">Contribución:</div>
                              <v-chip
                                v-if="
                                  informe.contribucionProyecto.caberaContribucion?.objetivogeneral
                                "
                                size="x-small"
                                color="primary"
                                variant="outlined"
                                class="mr-1"
                              >
                                OG:
                                {{
                                  informe.contribucionProyecto.caberaContribucion.objetivogeneral
                                    .data.codigo
                                }}
                              </v-chip>
                              <v-chip
                                v-if="informe.contribucionProyecto.caberaContribucion?.resultadoog"
                                size="x-small"
                                color="secondary"
                                variant="outlined"
                              >
                                ROG:
                                {{
                                  informe.contribucionProyecto.caberaContribucion.resultadoog.data
                                    .codigo
                                }}
                              </v-chip>
                            </div>

                            <!-- Comentarios -->
                            <div v-if="informe.comentariosRecomendaciones" class="mb-2">
                              <div class="text-caption text-grey">Comentarios:</div>
                              <p class="text-body-2 mb-0 text-truncate">
                                {{ informe.comentariosRecomendaciones }}
                              </p>
                            </div>
                          </div>
                        </v-card-text>

                        <v-card-actions class="pa-3">
                          <v-spacer></v-spacer>
                          <v-btn
                            size="small"
                            color="primary"
                            variant="text"
                            @click="verDetalleInforme(informe)"
                          >
                            Ver detalles
                          </v-btn>
                          <v-btn
                            size="small"
                            color="error"
                            variant="text"
                            @click="eliminarInforme(informe)"
                          >
                            <v-icon size="small">mdi-delete</v-icon>
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-col>

                    <!-- Card para nuevo informe -->
                    <v-col cols="12" md="6" lg="4">
                      <v-card class="nuevo-informe-card h-100" @click="nuevoInforme">
                        <v-card-text class="text-center d-flex flex-column justify-center h-100">
                          <v-icon size="64" color="primary">mdi-plus-circle</v-icon>
                          <div class="text-h6 mt-4">Crear nuevo informe</div>
                          <div class="text-caption text-grey mt-2">
                            Agregar un nuevo informe para esta actividad
                          </div>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                </div>
              </div>
            </v-card-text>
          </v-window-item>

          <!-- Tab: Tareas e Informes -->
          <v-window-item value="tareas">
            <v-card-text class="pa-4">
              <div class="form-section">
                <h3 class="text-h6 mb-4 primary--text">
                  <v-icon color="primary" class="mr-2">mdi-file-tree</v-icon>
                  Tareas Relacionadas
                </h3>

                <div class="tareas-list">
                  <v-card
                    v-for="tarea in actividad.tareas_con_informes"
                    :key="tarea.id"
                    class="tarea-card mb-4"
                  >
                    <v-card-title>
                      <div class="d-flex justify-space-between align-start w-100">
                        <div class="tarea-info">
                          <h3 class="text-h6 font-weight-bold">{{ tarea.titulo }}</h3>
                          <div class="d-flex align-center flex-wrap gap-2 mt-1">
                            <v-chip size="x-small" color="grey-lighten-2">
                              {{ tarea.codigo }}
                            </v-chip>
                            <v-chip :color="getEstadoTareaColor(tarea.estado)" size="x-small">
                              {{ getEstadoTareaText(tarea.estado) }}
                            </v-chip>
                            <span v-if="tarea.fecha_limite" class="text-caption text-grey">
                              <v-icon size="x-small" class="mr-1">mdi-clock</v-icon>
                              Vence: {{ formatDate(tarea.fecha_limite) }}
                            </span>
                          </div>
                        </div>
                        <div class="tarea-stats">
                          <v-chip :color="tarea.total_informes > 0 ? 'success' : 'warning'">
                            {{ tarea.total_informes }}
                            {{ tarea.total_informes === 1 ? 'informe' : 'informes' }}
                          </v-chip>
                        </div>
                      </div>
                    </v-card-title>

                    <v-card-text>
                      <!-- Informes de la tarea -->
                      <div v-if="tarea.informes && tarea.informes.length > 0">
                        <h4 class="text-subtitle-2 mb-3">Informes de la Tarea</h4>
                        <v-table density="compact">
                          <thead>
                            <tr>
                              <th class="text-left">#</th>
                              <th class="text-left">Fecha</th>
                              <th class="text-left">Objetivo</th>
                              <th class="text-center">Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="informe in tarea.informes" :key="informe.id">
                              <td>{{ informe.numeroInforme || `INF-${informe.id}` }}</td>
                              <td>{{ formatDate(informe.fechaEjecucion) }}</td>
                              <td>{{ informe.objetivoTarea || 'Sin objetivo' }}</td>
                              <td class="text-center">
                                <v-btn
                                  icon
                                  size="x-small"
                                  variant="text"
                                  @click="verDetalleInformeTarea(informe)"
                                >
                                  <v-icon size="small">mdi-eye</v-icon>
                                </v-btn>
                              </td>
                            </tr>
                          </tbody>
                        </v-table>
                      </div>
                      <div v-else class="no-informes">
                        <v-alert type="info" variant="tonal" density="compact" class="mb-3">
                          Esta tarea no tiene informes registrados
                        </v-alert>
                        <v-btn color="primary" size="small" @click="nuevoInformeTarea(tarea)">
                          Crear Primer Informe
                        </v-btn>
                      </div>
                    </v-card-text>
                  </v-card>

                  <v-alert
                    v-if="actividad.tareas_con_informes.length === 0"
                    type="info"
                    variant="tonal"
                  >
                    No hay tareas relacionadas para esta actividad.
                  </v-alert>
                </div>
              </div>
            </v-card-text>
          </v-window-item>
        </v-window>
      </v-card>
    </div>

    <!-- Modal para detalle de informe -->
    <v-dialog v-model="modalDetalle" max-width="800px" persistent>
      <v-card v-if="informeSeleccionado">
        <v-card-title class="d-flex justify-space-between align-center">
          <span>Detalle del Informe</span>
          <v-btn icon @click="modalDetalle = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="pa-0">
          <InformeDetalle :informe="informeSeleccionado" />
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Modal para estadísticas -->
    <v-dialog v-model="modalEstadisticas" max-width="800px" persistent>
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <span>Estadísticas de Informes</span>
          <v-btn icon @click="modalEstadisticas = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="pa-0">
          <InformeEstadisticas :actividad="actividad" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import InformeDetalle from '@/modules/formularios/components/partials/InformeDetalle.vue'
import InformeEstadisticas from '@/modules/formularios/components/partials/InformeEstadisticas.vue'
import PaginaTituloIcono from '@/components/layout/partials/PaginaTituloIcono.vue'
import ProyectoIdHeader from '@/modules/proyecto/components/partials/ProyectoIdHeader.vue'
import ActividadInformacion from '@/modules/proyecto/components/partials/ActividadInformacion.vue'

const router = useRouter()
const route = useRoute()

// Estado
const tab = ref('informes')
const buscarInformes = ref('')
const modalDetalle = ref(false)
const modalEstadisticas = ref(false)
const informeSeleccionado = ref(null)
const cargandoGeneral = ref(false)

// Datos de la actividad
const actividad = ref({
  id: null,
  codigo: '',
  nombreCorto: '',
  estado: '',
  tipo_info: {
    id: null,
    sigla: '',
    tipo_actividad: '',
  },
  fecha_inicio: '',
  fecha_cierre: '',
  presupuesto: '0.00',
  totalEjecutado: '0.00',
  gradoEjecucion: '',
  proyecto: null,
  informes_actividad: [],
  tareas_con_informes: [],
  estadisticas_informes: {
    total_informes_actividad: 0,
    total_informes_tareas: 0,
    total_general: 0,
    cantidad_tareas: 0,
  },
})

// Computed
const informesFiltrados = computed(() => {
  if (!buscarInformes.value) return actividad.value.informes_actividad

  const searchTerm = buscarInformes.value.toLowerCase()
  return actividad.value.informes_actividad.filter((informe) => {
    return (
      (informe.numeroInforme && informe.numeroInforme.toLowerCase().includes(searchTerm)) ||
      (informe.objetivoActividad && informe.objetivoActividad.toLowerCase().includes(searchTerm)) ||
      (informe.tipoActividad && informe.tipoActividad.toLowerCase().includes(searchTerm))
    )
  })
})

// Métodos
const formatDate = (dateString) => {
  if (!dateString) return 'No definida'
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES')
}

const formatCurrency = (amount) => {
  if (!amount) return '$0.00'
  const numAmount = parseFloat(amount)
  return new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency: 'BOB',
    minimumFractionDigits: 2,
  }).format(numAmount)
}

const getEstadoColor = (estado) => {
  const colores = {
    CRD: 'grey',
    PLAN: 'blue',
    EJEC: 'orange',
    REP: 'purple',
    FIN: 'green',
    RETR: 'red',
    REPROG: 'amber',
  }
  return colores[estado] || 'grey'
}

const getEstadoText = (estado) => {
  const textos = {
    CRD: 'Creada',
    PLAN: 'Planificada',
    EJEC: 'En Ejecución',
    REP: 'En Reporte',
    FIN: 'Finalizado',
    RETR: 'Retraso',
    REPROG: 'Reprogramación',
  }
  return textos[estado] || estado
}

const getEstadoTareaColor = (estado) => {
  const colores = {
    PEN: 'grey',
    EPROG: 'blue',
    COMPL: 'green',
  }
  return colores[estado] || 'grey'
}

const getEstadoTareaText = (estado) => {
  const textos = {
    PEN: 'Pendiente',
    EPROG: 'En Progreso',
    COMPL: 'Completada',
  }
  return textos[estado] || estado
}

const getEjecucionClass = (ejecutado, planificado) => {
  const porcentaje = calcularPorcentajeEjecucion(ejecutado, planificado)
  if (porcentaje >= 100) return 'text-success'
  if (porcentaje >= 80) return 'text-warning'
  if (porcentaje >= 50) return 'text-info'
  return 'text-error'
}

const getColorPorcentaje = (porcentaje) => {
  if (porcentaje >= 100) return 'success'
  if (porcentaje >= 80) return 'warning'
  if (porcentaje >= 50) return 'info'
  return 'error'
}

const calcularPorcentajeEjecucion = (ejecutado, planificado) => {
  ejecutado = parseFloat(ejecutado) || 0
  planificado = parseFloat(planificado) || 0
  if (planificado === 0) return 0
  return ((ejecutado / planificado) * 100).toFixed(2)
}

const isInformeCompleto = (informe) => {
  return !!(
    informe.fechaEjecucion &&
    informe.objetivoActividad &&
    informe.tipoActividad &&
    informe.procedenciaFondos
  )
}

// Acciones
const nuevoInforme = () => {
  if (actividad.value.id) {
    router.push(`/actividades/${actividad.value.id}/informes/nuevo`)
  }
}

const editarInforme = (informe) => {
  if (actividad.value.id && informe.id) {
    router.push(`/actividades/${actividad.value.id}/informes/${informe.id}/editar`)
  }
}

const verDetalleInforme = (informe) => {
  informeSeleccionado.value = informe
  modalDetalle.value = true
}

const verDetalleInformeTarea = (informe) => {
  if (informe.id) {
    router.push(`/tareas/informes/${informe.id}`)
  }
}

const nuevoInformeTarea = (tarea) => {
  if (tarea.id) {
    router.push(`/tareas/${tarea.id}/informes/nuevo`)
  }
}

const eliminarInforme = async (informe) => {
  const confirmacion = await Swal.fire({
    title: '¿Eliminar informe?',
    text: 'Esta acción no se puede deshacer',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
  })

  if (confirmacion.isConfirmed) {
    // Llamar a API para eliminar
    console.log('Eliminar informe:', informe.id)
  }
}

const verEstadisticas = () => {
  modalEstadisticas.value = true
}

// Cargar datos
onMounted(async () => {
  cargandoGeneral.value = true
  try {
    const actividadId = route.params.id

    // Simular carga de datos (reemplazar con API real)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Datos de ejemplo
    actividad.value = {
      id: actividadId || 72,
      codigo: 'ACTTEST',
      nombreCorto: 'Actividad test',
      estado: 'PLAN',
      tipo_info: {
        id: 4,
        sigla: 'AOP',
        tipo_actividad: 'Actividad Operativa',
      },
      fecha_inicio: '2026-01-01',
      fecha_cierre: '2026-01-31',
      presupuesto: '5445.00',
      totalEjecutado: '0.00',
      gradoEjecucion: 'PLANIFICADA',
      proyecto: 1,
      informes_actividad: [
        {
          id: 6,
          numeroInforme: '',
          fechaEjecucion: null,
          objetivoActividad: '',
          tipoActividad: '',
          procedenciaFondos: null,
          comentariosRecomendaciones: '',
        },
        {
          id: 7,
          numeroInforme: null,
          fechaEjecucion: '2026-01-31',
          objetivoActividad: 'Obje de la activida',
          informeObjetivoActividad: 'dlkasmdlka kjdlkajs kjd kas',
          tipoActividad: 'AOP - Actividad Operativa',
          reporteTipo: 'Rep de AOP',
          procedenciaFondos: {
            fondosCompletos: [
              {
                id: 3,
                nombre: 'MISEREOR',
                monto: 5445,
                esExistente: true,
                montoEjecutado: 4522,
                verificado: true,
              },
            ],
            totalPlanificado: 5445,
            totalEjecutado: 4522,
            diferenciaTotal: 923,
            porcentajeEjecucion: '83.05',
            observaciones: 'Presupuesto ejecutado',
          },
          contribucionProyecto: {
            caberaContribucion: {
              objetivogeneral: {
                tipo: 'objetivogeneral',
                data: {
                  id: 36,
                  codigo: 'OG',
                  descripcion: 'Contribuir a la consolidación de comunidades...',
                },
              },
              resultadoog: {
                tipo: 'resultadoog',
                data: {
                  id: 75,
                  codigo: 'R1',
                  descripcion: 'Tomadores de decisión del órgano legislativo...',
                },
              },
            },
          },
          comentariosRecomendaciones: 'Comentarios y recomendaciones',
        },
      ],
      tareas_con_informes: [
        {
          id: 12,
          codigo: 'SACT-0012/ACTTEST',
          titulo: 'Subactividad de la actividad',
          estado: 'PEN',
          fecha_limite: '2026-02-01',
          presupuesto: 0.0,
          total_informes: 0,
          informes: [],
        },
      ],
      estadisticas_informes: {
        total_informes_actividad: 2,
        total_informes_tareas: 0,
        total_general: 2,
        cantidad_tareas: 1,
      },
    }
  } catch (error) {
    console.error('Error cargando datos:', error)
  } finally {
    cargandoGeneral.value = false
  }
})
</script>

<style scoped>
.actividad-informes-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px 16px;
}

.v-card {
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.12);
}

.v-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.form-section {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 24px;
  border: 1px solid #e0e0e0;
}

.form-section h3 {
  color: #1976d2;
  border-bottom: 2px solid #1976d2;
  padding-bottom: 12px;
  margin-bottom: 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.estadistica-item {
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.estadistica-valor {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 8px;
}

.estadistica-label {
  font-size: 0.9rem;
  color: #666;
}

.informes-list {
  margin-top: 20px;
}

.informe-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

.informe-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.informe-card.informe-incompleto {
  border-left: 4px solid #ffc107;
}

.informe-header {
  padding: 16px 16px 8px 16px;
}

.informe-content {
  flex: 1;
}

.nuevo-informe-card {
  cursor: pointer;
  border: 2px dashed #ddd;
  background: #fafafa;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.nuevo-informe-card:hover {
  border-color: #1976d2;
  background: #f0f7ff;
  transform: scale(1.02);
}

.tarea-card {
  transition: all 0.2s;
}

.tarea-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.tarea-info h3 {
  margin: 0 0 4px 0;
}

.tarea-stats {
  flex-shrink: 0;
}

.no-informes {
  padding: 20px;
  text-align: center;
}

.h-100 {
  height: 100%;
}

.w-100 {
  width: 100%;
}

.gap-3 {
  gap: 12px;
}

.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.text-primary {
  color: #1976d2 !important;
}

.text-secondary {
  color: #6c757d !important;
}

.text-success {
  color: #4caf50 !important;
}

.text-warning {
  color: #ff9800 !important;
}

.text-info {
  color: #2196f3 !important;
}

.text-error {
  color: #f44336 !important;
}

@media (max-width: 960px) {
  .actividad-informes-container {
    padding: 16px 12px;
  }

  .form-section {
    padding: 20px;
    margin-bottom: 20px;
  }

  .estadistica-item {
    margin-bottom: 16px;
  }

  .estadistica-valor {
    font-size: 2rem;
  }
}

@media (max-width: 600px) {
  .informes-list .v-col {
    width: 100%;
  }

  .informe-card {
    margin-bottom: 16px;
  }

  .nuevo-informe-card {
    min-height: 200px;
  }
}
</style>
